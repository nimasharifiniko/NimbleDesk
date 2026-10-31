"use client";

import React, { useState, useEffect } from "react";
import { useDashboardLang } from "@/contexts/DashboardLangContext";

type Lang = "fa" | "en";

const TRANSLATIONS = {
  en: {
    dir: "ltr" as const,
    welcome: "Welcome back, Alex 👋",
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
    downloadBtn: "↓ Download QR Code",
    previewChat: "💬 Preview Customer Chat",
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
    welcome: "خوش برگشتید، الکس 👋",
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
    downloadBtn: "↓ دانلود کد QR",
    previewChat: "💬 پیش‌نمایش چت مشتری",
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

// آدرس نمونه چت مشتری که QR به آن اشاره می‌کند
const QR_TARGET_URL = "https://nimble-desk.vercel.app/c/sample-cafe";
// QR Code واقعی از QRServer API — رنگ‌ها هماهنگ با پالت پروژه (emerald روی پس‌زمینه رسمی #080c09)
const QR_IMAGE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
  QR_TARGET_URL
)}&color=10b981&bgcolor=080c09`;

export default function BusinessDashboardOverview() {
  const { lang, setLang } = useDashboardLang();
  const t = TRANSLATIONS[lang];

  // تاریخ پویا — محاسبه فقط سمت کلاینت داخل useEffect
  // (برای رفع خطای Next.js: "new Date() unstable value during prerender")
  const [dateRangeText, setDateRangeText] = useState<string>("");

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

  const weekDaysOpen: (keyof typeof t.days)[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weekDaysClosed: (keyof typeof t.days)[] = ["Saturday", "Sunday"];

  return (
    <div dir={t.dir} className="space-y-6">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-2">
            {t.welcome}
          </h1>
          <p className="text-xs text-gray-400 light:text-slate-600 mt-0.5">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {t.metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 light:shadow-md backdrop-blur-xl hover:border-emerald-500/30 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 light:text-slate-600 font-medium">{m.title}</span>
              <div className="w-8 h-8 rounded-xl bg-white/5 light:bg-slate-100 flex items-center justify-center text-sm">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Generator Widget */}
        <div className="p-5 rounded-2xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 light:shadow-md backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white light:text-slate-900">{t.qrTitle}</h3>
              <p className="text-[11px] text-gray-400 light:text-slate-500">{t.qrSubtitle}</p>
            </div>
            <span className="text-gray-500 light:text-slate-400 hover:text-white light:hover:text-slate-900 cursor-pointer">•••</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-neutral-950/40 light:bg-neutral-100 backdrop-blur-sm rounded-xl border border-white/10 light:border-slate-200 relative">
            {/* فریم شیشه‌ای + گلو سبز نئونی دور QR واقعی */}
            <div className="w-40 h-40 rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.25)] border border-emerald-500/20 bg-neutral-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QR_IMAGE_URL}
                alt="QR Code - NimbleDesk AI Front Desk"
                width={160}
                height={160}
                className="w-[92%] h-[92%] object-contain rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-neutral-950/40 light:bg-neutral-100 backdrop-blur-sm border border-white/10 light:border-slate-200 rounded-xl px-3 py-2 text-xs text-gray-300 light:text-slate-600">
              <span className="truncate text-[11px] text-gray-400 light:text-slate-500">{QR_TARGET_URL}</span>
              <button type="button" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold">{t.copyBtn}</button>
            </div>
            <a
              href={QR_IMAGE_URL}
              download="nimbledesk-qr-code.png"
              className="w-full flex items-center justify-center py-2.5 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:brightness-110 transition"
            >
              {t.downloadBtn}
            </a>
            <a
              href="/c/sample-cafe"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 hover:border-emerald-500/40 text-gray-300 light:text-slate-600 hover:text-emerald-400 font-semibold text-xs rounded-xl backdrop-blur-xl transition"
            >
              {t.previewChat}
            </a>
          </div>
        </div>

        {/* Upload Documents Widget */}
        <div className="p-5 rounded-2xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 light:shadow-md backdrop-blur-xl flex flex-col justify-between space-y-4">
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
                  <span className="text-red-400 font-bold text-sm">📄</span>
                  <div className="truncate">
                    <p className="text-xs font-medium text-gray-200 light:text-slate-700 truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-500 light:text-slate-400">{doc.size} • {doc.uploaded}</p>
                  </div>
                </div>
                <span className="text-emerald-400 text-xs">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Hours Widget */}
        <div className="p-5 rounded-2xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 light:shadow-md backdrop-blur-xl flex flex-col justify-between space-y-4">
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