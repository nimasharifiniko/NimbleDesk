import { NextResponse } from "next/server";

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
    const { messages, customServices } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "کلید API تنظیم نشده است (OPENROUTER_API_KEY در فایل .env.local موجود نیست)." },
        { status: 500 }
      );
    }

    // تولید System Prompt به صورت داینامیک
    let systemPromptText = `شما دستیار هوشمند 24/7 در Sample Cafe هستید. اطلاعات کافه: ساعت کاری همه روزه از ۹:۰۰ تا ۲۲:۰۰. منو: اسپرسو (۴۵ هزار تومان)، آیس لاته (۶۵ هزار تومان)، کیک روز. امکان رزرو میز وجود دارد.
اگر کاربر درباره کافه پرسید، دقیق بر اساس این اطلاعات پاسخ بده.
اگر کاربر سوال عمومی، علمی یا نامربوط (مثلاً تعمیر ماشین سمند، دلیل تلخی قهوه، یا قیمت ماشین) پرسید، با دانش عمومی خودت به عنوان یک دستیار دانشمند، مودب و باحوصله کاملاً پاسخ بده! پاسخ‌ها کوتاه، جذاب و به زبان کاربر (فارسی/انگلیسی/هلندی) باشد.`;

    // اگر خدمات اختصاصی از Onboarding ارسال شده باشد، پرامپت تغییر می‌کند
    if (customServices && Array.isArray(customServices)) {
      const activeServices = customServices.filter((s: any) => s.active);
      if (activeServices.length > 0) {
        const servicesListText = activeServices.map((s: any) => `- ${s.name}: ${s.price}`).join("\n");
        systemPromptText = `شما دستیار هوشمند 24/7 یک کسب‌وکار هستید.
ساعت کاری: همه روزه از ۹:۰۰ تا ۲۲:۰۰.
خدمات و قیمت‌های فعال کسب‌وکار:
${servicesListText}

اگر کاربر درباره هر کدام از این خدمات یا قیمت‌ها پرسید، دقیقاً بر اساس این اطلاعات پاسخ بده.
اگر کاربر سوال عمومی، علمی یا نامربوط (مثلاً تعمیر ماشین سمند، دلیل تلخی قهوه، یا قیمت ماشین) پرسید، با دانش عمومی خودت به عنوان یک دستیار دانشمند، مودب و باحوصله کاملاً پاسخ بده! پاسخ‌ها کوتاه، جذاب و به زبان کاربر (فارسی/انگلیسی/هلندی) باشد.`;
      }
    }

    const openRouterMessages = [
      { role: "system", content: systemPromptText },
      ...(messages || []),
    ];

    let lastError = "";

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