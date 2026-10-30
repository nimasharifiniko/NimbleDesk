"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
  options?: string[];
  hasBookingBtn?: boolean;
};

export default function CustomerChatPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "demo";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hi! Welcome to Glow Beauty Salon. How can I help you today?",
      time: "10:30 AM",
      options: [
        "Haircut & Styling",
        "Manicure & Pedicure",
        "Facial Treatment",
        "View all services",
      ],
    },
    {
      id: 2,
      sender: "user",
      text: "I would like to book a haircut",
      time: "10:31 AM",
    },
    {
      id: 3,
      sender: "ai",
      text: "Great choice! Our Haircut & Styling starts from . Would you like to book an appointment?",
      time: "10:31 AM",
      hasBookingBtn: true,
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <main className="min-h-screen bg-[#080c09] flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] h-[844px] flex flex-col rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(57,255,20,0.08)] bg-black/60 backdrop-blur-xl">
        {/* Header */}
        <header className="flex items-center gap-3 p-5 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-black font-bold text-sm shadow-[0_0_12px_rgba(57,255,20,0.4)]">
            G
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-white truncate">
              Glow Beauty Salon
            </h1>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Online
            </p>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-white text-lg px-1"
            aria-label="More"
          >
            ···
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={lex flex-col }
            >
              <div
                className={max-w-[85%] p-4 text-xs leading-relaxed }
              >
                <p>{msg.text}</p>

                {msg.options && (
                  <div className="mt-3 space-y-2">
                    {msg.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer text-xs text-gray-200"
                      >
                        <span>{opt}</span>
                        <span className="text-gray-400">›</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.hasBookingBtn && (
                  <button
                    type="button"
                    className="w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:brightness-110 transition"
                  >
                    <span>Book Now</span>
                    <span>→</span>
                  </button>
                )}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="px-5 py-2 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            className="px-3 py-1.5 rounded-full glass-bubble-ai border border-white/10 text-gray-300 hover:border-emerald-500/50 whitespace-nowrap"
          >
            View my bookings
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-full glass-bubble-ai border border-white/10 text-gray-300 hover:border-emerald-500/50 whitespace-nowrap"
          >
            Talk to human
          </button>
        </div>

        {/* Input */}
        <footer className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 focus-within:border-emerald-500/60 transition">
            <button
              type="button"
              className="text-gray-400 hover:text-white text-lg leading-none"
              aria-label="Attach"
            >
              +
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-500"
            />
            <button
              type="button"
              onClick={handleSend}
              className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(57,255,20,0.5)] hover:scale-105 transition"
              aria-label="Send"
            >
              ↑
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}