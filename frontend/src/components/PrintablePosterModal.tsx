"use client";

import React from "react";

type PrintablePosterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
  slug?: string;
};

export default function PrintablePosterModal({
  isOpen,
  onClose,
  businessName = "Glow Beauty Salon",
  slug = "glow-salon",
}: PrintablePosterModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrUrl = `https://nimbledesk.com/c/${slug}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[#080c09] border border-white/20 rounded-[2.5rem] p-8 shadow-[0_0_80px_rgba(57,255,20,0.15)] text-white relative flex flex-col items-center text-center gap-6 print:bg-white print:text-black print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Close button (Hidden during printing) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white text-lg w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition print:hidden"
        >
          ✕
        </button>

        {/* Business Branding Header */}
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 mx-auto flex items-center justify-center text-black font-extrabold text-2xl shadow-[0_0_20px_rgba(57,255,20,0.4)]">
            ⬡
          </div>
          <h2 className="text-xl font-bold text-white print:text-black">{businessName}</h2>
          <p className="text-xs text-emerald-400 font-semibold tracking-wide uppercase print:text-emerald-700">
            Smart AI Front-Desk Active
          </p>
        </div>

        {/* Poster Main Content Box */}
        <div className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 print:bg-gray-100 print:border-gray-300">
          <div className="w-48 h-48 bg-white p-3 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(57,255,20,0.25)]">
            <div className="w-full h-full border-4 border-black rounded-lg flex flex-col items-center justify-center bg-black text-emerald-400 font-bold text-xs text-center p-2 gap-2">
              <span className="text-2xl">📱</span>
              <span>[ SCAN QR CODE ]</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white print:text-black">
              Scan to Chat & Book Online
            </h3>
            <p className="text-[11px] text-gray-400 max-w-[260px] print:text-gray-600">
              Point your phone camera to view services, ask questions, or book appointments instantly.
            </p>
          </div>
        </div>

        <p className="text-[10px] text-gray-500 font-mono print:text-gray-800">
          {qrUrl}
        </p>

        {/* Print Action CTAs (Hidden during print) */}
        <div className="flex items-center gap-3 w-full print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(57,255,20,0.35)] hover:brightness-110 active:scale-95 transition"
          >
            🖨️ Print Poster
          </button>
        </div>
      </div>
    </div>
  );
}
