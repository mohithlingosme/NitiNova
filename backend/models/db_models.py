import uuid
from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    ForeignKey,
    Enum as PgEnum,
    JSON,
    Float,
    ARRAY,
    Integer
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy_utils import UUIDType

from sqlalchemy.orm import declarative_base
Base = declarative_base()

class Case(Base):
    __tablename__ = "cases"

    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    case_name = Column(Text, nullable=False)
    court = Column(Text)
    judges = Column(ARRAY(Text))
    date = Column(DateTime)
    facts = Column(Text)
    issues = Column(JSONB)
    arguments = Column(Text)
    judgement = Column(Text)
    citations = Column(JSONB)
    summary = Column(Text)
    ratio = Column(Text)
    subject_tags = Column(ARRAY(Text))
    case_status = Column(PgEnum('good_law', 'overruled', 'distinguished', 'per_incuriam', name='case_status_enum'))
    source_url = Column(Text)
    ingested_at = Column(DateTime, server_default=func.now())

class CitationIndex(Base):
    __tablename__ = "citations_index"

    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    raw_citation = Column(Text, nullable=False)
    case_id = Column(UUIDType(binary=False), ForeignKey("cases.id"))
    confidence = Column(Float)

    case = relationship("Case")

class CaseRelationship(Base):
    __tablename__ = "case_relationships"

    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    from_case_id = Column(UUIDType(binary=False), ForeignKey("cases.id"))
    to_case_id = Column(UUIDType(binary=False), ForeignKey("cases.id"))
    relationship_type = Column(PgEnum('cites', 'overrules', 'distinguishes', name='relationship_type_enum'))

class User(Base):
    __tablename__ = "users"

    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(PgEnum('free', 'pro', 'admin', name='user_role_enum'), default='free')
    created_at = Column(DateTime, server_default=func.now())

class VerificationLog(Base):
    __tablename__ = "verification_logs"

    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUIDType(binary=False))
    raw_citation = Column(Text, nullable=False)
    matched_case_id = Column(UUIDType(binary=False), nullable=True)
    match_type = Column(Text)
    score = Column(Float)
    re_run_count = Column(Integer, default=0)
    final_status = Column(Text)
    verified_at = Column(DateTime, server_default=func.now())
