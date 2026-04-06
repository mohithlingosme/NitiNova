from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from .db.base import Base
from datetime import datetime

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    content = Column(Text)
    type = Column(String)  # "draft", "template", "judgment"
    case_id = Column(Integer, ForeignKey("cases.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

