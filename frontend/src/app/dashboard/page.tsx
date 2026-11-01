"use client";

import React, { useState, useEffect } from "react";
import { useDashboardLang } from "@/contexts/DashboardLangContext";
import { encodeBiz } from "../../lib/bizCodec";

type Lang = "fa" | "en";

interface BusinessProfile {
  managerName?: string;
  businessName?: string;
  phone?: string;
  address?: string;
}

const TRANSLATIONS = {
  en: {
    dir: "ltr" as const,
    welcomePrefix: "Welcome back,",
    welcomeNoName: "Welcome back 👋",
    subtitle: "Here's what's happening with your AI Front Desk today.",
    metrics: [
      { title: "Total Conversations", value: "1,248", change: "↗ 18.5% vs last week", icon: "💬" },
      { title: "Qualified Leads", value: "312", change: "↗ 22.1% vs last week", icon: "🎯" },
      { title: "Documents Uploaded", value: "36", change: "↗ 12.4% vs last week", icon: "📄" },
      { title: "Avg. Response Time", value: "2.4s", change: "↘ 8.3% vs last week", icon: "⏱️" },
    ],
    qrTitle: "QR Code Generator",
    qrSubtitle: "Generate a QR code for your AI Front Desk",
    copyBtn: "Copy",
    copiedBtn: "Copied ✓",
    downloadBtn: "↓ Download QR Code",
    previewChat: "💬 Preview Customer Chat",
    qrTrimmed: (used: number, total: number) =>
      `Only ${used} of ${total} services fit in the QR code.`,
    uploadTitle: "Upload Documents",
    uploadSubtitle: "Upload PDF documents to train your AI",
    dragDrop: "Drag & drop your PDF files here",
    orBrowse: "or click to browse",
    supportText: "Supports PDF files up to 50MB each",
    recentDocs: [
      { name: "Company_Information.pdf", size: "2.4 MB", uploaded: "Uploaded just now" },
      { name: "Services_Catalog.pdf", size: "1.8 MB", uploaded: "Uploaded 2 hours ago" },
      { name: "Pricing_Guide.pdf", size: "3.2 MB", uploaded: "Uploaded yesterday" },
    ],
    hoursTitle: "Business Hours",
    hoursSubtitle: "Set when your AI Front Desk is available",
    days: {
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday",
      Saturday: "Saturday",
      Sunday: "Sunday",
    },
    openHours: "09:00 AM – 06:00 PM",
    closed: "Closed",
    saveChanges: "Save Changes",
  },
  fa: {
    dir: "rtl" as const,
    welcomePrefix: "خوش برگشتید،",
    welcomeNoName: "خوش برگشتید 👋",
    subtitle: "اتفاقات امروز دستیار هوشمند شما اینجاست.",
    metrics: [
      { title: "کل مکالمات", value: "۱,۲۴۸", change: "↗ ۱۸.۵٪ نسبت به هفته قبل", icon: "💬" },
      { title: "سرنخ‌های واجد شرایط", value: "۳۱۲", change: "↗ ۲۲.۱٪ نسبت به هفته قبل", icon: "🎯" },
      { title: "اسناد آپلودشده", value: "۳۶", change: "↗ ۱۲.۴٪ نسبت به هفته قبل", icon: "📄" },
      { title: "میانگین زمان پاسخ", value: "۲.۴ ثانیه", change: "↘ ۸.۳٪ نسبت به هفته قبل", icon: "⏱️" },
    ],
    qrTitle: "تولید کد QR",
    qrSubtitle: "یک کد QR برای دستیار هوشمند خود بسازید",
    copyBtn: "کپی",
    copiedBtn: "کپی شد ✓",
    downloadBtn: "↓ دانلود کد QR",
    previewChat: "💬 پیش‌نمایش چت مشتری",
    qrTrimmed: (used: number, total: number) =>
      `فقط ${used.toLocaleString("fa-IR")} خدمت از ${total.toLocaleString("fa-IR")} خدمت در کد QR جا شد.`,
    uploadTitle: "آپلود اسناد",
    uploadSubtitle: "اسناد PDF را برای آموزش هوش مصنوعی آپلود کنید",
    dragDrop: "فایل‌های PDF خود را اینجا بکشید و رها کنید",
    orBrowse: "یا برای انتخاب کلیک کنید",
    supportText: "فایل‌های PDF تا حداکثر ۵۰ مگابایت پشتیبانی می‌شوند",
    recentDocs: [
      { name: "Company_Information.pdf", size: "۲.۴ مگابایت", uploaded: "همین الان آپلود شد" },
      { name: "Services_Catalog.pdf", size: "۱.۸ مگابایت", uploaded: "۲ ساعت پیش آپلود شد" },
      { name: "Pricing_Guide.pdf", size: "۳.۲ مگابایت", uploaded: "دیروز آپلود شد" },
    ],
    hoursTitle: "ساعات کاری",
    hoursSubtitle: "زمان در دسترس بودن دستیار هوشمند را تنظیم کنید",
    days: {
      Monday: "دوشنبه",
      Tuesday: "سه‌شنبه",
      Wednesday: "چهارشنبه",
      Thursday: "پنجشنبه",
      Friday: "جمعه",
      Saturday: "شنبه",
      Sunday: "یکشنبه",
    },
    openHours: "۰۹:۰۰ الی ۱۸:۰۰",
    closed: "تعطیل",
    saveChanges: "ذخیره تغییرات",
  },
};

// دامنه اصلی پروژه — QR به چت مشتری روی همین دامنه اشاره می‌کند
const SITE_BASE_URL = "https://nimble-desk.vercel.app";
// اگر Onboarding انجام نشده باشد از این slug نمونه استفاده می‌شود
const FALLBACK_SLUG = "sample-cafe";
// سقف طول آدرس انکودشده‌ی داخل QRServer (سرویس حدود ۹۰۰ کاراکتر را تحمل می‌کند)
const QR_DATA_BUDGET = 880;

interface BizInfo {
  encoded: string; // رشته Base64 فشرده (خالی = بدون داده)
  usedServices: number;
  totalServices: number;
}

export default function BusinessDashboardOverview() {
  const { lang, setLang } = useDashboardLang();
  const t = TRANSLATIONS[lang];

  // تاریخ پویا — محاسبه فقط سمت کلاینت داخل useEffect
  // (برای رفع خطای Next.js: "new Date() unstable value during prerender")
  const [dateRangeText, setDateRangeText] = useState<string>("");

  // پروفایل کسب‌وکار (مقدار اولیه null برای جلوگیری از Hydration Error)
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  // slug چت مشتری (null = هنوز از localStorage خوانده نشده)
  const [slug, setSlug] = useState<string | null>(null);

  // داده‌ی فشرده‌ی کسب‌وکار که داخل لینک QR می‌رود
  const [biz, setBiz] = useState<BizInfo | null>(null);

  // وضعیت دکمه کپی
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // پروفایل
    let parsedProfile: BusinessProfile | null = null;
    try {
      const raw = localStorage.getItem("nimble_profile");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          parsedProfile = parsed as BusinessProfile;
          setProfile(parsedProfile);
        }
      }
    } catch {
      // داده خراب در localStorage؛ از متن پیش‌فرض استفاده می‌شود
    }

    // خدمات
    let parsedServices: unknown = [];
    try {
      const rawServices = localStorage.getItem("nimble_services");
      if (rawServices) parsedServices = JSON.parse(rawServices);
    } catch {
      // داده خراب؛ بدون خدمات ادامه می‌دهیم
    }

    // slug ذخیره‌شده در Onboarding
    let savedSlug = "";
    try {
      const rawBiz = localStorage.getItem("nimble_business");
      if (rawBiz) {
        const parsedBiz = JSON.parse(rawBiz);
        if (parsedBiz && typeof parsedBiz.slug === "string") {
          savedSlug = parsedBiz.slug.trim();
        }
      }
    } catch {
      // داده خراب؛ از slug نمونه استفاده می‌شود
    }
    const finalSlug = savedSlug || FALLBACK_SLUG;

    // محاسبه‌ی سقف طول داده بر اساس طول آدرس پایه (slug فارسی بعد از انکود طولانی می‌شود)
    const baseLen = encodeURIComponent(
      `${SITE_BASE_URL}/c/${encodeURIComponent(finalSlug)}?biz=`
    ).length;
    const maxChars = Math.max(200, QR_DATA_BUDGET - baseLen);

    const result = encodeBiz(
      { profile: parsedProfile, services: parsedServices },
      maxChars
    );

    setBiz(result);
    setSlug(finalSlug);
  }, []);

  useEffect(() => {
    const today = new Date();
    const day = today.getDay(); // 0=Sun ... 6=Sat
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const locale = lang === "fa" ? "fa-IR" : "en-US";
    const dayFormatter = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
    const yearFormatter = new Intl.DateTimeFormat(locale, { year: "numeric" });

    setDateRangeText(
      `${dayFormatter.format(startOfWeek)} – ${dayFormatter.format(endOfWeek)}, ${yearFormatter.format(endOfWeek)}`
    );
  }, [lang]);

  // آدرس‌های وابسته به slug و داده‌ی کسب‌وکار (تا زمانی که خوانده نشده، null هستند)
  const ready = slug !== null && biz !== null;
  const chatPath =
    ready && slug
      ? `/c/${encodeURIComponent(slug)}${biz && biz.encoded ? `?biz=${biz.encoded}` : ""}`
      : null;
  const qrTargetUrl = chatPath ? `${SITE_BASE_URL}${chatPath}` : null;
  const qrImageUrl = qrTargetUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=L&data=${encodeURIComponent(
        qrTargetUrl
      )}&color=10b981&bgcolor=080c09`
    : null;

  const servicesTrimmed = !!biz && biz.usedServices < biz.totalServices;

  // کپی لینک چت (داخل event handler)
  const handleCopy = async () => {
    if (!qrTargetUrl) return;
    try {
      await navigator.clipboard.writeText(qrTargetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // مرورگر اجازه دسترسی به کلیپ‌بورد نداد
    }
  };

  // تیتر خوش‌آمدگویی داینامیک
  const managerName = profile?.managerName?.trim();
  const welcomeText = managerName
    ? `${t.welcomePrefix} ${managerName} 👋`
    : t.welcomeNoName;

  const weekDaysOpen: (keyof typeof t.days)[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weekDaysClosed: (keyof typeof t.days)[] = ["Saturday", "Sunday"];

  return (
    <div dir={t.dir} className="space-y-5 md:space-y-6">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-white light:text-slate-900 flex items-center gap-2 break-words">
            {welcomeText}
          </h1>
          <p className="text-xs text-gray-400 light:text-slate-600 mt-0.5">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 backdrop-blur-xl rounded-xl px-3 py-1.5 text-xs text-gray-300 light:text-slate-600">
            <span>📅 {dateRangeText || "…"}</span>
            <span className="text-gray-500 light:text-slate-400">▼</span>
          </div>

          {/* دکمه تغییر زبان */}
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "fa" : "en")}
            className="flex items-center gap-1.5 bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 backdrop-blur-xl hover:border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs text-gray-300 light:text-slate-600 transition"
          >
            🌐 {lang === "en" ? "FA" : "EN"}
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {t.metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 light:shadow-md backdrop-blur-xl hover:border-emerald-500/30 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 light:text-slate-600 font-medium">{m.title}</span>
              <div className="w-8 h-8 rounded-xl bg-white/5 light:bg-slate-100 flex items-center justify-center text-sm shrink-0">
                {m.icon}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-white light:text-slate-900">{m.value}</h3>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">
                {m.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: QR Code Generator & Upload Documents & Business Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* QR Code Generator Widget */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 light:shadow-md backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white light:text-slate-900">{t.qrTitle}</h3>
              <p className="text-[11px] text-gray-400 light:text-slate-500">{t.qrSubtitle}</p>
            </div>
            <span className="text-gray-500 light:text-slate-400 hover:text-white light:hover:text-slate-900 cursor-pointer">•••</span>
          </div>

          <div className="w-full flex flex-col items-center justify-center p-4 bg-neutral-950/40 light:bg-neutral-100 backdrop-blur-sm rounded-xl border border-white/10 light:border-slate-200 relative">
            {/* فریم شیشه‌ای + گلو سبز نئونی دور QR واقعی — وسط‌چین و کاملاً قابل اسکن در موبایل */}
            <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.25)] border border-emerald-500/20 bg-neutral-950 mx-auto">
              {qrImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrImageUrl}
                  alt="QR Code - NimbleDesk AI Front Desk"
                  width={160}
                  height={160}
                  className="w-[92%] h-[92%] object-contain rounded-lg"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="w-[92%] h-[92%] rounded-lg bg-white/10 animate-pulse"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-neutral-950/40 light:bg-neutral-100 backdrop-blur-sm border border-white/10 light:border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-300 light:text-slate-600">
              <span dir="ltr" className="truncate text-[11px] text-gray-400 light:text-slate-500">
                {qrTargetUrl ?? "…"}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!ready}
                className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold shrink-0 ms-2 disabled:opacity-50"
              >
                {copied ? t.copiedBtn : t.copyBtn}
              </button>
            </div>

            {servicesTrimmed && biz && (
              <p className="text-[10px] text-amber-400 light:text-amber-600 px-1">
                {t.qrTrimmed(biz.usedServices, biz.totalServices)}
              </p>
            )}

            <a
              href={qrImageUrl ?? "#"}
              download="nimbledesk-qr-code.png"
              aria-disabled={!ready}
              className={`w-full flex items-center justify-center py-2.5 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:brightness-110 transition ${
                ready ? "" : "pointer-events-none opacity-60"
              }`}
            >
              {t.downloadBtn}
            </a>
            <a
              href={chatPath ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!ready}
              className={`w-full flex items-center justify-center gap-1.5 py-2.5 bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 hover:border-emerald-500/40 text-gray-300 light:text-slate-600 hover:text-emerald-400 font-semibold text-xs rounded-xl backdrop-blur-xl transition ${
                ready ? "" : "pointer-events-none opacity-60"
              }`}
            >
              {t.previewChat}
            </a>
          </div>
        </div>

        {/* Upload Documents Widget */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 light:shadow-md backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white light:text-slate-900">{t.uploadTitle}</h3>
              <p className="text-[11px] text-gray-400 light:text-slate-500">{t.uploadSubtitle}</p>
            </div>
            <span className="text-gray-500 light:text-slate-400 hover:text-white light:hover:text-slate-900 cursor-pointer">•••</span>
          </div>

          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-white/20 light:border-slate-300 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 bg-neutral-950/30 light:bg-slate-50 backdrop-blur-sm cursor-pointer transition">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
              ☁️
            </div>
            <p className="text-xs font-semibold text-white light:text-slate-900">
              {t.dragDrop}
            </p>
            <p className="text-[10px] text-gray-500 light:text-slate-500">{t.orBrowse}</p>
            <span className="text-[9px] text-gray-500 light:text-slate-400">{t.supportText}</span>
          </div>

          {/* File Upload List */}
          <div className="space-y-2">
            {t.recentDocs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/30 light:bg-slate-50 backdrop-blur-sm border border-white/5 light:border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-red-400 font-bold text-sm shrink-0">📄</span>
                  <div className="truncate">
                    <p className="text-xs font-medium text-gray-200 light:text-slate-700 truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-500 light:text-slate-400">{doc.size} • {doc.uploaded}</p>
                  </div>
                </div>
                <span className="text-emerald-400 text-xs shrink-0 ms-2">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Hours Widget */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 light:shadow-md backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white light:text-slate-900">{t.hoursTitle}</h3>
              <p className="text-[11px] text-gray-400 light:text-slate-500">{t.hoursSubtitle}</p>
            </div>
            <span className="text-gray-500 light:text-slate-400 hover:text-white light:hover:text-slate-900 cursor-pointer">•••</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {weekDaysOpen.map((day) => (
              <div key={day} className="flex items-center justify-between text-gray-300 light:text-slate-600">
                <span className="w-20 font-medium text-[11px]">{t.days[day]}</span>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(57,255,20,0.6)]" />
                  <span className="text-[11px] text-gray-400 light:text-slate-500">{t.openHours}</span>
                </div>
              </div>
            ))}
            {weekDaysClosed.map((day) => (
              <div key={day} className="flex items-center justify-between text-gray-500 light:text-slate-400">
                <span className="w-20 font-medium text-[11px]">{t.days[day]}</span>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-600 light:bg-slate-300 inline-block" />
                  <span className="text-[11px] text-gray-500 light:text-slate-400">{t.closed}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="w-full py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(57,255,20,0.4)] hover:brightness-110 transition"
          >
            {t.saveChanges}
          </button>
        </div>
      </div>
    </div>
  );
}