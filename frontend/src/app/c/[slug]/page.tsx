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
    hoursReply: "ساعات کاری ما شنبه تا پنجشنبه، از ساعت ۰۹:۰۰ الی ۲۲:۰۰ می‌باشد.",
    servicesReply: "خدمات ما شامل منوی اسپرسوبار، دسرها و رزرو سالن خصوصی است.",
    thanksReply: "ممنون از پیام شما! چطور می‌توانم بیشتر کمکتان کنم؟",
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
    hoursReply: "Our operating hours are Monday to Saturday, 09:00 AM to 10:00 PM.",
    servicesReply: "Our services include espresso bar menu, desserts, and private hall bookings.",
    thanksReply: "Thank you for reaching out! How else can I assist you?",
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
    hoursReply: "Wij zijn open van maandag t/m zaterdag van 09:00 tot 22:00.",
    servicesReply: "Onze diensten omvatten espressobar, desserts en zaalreserveringen.",
    thanksReply: "Bedankt voor uw bericht! Hoe kan ik u verder helpen?",
  },
};

type Intent = "services" | "hours" | "booking" | "general";

function CustomerChatContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "sample-cafe";
  const { theme, toggleTheme } = useTheme();

  const [lang, setLang] = useState<Lang>("fa");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", date: "" });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];
  const isRtl = t.dir === "rtl";

  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    setMessages([
      {
        id: "welcome-1",
        sender: "bot",
        text: t.welcome,
        timestamp: nowTime(),
      },
    ]);
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const langOptions: { code: Lang; label: string }[] = [
    { code: "fa", label: "FA" },
    { code: "en", label: "EN" },
    { code: "nl", label: "NL" },
  ];

  const sendMessage = async (overrideText?: string, intent: Intent = "general") => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: nowTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_slug: slug,
          message: textToSend,
          lang,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.response || data.text || t.thanksReply,
        timestamp: nowTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      let reply = t.thanksReply;
      if (intent === "hours") reply = t.hoursReply;
      else if (intent === "services") reply = t.servicesReply;

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: reply,
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
      className="relative min-h-screen bg-neutral-950 light:bg-neutral-100 text-gray-100 light:text-slate-900 flex justify-center items-center p-0 md:p-6 font-sans overflow-hidden transition-colors duration-300"
      dir={t.dir}
    >
      {/* نورهای محو سبز پس‌زمینه (Ambient Glow) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-green-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md h-screen md:h-[840px] bg-white/[0.04] light:bg-white/90 border border-white/10 light:border-slate-200 rounded-none md:rounded-3xl shadow-2xl light:shadow-md backdrop-blur-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white/[0.03] light:bg-white/80 border-b border-white/10 light:border-slate-200 p-4 flex items-center justify-between z-10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/40 flex items-center justify-center text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <BotIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white light:text-slate-900 text-base capitalize">
                {slug.replace(/-/g, " ")}
              </h1>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* سوئیچر ۳ زبانه */}
            <div className="flex items-center gap-1 px-1 py-1 rounded-full bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 backdrop-blur-xl">
              <GlobeIcon className="w-3.5 h-3.5 text-green-400 mx-1" />
              {langOptions.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLang(opt.code)}
                  className={`px-2 py-1 rounded-full text-[10px] font-semibold transition ${lang === opt.code
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
              className="flex items-center justify-center rounded-full bg-white/5 light:bg-white/80 border border-white/10 light:border-slate-200 p-2 text-gray-300 light:text-slate-600 backdrop-blur-xl transition hover:border-emerald-500/40"
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
                        onClick={() => sendMessage(t.viewServices, "services")}
                        className="w-full text-start px-3 py-2 rounded-xl bg-white/5 light:bg-slate-50 hover:bg-white/10 light:hover:bg-slate-100 border border-white/10 light:border-slate-200 text-xs text-green-300 light:text-green-600 flex items-center justify-between transition"
                      >
                        <span>{t.viewServices}</span>
                        <ChevronRightIcon className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => sendMessage(t.workingHours, "hours")}
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

          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 flex-shrink-0">
                <BotIcon className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-none bg-white/5 light:bg-white border border-white/10 light:border-slate-200 backdrop-blur-xl px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-400" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Buttons — اسکرول‌بار کاملاً مخفی */}
        <div className="px-3 py-2 bg-white/[0.02] light:bg-white/60 border-t border-white/10 light:border-slate-200 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
            onClick={() => sendMessage(t.workingHours, "hours")}
            className="flex-none px-3 py-1.5 rounded-full bg-white/5 light:bg-white hover:bg-white/10 light:hover:bg-slate-100 border border-white/10 light:border-slate-200 text-green-300 light:text-green-600 text-xs font-medium transition whitespace-nowrap backdrop-blur-xl"
          >
            {t.hoursBtn}
          </button>
          <button
            type="button"
            onClick={() => sendMessage(t.viewServices, "services")}
            className="flex-none px-3 py-1.5 rounded-full bg-white/5 light:bg-white hover:bg-white/10 light:hover:bg-slate-100 border border-white/10 light:border-slate-200 text-green-300 light:text-green-600 text-xs font-medium transition whitespace-nowrap backdrop-blur-xl"
          >
            {t.servicesBtn}
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white/[0.03] light:bg-white/80 border-t border-white/10 light:border-slate-200 flex items-center gap-2 backdrop-blur-xl">
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
          <div className="absolute inset-0 z-20 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
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
                      <CalendarIcon className="w-4.5 h-4.5" />
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