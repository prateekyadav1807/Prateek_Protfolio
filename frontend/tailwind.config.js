/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        yellow: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        surface: '#111111',
        card: '#1a1a1a',
        border: '#2a2a2a',
        muted: '#888888',
      },
    },
  },
  plugins: [],
}
