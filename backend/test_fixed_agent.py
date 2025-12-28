import asyncio
from agent import RAGAgent

async def test_agent():
    """Test the fixed agent"""
    print("Testing the fixed RAG agent...")

    # Initialize the agent
    agent = RAGAgent()
    print("SUCCESS: Agent initialized successfully!")

    # Test a simple query
    try:
        print("\nTesting query...")
        response = await agent.query_with_validation("What is AI?", context_constraint=None)

        print(f"SUCCESS: Query successful!")
        print(f"Content: {response.content[:100]}...")
        print(f"Citations: {len(response.citations)}")
        print(f"Confidence: {response.confidence_score}")

    except Exception as e:
        print(f"ERROR: Error during query: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_agent())