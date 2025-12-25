import os
import logging
from typing import List, Dict, Any, Optional
import requests
import cohere
from qdrant_client import QdrantClient
from qdrant_client.http import models
from dotenv import load_dotenv
import time
from datetime import datetime


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()


def validate_environment_variables() -> bool:
    """
    Validate that all required environment variables are set.

    Returns:
        bool: True if all required environment variables are present, False otherwise
    """
    required_vars = ['COHERE_API_KEY']
    missing_vars = []

    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        return False

    logger.info("All required environment variables are present")
    return True


class RetrievalService:
    """
    A service class for the RAG retrieval pipeline using Qdrant and Cohere.
    Supports both cloud and local Qdrant configurations.
    """

    def __init__(self,
                 qdrant_url: Optional[str] = None,
                 qdrant_api_key: Optional[str] = None,
                 cohere_api_key: Optional[str] = None,
                 collection_name: str = "rag_embedding",
                 local_mode: bool = False):
        """
        Initialize the RetrievalService.

        Args:
            qdrant_url: URL for Qdrant instance (cloud or local)
            qdrant_api_key: API key for Qdrant (not needed for local)
            cohere_api_key: API key for Cohere
            collection_name: Name of the collection to search in
            local_mode: Whether to use local Qdrant (default: False for cloud)
        """
        self.qdrant_url = qdrant_url or os.getenv('QDRANT_URL')
        self.qdrant_api_key = qdrant_api_key or os.getenv('QDRANT_API_KEY')
        self.cohere_api_key = cohere_api_key or os.getenv('COHERE_API_KEY')
        self.collection_name = collection_name
        self.local_mode = local_mode

        # Initialize Cohere client
        if not self.cohere_api_key:
            raise ValueError("Cohere API key is required")
        self.cohere_client = cohere.Client(api_key=self.cohere_api_key)

        # Initialize Qdrant client
        self._initialize_qdrant_client()

        logger.info(f"RetrievalService initialized with collection: {self.collection_name}")

    def _initialize_qdrant_client(self):
        """Initialize the Qdrant client based on configuration."""
        try:
            if self.local_mode:
                # Connect to local Qdrant instance
                self.client = QdrantClient(host="localhost", port=6333)
                logger.info("Connected to local Qdrant instance")
            else:
                # Connect to Qdrant Cloud
                if not self.qdrant_url:
                    raise ValueError("Qdrant URL is required for cloud mode")

                client_params = {
                    "url": self.qdrant_url,
                    "timeout": 10
                }

                if self.qdrant_api_key:
                    client_params["api_key"] = self.qdrant_api_key

                self.client = QdrantClient(**client_params)
                logger.info(f"Connected to Qdrant Cloud: {self.qdrant_url}")

            # Verify collection exists
            collections = self.client.get_collections()
            collection_names = [col.name for col in collections.collections]

            if self.collection_name not in collection_names:
                logger.warning(f"Collection '{self.collection_name}' not found in Qdrant")
            else:
                logger.info(f"Collection '{self.collection_name}' verified in Qdrant")

        except Exception as e:
            logger.error(f"Failed to initialize Qdrant client: {str(e)}")
            raise

    def embed_query(self, query_text: str) -> List[float]:
        """
        Embed a query text using Cohere.

        Args:
            query_text: The text to embed

        Returns:
            List of floats representing the embedding vector
        """
        try:
            response = self.cohere_client.embed(
                texts=[query_text],
                model="embed-english-v3.0",
                input_type="search_query"
            )
            embedding = response.embeddings[0]
            logger.debug(f"Generated embedding with {len(embedding)} dimensions")
            return embedding
        except Exception as e:
            logger.error(f"Error generating embedding for query: {str(e)}")
            raise

    def search(self,
               query_text: str,
               top_k: int = 5,
               threshold: float = 0.0,
               filters: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Perform vector similarity search on document chunks collection.

        Args:
            query_text: The query text to search for
            top_k: Number of top results to return
            threshold: Similarity threshold to filter results
            filters: Optional filters to apply to the search

        Returns:
            Dictionary with search results and metadata
        """
        start_time = time.time()

        logger.info(f"Starting semantic search for query: '{query_text[:50]}...'")

        try:
            # Embed the query
            query_vector = self.embed_query(query_text)

            # Apply filters if provided
            qdrant_filters = None
            if filters:
                conditions = []
                for key, value in filters.items():
                    conditions.append(models.FieldCondition(
                        key=key,
                        match=models.MatchValue(value=value)
                    ))

                if conditions:
                    qdrant_filters = models.Filter(must=conditions)

            # Perform the search
            search_results = self.client.query_points(
                collection_name=self.collection_name,
                query=query_vector,
                limit=top_k,
                query_filter=qdrant_filters,
                score_threshold=threshold
            )

            # Process results
            points = search_results.points if hasattr(search_results, 'points') else search_results
            results = []

            for i, point in enumerate(points):
                payload = getattr(point, 'payload', {})
                score = getattr(point, 'score', 0)

                result = {
                    "id": getattr(point, 'id', f"result_{i}"),
                    "content": payload.get("content", ""),
                    "similarity_score": score,
                    "metadata": {k: v for k, v in payload.items() if k != "content"}
                }
                results.append(result)

            # Calculate query time
            query_time = time.time() - start_time

            # Prepare response
            response = {
                "query": query_text,
                "total_results": len(results),
                "query_time": query_time,
                "timestamp": datetime.now().isoformat(),
                "parameters": {
                    "top_k": top_k,
                    "threshold": threshold
                },
                "results": results
            }

            logger.info(f"Search completed in {query_time:.3f}s, found {len(results)} results")
            return response

        except Exception as e:
            logger.error(f"Error during semantic search: {str(e)}")
            raise

    def validate_chunks(self, chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validate retrieved chunks for completeness and quality.

        Args:
            chunks: List of retrieved chunks to validate

        Returns:
            Dictionary with validation results
        """
        logger.info(f"Validating {len(chunks)} chunks")

        validation_results = {
            "total_chunks": len(chunks),
            "valid_chunks": 0,
            "invalid_chunks": 0,
            "validation_details": []
        }

        for i, chunk in enumerate(chunks):
            is_valid = True
            issues = []

            # Check if chunk has required fields
            if not chunk.get("content"):
                is_valid = False
                issues.append("Missing content")

            if not chunk.get("similarity_score"):
                is_valid = False
                issues.append("Missing similarity score")

            # Validate content length
            content = chunk.get("content", "")
            if len(content.strip()) < 10:  # Minimum content length check
                is_valid = False
                issues.append("Content too short")

            # Add to validation results
            validation_results["validation_details"].append({
                "chunk_index": i,
                "is_valid": is_valid,
                "issues": issues
            })

            if is_valid:
                validation_results["valid_chunks"] += 1
            else:
                validation_results["invalid_chunks"] += 1

        logger.info(f"Validation completed: {validation_results['valid_chunks']} valid, {validation_results['invalid_chunks']} invalid")
        return validation_results

    def query_directly(self, query_text: str, **kwargs) -> Dict[str, Any]:
        """
        Direct querying method for simple access to the search functionality.

        Args:
            query_text: The query text
            **kwargs: Additional parameters for search

        Returns:
            Search results with metadata
        """
        logger.info(f"Direct query for: '{query_text[:50]}...'")
        return self.search(query_text, **kwargs)

    def inspect_collection(self) -> Dict[str, Any]:
        """
        Inspect the full collection to get information about available data.

        Returns:
            Dictionary with collection information
        """
        logger.info(f"Inspecting collection: {self.collection_name}")

        try:
            # Get collection info
            collection_info = self.client.get_collection(self.collection_name)

            # Count total points
            count_result = self.client.count(
                collection_name=self.collection_name
            )

            # Get sample points
            sample_points = self.client.scroll(
                collection_name=self.collection_name,
                limit=5  # Get first 5 points as sample
            )

            sample_data = []
            if sample_points[0]:  # Check if we have points
                for point in sample_points[0][:3]:  # Take first 3 as sample
                    sample_data.append({
                        "id": getattr(point, 'id', 'unknown'),
                        "payload_keys": list(getattr(point, 'payload', {}).keys()) if hasattr(point, 'payload') else [],
                        "vector_size": len(getattr(point, 'vector', [])) if hasattr(point, 'vector') else 0
                    })

            inspection_result = {
                "collection_name": self.collection_name,
                "total_points": count_result.count,
                "config": {
                    "vector_size": collection_info.config.params.vectors.size if collection_info.config.params.vectors else None,
                    "distance": str(collection_info.config.params.vectors.distance) if collection_info.config.params.vectors else None
                },
                "sample_data": sample_data,
                "timestamp": datetime.now().isoformat()
            }

            logger.info(f"Collection inspection completed: {count_result.count} points found")
            return inspection_result

        except Exception as e:
            logger.error(f"Error during collection inspection: {str(e)}")
            raise


# Validate environment variables on module import
if not validate_environment_variables():
    logger.warning("Some required environment variables are missing")


# Convenience function for direct use
def create_retrieval_service(**kwargs) -> RetrievalService:
    """
    Create and return a configured RetrievalService instance.

    Args:
        **kwargs: Parameters to pass to RetrievalService constructor

    Returns:
        Configured RetrievalService instance
    """
    return RetrievalService(**kwargs)