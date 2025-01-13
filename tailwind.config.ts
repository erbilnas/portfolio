import { setupInspiraUI } from "@inspira-ui/plugins";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: "selector",
  safelist: ["dark"],
  prefix: "",
  content: [],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "card-enter": "card-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        "card-leave": "card-leave 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        "card-move": "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        "title-float": "title-float 3s ease-in-out infinite",
        "title-gradient": "title-gradient 3s linear infinite",
        "title-fade": "title-fade 1s ease-out forwards",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.5" },
        },
        "card-enter": {
          "0%": {
            opacity: "0",
            transform:
              "perspective(2000px) translateX(100px) translateY(10px) translateZ(-100px) rotateY(-20deg) scale(0.8)",
            filter: "blur(4px)",
          },
          "100%": {
            opacity: "1",
            transform:
              "perspective(2000px) translateX(0) translateY(0) translateZ(0) rotateY(0) scale(1)",
            filter: "blur(0)",
          },
        },
        "card-leave": {
          "0%": {
            opacity: "1",
            transform:
              "perspective(2000px) translateX(0) translateY(0) translateZ(0) rotateY(0) scale(1)",
            filter: "blur(0)",
          },
          "100%": {
            opacity: "0",
            transform:
              "perspective(2000px) translateX(-100px) translateY(10px) translateZ(-100px) rotateY(20deg) scale(0.8)",
            filter: "blur(4px)",
          },
        },
        "title-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "title-gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "title-fade": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      boxShadow: {
        glow: "0 0 10px rgba(139, 92, 246, 0.3)", // violet-500 with reduced opacity
      },
    },
  },

  plugins: [
    animate,
    setupInspiraUI,
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
} satisfies Config;
