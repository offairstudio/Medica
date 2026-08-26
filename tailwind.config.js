/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF8F6",
          100: "#D9F0EB",
          200: "#B6DFD7",
          300: "#84C6BC",
          400: "#4DA89E",
          500: "#278B82",
          600: "#156F69",
          700: "#105954",
          800: "#0E4643",
          900: "#0B3433",
        },
        hospital: {
          refael: "#2B7FC4",
          elisha: "#0F9B8E",
        },
        success: "#187B5B",
        warning: "#A97321",
        danger: "#BB4050",
        info: "#326D91",
        ink: "#102B2D",
        body: "#3F5657",
        muted: "#718284",
        line: "#DCE6E4",
        surface: "#FFFFFF",
        canvas: "#F4F7F6",
      },
      fontFamily: {
        sans: ["Assistant", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["32px", { lineHeight: "1.25", fontWeight: "700" }],
        h1: ["26px", { lineHeight: "1.3", fontWeight: "700" }],
        h2: ["20px", { lineHeight: "1.35", fontWeight: "600" }],
        h3: ["17px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-strong": ["15px", { lineHeight: "1.55", fontWeight: "600" }],
        caption: ["13px", { lineHeight: "1.45", fontWeight: "400" }],
        "mono-num": ["15px", { lineHeight: "1.4", fontWeight: "600" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(16,43,45,.06)",
        md: "0 8px 24px rgba(16,43,45,.08)",
        lg: "0 20px 48px rgba(16,43,45,.14)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
      transitionTimingFunction: {
        slow: "cubic-bezier(.22,1,.36,1)",
      },
    },
  },
  plugins: [],
};
