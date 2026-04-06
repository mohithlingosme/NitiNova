from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Reuse from existing schemas/user.py or create specific ones
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]

    class Config:
        from_attributes = True

