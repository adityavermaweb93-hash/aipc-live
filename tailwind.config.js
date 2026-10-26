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
        brand: {
          maroon: "#801b0d",
          red: "#7F0401",
          brightRed: "#cc0000",
          hoverRed: "#9e0502",
          gold: "#c5a059",
          dark: "#0a0a0a",
          darkCard: "#0d0d0d",
          bgLight: "#F7F5F3",
          bgParchment: "#FDFCFB",
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
