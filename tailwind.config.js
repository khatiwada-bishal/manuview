/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#16a34a",
          600: "#15803d",
          700: "#166534",
        },
        slate: {
          850: "#151e2e",
          950: "#0b0f19",
        },
        notion: {
          bg: "#191919",
          sidebar: "#202020",
          card: "#222222",
          elevated: "#282828",
          hover: "#2f2f2f",
          border: "#2e2e2e",
          borderLight: "#383838",
          text: "#e6e6e6",
          muted: "#9b9a97",
          dim: "#6b6a67",
          callout: "#232323",
          tag: "#2c2c2c",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
