/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#41E296',
        secondary: '#00C4EE',
      },
    },
  },
  plugins: [],
};
