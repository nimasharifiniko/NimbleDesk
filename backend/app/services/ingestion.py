from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.knowledge import Document, Chunk
from backend.app.services.embedding import embedding_service

class IngestionService:
    """
    Ingests text documents and FAQs, splits them into text chunks,
    generates vector embeddings, and persists them into PostgreSQL.
    Enforces strict tenant isolation with business_id scoping.
    """
    def chunk_text(self, text: str, chunk_size: int = 300, overlap: int = 50) -> List[str]:
        if not text or not text.strip():
            return []
        
        words = text.split()
        if len(words) <= chunk_size:
            return [text.strip()]

        chunks = []
        start = 0
        while start < len(words):
            end = min(start + chunk_size, len(words))
            chunk = " ".join(words[start:end])
            chunks.append(chunk)
            if end == len(words):
                break
            start += chunk_size - overlap

        return chunks

    async def ingest_text_document(
        self,
        db: AsyncSession,
        business_id: UUID,
        title: str,
        content: str
    ) -> Document:
        # Create Document record
        doc = Document(
            business_id=business_id,
            title=title
        )
        db.add(doc)
        await db.flush()

        # Chunk text content
        raw_chunks = self.chunk_text(content)
        
        # Save chunks with generated embeddings
        for chunk_text in raw_chunks:
            vector = embedding_service.generate_embedding(chunk_text)
            chunk = Chunk(
                document_id=doc.id,
                content=chunk_text,
                embedding=vector
            )
            db.add(chunk)

        await db.commit()
        await db.refresh(doc)
        return doc

ingestion_service = IngestionService()
