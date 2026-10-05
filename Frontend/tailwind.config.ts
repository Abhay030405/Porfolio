import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "87.5rem",
      },
    },
    extend: {
      /*
       * Breakpoints in rem rather than px. In a media query `rem` always
       * resolves against the browser's default font size (not the fluid
       * `html` size set in index.css), so these stay at the familiar
       * 480/640/768/1024/1280/1536 while still honouring a user who has
       * bumped their browser's base font size.
       */
      screens: {
        xs: "30rem",
        sm: "40rem",
        md: "48rem",
        lg: "64rem",
        xl: "80rem",
        "2xl": "96rem",
      },
      fontFamily: {
        sans: ['General Sans', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      /* Fluid type ramp — interpolates with the viewport, capped at both ends. */
      fontSize: {
        "fluid-xs": ["clamp(0.6875rem, 0.66rem + 0.14vw, 0.75rem)", { lineHeight: "1.5" }],
        "fluid-sm": ["clamp(0.8125rem, 0.79rem + 0.12vw, 0.875rem)", { lineHeight: "1.55" }],
        "fluid-base": ["clamp(0.875rem, 0.84rem + 0.18vw, 0.9375rem)", { lineHeight: "1.6" }],
        "fluid-lg": ["clamp(1.125rem, 1rem + 0.6vw, 1.5rem)", { lineHeight: "1.3" }],
        "fluid-xl": ["clamp(1.75rem, 1.2rem + 2.4vw, 3rem)", { lineHeight: "1.15" }],
      },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          muted: "hsl(var(--sidebar-muted))",
        },
        chat: {
          input: "hsl(var(--chat-input))",
          "input-border": "hsl(var(--chat-input-border))",
          hover: "hsl(var(--chat-hover))",
          active: "hsl(var(--chat-active))",
        },
        /*
         * Brand accent. Replaces Tailwind's stock orange scale so every
         * existing `orange-*` class picks up #C6613F; shades hold the base
         * hue and saturation and vary only lightness.
         */
        brand: "hsl(var(--brand))",
        orange: {
          50: "hsl(15 54% 96%)",
          100: "hsl(15 54% 91%)",
          200: "hsl(15 54% 82%)",
          300: "hsl(15 54% 69%)",
          400: "hsl(15 54% 60%)",
          500: "hsl(var(--brand))",
          600: "hsl(15 54% 44%)",
          700: "hsl(15 54% 37%)",
          800: "hsl(15 54% 30%)",
          900: "hsl(15 54% 24%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.125rem)",
        sm: "calc(var(--radius) - 0.25rem)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(0.625rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "typing": {
          "0%, 60%, 100%": { opacity: "0" },
          "30%": { opacity: "1" },
        },
        "spin-ring": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "blink-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-0.375rem)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":       { opacity: "0.7", transform: "scale(1.08)" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "fade-in":         "fade-in 0.3s ease-out",
        "typing":          "typing 1.4s infinite",
        "spin-ring":       "spin-ring 3s linear infinite",
        "blink-cursor":    "blink-cursor 1s step-end infinite",
        "float":           "float 3s ease-in-out infinite",
        "glow-pulse":      "glow-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
