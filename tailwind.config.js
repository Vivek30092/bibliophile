/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#141210',
        deep: '#1E1A16',
        deeper: '#28221C',
        darkest: '#0E0C0A',
        footer: '#090806',
        accent: {
          DEFAULT: '#C4945A',
          light: '#D4A96A',
          dark: '#A07840',
          glow: 'rgba(196, 148, 90, 0.22)'
        },
        avail: {
          green: '#3BB87F',
          red: '#E05555',
          orange: '#E07C3A',
          blue: '#4A9ED6'
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
