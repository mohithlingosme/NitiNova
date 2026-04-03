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

    def keyword_score(self, query: str, documents: List[Dict]) -> List[Dict]:
        """Simple TF-IDF like keyword scoring."""
        query_words = set(query.lower().split())
        scores = []
        for doc in documents:
            doc_text = ' '.join([
                doc['document'].get('case_name', ''),
                doc['document'].get('citation', ''),
                ' '.join(doc['document'].get('subject', []))
            ]).lower()
            doc_words = set(doc_text.split())
            intersection = len(query_words & doc_words)
            score = intersection / max(len(query_words), 1)
            scores.append(score)
        # Re-rank by score
        ranked = sorted(zip(scores, documents), key=lambda x: x[0], reverse=True)
        return [{'score': s, 'document': d} for s, d in ranked]

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Hybrid retrieval with RRF: semantic FAISS + keyword BM25-like, fused by reciprocal rank fusion.
        """
        semantic_results = []
        keyword_results = self.keyword_score(query, self.metadata)
        
        if self.embedding_service:
            try:
                query_embedding = self.embedding_service.generate_embeddings([query])
                query_embedding = np.array(query_embedding).astype('float32')
                distances, indices = self.index.search(query_embedding, top_k * 2)
                semantic_results = []
                for i in range(len(indices[0])):
                    idx = indices[0][i]
                    semantic_results.append({
                        'rank': i + 1,
                        'document': self.metadata[idx],
                        'distance': float(distances[0][i])
                    })
            except Exception:
                pass

        # RRF fusion
        fused_scores = {}
        k = 60  # RRF constant

        # Semantic ranks
        for res in semantic_results:
            doc_id = id(res['document'])  # Use id as unique key
            score = 1 / (res['rank'] + k)
            fused_scores[doc_id] = fused_scores.get(doc_id, 0) + score

        # Keyword ranks
        for i, res in enumerate(keyword_results[:top_k * 2]):
            doc_id = id(res['document'])
            score = 1 / (i + 1 + k)
            fused_scores[doc_id] = fused_scores.get(doc_id, 0) + score

        # Sort by fused score
        fused = sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
        results = []
        for score, doc_id in fused[:top_k]:
            for doc_res in self.metadata + semantic_results + keyword_results:
                if id(doc_res['document' if 'document' in doc_res else 'doc']) == doc_id:
                    results.append({'document': doc_res['document'], 'rrf_score': score})
                    break
        return results if results else [{'document': m, 'distance': 0.0} for m in self.metadata[:top_k]]

