import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        ui: ["var(--font-ui)"],
      },
      colors: {
        accent: "#c41230",
      },
    },
  },
  plugins: [],
};

export default config;
