/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',
        secondary: '#4ca1af',
        accent: '#6c5ce7',
        danger: '#ff4d4d',
        success: '#2ecc71',
        warning: '#feca57'
      }
    },
  },
  plugins: [],
}