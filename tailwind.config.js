/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F6F3FB",
          100: "#EDE8F7",
          200: "#DCD1EF",
          300: "#C3AFE2",
          400: "#A084D2",
          500: "#8062BD",
          600: "#63469E",
          700: "#503680",
          800: "#462E79",
          900: "#34205F",
        },
        accent: "#12CBCA",
        hospital: {
          refael: "#012D5E",
          elisha: "#46348A",
        },
        success: "#187B5B",
        warning: "#A97321",
        danger: "#BB4050",
        info: "#326D91",
        ink: "#1D252B",
        body: "#3F444B",
        muted: "#69727D",
        line: "#DDE5E6",
        surface: "#FFFFFF",
        canvas: "#F0F4F3",
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
        sm: "0 1px 3px rgba(70,46,121,.06)",
        md: "0 8px 24px rgba(70,46,121,.08)",
        lg: "0 20px 48px rgba(52,32,95,.14)",
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
