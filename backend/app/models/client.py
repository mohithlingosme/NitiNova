from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from .db.base import Base
from datetime import datetime

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    organization = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    cases = relationship("Case", back_populates="client")

