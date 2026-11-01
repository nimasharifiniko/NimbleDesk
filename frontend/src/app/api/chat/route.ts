import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `شما دستیار هوشمند 24/7 در Sample Cafe هستید. اطلاعات کافه: ساعت کاری همه روزه از ۹:۰۰ تا ۲۲:۰۰. منو: اسپرسو (۴۵ هزار تومان)، آیس لاته (۶۵ هزار تومان)، کیک روز. امکان رزرو میز وجود دارد.
اگر کاربر درباره کافه پرسید، دقیق بر اساس این اطلاعات پاسخ بده.
اگر کاربر سوال عمومی، علمی یا نامربوط (مثلاً تعمیر ماشین سمند، دلیل تلخی قهوه، یا قیمت ماشین) پرسید، با دانش عمومی خودت به عنوان یک دستیار دانشمند، مودب و باحوصله کاملاً پاسخ بده! پاسخ‌ها کوتاه، جذاب و به زبان کاربر (فارسی/انگلیسی/هلندی) باشد.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "کلید API تنظیم نشده است (OPENROUTER_API_KEY در فایل .env.local موجود نیست)." },
        { status: 500 }
      );
    }

    const openRouterMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(messages || [])
    ];

    // تابع کمکی برای ارسال درخواست با مدل مشخص
    const fetchFromOpenRouter = async (modelName: string) => {
      return fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://nimble-desk.vercel.app",
          "X-Title": "NimbleDesk AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: modelName,
          messages: openRouterMessages,
        }),
      });
    };

    // تلاش اول: استفاده از مدل Gemini 2.0 Flash Lite
    let res = await fetchFromOpenRouter("google/gemini-2.0-flash-lite-preview-02-05:free");

    // اگر مدل اول ارور داد (مثلاً لیمیت شده بود)، به صورت اتوماتیک سوئیچ می‌کنیم روی Llama
    if (!res.ok) {
      console.warn("Gemini model failed or is busy. Falling back to Llama...");
      res = await fetchFromOpenRouter("meta-llama/llama-3.3-70b-instruct:free");
    }

    // اگر مدل دوم هم ارور داد، خطای واقعی را پرتاب می‌کنیم
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenRouter API Failed (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("پاسخ معتبری از هوش مصنوعی دریافت نشد (خروجی خالی).");
    }

    return NextResponse.json({ response: reply });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "خطای ناشناخته در ارتباط با هوش مصنوعی رخ داد." },
      { status: 500 }
    );
  }
}