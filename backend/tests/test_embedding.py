import pytest
from backend.app.services.embedding import embedding_service

def test_embedding_dimension():
    vector = embedding_service.generate_embedding("Hello world")
    assert len(vector) == 768
    assert isinstance(vector, list)

def test_empty_string_embedding():
    vector = embedding_service.generate_embedding("")
    assert len(vector) == 768
    assert all(v == 0.0 for v in vector)

def test_embedding_deterministic():
    vec1 = embedding_service.generate_embedding("NimbleDesk smart assistant")
    vec2 = embedding_service.generate_embedding("NimbleDesk smart assistant")
    assert vec1 == vec2

def test_embedding_normalization():
    import numpy as np
    vec = embedding_service.generate_embedding("Test normalization")
    norm = np.linalg.norm(vec)
    assert pytest.approx(norm, abs=1e-5) == 1.0
