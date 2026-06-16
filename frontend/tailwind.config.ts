import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial dark palette derived from the Strata reference
        ink: {
          DEFAULT: "#1a181a", // page background
          soft: "#201e20",
          card: "#222022",
        },
        bone: {
          DEFAULT: "#ebebeb", // primary text
          dim: "#bebfc4",
          muted: "#919191",
          faint: "#7a7a7a",
        },
        line: "#363636",
        accent: {
          DEFAULT: "#0099ff",
          soft: "#3fb0ff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Satoshi", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      fontSize: {
        "display-lg": ["clamp(3rem, 8vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display": ["clamp(2.5rem, 5.5vw, 5rem)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "heading": ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        label: "0.18em",
      },
      maxWidth: {
        editorial: "1320px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
