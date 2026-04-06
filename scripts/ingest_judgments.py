#!/usr/bin/env python3
"""
Script to ingest Indian case law judgments into vector store.
"""
import os
from dotenv import load_dotenv
import pinecone
from langchain.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings

load_dotenv()

pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT")
)
index = pinecone.Index(os.getenv("PINECONE_INDEX_NAME"))

# TODO: Load from data/raw/, split, embed, upsert to Pinecone
print("Ingestion script starter - implement RAG pipeline")

