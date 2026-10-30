import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-dark)",
        foreground: "var(--text-main)",
        neon: {
          DEFAULT: "#39ff14",
          dark: "#22c55e",
          glow: "rgba(57, 255, 20, 0.4)",
        },
        glass: {
          DEFAULT: "rgba(18, 26, 20, 0.55)",
          border: "rgba(255, 255, 255, 0.08)",
        }
      },
      boxShadow: {
        'neon': '0 0 15px rgba(57, 255, 20, 0.3)',
        'neon-strong': '0 0 25px rgba(57, 255, 20, 0.6)',
      }
    },
  },
  plugins: [],
} satisfies Config;
