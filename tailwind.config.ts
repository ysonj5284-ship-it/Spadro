import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        espresso: "#2B1B14",
        "espresso-deep": "#1A100C",
        rose: {
          DEFAULT: "#D9A78C",
          dark: "#C98A6B",
        },
        wine: {
          DEFAULT: "#7A1F2B",
          deep: "#5C1620",
        },
        cream: "#F3E9E2",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;
