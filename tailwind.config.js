/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nav: "#4C3780",
        navhover: "#08ecdc",
        background: "#F3F2F5",
        primary: "#6B4BA1",
        secondary: "#FFFFFF",
        accent: "#54A3D5",
        btn: "#865DC1",
        btn_hover: "#A584E0",
        text: "#333333",
      },
    },
  },
  plugins: [],
};
