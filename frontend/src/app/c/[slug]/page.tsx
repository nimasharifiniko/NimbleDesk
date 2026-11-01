"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

type Lang = "fa" | "en" | "nl";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface BusinessProfile {
  managerName?: string;
  businessName?: string;
  phone?: string;
  address?: string;
}

/* ---------- آیکون‌های SVG داخلی ---------- */
const GlobeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const SendIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-7 20-4z" />
  </svg>
);

const BotIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="10" rx="2" strokeWidth="2" />
    <circle cx="12" cy="5" r="2" strokeWidth="2" />
    <path strokeWidth="2" d="M12 7v4M8 15h.01M16 15h.01" />
  </svg>
);

const CalendarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
    <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 18l8-6-6-6" />
  </svg>
);

const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const UserIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" strokeWidth="2" />
  </svg>
);

const MicIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="9" y="2" width="6" height="12" rx="3" strokeWidth="2" />
    <path strokeWidth="2" strokeLinecap="round" d="M5 10a7 7 0 0 0 14 0M12 19v3" />
  </svg>
);

const SunIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
/* ------------------------------------------- */

const TRANSLATIONS = {
  fa: {
    dir: "rtl" as const,
    subtitle: "دستیار هوشمند | ۲۴ ساعته فعال",
    welcome: "سلام! خوش آمدید 👋 چطور می‌توانم امروز کمکتان کنم؟",
    viewServices: "مشاهده خدمات و قیمت‌ها",
    workingHours: "ساعات کاری ما",
    bookAppointment: "رزرو نوبت",
    placeholder: "پیام خود را بنویسید...",
    bookNowBtn: "رزرو نوبت",
    hoursBtn: "ساعات کاری",
    servicesBtn: "خدمات و قیمت‌ها",
    modalTitle: "رزرو نوبت جدید",
    nameLabel: "نام و نام خانوادگی",
    phoneLabel: "شماره تماس",
    dateLabel: "تاریخ و ساعت مورد نظر",
    submitBooking: "ثبت درخواست",
    cancelBtn: "انصراف",
    bookingSuccess: "درخواست رزرو شما با موفقیت ثبت شد! به‌زودی با شما تماس می‌گیریم.",
    footerCopyright: "© ۲۰۲۶ تمام حقوق برای NimbleDesk محفوظ است · طراحی و توسعه توسط نیما شریفی‌نیکو",
  },
  en: {
    dir: "ltr" as const,
    subtitle: "AI Assistant Active 24/7",
    welcome: "Hi! Welcome 👋 How can I assist you today?",
    viewServices: "View Services & Pricing",
    workingHours: "Operating Hours",
    bookAppointment: "Book an Appointment",
    placeholder: "Type a message...",
    bookNowBtn: "Book Now",
    hoursBtn: "Business Hours",
    servicesBtn: "Services & Prices",
    modalTitle: "Book an Appointment",
    nameLabel: "Full Name",
    phoneLabel: "Phone Number",
    dateLabel: "Preferred Date & Time",
    submitBooking: "Confirm Booking",
    cancelBtn: "Cancel",
    bookingSuccess: "Your booking request has been submitted successfully! We'll contact you soon.",
    footerCopyright: "© 2026 NimbleDesk · Designed & Developed by Nima Sharifi Niko",
  },
  nl: {
    dir: "ltr" as const,
    subtitle: "AI-assistent 24/7 actief",
    welcome: "Hallo! Welkom 👋 Hoe kan ik u vandaag helpen?",
    viewServices: "Diensten & Prijzen Bekijken",
    workingHours: "Openingstijden",
    bookAppointment: "Afspraak Maken",
    placeholder: "Typ een bericht...",
    bookNowBtn: "Nu Boeken",
    hoursBtn: "Openingstijden",
    servicesBtn: "Diensten & Prijzen",
    modalTitle: "Afspraak Maken",
    nameLabel: "Volledige Naam",
    phoneLabel: "Telefoonnummer",
    dateLabel: "Gewenste Datum & Tijd",
    submitBooking: "Afspraak Bevestigen",
    cancelBtn: "Annuleren",
    bookingSuccess: "Uw afspraakaanvraag is succesvol verzonden! We nemen spoedig contact op.",
    footerCopyright: "© 2026 NimbleDesk · Designed & Developed by Nima Sharifi Niko",
  },
};

function CustomerChatContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "sample-cafe";
  const { theme, toggleTheme } = useTheme();

  const [lang, setLang] = useState<Lang>("fa");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // پروفایل کسب‌وکار (فقط بعد از mount از localStorage خوانده می‌شود → بدون Hydration Error)
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", date: "" });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];
  const isRtl = t.dir === "rtl";

  // نام نمایشی هدر: نام کسب‌وکار از پروفایل؛ در غیر این صورت از slug
  const displayName = profile?.businessName?.trim() || slug.replace(/-/g, " ");

  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // خواندن پروفایل از localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("nimble_profile");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setProfile(parsed as BusinessProfile);
        }
      }
    } catch (e) {
      console.warn("Could not read nimble_profile from localStorage", e);
    }
  }, []);

  useEffect(() => {
    setMessages([
      {
        id: "welcome-1",
        sender: "bot",
        text: t.welcome,
        timestamp: nowTime(),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const langOptions: { code: Lang; label: string }[] = [
    { code: "fa", label: "FA" },
    { code: "en", label: "EN" },
    { code: "nl", label: "NL" },
  ];

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: nowTime(),
    };

    // آماده‌سازی تاریخچه مکالمات برای هوش مصنوعی
    const apiMessages = messages.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));
    apiMessages.push({ role: "user", content: textToSend });

    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setInput("");
    setLoading(true);

    try {
      // خواندن خدمات تنظیم‌شده توسط صاحب کسب‌وکار (داخل event handler، امن برای Hydration)
      let customServices = null;
      try {
        const stored = localStorage.getItem("nimble_services");
        if (stored) {
          customServices = JSON.parse(stored);
        }
      } catch (e) {
        console.warn("Could not read nimble_services from localStorage", e);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          customServices,
          businessProfile: profile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "خطای نامشخص در ارتباط با سرور");
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.response,
        timestamp: nowTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg = err.message || "متاسفانه ارتباط با هوش مصنوعی برقرار نشد.";
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: `⚠️ خطا: ${errorMsg}`,
        timestamp: nowTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.date) return;

    setBookingSuccess(true);

    setTimeout(() => {
      setShowBookingModal(false);
      setBookingSuccess(false);
      setBookingForm({ name: "", phone: "", date: "" });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: t.bookingSuccess,
          timestamp: nowTime(),
        },
      ]);
    }, 1600);
  };

  return (
    <div
      className="relative flex flex-col h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-neutral-950 light:bg-neutral-100 text-gray-100 light:text-slate-900 font-sans transition-colors duration-300 md:items-center md:justify-center md:p-6"
      dir={t.dir}
    >
      {/* نورهای محو سبز پس‌زمینه (Ambient Glow) — فقط دسکتاپ */}
      <div className="pointer-events-none hidden md:block absolute -top-24 -left-24 h-80 w-80 rounded-full bg-green-500/20 blur-[120px]" />
      <div className="pointer-events-none hidden md:block absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none hidden md:block absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-500/10 blur-[100px]" />

      <div className="relative z-10 w-full h-full md:max-w-md md:h-[840px] md:max-h-[90vh] bg-white/[0.04] light:bg-white/90 border-0 md:border md:border-white/10 md:light:border-slate-200 rounded-none md:rounded-3xl shadow-2xl light:shadow-md backdrop-blur-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-none sticky top-0 z-20 w-full bg-white/[0.03] light:bg-white/80 border-b border-white/10 light:border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between gap-2 backdrop-blur-xl">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/40 flex items-center justify-center text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] shrink-0">
              <BotIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-white light:text-slate-900 text-sm sm:text-base capitalize truncate">
                {displayName}
              </h1>
              <p className="text-[10px] sm:text-xs text-green-400 flex items-center gap-1 truncate">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)] shrink-0"></span>
                <span className="truncate">{t.subtitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* سوئیچر ۳ زبانه */}
            <div className="flex items-center gap-0.5 px-1 py-1 rounded-full bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 backdrop-blur-xl">
              <GlobeIcon className="w-3.5 h-3.5 text-green-400 mx-0.5 shrink-0" />
              {langOptions.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLang(opt.code)}
                  className={`px-1.5 sm:px-2 py-1 rounded-full text-[10px] font-semibold transition ${lang === opt.code
                    ? "bg-green-400 text-black shadow-[0_0_12px_rgba(74,222,128,0.5)]"
                    : "text-gray-400 light:text-slate-500 hover:text-gray-200 light:hover:text-slate-800"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* دکمه تم */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center rounded-full bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 p-2 text-gray-300 light:text-slate-600 backdrop-blur-xl transition hover:border-emerald-500/40 shrink-0"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-end gap-2 max-w-[85%]">
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 flex-shrink-0 mb-1">
                    <BotIcon className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed backdrop-blur-xl ${msg.sender === "user"
                    ? "bg-green-400 text-black font-medium rounded-br-none shadow-[0_0_20px_rgba(74,222,128,0.35)]"
                    : "bg-white/5 light:bg-white light:border-slate-200 text-gray-100 light:text-slate-800 border border-white/10 rounded-bl-none"
                    }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {index === 0 && msg.sender === "bot" && (
                    <div className="mt-3 pt-3 border-t border-white/10 light:border-slate-200 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => sendMessage(t.viewServices)}
                        className="w-full text-start px-3 py-2 rounded-xl bg-white/5 light:bg-slate-50 hover:bg-white/10 light:hover:bg-slate-100 border border-white/10 light:border-slate-200 text-xs text-green-300 light:text-green-600 flex items-center justify-between transition"
                      >
                        <span>{t.viewServices}</span>
                        <ChevronRightIcon className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => sendMessage(t.workingHours)}
                        className="w-full text-start px-3 py-2 rounded-xl bg-white/5 light:bg-slate-50 hover:bg-white/10 light:hover:bg-slate-100 border border-white/10 light:border-slate-200 text-xs text-green-300 light:text-green-600 flex items-center justify-between transition"
                      >
                        <span>{t.workingHours}</span>
                        <ChevronRightIcon className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingModal(true)}
                        className="w-full text-start px-3 py-2.5 rounded-xl bg-green-400/90 hover:bg-green-400 text-black text-xs font-bold flex items-center justify-between transition shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                      >
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {t.bookAppointment}
                        </span>
                        <ChevronRightIcon className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-gray-500 light:text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 flex-shrink-0">
                <BotIcon className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none bg-white/5 light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-xl px-4 py-4">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Buttons */}
        <div className="flex-none px-3 py-2 bg-white/[0.02] light:bg-white/60 border-t border-white/10 light:border-slate-200 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setShowBookingModal(true)}
            className="flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-400 text-black text-xs font-bold transition shadow-[0_0_15px_rgba(74,222,128,0.35)] hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] whitespace-nowrap"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            {t.bookNowBtn}
          </button>
          <button
            type="button"
            onClick={() => sendMessage(t.workingHours)}
            className="flex-none px-3 py-1.5 rounded-full bg-white/5 light:bg-white hover:bg-white/10 light:hover:bg-slate-100 border border-white/10 light:border-slate-200 text-green-300 light:text-green-600 text-xs font-medium transition whitespace-nowrap backdrop-blur-xl"
          >
            {t.hoursBtn}
          </button>
          <button
            type="button"
            onClick={() => sendMessage(t.viewServices)}
            className="flex-none px-3 py-1.5 rounded-full bg-white/5 light:bg-white hover:bg-white/10 light:hover:bg-slate-100 border border-white/10 light:border-slate-200 text-green-300 light:text-green-600 text-xs font-medium transition whitespace-nowrap backdrop-blur-xl"
          >
            {t.servicesBtn}
          </button>
        </div>

        {/* Input Bar */}
        <div className="flex-none p-3 sm:p-4 bg-white/[0.03] light:bg-white/80 border-t border-white/10 light:border-slate-200 flex items-center gap-2 backdrop-blur-xl">
          <div className="flex-1 flex items-center gap-2 bg-white/5 light:bg-white border border-white/10 light:border-slate-200 focus-within:border-green-400/60 rounded-2xl px-4 transition">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={t.placeholder}
              className="flex-1 bg-transparent py-2.5 text-sm text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400 outline-none"
            />
            <MicIcon className="w-4 h-4 text-gray-500 light:text-slate-400 flex-shrink-0" />
          </div>
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-2xl bg-green-400 hover:bg-green-300 disabled:opacity-30 disabled:shadow-none text-black font-bold flex items-center justify-center transition shadow-[0_0_20px_rgba(74,222,128,0.4)] flex-shrink-0"
          >
            <SendIcon className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="absolute inset-0 z-30 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white/[0.06] light:bg-white border border-white/10 light:border-slate-200 rounded-3xl shadow-2xl light:shadow-xl backdrop-blur-2xl p-5 relative">
              <button
                type="button"
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingSuccess(false);
                }}
                className="absolute top-3 end-3 text-gray-400 light:text-slate-400 hover:text-gray-200 light:hover:text-slate-700 transition"
              >
                <XIcon className="w-4 h-4" />
              </button>

              {!bookingSuccess ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/40 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-white light:text-slate-900">{t.modalTitle}</h2>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 light:text-slate-500 mb-1">{t.nameLabel}</label>
                      <div className="flex items-center gap-2 bg-white/5 light:bg-slate-50 border border-white/10 light:border-slate-200 focus-within:border-green-400/60 rounded-2xl px-3 transition">
                        <UserIcon className="w-3.5 h-3.5 text-gray-500 light:text-slate-400 flex-shrink-0" />
                        <input
                          type="text"
                          required
                          value={bookingForm.name}
                          onChange={(e) =>
                            setBookingForm((p) => ({ ...p, name: e.target.value }))
                          }
                          className="flex-1 bg-transparent py-2.5 text-sm text-white light:text-slate-900 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 light:text-slate-500 mb-1">{t.phoneLabel}</label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={bookingForm.phone}
                        onChange={(e) =>
                          setBookingForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="w-full bg-white/5 light:bg-slate-50 border border-white/10 light:border-slate-200 focus:border-green-400/60 rounded-2xl px-3 py-2.5 text-sm text-white light:text-slate-900 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 light:text-slate-500 mb-1">{t.dateLabel}</label>
                      <div className="flex items-center gap-2 bg-white/5 light:bg-slate-50 border border-white/10 light:border-slate-200 focus-within:border-green-400/60 rounded-2xl px-3 transition">
                        <CalendarIcon className="w-3.5 h-3.5 text-gray-500 light:text-slate-400 flex-shrink-0" />
                        <input
                          type="datetime-local"
                          required
                          dir="ltr"
                          value={bookingForm.date}
                          onChange={(e) =>
                            setBookingForm((p) => ({ ...p, date: e.target.value }))
                          }
                          className="flex-1 bg-transparent py-2.5 text-sm text-white light:text-slate-900 outline-none [color-scheme:dark] light:[color-scheme:light]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowBookingModal(false)}
                        className="flex-1 py-2.5 rounded-2xl bg-white/5 light:bg-slate-100 hover:bg-white/10 light:hover:bg-slate-200 border border-white/10 light:border-slate-200 text-gray-300 light:text-slate-600 text-sm font-medium transition"
                      >
                        {t.cancelBtn}
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-2xl bg-green-400 hover:bg-green-300 text-black text-sm font-bold transition shadow-[0_0_20px_rgba(74,222,128,0.4)]"
                      >
                        {t.submitBooking}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-6 gap-3">
                  <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center text-green-400 shadow-[0_0_25px_rgba(74,222,128,0.4)]">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-gray-200 light:text-slate-700">{t.bookingSuccess}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* کپی‌رایت برندینگ */}
      <p className="hidden md:block fixed bottom-2 inset-x-0 text-center text-[10px] text-gray-600 light:text-slate-400 z-0 pointer-events-none">
        {t.footerCopyright}
      </p>
    </div>
  );
}

export default function CustomerChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 light:bg-neutral-100 text-white light:text-slate-900 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CustomerChatContent />
    </Suspense>
  );
}