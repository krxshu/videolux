/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#070A13",
          secondary: "#111827",
        },
        brand: {
          purple: "#6C5CE7",
          cyan: "#00D9FF",
          violet: "#8B5CF6",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gradient-purple-cyan": "linear-gradient(135deg, #6C5CE7 0%, #00D9FF 100%)",
        "gradient-purple-violet": "linear-gradient(135deg, #6C5CE7 0%, #8B5CF6 100%)",
        "gradient-radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(108,92,231,0.18) 0%, rgba(7,10,19,0) 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(108,92,231,0.45)",
        "glow-cyan": "0 0 40px -10px rgba(0,217,255,0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
