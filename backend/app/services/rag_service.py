import pinecone
from ..core.config import get_settings

settings = get_settings()

index = pinecone.Index(settings.PINECONE_INDEX_NAME)

async def search_cases(query: str, top_k: int = 5):
    # TODO: Embed query and search Pinecone
    vector = [0.1] * 1536  # Dummy embedding
    matches = index.query(vector=vector, top_k=top_k, include_metadata=True)
    return matches['matches']

