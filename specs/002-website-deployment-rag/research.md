# Research: Website Deployment, Embeddings & Vector Storage

## Decision: Project Structure
**Rationale**: Based on requirements, we need a backend project using uv for dependency management. The structure will be a single main.py file with specific functions as required.

**Alternatives considered**:
- Multiple files approach was rejected due to the requirement for a single main.py file
- Different package managers were considered but uv was specifically required

## Decision: Web Scraping Approach
**Rationale**: Using requests + beautifulsoup4 for extracting content from Docusaurus sites, as these are standard and reliable tools for web scraping.

**Alternatives considered**:
- Selenium for JavaScript-heavy sites (rejected as Docusaurus content is typically static)
- Scrapy for complex scraping (overkill for this use case)

## Decision: Embedding Model
**Rationale**: Using Cohere's embedding models as specifically required in the feature specification.

**Alternatives considered**:
- OpenAI embeddings (not specified in requirements)
- Hugging Face local models (more complex setup than required)

## Decision: Vector Storage
**Rationale**: Using Qdrant Cloud as specifically required in the feature specification.

**Alternatives considered**:
- Pinecone (not specified in requirements)
- Local vector databases (cloud solution was specified)

## Decision: URL Collection Method
**Rationale**: Will implement a sitemap parser or site crawler to collect all URLs from the deployed Docusaurus site.

**Alternatives considered**:
- Manual URL list (not scalable)
- API-based collection (Docusaurus doesn't provide such an API by default)

## Decision: Text Chunking Strategy
**Rationale**: Will implement semantic-aware chunking that preserves section metadata from Docusaurus sites to maintain context.

**Alternatives considered**:
- Fixed-size chunking (would lose semantic context)
- Sentence-based chunking (would not align with document structure)