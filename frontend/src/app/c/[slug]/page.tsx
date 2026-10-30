"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCustomerChat } from "@/hooks/useCustomerChat";
import BookingModal from "@/components/BookingModal";

// Multilingual Dictionary
const t = {
  en: {
    onlineStatus: "Smart Front-Desk Active",
    typePlaceholder: "Type a message...",
    aiThinking: "Thinking...",
    bookNowBtn: "Book Now",
    bookModalTitle: "General Appointment",
    chipHours: "🕒 Business Hours",
    chipServices: "📋 Services & Prices",
    chipSupport: "🎧 Talk to Human",
    hoursQuery: "What are your business hours?",
    servicesQuery: "Can I see your price list?",
    supportQuery: "I need human support",
    langSwitch: "فارسی",
  },
  fa: {
    onlineStatus: "پاسخگوی هوشمند فعال است",
    typePlaceholder: "پیام خود را بنویسید...",
    aiThinking: "در حال پردازش...",
    bookNowBtn: "رزرو آنلاین نوبت",
    bookModalTitle: "رزرو نوبت عمومی",
    chipHours: "🕒 ساعت کاری مجموعه",
    chipServices: "📋 لیست خدمات و قیمت‌ها",
    chipSupport: "🎧 گفتگو با پشتیبان انسانی",
    hoursQuery: "ساعت کاری مجموعه به چه صورت است؟",
    servicesQuery: "لطفاً لیست قیمت و خدمات را ارسال کنید",
    supportQuery: "می‌خواهم با پشتیبان انسانی صحبت کنم",
    langSwitch: "English",
  },
};

export default function CustomerChatPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "demo";

  const [lang, setLang] = useState<"en" | "fa">("en");
  const dict = t[lang];

  const { messages, sendMessage, isTyping } = useCustomerChat(slug);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeService, setActiveService] = useState({
    name: "General Service",
    price: "$45",
  });

  const isRtl = lang === "fa";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "fa" : "en"));
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const handleOpenBooking = (serviceName = dict.bookModalTitle, price = "$45") => {
    setActiveService({ name: serviceName, price });
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = (bookingData: {
    serviceName: string;
    date: string;
    time: string;
    customerName: string;
    customerPhone: string;
  }) => {
    const confirmationText = isRtl
      ? `📅 درخواست رزرو نوبت ثبت شد:\n• سرویس: ${bookingData.serviceName}\n• تاریخ: ${bookingData.date}\n• ساعت: ${bookingData.time}\n• نام: ${bookingData.customerName} (${bookingData.customerPhone})`
      : `📅 Appointment Requested:\n• Service: ${bookingData.serviceName}\n• Date: ${bookingData.date}\n• Time: ${bookingData.time}\n• Customer: ${bookingData.customerName} (${bookingData.customerPhone})`;
    sendMessage(confirmationText);
  };

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#080c09] flex items-center justify-center p-4 select-none font-sans"
    >
      <div className="w-full max-w-[390px] h-[844px] flex flex-col rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(57,255,20,0.08)] bg-black/60 backdrop-blur-xl relative">
        {/* Header */}
        <header className="flex items-center gap-3 p-5 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-black font-bold text-sm shadow-[0_0_12px_rgba(57,255,20,0.4)] capitalize shrink-0">
            {slug.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-white truncate capitalize">
              {slug.replace("-", " ")}
            </h1>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {dict.onlineStatus}
            </p>
          </div>

          {/* Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-emerald-400 hover:bg-emerald-500/20 font-bold transition"
          >
            {dict.langSwitch}
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-4 text-xs leading-relaxed transition-all ${
                  msg.sender === "user"
                    ? `bg-gradient-to-r from-emerald-500 to-green-600 text-black font-semibold rounded-2xl ${
                        isRtl ? "rounded-tl-none" : "rounded-tr-none"
                      } shadow-[0_0_18px_rgba(57,255,20,0.35)]`
                    : `glass-bubble-ai text-gray-100 rounded-2xl ${
                        isRtl ? "rounded-tr-none" : "rounded-tl-none"
                      } border border-white/10`
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {msg.text || (msg.isStreaming ? dict.aiThinking : "")}
                </p>

                {/* Service Cards */}
                {msg.options && (
                  <div className="mt-3 space-y-2">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleOpenBooking(opt.label, "$45")}
                        className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 transition text-xs text-gray-200 group"
                      >
                        <span>{opt.label}</span>
                        <span className="text-gray-400 group-hover:text-emerald-400 transition">
                          {isRtl ? "‹" : "›"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct Booking CTA */}
                {msg.hasBookingBtn && (
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(dict.bookModalTitle, "$45")}
                    className="w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:brightness-110 active:scale-95 transition"
                  >
                    <span>{dict.bookNowBtn}</span>
                    <span>📅</span>
                  </button>
                )}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 glass-bubble-ai px-3 py-2 rounded-xl w-max border border-white/10">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips */}
        <div className="px-5 py-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => handleOpenBooking(dict.bookModalTitle, "$50")}
            className="px-3 py-1.5 rounded-full glass-bubble-ai border border-white/10 text-gray-300 hover:border-emerald-500/50 hover:text-white whitespace-nowrap transition flex items-center gap-1.5"
          >
            📅 {dict.bookNowBtn}
          </button>
          <button
            type="button"
            onClick={() => sendMessage(dict.hoursQuery)}
            className="px-3 py-1.5 rounded-full glass-bubble-ai border border-white/10 text-gray-300 hover:border-emerald-500/50 hover:text-white whitespace-nowrap transition flex items-center gap-1.5"
          >
            {dict.chipHours}
          </button>
          <button
            type="button"
            onClick={() => sendMessage(dict.servicesQuery)}
            className="px-3 py-1.5 rounded-full glass-bubble-ai border border-white/10 text-gray-300 hover:border-emerald-500/50 hover:text-white whitespace-nowrap transition flex items-center gap-1.5"
          >
            {dict.chipServices}
          </button>
          <button
            type="button"
            onClick={() => sendMessage(dict.supportQuery)}
            className="px-3 py-1.5 rounded-full glass-bubble-ai border border-white/10 text-gray-300 hover:border-emerald-500/50 hover:text-white whitespace-nowrap transition flex items-center gap-1.5"
          >
            {dict.chipSupport}
          </button>
        </div>

        {/* Input Bar */}
        <footer className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 focus-within:border-emerald-500/60 transition">
            <button
              type="button"
              className="text-gray-400 hover:text-white text-lg leading-none"
              aria-label="Add attachment"
            >
              +
            </button>
            <input
              type="text"
              value={input}
              disabled={isTyping}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isTyping ? dict.aiThinking : dict.typePlaceholder}
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(57,255,20,0.5)] hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Send message"
            >
              ↑
            </button>
          </div>
        </footer>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          serviceName={activeService.name}
          servicePrice={activeService.price}
          onConfirmBooking={handleConfirmBooking}
        />
      </div>
    </main>
  );
}