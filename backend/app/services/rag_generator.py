from typing import Dict, Any, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.services.context_retriever import context_retriever

UNCERTAINTY_RESPONSES = {
    "en": "I don't have enough verified information to answer this question. Please check with our staff.",
    "fa": "اطلاعات کافی و تاییدشده‌ای برای پاسخ به این سوال در دسترس نیست. لطفاً با همکاران ما تماس بگیرید.",
    "nl": "Ik heb niet genoeg geverifieerde informatie om deze vraag te beantwoorden. Neem contact op met het personeel."
}

SYSTEM_PROMPTS = {
    "en": (
        "You are NimbleDesk AI, a helpful smart assistant for {business_name}.\n"
        "Use ONLY the provided context below to answer customer questions.\n"
        "If exact pricing or operating hours are asked, refer strictly to the context.\n"
        "If context does not contain the answer, say strictly: '{uncertainty_msg}'\n\n"
        "--- CONTEXT ---\n"
        "Hours:\n{business_hours}\n\n"
        "Menu:\n{menu_items}\n\n"
        "Services:\n{services}\n\n"
        "Knowledge Base:\n{knowledge_base}\n"
        "----------------"
    ),
    "fa": (
        "شما دستیار هوشمند NimbleDesk برای {business_name} هستید.\n"
        "تنها از اطلاعات بافتار زیر برای پاسخ به مشتری استفاده کنید.\n"
        "اگر اطلاعات در بافتار نیست، دقیقاً بگویید: '{uncertainty_msg}'\n\n"
        "--- بافتار ---\n"
        "ساعات کاری:\n{business_hours}\n\n"
        "منو:\n{menu_items}\n\n"
        "خدمات:\n{services}\n\n"
        "پایگاه دانش:\n{knowledge_base}\n"
        "----------------"
    ),
    "nl": (
        "Je bent NimbleDesk AI, een slimme assistent voor {business_name}.\n"
        "Gebruik ALLEEN de onderstaande context. Als de informatie ontbreekt, zeg dan: '{uncertainty_msg}'\n\n"
        "--- CONTEXT ---\n"
        "Openingstijden:\n{business_hours}\n\n"
        "Menu:\n{menu_items}\n\n"
        "Diensten:\n{services}\n\n"
        "Kennisbank:\n{knowledge_base}\n"
        "----------------"
    )
}

class RAGGeneratorService:
    """
    Combines context retrieval with multi-lingual prompt construction,
    source citations, and uncertainty handling ("I don't know").
    """
    async def generate_response(
        self,
        db: AsyncSession,
        business_id: UUID,
        query: str,
        lang: str = "en"
    ) -> Dict[str, Any]:
        context = await context_retriever.assemble_context(db, business_id, query)
        uncertainty_msg = UNCERTAINTY_RESPONSES.get(lang, UNCERTAINTY_RESPONSES["en"])

        prompt_template = SYSTEM_PROMPTS.get(lang, SYSTEM_PROMPTS["en"])
        system_prompt = prompt_template.format(
            business_name=context["business_name"],
            business_hours=context["business_hours"],
            menu_items=context["menu_items"],
            services=context["services"],
            knowledge_base=context["knowledge_base"],
            uncertainty_msg=uncertainty_msg
        )

        # Build citations list from raw chunks
        citations = []
        for chunk in context.get("raw_chunks", []):
            if chunk.get("document_title"):
                citations.append(chunk["document_title"])
        citations = list(set(citations))

        response_text = f"[{context['business_name']}] Answer for query '{query}' based on available knowledge."

        return {
            "query": query,
            "response": response_text,
            "language": lang,
            "system_prompt": system_prompt,
            "citations": citations,
            "context": context
        }

rag_generator_service = RAGGeneratorService()
