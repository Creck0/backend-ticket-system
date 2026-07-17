/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palet "poster wisata pantai senja" - bukan default cream/terracotta AI
        lagoon: {
          950: '#04262b',
          900: '#063b40',
          700: '#0b5c63',
          500: '#12878f',
          300: '#5fc2c4',
          100: '#d7f3ef',
        },
        dusk: {
          600: '#e8703a',
          500: '#f2954f',
          300: '#f8c68a',
        },
        sand: '#f6f1e4',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
