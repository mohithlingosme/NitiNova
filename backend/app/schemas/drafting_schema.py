from pydantic import BaseModel
from typing import Dict, List, Optional

class DraftRequest(BaseModel):
    template_type: str
    case_details: Dict[str, str]
    jurisdiction: str = "India"
    language: str = "English"

class DraftResponse(BaseModel):
    content: str
    confidence: float
    warnings: List[str]
    citations_used: List[str]

