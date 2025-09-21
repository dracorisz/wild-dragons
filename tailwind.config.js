/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e293b', // dark blue
        accent: '#e11d48',  // pink/red
        dragon: '#fbbf24',  // gold
        forest: '#059669',  // green
        sky: '#38bdf8',     // blue
      },
    },
  },
  plugins: [],
}