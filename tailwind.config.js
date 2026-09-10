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
          canvas: "#FFFFFF",
          surface: "#F7F7F5",
          hover: "#F1F1EF",
          border: "#EBEBEA",
          borderDark: "#D0D0CE",
          ink: "#2F3437",
          inkDark: "#000000",
          muted: "#787774",
          dim: "#9B9A97",
          blue: "#0A85EA",
          blueHover: "#0075EB",
          pastel: {
            red: "#FDF0EF",
            redBorder: "#F7CECC",
            redText: "#7C2D2B",
            green: "#EDF6EE",
            greenBorder: "#CBE7CE",
            greenText: "#1E5A2A",
            yellow: "#FBF3DB",
            yellowBorder: "#F4E2B6",
            yellowText: "#78510E",
            blue: "#EBF3FB",
            blueBorder: "#CDE1F8",
            blueText: "#18569C",
            purple: "#F6F3F9",
            purpleBorder: "#DFD5F5",
            purpleText: "#57338C",
          },
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
