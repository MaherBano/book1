# RAG Agent

This is a Retrieval-Augmented Generation (RAG) agent that connects to Qdrant Cloud for content retrieval and uses OpenAI for response generation. The agent generates citation-aware responses from book content.

## Features

- Query book content with AI agent
- Support for constrained-context queries
- Citation-aware responses with proper attribution
- Error handling for various edge cases
- Query type classification (factual, conceptual, section-specific)

## Prerequisites

- Python 3.11+
- OpenAI API key
- Qdrant Cloud account and API key
- Cohere API key
- Existing Qdrant collection with book content (rag_embedding)

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Copy the environment file template:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   QDRANT_URL=your_qdrant_cloud_url
   QDRANT_API_KEY=your_qdrant_api_key
   COHERE_API_KEY=your_cohere_api_key
   ```

## Usage

Run the agent interactively:
```bash
python agent.py
```

Or use it programmatically:
```python
from agent import RAGAgent

agent = RAGAgent()
response = agent.query("What is the main concept of machine learning?")
print(response.content)
print(response.citations)
```

## Example Response Structure

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