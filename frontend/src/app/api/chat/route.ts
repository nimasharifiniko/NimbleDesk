import { NextResponse } from "next/server";

const MODELS = [
  "openrouter/auto",
  "deepseek/deepseek-r1:free",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

const GENERAL_RULE = `اگر کاربر سوالی عمومی، علمی یا نامرتبط با کسب‌وکار پرسید، با دانش عمومی خودت مودبانه و کوتاه پاسخ بده. همیشه به همان زبانی پاسخ بده که کاربر نوشته است (فارسی، انگلیسی یا هلندی).`;

const DEFAULT_CAFE_PROMPT = `شما دستیار هوشمند شبانه‌روزی «Sample Cafe» هستید.
ساعت کاری: همه روزه از ۹:۰۰ تا ۲۲:۰۰.
منو و قیمت‌ها:
- اسپرسو: ۴۵ هزار تومان
- آیس لاته: ۶۵ هزار تومان
- کیک روز: موجود است
رزرو میز: کاربر می‌تواند از طریق همین چت درخواست رزرو میز بدهد.
${GENERAL_RULE}`;

function clean(v: unknown, max = 200): string {
  if (typeof v === "string") return v.trim().slice(0, max);
  if (typeof v === "number") return String(v).slice(0, max);
  return "";
}

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "کلید OPENROUTER_API_KEY در فایل frontend/.env.local تنظیم نشده است. آن را اضافه کنید و سرور را دوباره اجرا کنید.",
        },
        { status: 500 }
      );
    }

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { messages, customServices, businessProfile } = body as {
      messages?: unknown;
      customServices?: unknown;
      businessProfile?: unknown;
    };

    // ---------- پروفایل کسب‌وکار ----------
    const rawProfile =
      businessProfile && typeof businessProfile === "object"
        ? (businessProfile as Record<string, unknown>)
        : {};

    const profile = {
      businessName: clean(rawProfile.businessName),
      managerName: clean(rawProfile.managerName),
      phone: clean(rawProfile.phone, 50),
      address: clean(rawProfile.address, 300),
    };
    const hasProfile = Object.values(profile).some(Boolean);

    // ---------- خدمات فعال ----------
    const activeServices = Array.isArray(customServices)
      ? customServices
          .filter(
            (s): s is Record<string, unknown> =>
              !!s &&
              typeof s === "object" &&
              Boolean((s as Record<string, unknown>).active) &&
              Boolean(clean((s as Record<string, unknown>).name))
          )
          .slice(0, 50)
          .map((s) => ({
            name: clean(s.name),
            price: clean(s.price, 60),
          }))
      : [];

    // ---------- ساخت System Prompt ----------
    let systemPrompt = DEFAULT_CAFE_PROMPT;

    if (hasProfile || activeServices.length > 0) {
      const parts: string[] = [];
      parts.push(
        `شما دستیار هوشمند شبانه‌روزی «${
          profile.businessName || "این کسب‌وکار"
        }» هستید.`
      );
      parts.push("ساعت کاری: همه روزه از ۹:۰۰ تا ۲۲:۰۰.");

      if (hasProfile) {
        const fields: string[] = [];
        if (profile.businessName)
          fields.push(`نام کسب‌وکار: ${profile.businessName}`);
        if (profile.managerName)
          fields.push(`نام مدیریت: ${profile.managerName}`);
        if (profile.phone) fields.push(`شماره تماس: ${profile.phone}`);
        if (profile.address) fields.push(`آدرس: ${profile.address}`);

        parts.push(`${fields.join("، ")}.`);
        parts.push(
          "اگر کاربر اطلاعات تماس، آدرس یا نام مدیر را خواست، دقیقاً از این اطلاعات استفاده کن. اگر مورد درخواستی بالا ثبت نشده بود، بگو این اطلاعات هنوز ثبت نشده و هرگز شماره یا آدرس جعل نکن."
        );
      }

      if (activeServices.length > 0) {
        const list = activeServices
          .map((s) => `- ${s.name}${s.price ? `: ${s.price}` : ""}`)
          .join("\n");
        parts.push(`خدمات و قیمت‌های فعال کسب‌وکار:\n${list}`);
        parts.push(
          "اگر کاربر درباره هر کدام از این خدمات یا قیمت‌ها پرسید، دقیقاً بر اساس این اطلاعات پاسخ بده."
        );
      }

      parts.push(GENERAL_RULE);
      systemPrompt = parts.join("\n");
    }

    // ---------- پیام‌ها ----------
    const userMessages: ChatMessage[] = Array.isArray(messages)
      ? (messages as unknown[])
          .filter(
            (m): m is ChatMessage =>
              !!m &&
              typeof m === "object" &&
              typeof (m as ChatMessage).role === "string" &&
              typeof (m as ChatMessage).content === "string"
          )
          .map((m) => ({ role: m.role, content: m.content }))
      : [];

    const apiMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...userMessages,
    ];

    // ---------- تلاش روی مدل‌ها با Fallback ----------
    let lastError = "";

    for (const model of MODELS) {
      try {
        const res = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "HTTP-Referer": "https://nimble-desk.vercel.app",
              "X-Title": "NimbleDesk AI",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ model, messages: apiMessages }),
          }
        );

        const raw = await res.text();

        if (!res.ok) {
          lastError = `${model} → ${res.status}: ${raw.slice(0, 200)}`;
          continue;
        }

        let data: {
          choices?: { message?: { content?: string } }[];
        } = {};
        try {
          data = JSON.parse(raw);
        } catch {
          lastError = `${model} → پاسخ نامعتبر (JSON نیست)`;
          continue;
        }

        const reply = data.choices?.[0]?.message?.content;
        if (typeof reply === "string" && reply.trim()) {
          return NextResponse.json({ response: reply, modelUsed: model });
        }

        lastError = `${model} → پاسخ خالی`;
      } catch (err) {
        lastError = `${model} → ${
          err instanceof Error ? err.message : "خطای ناشناخته"
        }`;
      }
    }

    return NextResponse.json(
      {
        error: `ارتباط با هیچ‌یک از مدل‌های هوش مصنوعی برقرار نشد. آخرین خطا: ${lastError}`,
      },
      { status: 502 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: `خطای داخلی سرور: ${
          err instanceof Error ? err.message : "ناشناخته"
        }`,
      },
      { status: 500 }
    );
  }
}