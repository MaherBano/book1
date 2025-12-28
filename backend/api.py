"""
API endpoints for the RAG chatbot integration
"""
import os
import asyncio
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from agent import RAGAgent

# Initialize FastAPI app
app = FastAPI(
    title="RAG Chatbot API",
    description="API for the RAG-enabled chatbot integrated with Docusaurus documentation",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the Docusaurus frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the RAG agent
rag_agent = RAGAgent()

class ChatRequest(BaseModel):
    message: str
    context_constraint: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    citations: list
    confidence_score: float
    query_id: str

@app.get("/")
async def root():
    return {"message": "RAG Chatbot API is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint that processes user queries using the RAG agent
    """
    try:
        # Process the query using the RAG agent
        agent_response = await rag_agent.query_with_validation(
            query_text=request.message,
            context_constraint=request.context_constraint
        )

        return ChatResponse(
            response=agent_response.content,
            citations=[{
                "url": citation.url,
                "chapter": citation.chapter,
                "section": citation.section,
                "content_preview": citation.content_preview,
                "relevance_score": citation.relevance_score
            } for citation in agent_response.citations],
            confidence_score=agent_response.confidence_score or 0.0,
            query_id=agent_response.query_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "RAG Chatbot API"}

if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=int(os.getenv("API_PORT", 8000)),
        reload=True
    )