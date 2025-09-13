/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light-background': '#F5F7FA',
        'light-primary': '#6C63FF',
        'light-secondary': '#00BFA6',
        'light-accent': '#FF6B6B',
        'light-headings': '#2C3E50',
        'light-body': '#4F4F4F',

        'dark-background': '#121212',
        'dark-primary': '#8C82FC',
        'dark-secondary': '#26D7AE',
        'dark-accent': '#FF8A80',
        'dark-headings': '#E0E0E0',
        'dark-body': '#BDBDBD',

        'success': '#27AE60',
        'warning': '#F2C94C',
        'error': '#EB5757',
      }
    },
  },
  plugins: [],
}
