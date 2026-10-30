"use client";

import React from "react";

export default function PricingSettingsPage() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      desc: "Ideal for small single-location shops",
      features: ["500 AI Conversations / mo", "Basic Knowledge Base (3 PDFs)", "Standard QR Code Generator", "Email Support"],
      isCurrent: false,
    },
    {
      name: "Pro",
      price: "$79",
      period: "/month",
      desc: "Perfect for growing local businesses",
      features: ["2,500 AI Conversations / mo", "Unlimited Knowledge Base PDFs", "Printable QR Stand Generator", "SSE Streaming Chat Widget", "Priority Support"],
      isCurrent: true,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      desc: "For multi-location chains and franchises",
      features: ["Unlimited Conversations", "Dedicated AI Fine-tuning", "Multi-tenant Access", "24/7 Phone & Human Support"],
      isCurrent: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Subscription & Usage Plans</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage your subscription tier, billing limits, and active AI Front Desk quotas.
        </p>
      </div>

      {/* Usage Meter Card */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Current Month Usage</span>
            <h3 className="text-lg font-bold text-white">1,178 / 2,500 Interactions</h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-black shadow-[0_0_10px_rgba(57,255,20,0.4)]">
            Pro Plan Active
          </span>
        </div>

        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-full w-[47%] rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
        </div>
        <p className="text-[11px] text-gray-400">Renews on June 1, 2025 • 47% consumed</p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border flex flex-col justify-between gap-4 relative transition ${
              p.isCurrent
                ? "bg-emerald-500/10 border-emerald-400 shadow-[0_0_30px_rgba(57,255,20,0.15)]"
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-black uppercase tracking-wider shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                Most Popular
              </span>
            )}

            <div className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-white">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{p.price}</span>
                <span className="text-xs text-gray-400">{p.period}</span>
              </div>

              <hr className="border-white/10" />

              <ul className="space-y-2 text-xs text-gray-300">
                {p.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              disabled={p.isCurrent}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                p.isCurrent
                  ? "bg-white/10 text-emerald-400 border border-emerald-500/30 cursor-default"
                  : "bg-gradient-to-r from-emerald-400 to-green-500 text-black shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:brightness-110 active:scale-95"
              }`}
            >
              {p.isCurrent ? "Current Active Plan" : "Upgrade Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
