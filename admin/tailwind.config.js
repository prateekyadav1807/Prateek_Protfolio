/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        yellow: { 400: '#eab308', 500: '#ca8a04' },
      },
    },
  },
  plugins: [],
}
