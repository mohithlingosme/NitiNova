import sys
from os.path import abspath, dirname
sys.path.insert(0, dirname(dirname(abspath(__file__))))

import os
import json
import faiss
import numpy as np
import logging
from backend.core.embedding_service import EmbeddingService

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Constants
PROCESSED_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'processed')
INDEX_PATH = os.path.join(PROCESSED_DATA_DIR, 'faiss.index')
METADATA_PATH = os.path.join(PROCESSED_DATA_DIR, 'metadata.json')

def chunk_text(text, chunk_size=512, overlap=50):
    """Chunks text into smaller pieces with overlap."""
    tokens = text.split()
    chunks = []
    for i in range(0, len(tokens), chunk_size - overlap):
        chunks.append(" ".join(tokens[i:i + chunk_size]))
    return chunks

def build_vector_index():
    """
    Builds a FAISS vector index from the processed legal documents.
    """
    embedding_service = EmbeddingService()
    
    all_chunks = []
    metadata = []
    
    for filename in os.listdir(PROCESSED_DATA_DIR):
        if filename.endswith('.json'):
            filepath = os.path.join(PROCESSED_DATA_DIR, filename)
            
            with open(filepath, 'r') as f:
                data = json.load(f)
                
                # Use facts, judgement, summary for embeddings as per task
                facts = data.get('facts', '')
                judgement = data.get('judgement', '')
                summary = data.get('summary', '')
                text = f"{facts} {judgement} {summary}".strip()
                if not text:
                    continue
                
                chunks = chunk_text(text)
                
                for i, chunk in enumerate(chunks):
                    all_chunks.append(chunk)
                    metadata.append({
                        'case_id': os.path.splitext(filename)[0],
                        'chunk_index': i,
                        'case_name': data.get('case_name', 'Unknown'),
                        'citation': data.get('neutral_citation', 'Unknown'),
                        'year': data.get('year', 'Unknown'),
                        'court': data.get('court_name', 'Unknown'),
                        'subject': data.get('subject_tags', [])
                    })

    if not all_chunks:
        logging.warning("No text chunks found to index.")
        return

    logging.info(f"Generating embeddings for {len(all_chunks)} chunks...")
    embeddings = embedding_service.generate_embeddings(all_chunks)
    embeddings = np.array(embeddings).astype('float32')

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    
    logging.info(f"Writing FAISS index to: {INDEX_PATH}")
    faiss.write_index(index, INDEX_PATH)
    
    logging.info(f"Writing metadata to: {METADATA_PATH}")
    with open(METADATA_PATH, 'w') as f:
        json.dump(metadata, f, indent=4)

if __name__ == "__main__":
    build_vector_index()
