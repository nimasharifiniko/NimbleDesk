import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `شما دستیار هوشمند 24/7 در Sample Cafe هستید. اطلاعات کافه: ساعت کاری همه روزه از ۹:۰۰ تا ۲۲:۰۰. منو: اسپرسو (۴۵ هزار تومان)، آیس لاته (۶۵ هزار تومان)، کیک روز. امکان رزرو میز وجود دارد.
اگر کاربر درباره کافه پرسید، دقیق بر اساس این اطلاعات پاسخ بده.
اگر کاربر سوال عمومی، علمی یا نامربوط (مثلاً تعمیر ماشین سمند، دلیل تلخی قهوه، یا قیمت ماشین) پرسید، با دانش عمومی خودت به عنوان یک دستیار دانشمند، مودب و باحوصله کاملاً پاسخ بده! پاسخ‌ها کوتاه، جذاب و به زبان کاربر (فارسی/انگلیسی/هلندی) باشد.`;

const MODELS = [
  "openrouter/auto",
  "deepseek/deepseek-r1:free",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

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
      ...(messages || []),
    ];

    let lastError = "";

    // پیمایش روی لیست مدل‌ها تا اولین پاسخ موفق (Status 200)
    for (const model of MODELS) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "https://nimble-desk.vercel.app",
            "X-Title": "NimbleDesk AI",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            messages: openRouterMessages,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ response: reply, modelUsed: model });
          }
        }

        const errorText = await res.text();
        lastError = `Model ${model} failed (${res.status}): ${errorText}`;
        console.warn(lastError);
      } catch (err: any) {
        lastError = `Model ${model} error: ${err?.message || err}`;
        console.warn(lastError);
      }
    }

    // اگر تمام مدل‌های آرایه با خطا مواجه شدند
    return NextResponse.json(
      { error: `ارتباط با هیچ‌یک از مدل‌های هوش مصنوعی برقرار نشد. آخرین خطا: ${lastError}` },
      { status: 502 }
    );
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "خطای ناشناخته در پردازش درخواست چت رخ داد." },
      { status: 500 }
    );
  }
}