from sqlalchemy import Column, Integer, String, Boolean, Float
from .db.base import Base

class Citation(Base):
    __tablename__ = "citations"

    id = Column(Integer, primary_key=True)
    citation_text = Column(String, nullable=False)
    verified = Column(Boolean, default=False)
    confidence_score = Column(Float)
    source = Column(String)

