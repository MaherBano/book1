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
from typing import List, Dict, Any, Optional
import hashlib

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def validate_environment_variables():
    """Validate that all required environment variables are set."""
    required_vars = ['COHERE_API_KEY', 'QDRANT_URL', 'QDRANT_API_KEY', 'BASE_URL']
    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        raise ValueError(f"Missing required environment variables: {missing_vars}")

    logger.info("All required environment variables are set")


def get_all_urls(base_url: str) -> List[str]:
    """
    Verify the Docusaurus site is deployed and collect all book URLs.

    Args:
        base_url: The base URL of the deployed Docusaurus site

    Returns:
        List of all discovered URLs from the site
    """
    logger.info(f"Collecting URLs from: {base_url}")

    # First, verify the site is accessible
    try:
        response = requests.get(base_url)
        response.raise_for_status()
        logger.info(f"Site is accessible: {base_url}")
    except requests.RequestException as e:
        logger.error(f"Failed to access site: {e}")
        raise

    urls = set()
    urls.add(base_url)

    # Try to get sitemap first
    sitemap_url = urljoin(base_url, 'sitemap.xml')
    try:
        sitemap_response = requests.get(sitemap_url)
        if sitemap_response.status_code == 200:
            logger.info(f"Found sitemap: {sitemap_url}")
            # Parse sitemap and extract URLs
            soup = BeautifulSoup(sitemap_response.content, 'xml')
            for loc in soup.find_all('loc'):
                url = loc.get_text().strip()
                if url and url.startswith(base_url):
                    urls.add(url)
        else:
            logger.info("No sitemap found, will crawl the site")
    except Exception as e:
        logger.warning(f"Could not fetch sitemap: {e}")

    # If no sitemap or we need to crawl, implement a simple breadth-first crawl
    if len(urls) <= 1:  # Only the base URL was added
        logger.info("Starting site crawl...")
        visited = set()
        to_visit = [base_url]
        max_pages = 100  # Prevent infinite crawling

        while to_visit and len(visited) < max_pages:
            current_url = to_visit.pop(0)
            if current_url in visited:
                continue

            visited.add(current_url)

            try:
                response = requests.get(current_url)
                response.raise_for_status()

                soup = BeautifulSoup(response.content, 'html.parser')

                # Find all links that are part of the same site
                for link in soup.find_all('a', href=True):
                    href = link['href']
                    full_url = urljoin(current_url, href)

                    # Only add URLs from the same domain
                    if urlparse(full_url).netloc == urlparse(base_url).netloc:
                        if full_url not in visited and full_url.startswith(base_url):
                            to_visit.append(full_url)
                            urls.add(full_url)

                # Add a small delay to be respectful to the server
                time.sleep(0.1)

            except Exception as e:
                logger.warning(f"Could not process {current_url}: {e}")
                continue

    logger.info(f"Collected {len(urls)} URLs from the site")
    return list(urls)


def extract_text_from_url(url: str) -> Dict[str, Any]:
    """
    Extract and clean page content from a given URL.

    Args:
        url: The URL to extract content from

    Returns:
        Dictionary with content, title, and section information
    """
    logger.info(f"Extracting content from: {url}")

    try:
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()

        # Try to find the main content area (Docusaurus specific selectors)
        content_selectors = [
            'main div[class*="docItem"]',  # Common Docusaurus content area
            'article',  # Standard article tag
            'main',  # Main content area
            '.main-wrapper',  # Another common Docusaurus selector
            '.container',  # Container div
            'div[class*="doc"]',  # Docusaurus documentation class
            'div[class*="theme"]',  # Docusaurus theme content
        ]

        content_element = None
        for selector in content_selectors:
            content_element = soup.select_one(selector)
            if content_element:
                break

        if not content_element:
            # If no specific content area found, use body
            content_element = soup.find('body')

        # Extract text content
        content = content_element.get_text(separator=' ', strip=True) if content_element else soup.get_text(separator=' ', strip=True)

        # Clean up the content (remove extra whitespace)
        content = ' '.join(content.split())

        # Extract title
        title = soup.find('title')
        title = title.get_text().strip() if title else urlparse(url).path.split('/')[-1] or 'Untitled'

        # Extract section/heading information (first H1 if available)
        section = ''
        h1 = soup.find('h1')
        if h1:
            section = h1.get_text().strip()
        else:
            # Look for other headings
            for heading in ['h2', 'h3', 'h4']:
                h = soup.find(heading)
                if h:
                    section = h.get_text().strip()
                    break

        result = {
            'url': url,
            'title': title,
            'section': section,
            'content': content
        }

        logger.info(f"Successfully extracted content from {url} (content length: {len(content)})")
        return result

    except Exception as e:
        logger.error(f"Error extracting content from {url}: {e}")
        raise


def chunk_text(content: str, url: str, title: str, section: str, chunk_size: int = 1000) -> List[Dict[str, Any]]:
    """
    Split text content into chunks with section metadata.

    Args:
        content: The text content to chunk
        url: Source URL of the content
        title: Title of the page
        section: Section information
        chunk_size: Size of each chunk (default 1000 characters)

    Returns:
        List of text chunks with metadata
    """
    logger.info(f"Chunking content from {url}")

    if not content:
        return []

    chunks = []
    start = 0

    while start < len(content):
        end = start + chunk_size

        # Try to break at sentence boundary if possible
        if end < len(content):
            # Look for sentence boundaries near the chunk_size
            for i in range(end, min(end + 200, len(content))):
                if content[i] in '.!?':
                    end = i + 1
                    break

        chunk_text = content[start:end].strip()

        if chunk_text:  # Only add non-empty chunks
            chunk = {
                'id': hashlib.md5(f"{url}_{start}".encode()).hexdigest(),
                'content': chunk_text,
                'url': url,
                'title': title,
                'section': section,
                'metadata': {
                    'start_pos': start,
                    'end_pos': end,
                    'chunk_index': len(chunks)
                }
            }
            chunks.append(chunk)

        start = end

    logger.info(f"Created {len(chunks)} chunks from content")
    return chunks


def embed(text_chunk: str) -> List[float]:
    """
    Generate embeddings using Cohere models.

    Args:
        text_chunk: Text to generate embeddings for

    Returns:
        Vector embedding as a list of floats
    """
    api_key = os.getenv('COHERE_API_KEY')
    if not api_key:
        raise ValueError("COHERE_API_KEY environment variable not set")

    try:
        co = cohere.Client(api_key)
        response = co.embed(
            texts=[text_chunk],
            model='embed-english-v3.0',  # Using Cohere's English embedding model
            input_type="search_document"  # Specify the input type
        )

        # Extract the embedding from the response
        embedding = response.embeddings[0]  # Get the first (and only) embedding
        logger.info(f"Generated embedding with {len(embedding)} dimensions")
        return embedding

    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        raise


def create_collection(collection_name: str):
    """
    Create a Qdrant collection named by rag_embedding.

    Args:
        collection_name: Name of the collection to create
    """
    qdrant_url = os.getenv('QDRANT_URL')
    qdrant_api_key = os.getenv('QDRANT_API_KEY')

    if not qdrant_url or not qdrant_api_key:
        raise ValueError("QDRANT_URL or QDRANT_API_KEY environment variable not set")

    try:
        client = QdrantClient(
            url=qdrant_url,
            api_key=qdrant_api_key,
        )

        # Check if collection already exists
        collections = client.get_collections()
        collection_exists = any(col.name == collection_name for col in collections.collections)

        if collection_exists:
            logger.info(f"Collection '{collection_name}' already exists")
            return

        # Create the collection
        # The dimension size depends on the Cohere embedding model used
        # embed-english-v3.0 produces 1024-dimensional embeddings for "search_document" input type
        client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE)
        )

        logger.info(f"Created collection '{collection_name}' with 1024-dimensional vectors")

    except Exception as e:
        logger.error(f"Error creating collection: {e}")
        raise


def save_chunk_to_qdrant(embedding: List[float], metadata: Dict[str, Any]):
    """
    Save chunk to Qdrant with metadata.

    Args:
        embedding: The embedding vector
        metadata: Metadata to store with the embedding
    """
    qdrant_url = os.getenv('QDRANT_URL')
    qdrant_api_key = os.getenv('QDRANT_API_KEY')

    if not qdrant_url or not qdrant_api_key:
        raise ValueError("QDRANT_URL or QDRANT_API_KEY environment variable not set")

    try:
        client = QdrantClient(
            url=qdrant_url,
            api_key=qdrant_api_key,
        )

        # Prepare the point to be stored
        point = models.PointStruct(
            id=metadata.get('id', hashlib.md5(str(metadata).encode()).hexdigest()[:16]),
            vector=embedding,
            payload={
                'content': metadata.get('content', ''),
                'url': metadata.get('url', ''),
                'title': metadata.get('title', ''),
                'section': metadata.get('section', ''),
                'chunk_index': metadata.get('metadata', {}).get('chunk_index', 0),
                'start_pos': metadata.get('metadata', {}).get('start_pos', 0),
                'end_pos': metadata.get('metadata', {}).get('end_pos', 0)
            }
        )

        # Store the point in the collection
        client.upsert(
            collection_name="rag_embedding",
            points=[point]
        )

        logger.info(f"Successfully saved chunk to Qdrant with ID: {point.id}")

    except Exception as e:
        logger.error(f"Error saving chunk to Qdrant: {e}")
        raise


def main():
    """
    Execute the complete pipeline:
    1. Verify Docusaurus site deployment
    2. Collect all URLs using get_all_urls
    3. Extract content from each URL using extract_text_from_url
    4. Chunk text using chunk_text
    5. Create "rag_embedding" collection using create_collection
    6. Generate embeddings using embed
    7. Save all chunks to Qdrant using save_chunk_to_qdrant
    """
    logger.info("Starting RAG pipeline execution...")

    try:
        # Validate environment variables
        validate_environment_variables()

        # Get base URL from environment
        base_url = os.getenv('BASE_URL')
        if not base_url:
            raise ValueError("BASE_URL environment variable not set")

        # 1. Create the Qdrant collection
        logger.info("Step 1: Creating Qdrant collection")
        create_collection("rag_embedding")

        # 2. Collect all URLs from the deployed Docusaurus site
        logger.info("Step 2: Collecting URLs from site")
        urls = get_all_urls(base_url)

        # 3. Process each URL: extract content, chunk it, embed, and save
        logger.info(f"Step 3: Processing {len(urls)} URLs")

        for i, url in enumerate(urls):
            logger.info(f"Processing URL {i+1}/{len(urls)}: {url}")

            try:
                # Extract content from URL
                content_data = extract_text_from_url(url)

                # Chunk the text content
                chunks = chunk_text(
                    content_data['content'],
                    content_data['url'],
                    content_data['title'],
                    content_data['section']
                )

                # Process each chunk
                for chunk in chunks:
                    # Generate embedding for the chunk
                    embedding = embed(chunk['content'])

                    # Save the chunk with its embedding to Qdrant
                    save_chunk_to_qdrant(embedding, chunk)

                logger.info(f"Successfully processed {len(chunks)} chunks from {url}")

            except Exception as e:
                logger.error(f"Error processing {url}: {e}")
                continue  # Continue with the next URL

        logger.info("RAG pipeline completed successfully!")

    except Exception as e:
        logger.error(f"RAG pipeline failed: {e}")
        raise


if __name__ == "__main__":
    main()