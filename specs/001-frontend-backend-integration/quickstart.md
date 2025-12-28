# Quickstart Guide: Frontend Integration & Local Connectivity

## Overview
This guide will help you set up and run the integrated frontend-backend system for the RAG chatbot in the Docusaurus documentation site.

## Prerequisites
- Python 3.11+
- Node.js 18+ (for Docusaurus)
- uv package manager
- GEMINI_API_KEY in your environment

## Backend Setup (FastAPI Server)

1. **Navigate to the backend directory:**
   ```bash
   cd backend/
   ```

2. **Install dependencies:**
   ```bash
   uv pip install -r requirements.txt
   # Or if using pyproject.toml:
   uv sync
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

4. **Start the FastAPI server:**
   ```bash
   python api.py
   # Or using uvicorn directly:
   uvicorn api:app --reload --port 8000
   ```

5. **Verify the server is running:**
   - Open http://localhost:8000 in your browser
   - You should see: `{"message": "RAG Chatbot API is running!"}`
   - Health check: http://localhost:8000/health

## Frontend Setup (Docusaurus)

1. **Navigate to the docusaurus directory:**
   ```bash
   cd docusaurus/
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Docusaurus development server:**
   ```bash
   npm start
   ```

4. **Access the documentation site:**
   - Open http://localhost:3000 in your browser
   - The chatbot widget should be visible and accessible on all pages

## API Endpoints

### Chat Endpoint
- **URL**: `POST http://localhost:8000/chat`
- **Request Body**:
  ```json
  {
    "message": "Your question here",
    "context_constraint": "Optional context (e.g., current page)",
    "session_id": "Optional session ID"
  }
  ```
- **Response**:
  ```json
  {
    "response": "AI-generated response",
    "citations": [...],
    "confidence_score": 0.85,
    "query_id": "unique-query-id",
    "timestamp": "2023-12-28T10:30:00Z"
  }
  ```

### Health Check
- **URL**: `GET http://localhost:8000/health`

### Create Session
- **URL**: `POST http://localhost:8000/sessions`

### Get Session History
- **URL**: `GET http://localhost:8000/sessions/{session_id}`

## Troubleshooting

1. **CORS Issues**: If you encounter CORS errors, ensure the backend allows requests from your frontend origin.

2. **API Connection**: If the frontend can't connect to the backend, verify that:
   - The FastAPI server is running on port 8000
   - The frontend is configured to call the correct backend URL
   - Both services are running simultaneously

3. **Environment Variables**: Ensure your GEMINI_API_KEY is properly set in the backend environment.

4. **Vector Database**: Make sure your Qdrant vector database is running and populated with the book content.

## Development Workflow

1. Start the backend API server
2. Start the Docusaurus frontend server
3. The chatbot widget will automatically connect to the backend API
4. Test by asking questions in the chatbot widget on any documentation page

## Next Steps

- Customize the chatbot widget styling in `src/components/Chatbot/ChatbotWidget.css`
- Extend the API with additional endpoints as needed
- Configure production deployment settings