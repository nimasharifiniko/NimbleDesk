"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCustomerChat } from "@/hooks/useCustomerChat";

export default function CustomerChatPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "demo";

  const { messages, sendMessage, isTyping } = useCustomerChat(slug);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  return (
    <main className="min-h-screen bg-[#080c09] flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-[390px] h-[844px] flex flex-col rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(57,255,20,0.08)] bg-black/60 backdrop-blur-xl">
        {/* Header */}
        <header className="flex items-center gap-3 p-5 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-black font-bold text-sm shadow-[0_0_12px_rgba(57,255,20,0.4)] capitalize">
            {slug.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-white truncate capitalize">
              {slug.replace("-", " ")}
            </h1>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Smart Front-Desk Active
            </p>
          </div>
          <button
            type="button"
            className="text-gray-400 hover:text-white text-lg px-1 transition"
            aria-label="More options"
          >
            ···
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={lex flex-col }
            >
              <div
                className={max-w-[85%] p-4 text-xs leading-relaxed transition-all }
              >
                <p className="whitespace-pre-wrap">
                  {msg.text || (msg.isStreaming ? "Thinking..." : "")}
                </p>

                {/* Service / Option Cards */}
                {msg.options && (
                  <div className="mt-3 space-y-2">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => sendMessage(opt.label)}
                        className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 transition text-xs text-gray-200 group"
                      >
                        <span>{opt.label}</span>
                        <span className="text-gray-400 group-hover:text-emerald-400 transition">
                          ›
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct Booking CTA */}
                {msg.hasBookingBtn && (
                  <button
                    type="button"
                    onClick={() => sendMessage("I want to book right now")}
                    className="w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:brightness-110 active:scale-95 transition"
                  >
                    <span>Book Appointment</span>
                    <span>→</span>
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
            onClick={() => sendMessage("What are your business hours?")}
            className="px-3 py-1.5 rounded-full glass-bubble-ai border border-white/10 text-gray-300 hover:border-emerald-500/50 hover:text-white whitespace-nowrap transition"
          >
            🕒 Opening Hours
          </button>
          <button
            type="button"
            onClick={() => sendMessage("Can I see your price list?")}
            className="px-3 py-1.5 rounded-full glass-bubble-ai border border-white/10 text-gray-300 hover:border-emerald-500/50 hover:text-white whitespace-nowrap transition"
          >
            📋 Services & Prices
          </button>
          <button
            type="button"
            onClick={() => sendMessage("I need human support")}
            className="px-3 py-1.5 rounded-full glass-bubble-ai border border-white/10 text-gray-300 hover:border-emerald-500/50 hover:text-white whitespace-nowrap transition"
          >
            👤 Talk to Human
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
              placeholder={isTyping ? "AI is replying..." : "Type a message..."}
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
      </div>
    </main>
  );
}