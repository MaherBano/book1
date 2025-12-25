# Quickstart: Website Deployment, Embeddings & Vector Storage

## Prerequisites

- Python 3.11+
- uv package manager
- Cohere API key
- Qdrant Cloud cluster URL and API key

## Setup

1. Create the backend directory:
   ```bash
   mkdir backend
   cd backend
   ```

2. Initialize the project with uv:
   ```bash
   uv init
   ```

3. Add required dependencies:
   ```bash
   uv add requests beautifulsoup4 cohere qdrant-client lxml python-dotenv
   ```

4. Create the main.py file with the required functions:
   - get_all_urls
   - extract_text_from_url
   - chunk_text
   - embed
   - create_collection
   - save_chunk_to_qdrant

## Configuration

1. Create a `.env` file with your API keys:
   ```
   COHERE_API_KEY=your_cohere_api_key_here
   QDRANT_URL=your_qdrant_cluster_url_here
   QDRANT_API_KEY=your_qdrant_api_key_here
   BASE_URL=your_docusaurus_site_url_here
   ```

2. Set up environment variables in your main.py file.

## Usage

1. Run the main function to execute the complete pipeline:
   ```bash
   python main.py
   ```

The pipeline will:
1. Collect all URLs from the deployed Docusaurus site
2. Extract and clean text content from each URL
3. Chunk the text with section metadata preserved
4. Generate embeddings using Cohere
5. Create a "rag_embedding" collection in Qdrant
6. Save all chunks to Qdrant with metadata

## Verification

After running, verify that:
- All URLs were processed successfully
- Embeddings were generated for all content
- Vectors were stored in Qdrant Cloud
- The "rag_embedding" collection exists and contains the expected records