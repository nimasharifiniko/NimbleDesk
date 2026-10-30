"use client";

import React, { useState } from "react";
import PrintablePosterModal from "@/components/PrintablePosterModal";

export default function QrCodeManagerPage() {
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const businessSlug = "glow-beauty-salon";
  const publicUrl = `https://nimbledesk.com/c/${businessSlug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white">QR Code & Printable Stand Poster</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Generate, download, and print QR posters to place on your storefront or desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Stand Preview Card */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
            📱
          </div>

          <div>
            <h2 className="text-base font-bold text-white">Storefront QR Stand</h2>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Print this high-resolution QR poster and put it at your front desk or entrance door.
            </p>
          </div>

          <div className="w-48 h-48 bg-white p-3 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(57,255,20,0.2)]">
            <div className="w-full h-full border-4 border-black rounded-lg flex flex-col items-center justify-center bg-black text-emerald-400 font-bold text-xs text-center p-2 gap-1">
              <span className="text-3xl">⬡</span>
              <span>[ SCAN QR CODE ]</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={() => setIsPosterOpen(true)}
              className="w-full py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:brightness-110 active:scale-95 transition"
            >
              🖨️ View & Print Poster
            </button>
          </div>
        </div>

        {/* Public Share Link & Embed Options */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white">Public Customer Link</h3>
            <p className="text-xs text-gray-400">
              Share this direct URL on your Instagram bio, Google Maps listing, or WhatsApp business.
            </p>

            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-300">
              <span className="truncate text-xs text-emerald-400 font-mono">{publicUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition shrink-0 ml-2"
              >
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <h3 className="text-sm font-semibold text-white">Embed Web Widget</h3>
            <p className="text-xs text-gray-400">
              Add a floating smart front-desk widget to your existing website.
            </p>
            <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-[11px] font-mono text-gray-400 overflow-x-auto">
              {`<script src="https://nimbledesk.com/widget.js" data-slug="${businessSlug}"></script>`}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Poster Modal */}
      <PrintablePosterModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
        businessName="Glow Beauty Salon"
        slug={businessSlug}
      />
    </div>
  );
}
