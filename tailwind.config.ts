import type { Config } from "tailwindcss";

const config: Config = {
  // Shared UI lives outside app/, so those files must be scanned as well.
  // Without this, production Tailwind omits their layout and responsive classes.
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: { card: "0 8px 30px rgba(15, 23, 42, 0.07)" },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        serif: ["var(--font-heading)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
