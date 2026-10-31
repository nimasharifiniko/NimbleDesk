"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type Lang = "fa" | "en";

type Industry = {
  id: string;
  title: string;
  icon: string;
  desc: string;
  defaultServices: string[];
};

const INDUSTRIES_BY_LANG: Record<Lang, Industry[]> = {
  en: [
    {
      id: "salon",
      title: "Beauty Salon & Spa",
      icon: "✂️",
      desc: "Haircut, Manicure, Pedicure, Facial & Hair Coloring",
      defaultServices: ["Haircut & Styling ($45)", "Manicure & Pedicure ($60)", "Facial Treatment ($85)"],
    },
    {
      id: "restaurant",
      title: "Restaurant & Cafe",
      icon: "🍽️",
      desc: "Menu inquiries, Table Reservation & Takeout Ordering",
      defaultServices: ["Table Reservation (Free)", "Chef Special Menu ($35)", "Catering Order ($150)"],
    },
    {
      id: "auto",
      title: "Auto Repair & Detailing",
      icon: "🚗",
      desc: "Oil Change, Tire Replacement & Full Inspection",
      defaultServices: ["Synthetic Oil Change ($65)", "Tire Balance & Rotation ($40)", "Full Inspection ($90)"],
    },
    {
      id: "clinic",
      title: "Medical & Dental Clinic",
      icon: "🩺",
      desc: "Doctor Consultation, Dental Cleaning & Checkup",
      defaultServices: ["Initial Consultation ($100)", "Teeth Cleaning ($120)", "General Checkup ($80)"],
    },
  ],
  fa: [
    {
      id: "salon",
      title: "سالن زیبایی و اسپا",
      icon: "✂️",
      desc: "کوتاهی مو، مانیکور، پدیکور، فیشیال و رنگ مو",
      defaultServices: ["کوتاهی و استایل مو (۴۵$)", "مانیکور و پدیکور (۶۰$)", "فیشیال صورت (۸۵$)"],
    },
    {
      id: "restaurant",
      title: "رستوران و کافه",
      icon: "🍽️",
      desc: "استعلام منو، رزرو میز و سفارش بیرون‌بر",
      defaultServices: ["رزرو میز (رایگان)", "منوی ویژه سرآشپز (۳۵$)", "سفارش کترینگ (۱۵۰$)"],
    },
    {
      id: "auto",
      title: "تعمیرگاه خودرو و دیتیلینگ",
      icon: "🚗",
      desc: "تعویض روغن، تعویض لاستیک و بازرسی کامل",
      defaultServices: ["تعویض روغن سینتتیک (۶۵$)", "بالانس و روتیشن لاستیک (۴۰$)", "بازرسی کامل (۹۰$)"],
    },
    {
      id: "clinic",
      title: "کلینیک پزشکی و دندانپزشکی",
      icon: "🩺",
      desc: "مشاوره پزشک، جرم‌گیری دندان و معاینه",
      defaultServices: ["مشاوره اولیه (۱۰۰$)", "جرم‌گیری دندان (۱۲۰$)", "معاینه عمومی (۸۰$)"],
    },
  ],
};

const TRANSLATIONS = {
  en: {
    dir: "ltr" as const,
    headerTitle: "Setup Your AI Front Desk",
    stepOf: (step: number) => `Step ${step} of 3`,
    step1Title: "Select Your Business Industry",
    step1Subtitle: "We will pre-configure AI tools, service menus, and FAQ templates for your trade.",
    step2Title: "Business Information",
    step2Subtitle: "Enter your basic details so customers and AI front desk know who you are.",
    businessNameLabel: "Business Name *",
    businessNamePlaceholder: "e.g. Glow Beauty Salon",
    slugLabel: "Custom URL Slug *",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+1 (555) 000-0000",
    addressLabel: "Location / Address",
    addressPlaceholder: "123 Main St, City",
    step3Title: "Review Pre-Configured Template",
    preloadedServices: "Pre-Loaded Services",
    active: "✓ Active",
    back: "← Back",
    continue: "Continue →",
    launch: "Launch Front Desk 🚀",
  },
  fa: {
    dir: "rtl" as const,
    headerTitle: "راه‌اندازی دستیار هوشمند شما",
    stepOf: (step: number) => `مرحله ${step} از ۳`,
    step1Title: "صنعت کسب‌وکار خود را انتخاب کنید",
    step1Subtitle: "ابزارهای هوش مصنوعی، منوی خدمات و قالب‌های سؤالات متداول متناسب با کسب‌وکار شما از پیش تنظیم می‌شود.",
    step2Title: "اطلاعات کسب‌وکار",
    step2Subtitle: "جزئیات اولیه را وارد کنید تا مشتریان و دستیار هوشمند شما را بشناسند.",
    businessNameLabel: "نام کسب‌وکار *",
    businessNamePlaceholder: "مثلاً: سالن زیبایی گلو",
    slugLabel: "آدرس اختصاصی *",
    phoneLabel: "شماره تماس",
    phonePlaceholder: "۰۹۱۲۰۰۰۰۰۰۰",
    addressLabel: "آدرس / موقعیت مکانی",
    addressPlaceholder: "خیابان اصلی، شهر",
    step3Title: "بررسی قالب از پیش تنظیم‌شده",
    preloadedServices: "خدمات از پیش بارگذاری شده",
    active: "✓ فعال",
    back: "→ بازگشت",
    continue: "ادامه ←",
    launch: "راه‌اندازی دستیار 🚀",
  },
};

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [step, setStep] = useState(1);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>(INDUSTRIES_BY_LANG.en[0].id);
  const [formData, setFormData] = useState({
    businessName: "",
    slug: "",
    phone: "",
    address: "",
  });

  const t = TRANSLATIONS[lang];
  const industries = INDUSTRIES_BY_LANG[lang];

  const selectedIndustry = useMemo(
    () => industries.find((i) => i.id === selectedIndustryId) ?? industries[0],
    [industries, selectedIndustryId]
  );

  const handleNext = () => {
    if (step === 2 && (!formData.businessName || !formData.slug)) return;
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main
      dir={t.dir}
      className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-black"
    >
      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_60px_rgba(57,255,20,0.08)] backdrop-blur-2xl relative space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-black font-extrabold flex items-center justify-center text-sm shadow-[0_0_12px_rgba(57,255,20,0.4)]">
              ⬡
            </div>
            <span className="text-sm font-bold text-white">{t.headerTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              {t.stepOf(step)}
            </span>

            {/* دکمه تغییر زبان */}
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "fa" : "en")}
              className="text-xs font-semibold text-gray-300 bg-white/5 hover:border-emerald-500/40 border border-white/10 px-3 py-1 rounded-full transition backdrop-blur-xl"
            >
              🌐 {lang === "en" ? "FA" : "EN"}
            </button>
          </div>
        </div>

        {/* STEP 1: Choose Industry */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">{t.step1Title}</h2>
              <p className="text-xs text-gray-400 mt-1">{t.step1Subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setSelectedIndustryId(ind.id)}
                  className={`p-4 rounded-2xl border text-start transition flex flex-col justify-between gap-2 backdrop-blur-xl ${selectedIndustry.id === ind.id
                    ? "bg-emerald-500/15 border-emerald-400 shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                >
                  <div className="text-2xl">{ind.icon}</div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{ind.title}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{ind.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Business Profile */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">{t.step2Title}</h2>
              <p className="text-xs text-gray-400 mt-1">{t.step2Subtitle}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">{t.businessNameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.businessNamePlaceholder}
                  value={formData.businessName}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setFormData({ ...formData, businessName: name, slug });
                  }}
                  className="w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/60 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">{t.slugLabel}</label>
                <div className="flex items-center bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl px-3.5 py-2.5 text-gray-400 focus-within:border-emerald-500/60 transition">
                  <span className="text-[11px] text-gray-500">nimbledesk.com/c/</span>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-transparent border-none outline-none text-white w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/60 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">{t.addressLabel}</label>
                  <input
                    type="text"
                    placeholder={t.addressPlaceholder}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/60 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Preview Pre-loaded Template */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">{t.step3Title}</h2>
              <p className="text-xs text-gray-400 mt-1">
                {lang === "fa" ? (
                  <>دستیار هوشمند شما با خدمات پیش‌فرض برای <span className="text-emerald-400 font-semibold">{selectedIndustry.title}</span> آماده است.</>
                ) : (
                  <>Your AI Front Desk is ready with default services for <span className="text-emerald-400 font-semibold">{selectedIndustry.title}</span>.</>
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {t.preloadedServices}
              </h4>
              <div className="space-y-2">
                {selectedIndustry.defaultServices.map((svc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/30 backdrop-blur-sm border border-white/5 text-xs text-gray-200">
                    <span>{svc}</span>
                    <span className="text-emerald-400 text-xs">{t.active}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl text-xs text-gray-300 transition"
            >
              {t.back}
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={step === 2 && (!formData.businessName || !formData.slug)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(57,255,20,0.35)] hover:brightness-110 active:scale-95 transition disabled:opacity-40"
          >
            {step === 3 ? t.launch : t.continue}
          </button>
        </div>
      </div>
    </main>
  );
}