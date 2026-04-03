from sentence_transformers import SentenceTransformer
from typing import List

class EmbeddingService:
    """
    A service for generating text embeddings using a sentence-transformer model.
    """

    def __init__(self, model_name: str = 'sentence-transformers/all-MiniLM-L6-v2'):
        """
        Initializes the EmbeddingService and loads the specified model.
        """
        self.model = SentenceTransformer(model_name)

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for a list of texts.
        """
        embeddings = self.model.encode(texts, convert_to_tensor=False)
        return embeddings.tolist()

# Example Usage:
if __name__ == '__main__':
    embedding_service = EmbeddingService()
    
    sentences = [
        "This is an example sentence.",
        "Each sentence is converted to a vector."
    ]
    
    embeddings = embedding_service.generate_embeddings(sentences)
    
    for sentence, embedding in zip(sentences, embeddings):
        print(f"Sentence: {sentence}")
        print(f"Embedding (first 5 dims): {embedding[:5]}")
        print("-" * 20)
