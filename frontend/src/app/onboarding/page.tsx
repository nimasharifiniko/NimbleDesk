"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Lang = "fa" | "en";

type ServiceItem = {
  id: string;
  name: string;
  price: string;
  active: boolean;
};

type Industry = {
  id: string;
  title: string;
  icon: string;
  desc: string;
  defaultServices: { name: string; price: string }[];
};

const INDUSTRIES_BY_LANG: Record<Lang, Industry[]> = {
  en: [
    {
      id: "salon",
      title: "Beauty Salon & Spa",
      icon: "✂️",
      desc: "Haircut, Manicure, Pedicure, Facial & Hair Coloring",
      defaultServices: [
        { name: "Haircut & Styling", price: "45" },
        { name: "Manicure & Pedicure", price: "60" },
        { name: "Facial Treatment", price: "85" },
      ],
    },
    {
      id: "restaurant",
      title: "Restaurant & Cafe",
      icon: "🍽️",
      desc: "Menu inquiries, Table Reservation & Takeout Ordering",
      defaultServices: [
        { name: "Table Reservation", price: "0" },
        { name: "Chef Special Menu", price: "35" },
        { name: "Catering Order", price: "150" },
      ],
    },
    {
      id: "auto",
      title: "Auto Repair & Detailing",
      icon: "🚗",
      desc: "Oil Change, Tire Replacement & Full Inspection",
      defaultServices: [
        { name: "Synthetic Oil Change", price: "65" },
        { name: "Tire Balance & Rotation", price: "40" },
        { name: "Full Inspection", price: "90" },
      ],
    },
    {
      id: "clinic",
      title: "Medical & Dental Clinic",
      icon: "🩺",
      desc: "Doctor Consultation, Dental Cleaning & Checkup",
      defaultServices: [
        { name: "Initial Consultation", price: "100" },
        { name: "Teeth Cleaning", price: "120" },
        { name: "General Checkup", price: "80" },
      ],
    },
  ],
  fa: [
    {
      id: "salon",
      title: "سالن زیبایی و اسپا",
      icon: "✂️",
      desc: "کوتاهی مو، مانیکور، پدیکور، فیشیال و رنگ مو",
      defaultServices: [
        { name: "کوتاهی و استایل مو", price: "450000" },
        { name: "مانیکور و پدیکور", price: "600000" },
        { name: "فیشیال صورت", price: "850000" },
      ],
    },
    {
      id: "restaurant",
      title: "رستوران و کافه",
      icon: "🍽️",
      desc: "استعلام منو، رزرو میز و سفارش بیرون‌بر",
      defaultServices: [
        { name: "رزرو میز", price: "0" },
        { name: "منوی ویژه سرآشپز", price: "350000" },
        { name: "سفارش کترینگ", price: "1500000" },
      ],
    },
    {
      id: "auto",
      title: "تعمیرگاه خودرو و دیتیلینگ",
      icon: "🚗",
      desc: "تعویض روغن، تعویض لاستیک و بازرسی کامل",
      defaultServices: [
        { name: "تعویض روغن سینتتیک", price: "650000" },
        { name: "بالانس و روتیشن لاستیک", price: "400000" },
        { name: "بازرسی کامل", price: "900000" },
      ],
    },
    {
      id: "clinic",
      title: "کلینیک پزشکی و دندانپزشکی",
      icon: "🩺",
      desc: "مشاوره پزشک، جرم‌گیری دندان و معاینه",
      defaultServices: [
        { name: "مشاوره اولیه", price: "1000000" },
        { name: "جرم‌گیری دندان", price: "1200000" },
        { name: "معاینه عمومی", price: "800000" },
      ],
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
    managerNameLabel: "Manager Name *",
    managerNamePlaceholder: "e.g. Alex Thompson",
    businessNameLabel: "Business Name *",
    businessNamePlaceholder: "e.g. Glow Beauty Salon",
    slugLabel: "Custom URL Slug *",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+1 (555) 000-0000",
    addressLabel: "Location / Address",
    addressPlaceholder: "123 Main St, City",
    step3Title: "Review & Manage Services",
    step3Subtitle: "Toggle, edit or add services for your AI assistant to manage.",
    addNewService: "Add Custom Service",
    serviceNameLabel: "Service Name",
    servicePriceLabel: "Price",
    addBtn: "Add +",
    freeText: "Free",
    back: "← Back",
    continue: "Continue →",
    launch: "Launch Front Desk 🚀",
    footerCopyright: "© 2026 NimbleDesk · Designed & Developed by Nima Sharifi Niko",
  },
  fa: {
    dir: "rtl" as const,
    headerTitle: "راه‌اندازی دستیار هوشمند شما",
    stepOf: (step: number) => `مرحله ${step} از ۳`,
    step1Title: "صنعت کسب‌وکار خود را انتخاب کنید",
    step1Subtitle: "ابزارهای هوش مصنوعی، منوی خدمات و قالب‌های سؤالات متداول متناسب با کسب‌وکار شما تنظیم می‌شود.",
    step2Title: "اطلاعات کسب‌وکار",
    step2Subtitle: "جزئیات اولیه را وارد کنید تا مشتریان و دستیار هوشمند شما را بشناسند.",
    managerNameLabel: "نام مدیر *",
    managerNamePlaceholder: "مثلاً: علی رضایی",
    businessNameLabel: "نام کسب‌وکار *",
    businessNamePlaceholder: "مثلاً: سالن زیبایی گلو",
    slugLabel: "آدرس اختصاصی *",
    phoneLabel: "شماره تماس",
    phonePlaceholder: "۰۹۱۲۰۰۰۰۰۰۰",
    addressLabel: "آدرس / موقعیت مکانی",
    addressPlaceholder: "خیابان اصلی، شهر",
    step3Title: "بررسی و مدیریت خدمات",
    step3Subtitle: "خدمات خود را فعال/غیرفعال، ویرایش یا خدمات جدیدی برای دستیار هوشمند اضافه کنید.",
    addNewService: "افزودن خدمت جدید",
    serviceNameLabel: "نام خدمت",
    servicePriceLabel: "قیمت",
    addBtn: "افزودن +",
    freeText: "رایگان",
    back: "→ بازگشت",
    continue: "ادامه ←",
    launch: "راه‌اندازی دستیار 🚀",
    footerCopyright: "© ۲۰۲۶ تمام حقوق برای NimbleDesk محفوظ است · طراحی و توسعه توسط نیما شریفی‌نیکو",
  },
};

/* --- آیکون‌های SVG داخلی --- */
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function OnboardingWizardPage() {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState<Lang>("en");
  const [step, setStep] = useState(1);

  const [selectedIndustryId, setSelectedIndustryId] = useState<string>(INDUSTRIES_BY_LANG.en[0].id);

  const [formData, setFormData] = useState({
    managerName: "",
    businessName: "",
    slug: "",
    phone: "",
    address: "",
  });

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [newService, setNewService] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "" });

  const servicesDirtyRef = useRef(false);
  const prevIndustryRef = useRef<string | null>(null);

  const t = TRANSLATIONS[lang];
  const industries = INDUSTRIES_BY_LANG[lang];
  const isRtl = t.dir === "rtl";

  const selectedIndustry = useMemo(
    () => industries.find((i) => i.id === selectedIndustryId) ?? industries[0],
    [industries, selectedIndustryId]
  );

  useEffect(() => {
    const industryChanged = prevIndustryRef.current !== selectedIndustryId;
    prevIndustryRef.current = selectedIndustryId;

    if (servicesDirtyRef.current && !industryChanged) return;

    const defaultSvc: ServiceItem[] = selectedIndustry.defaultServices.map((s, i) => ({
      id: `default-${i}`,
      name: s.name,
      price: s.price,
      active: true,
    }));
    setServices(defaultSvc);
    servicesDirtyRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndustryId, lang]);

  const formatPrice = (priceVal: string) => {
    if (!priceVal || !priceVal.trim()) return t.freeText;
    const num = Number(priceVal.replace(/,/g, ""));
    if (isNaN(num)) return priceVal;
    if (num === 0) return t.freeText;
    if (lang === "fa") return `${num.toLocaleString("fa-IR")} تومان`;
    return `$${num.toLocaleString("en-US")}`;
  };

  const handleToggleService = (id: string) => {
    servicesDirtyRef.current = true;
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const handleStartEdit = (svc: ServiceItem) => {
    setEditingId(svc.id);
    setEditForm({ name: svc.name, price: svc.price });
  };

  const handleSaveEdit = (id: string) => {
    servicesDirtyRef.current = true;
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: editForm.name, price: editForm.price } : s))
    );
    setEditingId(null);
  };

  const handleAddService = () => {
    if (!newService.name.trim()) return;
    servicesDirtyRef.current = true;
    const newId = `custom-${Date.now()}`;
    setServices((prev) => [
      ...prev,
      { id: newId, name: newService.name.trim(), price: newService.price, active: true },
    ]);
    setNewService({ name: "", price: "" });
  };

  const step2Invalid =
    !formData.managerName.trim() || !formData.businessName.trim() || !formData.slug.trim();

  const handleNext = () => {
    if (step === 2 && step2Invalid) return;

    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    if (typeof window !== "undefined") {
      const activeServicesFormatted = services
        .filter((s) => s.active)
        .map((s) => ({
          name: s.name,
          price: formatPrice(s.price),
          active: true,
        }));
      localStorage.setItem("nimble_services", JSON.stringify(activeServicesFormatted));

      localStorage.setItem(
        "nimble_profile",
        JSON.stringify({
          managerName: formData.managerName.trim(),
          businessName: formData.businessName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        })
      );

      localStorage.setItem(
        "nimble_business",
        JSON.stringify({
          industry: selectedIndustry.id,
          businessName: formData.businessName.trim(),
          slug: formData.slug.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        })
      );
    }

    window.location.href = "/dashboard";
  };

  return (
    <main
      dir={t.dir}
      className="min-h-screen bg-neutral-950 light:bg-neutral-100 text-white light:text-slate-900 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-black transition-colors duration-300"
    >
      <div className="w-full max-w-xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-[0_0_60px_rgba(57,255,20,0.08)] light:shadow-md backdrop-blur-2xl relative space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-black font-extrabold flex items-center justify-center text-sm shadow-[0_0_12px_rgba(57,255,20,0.4)]">
              ⬡
            </div>
            <span className="text-sm font-bold text-white light:text-slate-900">{t.headerTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              {t.stepOf(step)}
            </span>

            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "fa" : "en")}
              className="text-xs font-semibold text-gray-300 light:text-slate-600 bg-white/5 light:bg-white/80 hover:border-emerald-500/40 border border-white/10 light:border-slate-200 px-3 py-1 rounded-full transition backdrop-blur-xl"
            >
              🌐 {lang === "en" ? "FA" : "EN"}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center text-gray-300 light:text-slate-600 bg-white/5 light:bg-white/80 hover:border-emerald-500/40 border border-white/10 light:border-slate-200 p-1.5 rounded-full transition backdrop-blur-xl"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* STEP 1: Choose Industry */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white light:text-slate-900">{t.step1Title}</h2>
              <p className="text-xs text-gray-400 light:text-slate-600 mt-1">{t.step1Subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setSelectedIndustryId(ind.id)}
                  className={`p-4 rounded-2xl border text-start transition flex flex-col justify-between gap-2 backdrop-blur-xl ${selectedIndustry.id === ind.id
                    ? "bg-emerald-500/15 border-emerald-400 shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                    : "bg-white/5 light:bg-white/80 border-white/10 light:border-slate-200 hover:border-white/20"
                    }`}
                >
                  <div className="text-2xl">{ind.icon}</div>
                  <div>
                    <h3 className="text-xs font-bold text-white light:text-slate-900">{ind.title}</h3>
                    <p className="text-[10px] text-gray-400 light:text-slate-600 mt-0.5 line-clamp-2">{ind.desc}</p>
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
              <h2 className="text-lg font-bold text-white light:text-slate-900">{t.step2Title}</h2>
              <p className="text-xs text-gray-400 light:text-slate-600 mt-1">{t.step2Subtitle}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 light:text-slate-700 font-medium">{t.managerNameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.managerNamePlaceholder}
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  className="w-full bg-white/5 light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-xl rounded-xl px-3.5 py-2.5 text-white light:text-slate-900 outline-none focus:border-emerald-500/60 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 light:text-slate-700 font-medium">{t.businessNameLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.businessNamePlaceholder}
                  value={formData.businessName}
                  onChange={(e) => {
                    const name = e.target.value;
                    const generated = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setFormData({ ...formData, businessName: name, slug: generated || formData.slug });
                  }}
                  className="w-full bg-white/5 light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-xl rounded-xl px-3.5 py-2.5 text-white light:text-slate-900 outline-none focus:border-emerald-500/60 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 light:text-slate-700 font-medium">{t.slugLabel}</label>
                <div className="flex items-center bg-white/5 light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-xl rounded-xl px-3.5 py-2.5 text-gray-400 light:text-slate-500 focus-within:border-emerald-500/60 transition" dir="ltr">
                  <span className="text-[11px] text-gray-500 light:text-slate-400 whitespace-nowrap">nimbledesk.com/c/</span>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-transparent border-none outline-none text-white light:text-slate-900 w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 light:text-slate-700 font-medium">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-xl rounded-xl px-3.5 py-2.5 text-white light:text-slate-900 outline-none focus:border-emerald-500/60 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 light:text-slate-700 font-medium">{t.addressLabel}</label>
                  <input
                    type="text"
                    placeholder={t.addressPlaceholder}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white/5 light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-xl rounded-xl px-3.5 py-2.5 text-white light:text-slate-900 outline-none focus:border-emerald-500/60 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Manage Services */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in flex flex-col h-full max-h-[60vh]">
            <div>
              <h2 className="text-lg font-bold text-white light:text-slate-900">{t.step3Title}</h2>
              <p className="text-xs text-gray-400 light:text-slate-600 mt-1">{t.step3Subtitle}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pe-1 [scrollbar-width:thin] light:[color-scheme:light]">
              {services.map((svc) => (
                <div key={svc.id} className="p-3 rounded-xl bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 backdrop-blur-xl transition hover:border-white/20 light:hover:border-slate-300">
                  {editingId === svc.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="flex-1 min-w-0 bg-neutral-950/30 light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-lg px-2 py-1.5 text-xs text-white light:text-slate-900 outline-none focus:border-emerald-500/50"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="w-20 bg-neutral-950/30 light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-lg px-2 py-1.5 text-xs text-white light:text-slate-900 outline-none focus:border-emerald-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(svc.id)}
                        className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition shrink-0"
                      >
                        <CheckIcon />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col min-w-0 transition-opacity" style={{ opacity: svc.active ? 1 : 0.4 }}>
                        <span className="text-sm font-medium text-white light:text-slate-900 truncate">{svc.name}</span>
                        <span className="text-xs text-emerald-400 font-semibold">{formatPrice(svc.price)}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(svc)}
                          className="text-gray-400 light:text-slate-400 hover:text-emerald-400 light:hover:text-emerald-500 transition"
                        >
                          <PencilIcon />
                        </button>

                        {/* Glassmorphism Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleService(svc.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-white/10 transition-colors duration-200 ease-in-out backdrop-blur-md ${svc.active ? "bg-emerald-500/60 border-emerald-400" : "bg-white/10 light:bg-slate-300"
                            }`}
                        >
                          <span
                            className="pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            style={{
                              transform: svc.active
                                ? isRtl ? "translateX(-16px)" : "translateX(16px)"
                                : isRtl ? "translateX(-2px)" : "translateX(2px)",
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Service Form */}
            <div className="mt-4 pt-4 border-t border-white/10 light:border-slate-200 flex flex-col gap-2 shrink-0">
              <span className="text-[11px] text-gray-400 light:text-slate-500 font-medium">{t.addNewService}</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t.serviceNameLabel}
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="flex-1 min-w-0 bg-white/5 light:bg-white border border-white/10 light:border-slate-200 rounded-xl px-3 py-2 text-xs text-white light:text-slate-900 outline-none focus:border-emerald-500/50 backdrop-blur-md"
                />
                <input
                  type="text"
                  dir="ltr"
                  placeholder={t.servicePriceLabel}
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  className="w-20 sm:w-24 bg-white/5 light:bg-white border border-white/10 light:border-slate-200 rounded-xl px-3 py-2 text-xs text-white light:text-slate-900 outline-none focus:border-emerald-500/50 backdrop-blur-md text-center"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  disabled={!newService.name.trim()}
                  className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 disabled:opacity-30 transition shrink-0 whitespace-nowrap"
                >
                  {t.addBtn}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 light:border-slate-200 mt-auto">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl bg-white/5 light:bg-white/80 hover:bg-white/10 border border-white/10 light:border-slate-200 backdrop-blur-xl text-xs text-gray-300 light:text-slate-600 transition"
            >
              {t.back}
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={step === 2 && step2Invalid}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(57,255,20,0.35)] hover:brightness-110 active:scale-95 transition disabled:opacity-40"
          >
            {step === 3 ? t.launch : t.continue}
          </button>
        </div>
      </div>

      {/* کپی‌رایت برندینگ */}
      <p className="mt-6 text-[11px] text-gray-500 light:text-slate-500 text-center">
        {t.footerCopyright}
      </p>
    </main>
  );
}