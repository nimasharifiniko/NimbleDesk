import io
from typing import List
from uuid import UUID
from pypdf import PdfReader
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.models.knowledge import Document, Chunk
from backend.app.services.embedding import embedding_service

class IngestionService:
    """
    Ingests text documents, FAQs, and PDF files, splits them into text chunks,
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

    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        """
        Extracts raw plain text content from PDF binary data.
        """
        reader = PdfReader(io.BytesIO(pdf_bytes))
        pages_text = []
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                pages_text.append(extracted)
        return "\n".join(pages_text)

    async def ingest_text_document(
        self,
        db: AsyncSession,
        business_id: UUID,
        title: str,
        content: str
    ) -> Document:
        doc = Document(
            business_id=business_id,
            title=title
        )
        db.add(doc)
        await db.flush()

        raw_chunks = self.chunk_text(content)
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

    async def ingest_pdf_document(
        self,
        db: AsyncSession,
        business_id: UUID,
        title: str,
        pdf_bytes: bytes
    ) -> Document:
        extracted_text = self.extract_text_from_pdf(pdf_bytes)
        return await self.ingest_text_document(
            db=db,
            business_id=business_id,
            title=title,
            content=extracted_text
        )

ingestion_service = IngestionService()
