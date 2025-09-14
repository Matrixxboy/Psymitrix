// tailwind.config.js
import plugin from 'tailwindcss/plugin';

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
  plugins: [
    plugin(function ({ addUtilities, addComponents }) {
      // cross-browser backdrop blur utilities (webkit prefix + standard)
      addUtilities({
        '.-webkit-backdrop-blur-sm': {
          '-webkit-backdrop-filter': 'blur(6px)',
          'backdrop-filter': 'blur(6px)',
        },
        '.-webkit-backdrop-blur': {
          '-webkit-backdrop-filter': 'blur(10px)',
          'backdrop-filter': 'blur(10px)',
        },
        '.-webkit-backdrop-blur-lg': {
          '-webkit-backdrop-filter': 'blur(18px)',
          'backdrop-filter': 'blur(18px)',
        },
      }, { variants: ['responsive', 'hover'] });

      // reusable glass components
      addComponents({
        '.glass': {
          'background-color': 'rgba(255,255,255,0.12)', /* light glass */
          'border': '1px solid rgba(255,255,255,0.06)',
          
          'box-shadow': '0 8px 30px rgba(2,6,23,0.25)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'backdrop-filter': 'blur(12px)',
          'will-change': 'backdrop-filter',
        },
        '.glass-dark': {
          'background-color': 'rgba(18,18,18,0.45)', /* dark glass */
          'border': '1px solid rgba(255,255,255,0.03)',
          
          'box-shadow': '0 8px 30px rgba(0,0,0,0.6)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'backdrop-filter': 'blur(12px)',
          'will-change': 'backdrop-filter',
        },
      });
    })
  ],
}
