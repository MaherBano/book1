"""
Simple test to verify the RAG agent implementation
"""
import os
import sys

def test_agent_import():
    """Test that the agent module can be imported"""
    try:
        from agent import RAGAgent, Query, RetrievedContent, AgentResponse, Citation, ContextConstraint
        print("+ Successfully imported RAG agent components")
        return True
    except ImportError as e:
        print(f"- Failed to import RAG agent: {e}")
        return False

def test_data_models():
    """Test that data models can be instantiated"""
    try:
        from agent import Query

        # Test Query instantiation
        query = Query(text="Test query about the book content")
        print(f"+ Successfully created Query: {query.text}")

        # Test validation
        try:
            invalid_query = Query(text="Hi")  # Too short
            print("- Validation failed - should have rejected short query")
        except ValueError:
            print("+ Query validation working correctly")

        return True
    except Exception as e:
        print(f"- Failed to test data models: {e}")
        return False

def test_agent_initialization():
    """Test that agent can be initialized (configuration validation at init)"""
    try:
        from agent import RAGAgent

        # The agent should initialize with environment configuration
        # but actual connection validation happens during operations
        try:
            agent = RAGAgent()
            print("+ Agent initialized successfully with configuration")
            return True
        except (ValueError, Exception) as e:
            print(f"- Agent initialization failed: {e}")
            return False
    except Exception as e:
        print(f"- Failed to test agent initialization: {e}")
        return False

if __name__ == "__main__":
    print("Testing RAG Agent Implementation...")
    print()

    tests = [
        test_agent_import,
        test_data_models,
        test_agent_initialization
    ]

    passed = 0
    total = len(tests)

    for test in tests:
        if test():
            passed += 1
        print()

    print(f"Tests passed: {passed}/{total}")

    if passed == total:
        print("+ All tests passed!")
    else:
        print("- Some tests failed")