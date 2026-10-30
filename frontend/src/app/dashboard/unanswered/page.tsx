"use client";

import React, { useState } from "react";

type UnansweredItem = {
  id: string;
  question: string;
  count: number;
  lastAsked: string;
  customerPhone: string;
};

export default function UnansweredQuestionsPage() {
  const [questions, setUnanswered] = useState<UnansweredItem[]>([
    {
      id: "q-1",
      question: "Do you offer organic vegan hair dye?",
      count: 5,
      lastAsked: "10 mins ago",
      customerPhone: "+1 (555) 234-5678",
    },
    {
      id: "q-2",
      question: "What is your policy for late arrivals over 15 minutes?",
      count: 3,
      lastAsked: "2 hours ago",
      customerPhone: "+1 (555) 876-5432",
    },
  ]);

  const [activeAnswer, setActiveAnswer] = useState<{ id: string; text: string }>({
    id: "",
    text: "",
  });

  const handleResolve = (id: string) => {
    if (!activeAnswer.text.trim()) return;
    setUnanswered((prev) => prev.filter((item) => item.id !== id));
    setActiveAnswer({ id: "", text: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Unanswered Customer Questions</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Train your AI front-desk by answering queries it was unsure about.
        </p>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
            <span className="text-3xl">🎉</span>
            <h3 className="text-sm font-bold text-white">All Caught Up!</h3>
            <p className="text-xs text-gray-400">Your AI has answered all customer questions successfully.</p>
          </div>
        ) : (
          questions.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-emerald-500/30 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Asked {item.count} times
                  </span>
                  <h3 className="text-sm font-semibold text-white">"{item.question}"</h3>
                  <p className="text-[10px] text-gray-400">
                    Last asked {item.lastAsked} by {item.customerPhone}
                  </p>
                </div>
              </div>

              {/* Answer Input Box */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <textarea
                  rows={2}
                  placeholder="Type the official answer to train AI for future customers..."
                  value={activeAnswer.id === item.id ? activeAnswer.text : ""}
                  onChange={(e) => setActiveAnswer({ id: item.id, text: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-500/60 transition"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleResolve(item.id)}
                    disabled={activeAnswer.id !== item.id || !activeAnswer.text.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(57,255,20,0.3)] hover:brightness-110 active:scale-95 transition disabled:opacity-40"
                  >
                    Save & Train AI 🤖
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
