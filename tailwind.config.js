/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F7F5FC",
          100: "#EDE8F8",
          200: "#D9CFF0",
          300: "#B9A7E2",
          400: "#8F74CD",
          500: "#6B4BB8",
          600: "#573A9E",
          700: "#4A2C82",
          800: "#3A2166",
          900: "#2A1749",
        },
        hospital: {
          refael: "#2B7FC4",
          elisha: "#0F9B8E",
        },
        success: "#12876F",
        warning: "#C97A16",
        danger: "#C93F4E",
        info: "#2B7FC4",
        ink: "#1A1A22",
        body: "#4B4B58",
        muted: "#82828F",
        line: "#E5E2EC",
        surface: "#FFFFFF",
        canvas: "#F6F5FA",
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
        sm: "0 1px 2px rgba(26,26,34,.06)",
        md: "0 4px 16px rgba(26,26,34,.08)",
        lg: "0 12px 32px rgba(26,26,34,.12)",
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
