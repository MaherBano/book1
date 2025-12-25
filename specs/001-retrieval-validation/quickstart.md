# Quickstart: Retrieval Pipeline & Validation

## Prerequisites

- Python 3.11+
- uv package manager
- Access to Qdrant Cloud with existing Cohere embeddings
- Qdrant Cloud URL and API key
- Cohere API key

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Ensure dependencies are installed (they should already be present from the previous feature):
   ```bash
   uv add qdrant-client cohere python-dotenv pytest
   ```

3. Create the retrieve.py file with the required functions:
   - connect_to_qdrant
   - semantic_search
   - validate_retrieval_accuracy
   - validate_metadata_completeness
   - run_validation_tests

## Configuration

1. Ensure your `.env` file contains the necessary configuration:
   ```
   QDRANT_URL=your_qdrant_cloud_url
   QDRANT_API_KEY=your_qdrant_api_key
   COHERE_API_KEY=your_cohere_api_key
   ```

2. The retrieve.py module will automatically load these environment variables.

## Usage

1. Import and use the retrieval functions:
   ```python
   from retrieve import semantic_search, run_validation_tests

   # Perform semantic search
   results = semantic_search("your query here", top_k=5)

   # Run validation tests
   test_results = run_validation_tests()
   ```

2. The semantic search function will:
   - Connect to Qdrant Cloud
   - Execute vector similarity search
   - Return relevant book chunks with complete metadata
   - Validate results for accuracy and consistency

## Validation

After running retrieval operations, verify that:
- Queries return semantically relevant results
- Retrieved chunks include complete metadata (chapter, section, URL)
- Validation tests pass successfully
- Retrieval performance meets requirements (<2 second response time)