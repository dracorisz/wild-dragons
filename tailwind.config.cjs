/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e293b', // dark blue
        'primary-light': '#334155',
        accent: '#e11d48',  // pink/red
        'accent-hover': '#f43f5e',
        dragon: '#fbbf24',  // gold
        forest: '#059669',  // green
        sky: '#38bdf8',     // blue
        cosmic: '#8b5cf6',  // purple
        neon: '#22d3ee',    // cyan
      },
    },
  },
  plugins: [],
}