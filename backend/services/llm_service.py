"""
Mock LLM service for NitiNova backend.
"""
from openai import OpenAI
from backend.core.config import get_settings

settings = get_settings()

client = OpenAI(api_key=settings.openai_api_key)

def call_llm(query: str, model: str = None) -> str:
    """
    Call LLM with query.
    """
    model = model or settings.openai_model
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": query}],
            temperature=0.1,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"LLM error: {str(e)}"

def call_llm_stream(query: str, model: str = None):
    """
    Streaming LLM call.
    """
    model = model or settings.openai_model
    stream = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": query}],
        stream=True,
        temperature=0.1,
    )
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content
