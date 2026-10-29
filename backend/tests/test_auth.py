import pytest
from backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

def test_password_hashing_and_verification():
    raw_password = "SecretPassword123!"
    hashed = hash_password(raw_password)

    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_encode_and_decode():
    payload = {"sub": "user-uuid-1234", "email": "test@example.com"}
    token = create_access_token(payload)

    assert isinstance(token, str)
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user-uuid-1234"
    assert decoded["email"] == "test@example.com"

def test_decode_invalid_jwt_token():
    invalid_token = "invalid.token.string"
    decoded = decode_access_token(invalid_token)
    assert decoded is None
