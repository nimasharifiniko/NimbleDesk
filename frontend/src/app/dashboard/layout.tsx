"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardLangProvider, useDashboardLang } from "@/contexts/DashboardLangContext";
import { useTheme } from "@/contexts/ThemeContext";

const TRANSLATIONS = {
  en: {
    brand: "AI Front Desk",
    brandSubtitle: "Business Dashboard",
    nav: [
      { name: "Overview", href: "/dashboard", badge: null as string | null },
      { name: "Conversations", href: "/dashboard/conversations", badge: "24" },
      { name: "Leads", href: "/dashboard/leads", badge: "12" },
      { name: "Documents", href: "/dashboard/documents", badge: null },
      { name: "QR Codes", href: "/dashboard/qrcodes", badge: null },
      { name: "Business Hours", href: "/dashboard/hours", badge: null },
      { name: "Integrations", href: "/dashboard/integrations", badge: null },
      { name: "Settings", href: "/dashboard/settings", badge: null },
    ],
    yourPlan: "Your Plan",
    proPlan: "Pro Plan",
    usage: "Usage",
    interactions: "1178 / 1500 interactions",
    needHelp: "Need help?",
    searchPlaceholder: "Search anything...",
    ownerName: "Alex Thompson",
    ownerRole: "Business Owner",
    langToggle: "فارسی",
    footerCopyright: "© 2026 NimbleDesk · Designed & Developed by Nima Sharifi Niko",
  },
  fa: {
    brand: "دستیار هوشمند",
    brandSubtitle: "داشبورد کسب‌وکار",
    nav: [
      { name: "نمای کلی", href: "/dashboard", badge: null as string | null },
      { name: "مکالمات", href: "/dashboard/conversations", badge: "24" },
      { name: "سرنخ‌ها", href: "/dashboard/leads", badge: "12" },
      { name: "اسناد", href: "/dashboard/documents", badge: null },
      { name: "کدهای QR", href: "/dashboard/qrcodes", badge: null },
      { name: "ساعات کاری", href: "/dashboard/hours", badge: null },
      { name: "یکپارچه‌سازی‌ها", href: "/dashboard/integrations", badge: null },
      { name: "تنظیمات", href: "/dashboard/settings", badge: null },
    ],
    yourPlan: "پلن شما",
    proPlan: "پلن حرفه‌ای",
    usage: "میزان استفاده",
    interactions: "۱۱۷۸ / ۱۵۰۰ تعامل",
    needHelp: "نیاز به کمک دارید؟",
    searchPlaceholder: "جستجو کنید...",
    ownerName: "الکس تامپسون",
    ownerRole: "صاحب کسب‌وکار",
    langToggle: "English",
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

/* آیکون‌های جدید — بدون وابستگی به کتابخانه خارجی */
function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lang, setLang, dir } = useDashboardLang();
  const { theme, toggleTheme } = useTheme();
  const t = TRANSLATIONS[lang];

  // کنترل باز/بسته بودن سایدبار در حالت موبایل (Drawer)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // جهت صحیح انیمیشن ورود سایدبار بر اساس RTL/LTR
  const closedTransform = dir === "rtl" ? "translate-x-full" : "-translate-x-full";

  return (
    <div
      dir={dir}
      className="min-h-screen bg-neutral-950 light:bg-neutral-100 text-gray-100 light:text-slate-900 flex font-sans antialiased selection:bg-emerald-500 selection:text-black transition-colors duration-300"
    >
      {/* Overlay تیره پشت سایدبار موبایل */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 start-0 z-50 w-64 h-full border-e border-white/10 light:border-slate-200 bg-white/5 light:bg-white/80 backdrop-blur-xl flex flex-col justify-between p-5 select-none shrink-0 overflow-y-auto transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : closedTransform
          } md:translate-x-0`}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-black font-extrabold text-lg shadow-[0_0_15px_rgba(57,255,20,0.35)] shrink-0">
              ⬡
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white light:text-slate-900 leading-tight truncate">{t.brand}</h2>
              <p className="text-[10px] text-gray-400 light:text-slate-500 truncate">{t.brandSubtitle}</p>
            </div>

            {/* دکمه بستن سایدبار — فقط موبایل */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="md:hidden ms-auto flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-slate-100 transition shrink-0"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="space-y-1">
            {t.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-green-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(57,255,20,0.1)] font-semibold"
                      : "text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-100"
                    }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10 light:border-slate-200">
          {/* دکمه‌های تغییر زبان و تم */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "fa" : "en")}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 hover:border-emerald-500/40 text-xs font-semibold text-gray-300 light:text-slate-600 hover:text-emerald-400 transition"
            >
              🌐 {t.langToggle}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center px-3 py-2 rounded-xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 hover:border-emerald-500/40 text-gray-300 light:text-slate-600 hover:text-emerald-400 transition"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 light:text-slate-500 text-[11px]">{t.yourPlan}</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-black shadow-[0_0_8px_rgba(57,255,20,0.4)]">
                {t.proPlan}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-300 light:text-slate-600">
              <span>{t.usage}</span>
              <span className="font-semibold text-emerald-400">78%</span>
            </div>
            <div className="w-full bg-white/10 light:bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-full w-[78%] rounded-full shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
            </div>
            <p className="text-[10px] text-gray-500 light:text-slate-400">{t.interactions}</p>
          </div>

          <div className="flex items-center justify-between px-2 text-xs text-gray-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 cursor-pointer transition">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-gray-500 light:border-slate-400 flex items-center justify-center text-[10px]">?</span>
              {t.needHelp}
            </span>
            <span>{dir === "rtl" ? "←" : "→"}</span>
          </div>

          {/* کپی‌رایت برندینگ */}
          <div className="pt-3 border-t border-white/10 light:border-slate-200 text-center">
            <p className="text-[9px] text-gray-500 light:text-slate-400 leading-relaxed px-1">
              {t.footerCopyright}
            </p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 light:border-slate-200 bg-white/5 light:bg-white/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* دکمه همبرگر — فقط موبایل */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 text-gray-300 light:text-slate-600 hover:border-emerald-500/40 transition shrink-0"
            >
              <MenuIcon />
            </button>

            <div className="hidden sm:flex items-center gap-3 bg-white/5 light:bg-white border border-white/10 light:border-slate-200 rounded-xl px-3.5 py-1.5 w-full max-w-xs md:w-72 focus-within:border-emerald-500/60 transition">
              <span className="text-gray-400 light:text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="bg-transparent border-none outline-none text-xs text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400 w-full min-w-0"
              />
              <span className="hidden md:inline-block text-[10px] bg-white/10 light:bg-slate-100 text-gray-400 light:text-slate-500 px-1.5 py-0.5 rounded font-mono shrink-0">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              className="w-9 h-9 rounded-xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 flex items-center justify-center text-gray-300 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:border-white/20 light:hover:border-slate-300 transition relative"
              aria-label="Notifications"
            >
              🔔
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 end-2 shadow-[0_0_6px_rgba(57,255,20,0.8)]" />
            </button>

            <div className="flex items-center gap-3 ps-2 border-s border-white/10 light:border-slate-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-700 p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-neutral-950 light:bg-white flex items-center justify-center font-bold text-xs text-emerald-400">
                  AT
                </div>
              </div>
              <div className="hidden sm:block">
                <h4 className="text-xs font-semibold text-white light:text-slate-900 leading-tight">{t.ownerName}</h4>
                <p className="text-[10px] text-gray-400 light:text-slate-500">{t.ownerRole}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLangProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </DashboardLangProvider>
  );
}