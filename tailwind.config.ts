import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#112132",
        mist: "#eff4f7",
        line: "#d7e2ea",
        accent: "#0f766e",
        accentSoft: "#d7f3ee",
        warn: "#92400e",
      },
      boxShadow: {
        panel: "0 20px 50px rgba(17, 33, 50, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
