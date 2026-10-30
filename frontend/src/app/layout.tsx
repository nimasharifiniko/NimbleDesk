import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin", "arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NimbleDesk | AI Front-Desk",
  description: "Smart AI customer engagement platform with Glassmorphism UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={vazirmatn.variable}>
      <body className="bg-[#080c09] text-gray-100 antialiased selection:bg-neon selection:text-black">
        {children}
      </body>
    </html>
  );
}
