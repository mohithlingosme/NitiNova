"""
Pipeline orchestration service.
"""
from backend.services.llm_service import call_llm
from backend.services.search_service import search
# from ocr_pipeline.ocr_engine import extract_text
# from ocr_pipeline.parser import parse_judgment
# Comment out broken OCR imports as per plan

def run_verification_pipeline(query: str):
    """
    Full verification pipeline.
    """
    # RAG search
    docs = search(query)
    context = "\n".join([d["content"] for d in docs])
    
    prompt = f"""
    Query: {query}
    Context: {context}
    Verify if context supports query. Return JSON: {{"verified": true/false, "explanation": "reason"}}
    """
    
    response = call_llm(prompt)
    return response
