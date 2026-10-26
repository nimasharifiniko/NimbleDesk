"use client";

import { useState } from "react";
import en from "../dictionaries/en.json";
import fa from "../dictionaries/fa.json";
import nl from "../dictionaries/nl.json";

type Language = "en" | "fa" | "nl";

export default function Home() {
  const [lang, setLang] = useState<Language>("en");

  const dictionaries = { en, fa, nl };
  const dict = dictionaries[lang];
  const isRtl = lang === "fa";

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 transition-all duration-300"
    >
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-400">
              {dict.status}
            </span>
          </div>

          {/* 3-Language Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${lang === "en"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              English 🇬🇧
            </button>
            <button
              onClick={() => setLang("fa")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${lang === "fa"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              فارسی 🇮🇷
            </button>
            <button
              onClick={() => setLang("nl")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${lang === "nl"
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              Nederlands 🇳🇱
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3 text-center sm:text-start">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {dict.brand}
          </h1>
          <p className="text-lg font-medium text-emerald-400">
            {dict.tagline}
          </p>
          <p className="text-slate-400 leading-relaxed">
            {dict.description}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          Powered by NimbleDesk · Built with ❤️ by Nima Sharifi Niko
        </div>
      </div>
    </main>
  );
}