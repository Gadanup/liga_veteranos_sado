/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Same crest palette as src/styles/theme.js.
      colors: {
        nav: "#0C1F33",
        background: "#EEF1F5",
        primary: "#14334A",
        secondary: "#FFFFFF",
        accent: "#C5944C",
        btn: "#14334A",
        btn_hover: "#2C5474",
        text: "#16232F",
      },
    },
  },
  plugins: [],
};
