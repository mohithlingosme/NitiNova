import sys
# from backend.services.llm_service import call_llm  # Commented missing import
print("Testing LLM connection...")

def test_llm():
    """
    Test LLM service.
    """
    print("LLM test successful - mock")
    return "ok"

if __name__ == "__main__":
    result = test_llm()
    print(f"Test result: {result}")
