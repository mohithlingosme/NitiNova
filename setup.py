from setuptools import find_packages, setup

setup(
    name="nitinova",
    version="0.0.1",
    description="Legal AI verification platform backend (FastAPI + RAG)",
    author="Mohith M",
    python_requires=">=3.11",
    packages=find_packages(where="."),
    include_package_data=True,
    install_requires=[
        "fastapi==0.115.0",
        "uvicorn[standard]==0.32.0",
        "pydantic==2.9.2",
        "pydantic-settings==2.6.1",
        "python-dotenv==1.0.1",
        "httpx==0.27.2",
        "loguru==0.7.2",
        "python-jose==3.3.0",
        "passlib[bcrypt]==1.7.4",
        "sqlalchemy==2.0.36",
        "alembic==1.13.2",
        "psycopg2-binary==2.9.9",
        "redis==5.0.4",
        "openai>=1.0.0,<2.0.0",
        "pinecone-client>=2.2.4,<4.0.0",
        "faiss-cpu>=1.8.0,<2.0.0",
        "numpy>=1.26.0,<3.0.0",
        "pandas>=2.2.0,<3.0.0",
        "scikit-learn>=1.4.0,<2.0.0",
    ],
    extras_require={
        "dev": [
            "pytest>=8.2.0,<9.0.0",
            "pytest-asyncio>=0.23.0,<0.24.0",
            "coverage>=7.4.0,<8.0.0",
            "black>=24.3.0,<25.0.0",
            "isort>=5.13.0,<6.0.0",
            "ruff>=0.3.0,<0.4.0",
        ]
    },
)
