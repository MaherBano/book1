import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from dotenv import load_dotenv
import cohere
from qdrant_client import QdrantClient
from qdrant_client.http import models
import time
import logging
from typing import List, Dict, Any
import hashlib

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# -------------------- BLOG FILTER --------------------

def is_blog_url(url: str) -> bool:
    """Detect blog-related URLs."""
    blog_indicators = ["/blog", "/blogs", "/posts", "/news"]
    return any(indicator in url.lower() for indicator in blog_indicators)


# -------------------- ENV VALIDATION --------------------

def validate_environment_variables():
    required_vars = ['COHERE_API_KEY', 'QDRANT_URL', 'QDRANT_API_KEY', 'BASE_URL']
    missing = [v for v in required_vars if not os.getenv(v)]
    if missing:
        raise ValueError(f"Missing environment variables: {missing}")
    logger.info("Environment variables validated")


# -------------------- URL COLLECTION --------------------

def get_all_urls(base_url: str) -> List[str]:
    logger.info(f"Collecting URLs from: {base_url}")

    urls = set()

    # Check site availability
    response = requests.get(base_url)
    response.raise_for_status()

    # Try sitemap
    sitemap_url = urljoin(base_url, "sitemap.xml")
    try:
        sitemap = requests.get(sitemap_url)
        if sitemap.status_code == 200:
            soup = BeautifulSoup(sitemap.content, "xml")
            for loc in soup.find_all("loc"):
                url = loc.get_text().strip()
                if (
                    url.startswith(base_url)
                    and not is_blog_url(url)
                ):
                    urls.add(url)
            logger.info("URLs collected from sitemap")
            return list(urls)
    except Exception:
        logger.info("Sitemap not available, crawling site")

    # Crawl fallback
    visited = set()
    queue = [base_url]

    while queue and len(visited) < 100:
        current = queue.pop(0)
        if current in visited or is_blog_url(current):
            continue

        visited.add(current)
        urls.add(current)

        try:
            page = requests.get(current)
            soup = BeautifulSoup(page.content, "html.parser")

            for link in soup.find_all("a", href=True):
                full_url = urljoin(current, link["href"])
                if (
                    urlparse(full_url).netloc == urlparse(base_url).netloc
                    and full_url.startswith(base_url)
                    and not is_blog_url(full_url)
                    and full_url not in visited
                ):
                    queue.append(full_url)

            time.sleep(0.1)

        except Exception as e:
            logger.warning(f"Failed crawling {current}: {e}")

    logger.info(f"Collected {len(urls)} book URLs")
    return list(urls)


# -------------------- CONTENT EXTRACTION --------------------

def extract_text_from_url(url: str) -> Dict[str, Any]:
    if is_blog_url(url):
        logger.info(f"Skipped blog page: {url}")
        return {"url": url, "title": "", "section": "", "content": ""}

    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, "html.parser")

    for tag in soup(["script", "style"]):
        tag.decompose()

    content_element = soup.select_one("main") or soup.find("article") or soup.find("body")
    content = content_element.get_text(" ", strip=True)
    content = " ".join(content.split())

    title = soup.title.get_text(strip=True) if soup.title else "Untitled"
    h1 = soup.find("h1")
    section = h1.get_text(strip=True) if h1 else ""

    return {
        "url": url,
        "title": title,
        "section": section,
        "content": content
    }


# -------------------- CHUNKING --------------------

def chunk_text(content: str, url: str, title: str, section: str, size: int = 1000):
    chunks = []
    start = 0

    while start < len(content):
        end = min(start + size, len(content))
        chunk = content[start:end].strip()

        if chunk:
            chunks.append({
                "id": hashlib.md5(f"{url}_{start}".encode()).hexdigest(),
                "content": chunk,
                "url": url,
                "title": title,
                "section": section,
                "metadata": {
                    "start_pos": start,
                    "end_pos": end,
                    "chunk_index": len(chunks)
                }
            })

        start = end

    return chunks


# -------------------- EMBEDDING --------------------

def embed(text: str) -> List[float]:
    co = cohere.Client(os.getenv("COHERE_API_KEY"))
    response = co.embed(
        texts=[text],
        model="embed-english-v3.0",
        input_type="search_document"
    )
    return response.embeddings[0]


# -------------------- QDRANT --------------------

def create_collection(name: str):
    client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )

    if name in [c.name for c in client.get_collections().collections]:
        logger.info("Collection already exists")
        return

    client.create_collection(
        collection_name=name,
        vectors_config=models.VectorParams(
            size=1024,
            distance=models.Distance.COSINE
        )
    )

    logger.info("Qdrant collection created")


def save_chunk_to_qdrant(embedding: List[float], chunk: Dict[str, Any]):
    if is_blog_url(chunk.get("url", "")):
        logger.info("Skipped blog chunk")
        return

    client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )

    point = models.PointStruct(
        id=chunk["id"],
        vector=embedding,
        payload={
            "content": chunk["content"],
            "url": chunk["url"],
            "title": chunk["title"],
            "section": chunk["section"],
            **chunk["metadata"]
        }
    )

    client.upsert(collection_name="rag_embedding", points=[point])


# -------------------- MAIN PIPELINE --------------------

def main():
    validate_environment_variables()

    base_url = os.getenv("BASE_URL")
    create_collection("rag_embedding")

    urls = get_all_urls(base_url)
    logger.info(f"Processing {len(urls)} book pages")

    for url in urls:
        try:
            data = extract_text_from_url(url)
            if not data["content"]:
                continue

            chunks = chunk_text(
                data["content"],
                data["url"],
                data["title"],
                data["section"]
            )

            for chunk in chunks:
                embedding = embed(chunk["content"])
                save_chunk_to_qdrant(embedding, chunk)

            logger.info(f"Stored {len(chunks)} chunks from {url}")

        except Exception as e:
            logger.error(f"Failed processing {url}: {e}")

    logger.info("✅ RAG pipeline completed (BOOK ONLY)")


if __name__ == "__main__":
    main()
