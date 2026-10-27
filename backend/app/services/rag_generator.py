from typing import Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.services.context_retriever import context_retriever

SYSTEM_PROMPTS = {
    "en": (
        "You are NimbleDesk AI, a helpful smart assistant for {business_name}.\n"
        "Use ONLY the provided context below to answer customer questions.\n"
        "If exact pricing or operating hours are asked, refer strictly to the context.\n"
        "If information is missing, politely inform the user that you don't have that detail.\n\n"
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
        "برای قیمت‌ها و ساعات کاری دقیقاً به اطلاعات زیر استناد کنید.\n"
        "اگر اطلاعاتی موجود نیست، محترمانه اعلام کنید که دسترسی ندارید.\n\n"
        "--- بافتار ---\n"
        "ساعات کاری:\n{business_hours}\n\n"
        "منو:\n{menu_items}\n\n"
        "خدمات:\n{services}\n\n"
        "پایگاه دانش:\n{knowledge_base}\n"
        "----------------"
    ),
    "nl": (
        "Je bent NimbleDesk AI, een slimme assistent voor {business_name}.\n"
        "Gebruik ALLEEN de onderstaande context om vragen van klanten te beantwoorden.\n"
        "Indien de informatie ontbreekt, geef dit dan beleefd aan.\n\n"
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
    Combines context retrieval with multi-lingual prompt construction and response generation.
    """
    async def generate_response(
        self,
        db: AsyncSession,
        business_id: UUID,
        query: str,
        lang: str = "en"
    ) -> Dict[str, Any]:
        context = await context_retriever.assemble_context(db, business_id, query)
        
        prompt_template = SYSTEM_PROMPTS.get(lang, SYSTEM_PROMPTS["en"])
        system_prompt = prompt_template.format(
            business_name=context["business_name"],
            business_hours=context["business_hours"],
            menu_items=context["menu_items"],
            services=context["services"],
            knowledge_base=context["knowledge_base"]
        )

        response_text = f"[{context['business_name']}] Answer for query '{query}' based on available knowledge."

        return {
            "query": query,
            "response": response_text,
            "language": lang,
            "system_prompt": system_prompt,
            "context": context
        }

rag_generator_service = RAGGeneratorService()
