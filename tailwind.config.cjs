/** @type {import('tailwindcss').Config}*/
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        script: ['"Mrs Saint Delafield"', "cursive"],
      },
      colors: { ink: "#050507", card: "#111113", dim: "#8b8b93", line: "#232327", blue: "#4d8dff" },
      keyframes: {
        spinSlow: { to: { transform: "rotate(360deg)" } },
        marquee: { to: { transform: "translateX(-50%)" } },
        caret: { "50%": { opacity: 0 } },
      },
      animation: { spinSlow: "spinSlow 18s linear infinite", marquee: "marquee 28s linear infinite", caret: "caret 1s steps(1) infinite" },
    },
  },
  plugins: [],
};
