/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // blu scuro
        accent: '#facc15',  // giallo
        grayCustom: '#f5f5f5' // grigio chiaro personalizzato
      },
    },
  },
  plugins: [],
}
