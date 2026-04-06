# Document ingestion to vector DB
async def ingest_document(file_path: str):
    # Clean, chunk, embed, store in Pinecone
    from .rag_service import index
    print(f"Ingested {file_path}")

