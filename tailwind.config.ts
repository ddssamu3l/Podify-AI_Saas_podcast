import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        white: {
          1: "#FFFFFF",
          2: "rgba(255, 255, 255, 0.72)",
          3: "rgba(255, 255, 255, 0.4)",
          4: "rgba(255, 255, 255, 0.64)",
          5: "rgba(255, 255, 255, 0.80)",
        },
        black: {
          0: "#070707",
          1: "#15171C",
          2: "#222429",
          3: "#101114",
          4: "#252525",
          5: "#2E3036",
          6: "#24272C",
        },

        /* THESE ARE IOS DARK COLORS*/
        red: {
          DEFAULT: 'rgb(255, 69, 58)',
        },
        orange: {
          DEFAULT: "rgb(255, 159, 10)",
        },
        yellow: {
          DEFAULT: "#FF9F0A",
        },
        green: {
          DEFAULT: "rgb(48, 209, 88)",
        },
        mint: {
          DEFAULT: "rgb(99, 230, 226)",
        },
        teal: {
          DEFAULT: "rgb(64, 200, 224)",
        },
        cyan: {
          DEFAULT: "rgb(100, 210, 255)",
        },
        blue: {
          DEFAULT: "rgb(10, 132, 255)",
        },
        indigo: {
          DEFAULT: "rgb(94, 92, 230)",
        },
        purple: {
          DEFAULT: "rgb(191, 90, 242)",
        },
        pink: {
          DEFAULT: "rgb(191, 90, 242)",
        },
        brown: {
          DEFAULT: "rgb(172, 142, 104)",
        },
        grey:{
          DEFAULT: '#0f0f14',
        },
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        "nav-focus":
          "linear-gradient(270deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.00) 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;