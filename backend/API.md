# RAG Chatbot API

This API provides endpoints for the RAG-enabled chatbot that integrates with the Docusaurus documentation site.

## Setup

1. Make sure you have the required dependencies installed:
```bash
pip install -r requirements.txt
```

2. Ensure your `.env` file contains all required environment variables:
```bash
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
COHERE_API_KEY=your_cohere_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## Running the API

```bash
cd backend
python api.py
```

Or with uvicorn directly:
```bash
cd backend
uvicorn api:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## Endpoints

- `GET /` - Health check and basic info
- `POST /chat` - Main chat endpoint
- `GET /health` - Health check endpoint

## Chat Endpoint

The main `/chat` endpoint accepts a JSON payload:
```json
{
  "message": "Your question here",
  "context_constraint": "Optional context constraint"
}
```

And returns:
```json
{
  "response": "AI response",
  "citations": [...],
  "confidence_score": 0.85,
  "query_id": "unique_id"
}
```

## Integration with Docusaurus

The Docusaurus frontend will connect to this API to provide the chatbot functionality. Make sure the API is running when using the chatbot widget.