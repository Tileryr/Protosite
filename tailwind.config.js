/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '1': '1px',
      },

      colors: {
        highlight: "#564cbd",
        background: "#1a1b31",
      }
    },
  },
  plugins: [],
}

