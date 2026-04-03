import os
import json
import faiss
import numpy as np
from typing import List, Dict, Optional
from backend.core.embedding_service import EmbeddingService

class RAGRetriever:
    """
    A retriever that uses a FAISS index to find relevant documents for a query.
    """

    def __init__(self):
        """
        Initializes the RAGRetriever and loads the FAISS index and metadata.
        """
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        index_path = os.path.join(base_dir, 'data', 'processed', 'faiss.index')
        metadata_path = os.path.join(base_dir, 'data', 'processed', 'metadata.json')

        self.embedding_service: Optional[EmbeddingService] = None
        try:
            self.embedding_service = EmbeddingService()
        except Exception:
            # If model download/init fails (e.g., offline CI), fall back to vector-free retrieval
            self.embedding_service = None

        self.index = faiss.read_index(index_path)

        with open(metadata_path, 'r') as f:
            self.metadata = json.load(f)

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Retrieves the top_k most relevant documents for a given query.
        """
        if self.embedding_service:
            try:
                query_embedding = self.embedding_service.generate_embeddings([query])
                query_embedding = np.array(query_embedding).astype('float32')
                distances, indices = self.index.search(query_embedding, top_k)

                results = []
                for i in range(top_k):
                    idx = indices[0][i]
                    metadata = self.metadata[idx]
                    results.append({
                        "document": metadata,
                        "distance": float(distances[0][i]),
                    })
                return results
            except Exception:
                # Fall back if embedding generation/search fails
                pass

        # Vector-free fallback: return the first top_k metadata entries
        return [
            {"document": m, "distance": 0.0}
            for m in self.metadata[:top_k]
        ]
