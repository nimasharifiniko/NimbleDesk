"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "fa";

interface DashboardLangContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    dir: "ltr" | "rtl";
}

const DashboardLangContext = createContext<DashboardLangContextType | undefined>(undefined);

export function DashboardLangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>("en");
    const dir: "ltr" | "rtl" = lang === "fa" ? "rtl" : "ltr";

    return (
        <DashboardLangContext.Provider value={{ lang, setLang, dir }}>
            {children}
        </DashboardLangContext.Provider>
    );
}

export function useDashboardLang() {
    const ctx = useContext(DashboardLangContext);
    if (!ctx) {
        throw new Error("useDashboardLang must be used within DashboardLangProvider");
    }
    return ctx;
}