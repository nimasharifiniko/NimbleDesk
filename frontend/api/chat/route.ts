import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `تو دستیار هوشمند Sample Cafe هستی. اطلاعات کافه: ساعت کاری ۸ تا ۲۳، منو شامل اسپرسو و لاته. اگر سوال درباره کافه بود طبق این جواب بده، اگر سوال عمومی (مثل خواص قهوه یا حتی تعمیر ماشین!) بود با دانش خودت به عنوان یک دستیار دانا و مودب پاسخ بده. پاسخ‌ها کوتاه و به زبان کاربر باشد.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.warn("OPENROUTER_API_KEY is not set in .env.local");
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    // ترکیب System Prompt با تاریخچه پیام‌های کاربر و ربات
    const openRouterMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(messages || [])
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nimbledesk.app", // هدر استاندارد OpenRouter
        "X-Title": "NimbleDesk"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-preview-02-05:free",
        messages: openRouterMessages,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenRouter API error: ${res.status}`);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "متاسفانه مشکلی در دریافت پاسخ رخ داد.";

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}