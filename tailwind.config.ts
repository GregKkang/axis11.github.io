import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        navy: {
          DEFAULT: "hsl(var(--navy))",
          light: "hsl(var(--navy-light))",
          dark: "hsl(var(--navy-dark))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          muted: "hsl(var(--gold-muted))",
        },
        cream: "hsl(var(--cream))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Long-form article body. Applied as `prose prose-axis11`.
      typography: {
        axis11: {
          css: {
            "--tw-prose-body": "hsl(var(--foreground) / 0.85)",
            "--tw-prose-headings": "hsl(var(--navy))",
            "--tw-prose-lead": "hsl(var(--muted-foreground))",
            "--tw-prose-links": "hsl(var(--navy))",
            "--tw-prose-bold": "hsl(var(--navy))",
            "--tw-prose-counters": "hsl(var(--gold-muted))",
            "--tw-prose-bullets": "hsl(var(--gold-muted))",
            "--tw-prose-hr": "hsl(var(--border))",
            "--tw-prose-quotes": "hsl(var(--navy))",
            "--tw-prose-quote-borders": "hsl(var(--gold))",
            "--tw-prose-captions": "hsl(var(--muted-foreground))",
            "--tw-prose-code": "hsl(var(--navy))",
            "--tw-prose-th-borders": "hsl(var(--border))",
            "--tw-prose-td-borders": "hsl(var(--border))",
            maxWidth: "none",
            fontSize: "1.0625rem",
            lineHeight: "1.75",
            h2: { fontFamily: "var(--font-heading)", fontWeight: "600", marginTop: "2.5em" },
            h3: { fontFamily: "var(--font-heading)", fontWeight: "600" },
            h4: { fontFamily: "var(--font-heading)", fontWeight: "600" },
            a: { textDecorationThickness: "1px", textUnderlineOffset: "3px" },
            blockquote: { fontStyle: "normal", fontWeight: "400" },
            "thead th": { fontWeight: "600" },
            "td, th": { paddingInlineStart: "0.75em", paddingInlineEnd: "0.75em" },
            // Footnote block rendered by markdown-it-footnote.
            ".footnotes": {
              marginTop: "3em",
              paddingTop: "1.5em",
              borderTop: "1px solid hsl(var(--border))",
              fontSize: "0.875rem",
              color: "hsl(var(--muted-foreground))",
            },
            ".footnotes hr": { display: "none" },
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
} satisfies Config;
