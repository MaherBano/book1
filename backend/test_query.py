import os
import sys
import codecs

# Set stdout to handle UTF-8 encoding
sys.stdout.reconfigure(encoding='utf-8')

from retrieve import RetrievalService

# Load environment
os.environ['COHERE_API_KEY'] = os.getenv('COHERE_API_KEY')
os.environ['QDRANT_URL'] = os.getenv('QDRANT_URL')
os.environ['QDRANT_API_KEY'] = os.getenv('QDRANT_API_KEY')

# Initialize the retrieval service
retrieval_service = RetrievalService(collection_name="rag_embedding")

# Test the query
query = "What is ROS?"
print(f"Query: {query}")

# Perform the search
results = retrieval_service.search(query_text=query, top_k=5)

print(f"Total results: {results['total_results']}")
print(f"Query time: {results['query_time']:.3f}s")

if results['results']:
    print("\nTop results:")
    for i, result in enumerate(results['results'], 1):
        content_preview = result['content'][:200].encode('utf-8', errors='ignore').decode('utf-8')
        print(f"\n{i}. Content preview: {content_preview}...")
        print(f"   Similarity score: {result['similarity_score']:.3f}")
        print(f"   Metadata: {result['metadata']}")
else:
    print("No results found.")