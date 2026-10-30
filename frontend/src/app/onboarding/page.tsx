"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Industry = {
  id: string;
  title: string;
  icon: string;
  desc: string;
  defaultServices: string[];
};

const INDUSTRIES: Industry[] = [
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
];

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(INDUSTRIES[0]);
  const [formData, setFormData] = useState({
    businessName: "",
    slug: "",
    phone: "",
    address: "",
  });

  const handleNext = () => {
    if (step === 2 && (!formData.businessName || !formData.slug)) return;
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      // Complete setup
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-[#080c09] text-white flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-xl bg-black/60 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_60px_rgba(57,255,20,0.08)] backdrop-blur-xl relative space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-black font-extrabold flex items-center justify-center text-sm shadow-[0_0_12px_rgba(57,255,20,0.4)]">
              ⬡
            </div>
            <span className="text-sm font-bold text-white">Setup Your AI Front Desk</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Step {step} of 3
          </span>
        </div>

        {/* STEP 1: Choose Industry */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Select Your Business Industry</h2>
              <p className="text-xs text-gray-400 mt-1">
                We will pre-configure AI tools, service menus, and FAQ templates for your trade.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setSelectedIndustry(ind)}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 ${
                    selectedIndustry.id === ind.id
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
              <h2 className="text-lg font-bold text-white">Business Information</h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter your basic details so customers and AI front desk know who you are.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Glow Beauty Salon"
                  value={formData.businessName}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setFormData({ ...formData, businessName: name, slug });
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/60 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Custom URL Slug *</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-gray-400 focus-within:border-emerald-500/60 transition">
                  <span className="text-[11px] text-gray-500">nimbledesk.com/c/</span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-transparent border-none outline-none text-white w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/60 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Location / Address</label>
                  <input
                    type="text"
                    placeholder="123 Main St, City"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/60 transition"
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
              <h2 className="text-lg font-bold text-white">Review Pre-Configured Template</h2>
              <p className="text-xs text-gray-400 mt-1">
                Your AI Front Desk is ready with default services for <span className="text-emerald-400 font-semibold">{selectedIndustry.title}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Pre-Loaded Services
              </h4>
              <div className="space-y-2">
                {selectedIndustry.defaultServices.map((svc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-200">
                    <span>{svc}</span>
                    <span className="text-emerald-400 text-xs">✓ Active</span>
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
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition"
            >
              ← Back
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
            {step === 3 ? "Launch Front Desk 🚀" : "Continue →"}
          </button>
        </div>
      </div>
    </main>
  );
}
