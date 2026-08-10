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
        xl: "18px",
        lg: "12px",
        md: "8px",
        sm: "4px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "-0.01em",
        wide: "0.01em",
        wider: "0.025em",
        widest: "0.05em",
      },
      animation: {
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "card-enter": "card-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        "card-leave": "card-leave 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        "card-move": "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        "title-float": "title-float 3s ease-in-out infinite",
        "title-gradient": "title-gradient 3s linear infinite",
        "title-fade": "title-fade 1s ease-out forwards",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "vibes-vinyl-spin": "vibes-vinyl-spin 4s linear infinite",
        "vibes-vinyl-spin-slow": "vibes-vinyl-spin 18s linear infinite",
        "vibes-cover-float": "vibes-cover-float 5.5s ease-in-out infinite",
        "vibes-screen-flicker":
          "vibes-screen-flicker 6s ease-in-out infinite",
        "vibes-type-cursor": "vibes-type-cursor 1.1s steps(1) infinite",
        "vibes-line-type":
          "vibes-line-type 0.7s cubic-bezier(0.2, 0, 0, 1) both",
        "vibes-live-pulse": "vibes-live-pulse 1.8s ease-in-out infinite",
        "vibes-marquee": "vibes-marquee 12s linear infinite",
        "vibes-screen-flicker-soft":
          "vibes-screen-flicker-soft 5s ease-in-out infinite",
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
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "vibes-vinyl-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "vibes-cover-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "vibes-screen-flicker": {
          "0%, 100%": { opacity: "0.03" },
          "40%": { opacity: "0.03" },
          "42%": { opacity: "0.07" },
          "44%": { opacity: "0.02" },
          "70%": { opacity: "0.04" },
          "72%": { opacity: "0.08" },
          "74%": { opacity: "0.03" },
        },
        "vibes-type-cursor": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "vibes-line-type": {
          "0%": { transform: "scaleX(0.82)" },
          "100%": { transform: "scaleX(1)" },
        },
        "vibes-live-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "vibes-marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "vibes-screen-flicker-soft": {
          "0%, 100%": { opacity: "1" },
          "40%": { opacity: "1" },
          "42%": { opacity: "0.82" },
          "44%": { opacity: "1" },
          "70%": { opacity: "0.92" },
          "72%": { opacity: "0.78" },
          "74%": { opacity: "1" },
        },
      },
      boxShadow: {
        glow: "0 0 10px rgba(255, 255, 255, 0.3)", // white with reduced opacity
      },
    },
  },

  plugins: [
    animate,
    setupInspiraUI,
    plugin(function ({ addVariant }) {
      /** Sponsored gallery: base = dark (original), `light:` = html:not(.dark) overrides */
      addVariant("light", "html:not(.dark) &");
    }),
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
        ".scrollbar-thin": {
          /* Firefox */
          "scrollbar-width": "thin",
          "scrollbar-color": "hsl(var(--muted-foreground) / 0.4) transparent",
          /* Webkit (Chrome, Safari, Edge) */
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            "background-color": "hsl(var(--muted-foreground) / 0.3)",
            "border-radius": "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            "background-color": "hsl(var(--muted-foreground) / 0.5)",
          },
        },
      });
    }),
  ],
} satisfies Config;
