"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

type Lang = "fa" | "en";

const TRANSLATIONS = {
  en: {
    dir: "ltr" as const,
    brand: "NimbleDesk",
    loginBtn: "Log in",
    heroTitleLine1: "AI Front Desk for",
    heroTitleHighlight: "Local Businesses",
    heroSubtitle:
      "Give your customers an instant, always-on AI assistant that answers questions, books appointments, and never sleeps.",
    ctaPrimary: "Start Free Trial",
    ctaSecondary: "See Live Demo",
    featuresTitle: "Everything your front desk needs",
    featuresSubtitle: "Built for busy local businesses who can't afford to miss a customer.",
    features: [
      {
        icon: "💬",
        title: "24/7 Instant Responses",
        desc: "Your AI assistant answers customer questions instantly, day or night, no breaks needed.",
      },
      {
        icon: "🌐",
        title: "Multilingual Support",
        desc: "Chat with customers in Persian, English, Dutch and more — automatically detected.",
      },
      {
        icon: "🧠",
        title: "Smart Menu & Services",
        desc: "AI pre-configures your service menu and FAQ templates based on your business type.",
      },
      {
        icon: "📱",
        title: "Dedicated QR Code",
        desc: "Generate a unique QR code customers can scan to instantly start chatting with you.",
      },
    ],
    finalCtaTitle: "Ready to launch your AI Front Desk?",
    finalCtaSubtitle: "Setup takes less than 3 minutes. No credit card required.",
    footerCopyright: "© 2026 NimbleDesk · Designed & Developed by Nima Sharifi Niko",
  },
  fa: {
    dir: "rtl" as const,
    brand: "نیمبل‌دسک",
    loginBtn: "ورود",
    heroTitleLine1: "دستیار هوشمند ۲۴/۷",
    heroTitleHighlight: "کسب‌وکار شما",
    heroSubtitle:
      "به مشتریان خود یک دستیار هوشمند همیشه‌فعال بدهید که به سؤالات پاسخ می‌دهد، نوبت رزرو می‌کند و هرگز نمی‌خوابد.",
    ctaPrimary: "شروع رایگان",
    ctaSecondary: "مشاهده دمو زنده",
    featuresTitle: "هر آنچه پذیرش شما نیاز دارد",
    featuresSubtitle: "ساخته شده برای کسب‌وکارهای محلی شلوغ که نمی‌توانند مشتری را از دست بدهند.",
    features: [
      {
        icon: "💬",
        title: "پاسخگویی ۲۴/۷",
        desc: "دستیار هوشمند شما شب و روز، بدون وقفه، به سؤالات مشتریان پاسخ فوری می‌دهد.",
      },
      {
        icon: "🌐",
        title: "پشتیبانی چندزبانه",
        desc: "با مشتریان به فارسی، انگلیسی، هلندی و بیشتر گفتگو کنید — تشخیص خودکار زبان.",
      },
      {
        icon: "🧠",
        title: "ساخت هوشمند منو و خدمات",
        desc: "هوش مصنوعی منوی خدمات و سؤالات متداول شما را بر اساس نوع کسب‌وکار از پیش می‌سازد.",
      },
      {
        icon: "📱",
        title: "کیوآر کد اختصاصی",
        desc: "یک کد QR منحصربه‌فرد بسازید که مشتریان با اسکن آن فوراً گفتگو را شروع کنند.",
      },
    ],
    finalCtaTitle: "آماده راه‌اندازی دستیار هوشمند خود هستید؟",
    finalCtaSubtitle: "راه‌اندازی کمتر از ۳ دقیقه طول می‌کشد. نیازی به کارت اعتباری نیست.",
    footerCopyright: "© ۲۰۲۶ تمام حقوق برای NimbleDesk محفوظ است · طراحی و توسعه توسط نیما شریفی‌نیکو",
  },
};

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const { theme, toggleTheme } = useTheme();

  const t = TRANSLATIONS[lang];

  return (
    <main
      dir={t.dir}
      className="relative min-h-screen overflow-hidden bg-neutral-950 light:bg-neutral-100 text-white light:text-slate-900 selection:bg-emerald-500 selection:text-black transition-colors duration-300"
    >
      {/* Ambient Glow Background */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-green-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-500/10 blur-[100px]" />

      {/* Header */}
      <header className="relative z-10 sticky top-0 border-b border-white/10 light:border-slate-200 bg-neutral-950/70 light:bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-black font-extrabold text-lg shadow-[0_0_15px_rgba(57,255,20,0.35)]">
              ⬡
            </div>
            <span className="text-sm sm:text-base font-bold text-white light:text-slate-900">{t.brand}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "fa" : "en")}
              className="flex items-center gap-1.5 rounded-full border border-white/10 light:border-slate-200 bg-white/5 light:bg-white/80 px-3 py-1.5 text-xs text-gray-200 light:text-slate-600 backdrop-blur-xl transition hover:border-emerald-500/40"
            >
              🌐 {lang === "en" ? "FA" : "EN"}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center rounded-full border border-white/10 light:border-slate-200 bg-white/5 light:bg-white/80 p-2 text-gray-200 light:text-slate-600 backdrop-blur-xl transition hover:border-emerald-500/40"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            <Link
              href="/dashboard"
              className="rounded-full border border-white/10 light:border-slate-200 bg-white/5 light:bg-white/80 px-4 py-1.5 text-xs font-semibold text-gray-200 light:text-slate-600 backdrop-blur-xl transition hover:border-emerald-500/40 hover:text-emerald-400"
            >
              {t.loginBtn}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pt-16 pb-14 text-center sm:px-8 sm:pt-24 sm:pb-20">
        <h1 className="text-3xl font-extrabold leading-tight text-white light:text-slate-900 sm:text-5xl lg:text-6xl">
          {t.heroTitleLine1}{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            {t.heroTitleHighlight}
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm text-gray-400 light:text-slate-600 sm:text-base">
          {t.heroSubtitle}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 px-7 py-3.5 text-sm font-bold text-black shadow-[0_0_25px_rgba(74,222,128,0.4)] transition hover:brightness-110 hover:shadow-[0_0_30px_rgba(74,222,128,0.55)] text-center"
          >
            {t.ctaPrimary} →
          </Link>

          <a
            href="/c/sample-cafe"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto rounded-2xl border border-white/10 light:border-slate-200 bg-white/5 light:bg-white/80 px-7 py-3.5 text-sm font-semibold text-gray-200 light:text-slate-600 backdrop-blur-xl transition hover:border-emerald-500/40 hover:text-emerald-400 text-center"
          >
            {t.ctaSecondary}
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold text-white light:text-slate-900 sm:text-3xl">{t.featuresTitle}</h2>
          <p className="mt-2 text-xs text-gray-400 light:text-slate-600 sm:text-sm">{t.featuresSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.features.map((f, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 light:border-slate-200 bg-white/5 light:bg-white/80 light:shadow-md p-5 backdrop-blur-xl transition hover:border-emerald-500/30"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-white light:text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-xs text-gray-400 light:text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Band */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="rounded-[2.5rem] border border-white/10 light:border-slate-200 bg-white/5 light:bg-white/80 light:shadow-md p-8 text-center backdrop-blur-2xl shadow-[0_0_60px_rgba(57,255,20,0.08)] sm:p-12">
          <h2 className="text-lg font-bold text-white light:text-slate-900 sm:text-2xl">{t.finalCtaTitle}</h2>
          <p className="mt-2 text-xs text-gray-400 light:text-slate-600 sm:text-sm">{t.finalCtaSubtitle}</p>

          <Link
            href="/signup"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_25px_rgba(74,222,128,0.4)] transition hover:brightness-110 hover:shadow-[0_0_30px_rgba(74,222,128,0.55)]"
          >
            {t.ctaPrimary} →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 light:border-slate-200 py-6 text-center">
        <p className="text-[11px] text-gray-500 light:text-slate-500">
          {t.footerCopyright}
        </p>
      </footer>
    </main>
  );
}