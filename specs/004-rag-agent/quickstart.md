# Quickstart: RAG-Enabled AI Agent

## Overview
This guide provides a quick setup and usage guide for the RAG-Enabled AI Agent that integrates with OpenAI Agents SDK and Qdrant Cloud to generate citation-aware responses from book content.

## Prerequisites
- Python 3.11 or higher
- OpenAI API key
- Qdrant Cloud account and API key
- Cohere API key (for existing retrieval pipeline)
- Existing Qdrant collection with book content (rag_embedding)

## Setup

### 1. Install Dependencies
```bash
cd backend
uv sync
# Or if using pip:
pip install openai python-dotenv qdrant-client cohere requests
```

### 2. Environment Configuration
Ensure your `.env` file contains:
```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
COHERE_API_KEY=your_cohere_api_key
```

### 3. Verify Qdrant Connection
Make sure the `rag_embedding` collection exists in your Qdrant Cloud instance with the appropriate book content vectors.

## Usage

### 1. Initialize the Agent
```python
from agent import RAGAgent

# Create the agent instance
agent = RAGAgent()
```

### 2. Query the Agent
```python
# General query about book content
response = agent.query("What is the main concept of machine learning?")
print(response.content)
print(response.citations)

# Constrained-context query
response = agent.query("Explain neural networks", context_constraint="Chapter 3")
print(response.content)
print(response.citations)
```

### 3. Example Response Structure
```python
{
    "content": "Machine learning is a subset of AI that enables systems to learn and improve from experience...",
    "citations": [
        {
            "url": "https://book-1-ten.vercel.app/docs/chapter-1",
            "chapter": "Chapter 1: Foundations",
            "section": "Introduction to ML",
            "content_preview": "Machine learning is a subset of AI that enables systems...",
            "relevance_score": 0.87
        }
    ],
    "confidence_score": 0.92
}
```

## Key Features

### Citation-Aware Responses
The agent ensures all responses include proper citations to the originating book sections, maintaining transparency and verifiability.

### Contextual Constraints
Support for limiting responses to specific book sections or chapters based on user requirements.

### Semantic Retrieval
Uses semantic search to find the most relevant book content based on the user's query.

### Error Handling
Graceful handling of cases where no relevant content is found or connection issues occur.

## Troubleshooting

### Common Issues
- **No results found**: Verify Qdrant collection has book content and API keys are correct
- **Connection errors**: Check network connectivity and Qdrant Cloud availability
- **Poor response quality**: Ensure the Qdrant collection has sufficient book content

### Verification Steps
1. Test Qdrant connection independently
2. Verify API keys are properly set in environment
3. Confirm the rag_embedding collection contains book content
4. Test basic retrieval functionality via retrieve.py