/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'bright-purple': {
        '50': '#f0f3fd',
        '100': '#e3e9fc',
        '200': '#cdd5f8',
        '300': '#aeb9f3',
        '400': '#8e95eb',
        '500': '#7273e2',
        '600': '#6057d4',
        '700': '#564cbc',
        '800': '#433c97',
        '900': '#3a3778',
        '950': '#232046',
      },
      'dark-purple': {
        '50': '#f1f5fc',
        '100': '#e5ecfa',
        '200': '#d1dcf4',
        '300': '#b4c4ed',
        '400': '#96a5e3',
        '500': '#7c88d8',
        '600': '#6267c9',
        '700': '#5153b1',
        '800': '#44478f',
        '900': '#3c4073',
        '950': '#1a1b31',
      },
      'dry-purple': {
        '50': '#f2f4fc',
        '100': '#e1e6f8',
        '200': '#cad3f3',
        '300': '#a6b7ea',
        '400': '#7c92de',
        '500': '#5c6fd5',
        '600': '#4853c8',
        '700': '#3e43b7',
        '800': '#383995',
        '900': '#2a2c65',
        '950': '#222249',
      },
    },
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

