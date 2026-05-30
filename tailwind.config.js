/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Outfit",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        lors: {
          navy: "#040814",
          deep: "#080e21",
          indigo: "#121b45",
          accent: "#00ddff",
          glow: "#7eb8ff",
          violet: "#7c3aed",
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
