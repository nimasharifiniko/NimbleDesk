"use client";

import React from "react";

export default function BusinessDashboardOverview() {
  const metrics = [
    {
      title: "Total Conversations",
      value: "1,248",
      change: "↗ 18.5% vs last week",
      isPositive: true,
      icon: "💬",
    },
    {
      title: "Qualified Leads",
      value: "312",
      change: "↗ 22.1% vs last week",
      isPositive: true,
      icon: "🎯",
    },
    {
      title: "Documents Uploaded",
      value: "36",
      change: "↗ 12.4% vs last week",
      isPositive: true,
      icon: "📄",
    },
    {
      title: "Avg. Response Time",
      value: "2.4s",
      change: "↘ 8.3% vs last week",
      isPositive: true,
      icon: "⏱️",
    },
  ];

  const recentDocs = [
    { name: "Company_Information.pdf", size: "2.4 MB", uploaded: "Uploaded just now" },
    { name: "Services_Catalog.pdf", size: "1.8 MB", uploaded: "Uploaded 2 hours ago" },
    { name: "Pricing_Guide.pdf", size: "3.2 MB", uploaded: "Uploaded yesterday" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Welcome back, Alex 👋
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Here's what's happening with your AI Front Desk today.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-300">
          <span>📅 May 12 – May 18, 2025</span>
          <span className="text-gray-500">▼</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">{m.title}</span>
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-sm">
                {m.icon}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-white">{m.value}</h3>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">
                {m.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: QR Code Generator & Upload Documents & Business Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Generator Widget */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">QR Code Generator</h3>
              <p className="text-[11px] text-gray-400">Generate a QR code for your AI Front Desk</p>
            </div>
            <span className="text-gray-500 hover:text-white cursor-pointer">•••</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/10 relative">
            <div className="w-40 h-40 bg-white p-3 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.2)]">
              {/* QR Placeholder Icon */}
              <div className="w-full h-full border-4 border-black rounded-lg flex items-center justify-center bg-black text-emerald-400 font-bold text-xs text-center p-2">
                [ SCAN ME ]
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300">
              <span className="truncate text-[11px] text-gray-400">https://aifrontdesk.com/your-business</span>
              <button type="button" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold">Copy</button>
            </div>
            <button
              type="button"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:brightness-110 transition"
            >
              ↓ Download QR Code
            </button>
          </div>
        </div>

        {/* Upload Documents Widget */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Upload Documents</h3>
              <p className="text-[11px] text-gray-400">Upload PDF documents to train your AI</p>
            </div>
            <span className="text-gray-500 hover:text-white cursor-pointer">•••</span>
          </div>

          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 bg-black/20 cursor-pointer transition">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
              ☁️
            </div>
            <p className="text-xs font-semibold text-white">
              Drag & drop your PDF files here
            </p>
            <p className="text-[10px] text-gray-500">or click to browse</p>
            <span className="text-[9px] text-gray-500">Supports PDF files up to 50MB each</span>
          </div>

          {/* File Upload List */}
          <div className="space-y-2">
            {recentDocs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-red-400 font-bold text-sm">📄</span>
                  <div className="truncate">
                    <p className="text-xs font-medium text-gray-200 truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-500">{doc.size} • {doc.uploaded}</p>
                  </div>
                </div>
                <span className="text-emerald-400 text-xs">✓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Hours Widget */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Business Hours</h3>
              <p className="text-[11px] text-gray-400">Set when your AI Front Desk is available</p>
            </div>
            <span className="text-gray-500 hover:text-white cursor-pointer">•••</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <div key={day} className="flex items-center justify-between text-gray-300">
                <span className="w-20 font-medium text-[11px]">{day}</span>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-[0_0_6px_rgba(57,255,20,0.6)]" />
                  <span className="text-[11px] text-gray-400">09:00 AM – 06:00 PM</span>
                </div>
              </div>
            ))}
            {["Saturday", "Sunday"].map((day) => (
              <div key={day} className="flex items-center justify-between text-gray-500">
                <span className="w-20 font-medium text-[11px]">{day}</span>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" />
                  <span className="text-[11px] text-gray-500">Closed</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="w-full py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(57,255,20,0.4)] hover:brightness-110 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}