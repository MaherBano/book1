"""
RAG-Enabled AI Agent Implementation using OpenAI Agents SDK
Fixed version - tools must be standalone functions, not class methods
"""

import os
from typing import List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
from enum import Enum
import asyncio
import json
import traceback
from dotenv import load_dotenv
from agents import Agent, Runner, function_tool
from agents import OpenAIChatCompletionsModel
from openai import AsyncOpenAI

# Import the existing retrieval service
from retrieve import RetrievalService

# Load environment variables
load_dotenv()
# gemini_api_key = os.getenv("GEMINI_API_KEY")
ROUTER_API_KEY = "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"

# Configure Gemini client
client = AsyncOpenAI(
    api_key=ROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
    timeout=60.0,
    max_retries=2,
)

model = OpenAIChatCompletionsModel(
    model="google/gemini-2.0-flash-exp:free",
    openai_client=client
)

# =====================
# Data Models
# =====================
@dataclass
class Citation:
    url: str
    chapter: str
    section: str
    content_preview: str
    relevance_score: float

    def __post_init__(self):
        if self.relevance_score < 0.0 or self.relevance_score > 1.0:
            raise ValueError("Relevance score must be between 0.0 and 1.0")


@dataclass
class AgentResponse:
    content: str
    citations: List[Citation]
    query_id: str
    timestamp: datetime = None
    confidence_score: Optional[float] = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()


# =====================
# Global retrieval service (shared across tool calls)
# =====================
_retrieval_service = None
_last_retrieved_results = []

def get_retrieval_service():
    """Get or create the global retrieval service."""
    global _retrieval_service
    if _retrieval_service is None:
        _retrieval_service = RetrievalService(collection_name="rag_embedding")
    return _retrieval_service


# =====================
# Standalone tool function (required by function_tool decorator)
# =====================
@function_tool
def retrieve_content(query_text: str, context_constraint: Optional[str] = None) -> str:
    """
    Retrieve relevant content from the book based on the query.
    
    Args:
        query_text: The question or search query
        context_constraint: Optional context to filter results
        
    Returns:
        Retrieved content with metadata in a formatted string
    """
    global _last_retrieved_results
    
    print(f"\n🔍 Tool called with query: '{query_text}'")
    
    try:
        service = get_retrieval_service()
        # Don't apply filters that might not exist in the Qdrant collection
        # Just pass None for filters to avoid the "index required but not found" error
        filters = None

        print(f"🔎 Searching Qdrant (threshold=0.0, top_k=5)...")
        search_results = service.search(
            query_text=query_text,
            top_k=5,
            threshold=0.0,  # Get all results
            filters=filters
        )

        print(f"📊 Search returned {search_results['total_results']} results")
        
        if not search_results["results"]:
            _last_retrieved_results = []
            return "No relevant information found in the book for this query."

        # Store for citation generation
        _last_retrieved_results = search_results["results"]

        # Format the retrieved content in a clear way
        formatted_results = []
        for i, result in enumerate(search_results["results"], 1):
            score = result['similarity_score']
            chapter = result['metadata'].get('title', 'Unknown')
            section = result['metadata'].get('section', 'Unknown')
            content = result['content']
            
            print(f"  Result {i}: Score={score:.3f}, Chapter='{chapter[:50]}...', Section='{section[:50]}...'")
            
            formatted_results.append(
                f"Source {i} (Relevance: {score:.2f}):\n"
                f"Chapter: {chapter}\n"
                f"Section: {section}\n"
                f"Content: {content}\n"
            )

        final_output = "\n---\n".join(formatted_results)
        print(f"✅ Returning {len(formatted_results)} formatted results to agent")
        return final_output

    except Exception as e:
        error_msg = f"Error retrieving content: {str(e)}"
        print(f"❌ {error_msg}")
        traceback.print_exc()
        _last_retrieved_results = []
        return error_msg


# =====================
# RAG Agent
# =====================
class RAGAgent:
    def __init__(self):
        # Initialize retrieval service
        self.retrieval_service = get_retrieval_service()

        # Initialize the agent with the standalone tool
        self.agent = Agent(
            name="RAG Book Assistant",
            instructions="""You are a helpful RAG assistant that retrieves information from a book.

CRITICAL INSTRUCTIONS:
1. When you receive a question, IMMEDIATELY call the retrieve_content tool with the query text
2. Wait for the tool to return retrieved content
3. Based on the retrieved content, formulate a clear, helpful answer
4. If no relevant content is found, say so politely

DO NOT make up information. Only use what's retrieved from the tool.
Answer questions clearly and concisely based on the retrieved information.""",
            tools=[retrieve_content],  # Use the standalone function
            model=model
        )

    def _validate_retrieval_service(self) -> bool:
        try:
            result = self.retrieval_service.inspect_collection()
            print(f"✅ Validation successful: {result['total_points']} documents in collection")
            return True
        except Exception as e:
            print(f"❌ Retrieval service validation failed: {e}")
            traceback.print_exc()
            return False

    def _generate_citations(self) -> List[Citation]:
        """Generate citations from the last retrieved results."""
        global _last_retrieved_results
        citations = []
        for result in _last_retrieved_results:
            try:
                citations.append(Citation(
                    url=result['metadata'].get('url', 'N/A'),
                    chapter=result['metadata'].get('title', 'Unknown'),
                    section=result['metadata'].get('section', 'Unknown'),
                    content_preview=(result['content'][:200] + "..." if len(result['content']) > 200 else result['content']),
                    relevance_score=result['similarity_score']
                ))
            except Exception as e:
                print(f"⚠️  Warning: Could not create citation: {e}")
                continue
        return citations

    async def query(self, query_text: str, context_constraint: Optional[str] = None) -> AgentResponse:
        """Execute a query through the agent."""
        global _last_retrieved_results
        
        if not query_text.strip():
            raise ValueError("Query text cannot be empty")

        # Reset last results
        _last_retrieved_results = []

        # Create a simple, direct prompt
        user_message = f"Please answer this question: {query_text}"
        if context_constraint:
            user_message += f"\nContext constraint: {context_constraint}"

        print(f"\n💬 Sending to agent: '{user_message[:100]}...'")
        
        try:
            run_result = await Runner.run(
                self.agent,
                user_message
            )

            # Get the final output
            final_output = run_result.final_output

            print(f"\n📝 Agent final output length: {len(final_output)} characters")
            print(f"📝 Preview: {final_output[:200]}...")

            # Generate citations from stored results
            citations = self._generate_citations()
            
            confidence_score = 0.0
            if _last_retrieved_results:
                confidence_score = sum(r['similarity_score'] for r in _last_retrieved_results) / len(_last_retrieved_results)

            return AgentResponse(
                content=final_output or "I couldn't generate a response.",
                citations=citations,
                query_id=str(hash(query_text + str(datetime.now()))),
                confidence_score=confidence_score
            )
            
        except Exception as e:
            print(f"❌ Error during agent execution: {e}")
            traceback.print_exc()
            raise

    async def query_with_validation(self, query_text: str, context_constraint: Optional[str] = None) -> AgentResponse:
        """Execute a query with validation and error handling."""
        try:
            print("\n" + "="*60)
            print(f"🚀 Starting query: '{query_text}'")
            print("="*60)
            
            if not self._validate_retrieval_service():
                raise ConnectionError("Cannot connect to the retrieval service")

            response = await self.query(query_text, context_constraint)

            if not response.content.strip():
                raise ValueError("Agent returned an empty response")

            print(f"\n✅ Query completed successfully")
            return response

        except ConnectionError as e:
            print(f"❌ Connection error: {e}")
            return AgentResponse(
                content="Unable to connect to the knowledge base. Please check the connection and try again.",
                citations=[],
                query_id=str(hash(query_text + str(datetime.now()))),
                confidence_score=0.0
            )
        except Exception as e:
            print(f"❌ Error during query: {e}")
            traceback.print_exc()
            return AgentResponse(
                content=f"An unexpected error occurred: {str(e)}",
                citations=[],
                query_id=str(hash(query_text + str(datetime.now()))),
                confidence_score=0.0
            )


# =====================
# Testing function
# =====================
async def test_retrieval_directly():
    """Test the retrieval service directly without the agent."""
    print("\n" + "="*60)
    print("🧪 TESTING RETRIEVAL SERVICE DIRECTLY")
    print("="*60)
    
    service = get_retrieval_service()
    
    test_queries = ["What are the types of sensors?", "ROS 2", "machine learning"]
    
    for query in test_queries:
        print(f"\n📝 Testing query: '{query}'")
        try:
            results = service.search(query, top_k=3, threshold=0.0)
            print(f"✅ Found {results['total_results']} results")
            
            for i, r in enumerate(results['results'], 1):
                print(f"\n  Result {i}:")
                print(f"    Score: {r['similarity_score']:.3f}")
                print(f"    Chapter: {r['metadata'].get('title', 'N/A')[:60]}...")
                print(f"    Content preview: {r['content'][:150]}...")
        except Exception as e:
            print(f"❌ Error: {e}")
            traceback.print_exc()
    
    print("\n" + "="*60)


# =====================
# Example usage
# =====================
async def main():
    # First, test retrieval directly
    print("Running direct retrieval test first...\n")
    await test_retrieval_directly()
    
    print("\n\nNow starting the agent...\n")
    
    agent = RAGAgent()
    print("🤖 RAG Agent initialized! Type 'quit' to exit, 'test' to run retrieval test.\n")

    while True:
        query_text = input("\n❓ Enter your question: ").strip()
        
        if query_text.lower() in ['quit', 'exit', 'q']:
            print("👋 Goodbye!")
            break
            
        if query_text.lower() == 'test':
            await test_retrieval_directly()
            continue
            
        if not query_text:
            print("⚠️  Please enter a valid question.\n")
            continue

        response: AgentResponse = await agent.query_with_validation(query_text)
        
        print(f"\n{'='*60}")
        print(f"📖 Response:\n{response.content}")
        print(f"{'='*60}")

        if response.citations:
            print(f"\n📚 Citations ({len(response.citations)}):")
            for i, c in enumerate(response.citations, 1):
                print(f"  {i}. {c.chapter[:60]}... - {c.section[:40]}...")
                print(f"     URL: {c.url}")
                print(f"     Relevance: {c.relevance_score:.2f}")
                print(f"     Preview: {c.content_preview[:100]}...")
        
        if response.confidence_score > 0:
            print(f"\n📊 Confidence: {response.confidence_score:.2f}")
        
        await asyncio.sleep(0.5)


if __name__ == "__main__":
    asyncio.run(main())