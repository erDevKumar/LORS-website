/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        lors: {
          navy:    "#040814",
          deep:    "#080e21",
          indigo:  "#121b45",
          accent:  "#00ddff",
          glow:    "#7eb8ff",
          violet:  "#7c3aed",
          // Planet accent palette — mirrors galaxy body colors
          gold:    "#ffd27a",
          cyan:    "#19c8ff",
          emerald: "#36e0a4",
          purple:  "#9a6bff",
          sky:     "#7eb8ff",
          rose:    "#ff7ec2",
          amber:   "#ffc24d",
        },
      },
      animation: {
        "pulse-glow":    "pulse-glow 3s ease-in-out infinite",
        "fade-up":       "fade-up 0.5s ease-out forwards",
        "shimmer-slide": "shimmer-slide 6s ease-in-out infinite",
        "orbit-slow":    "spin 20s linear infinite",
        "blink-caret":   "blink-caret 1s step-end infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%":      { opacity: "0.9"  },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        "shimmer-slide": {
          "0%, 100%": { transform: "translateX(-160%) rotate(30deg)" },
          "50%":      { transform: "translateX(160%) rotate(30deg)"  },
        },
        "blink-caret": {
          "0%, 100%": { borderColor: "transparent"  },
          "50%":      { borderColor: "currentColor" },
        },
      },
    },
  },
  plugins: [],
};
