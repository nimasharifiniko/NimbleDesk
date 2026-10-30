"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", badge: null },
    { name: "Conversations", href: "/dashboard/conversations", badge: "24" },
    { name: "Leads", href: "/dashboard/leads", badge: "12" },
    { name: "Documents", href: "/dashboard/documents", badge: null },
    { name: "QR Codes", href: "/dashboard/qrcodes", badge: null },
    { name: "Business Hours", href: "/dashboard/hours", badge: null },
    { name: "Integrations", href: "/dashboard/integrations", badge: null },
    { name: "Settings", href: "/dashboard/settings", badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#080c09] text-gray-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-black">
      <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col justify-between p-5 select-none shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-black font-extrabold text-lg shadow-[0_0_15px_rgba(57,255,20,0.35)]">
              ⬡
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">AI Front Desk</h2>
              <p className="text-[10px] text-gray-400">Business Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-green-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(57,255,20,0.1)] font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">Your Plan</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-black shadow-[0_0_8px_rgba(57,255,20,0.4)]">
                Pro Plan
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-300">
              <span>Usage</span>
              <span className="font-semibold text-emerald-400">78%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-full w-[78%] rounded-full shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
            </div>
            <p className="text-[10px] text-gray-500">1178 / 1500 interactions</p>
          </div>

          <div className="flex items-center justify-between px-2 text-xs text-gray-400 hover:text-white cursor-pointer transition">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center text-[10px]">?</span>
              Need help?
            </span>
            <span>→</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 bg-black/30 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5 w-72 focus-within:border-emerald-500/60 transition">
            <span className="text-gray-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
            />
            <span className="text-[10px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded font-mono">⌘K</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/20 transition relative"
              aria-label="Notifications"
            >
              🔔
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2 shadow-[0_0_6px_rgba(57,255,20,0.8)]" />
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-700 p-0.5">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-emerald-400">
                  AT
                </div>
              </div>
              <div className="hidden sm:block">
                <h4 className="text-xs font-semibold text-white leading-tight">Alex Thompson</h4>
                <p className="text-[10px] text-gray-400">Business Owner</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}