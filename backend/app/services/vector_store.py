from typing import List, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.models.knowledge import Chunk, Document
from backend.app.services.embedding import embedding_service

class VectorStoreService:
    """
    Handles similarity search over vectorized document chunks using pgvector.
    Enforces strict tenant isolation by scoping all queries to business_id.
    """
    async def search_similar_chunks(
        self,
        db: AsyncSession,
        business_id: UUID,
        query: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        if not query or not query.strip():
            return []

        query_embedding = embedding_service.generate_embedding(query)

        # Scoped vector search filtered by business_id
        stmt = (
            select(Chunk, Document.title)
            .join(Document, Chunk.document_id == Document.id)
            .where(Document.business_id == business_id)
            .order_by(Chunk.embedding.cosine_distance(query_embedding))
            .limit(limit)
        )

        result = await db.execute(stmt)
        rows = result.all()

        results = []
        for chunk, doc_title in rows:
            results.append({
                "chunk_id": str(chunk.id),
                "document_id": str(chunk.document_id),
                "document_title": doc_title,
                "content": chunk.content,
            })

        return results

vector_store_service = VectorStoreService()
