#!/usr/bin/env python3
"""
Seed initial database data (users, matters).
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from backend.app.db.session import Base
from backend.app.models.user import User
# Add other models

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

# TODO: Insert sample data
print("DB seeding starter")

