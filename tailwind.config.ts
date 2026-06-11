import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette read straight off the reference
        brand: {
          navy: "#060C8B",           // primary text + footer bg
          "navy-deep": "#040870",     // footer hover / darker accents
          orange: "#F39200",          // primary CTA, "Enquire now"
          "orange-soft": "#FCE5C2",   // card top-corner accent fill
          "orange-tint": "#FFF5E5",   // very faint card hover
          lavender: "#ECEAFB",        // section bg behind Learning journey / Admissions
          cream: "#FFFBF5",           // hero CTA secondary surface
          ink: "#1F2A66",             // headings on light bg
          muted: "#6B7280",           // body copy
        },
      },
      fontFamily: {
        // Replace with the actual brand font once identified;
        // Inter is a clean sans-serif fallback that matches the reference well.
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 28px -16px rgba(15, 23, 42, 0.12)",
        "card-lg":
          "0 1px 2px rgba(15, 23, 42, 0.05), 0 24px 48px -24px rgba(15, 23, 42, 0.18)",
        cta: "0 10px 24px -10px rgba(243, 146, 0, 0.55)",
      },
      borderRadius: {
        card: "14px",
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        "drawer-item-in": {
          "0%": { opacity: "0", transform: "translateX(12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        bob: "bob 2.2s ease-in-out infinite",
        "drawer-item-in": "drawer-item-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
