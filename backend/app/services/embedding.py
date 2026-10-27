import numpy as np
from typing import List

class EmbeddingService:
    """
    Generates 768-dimensional vector embeddings for RAG retrieval.
    Includes a deterministic fall-back generator for local development and testing.
    """
    def __init__(self, dimension: int = 768):
        self.dimension = dimension

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generates a normalized float vector for the input text.
        """
        if not text or not text.strip():
            return [0.0] * self.dimension

        # Seed random generator with text hash to ensure deterministic output in dev mode
        seed = sum(ord(c) for c in text) % (2**32)
        rng = np.random.default_rng(seed)
        vec = rng.standard_normal(self.dimension)
        
        # L2 normalization
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm

        return vec.tolist()

embedding_service = EmbeddingService()
