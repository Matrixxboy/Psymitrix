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
        'light-background': '#F4F4F2',
        'light-primary': '#A5645A',
        'light-secondary': '#E5C397',
        'light-accent': '#D87D62',
        'light-headings': '#4B2F2A',
        'light-body': '#4A433F',

        'dark-background': '#140d08',
        'dark-primary': '#E1A79E',
        'dark-secondary': '#F0D2A8',
        'dark-accent': '#F1B18F',
        'dark-headings': '#F8F1EB',
        'dark-body': '#E5DAD2',

        'success': '#27AE60',
        'warning': '#F2C94C',
        'error': '#EB5757',
      },
      keyframes: {
        // ❤️ Heart Beat
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.15)' },
          '50%': { transform: 'scale(0.95)' },
          '75%': { transform: 'scale(1.1)' },
        },

        // 🧘 Meditation Float (slow up-down movement)
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },

        // 🎧 Headphone Pulse (gentle vibration / soundwave feel)
        headphonePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.1)', opacity: 0.85 },
        },

        // ✅ Check Pop (gentle appear + bounce)
        checkPop: {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '60%': { transform: 'scale(1.2)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        heartbeat: 'heartbeat 1.3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        headphonePulse: 'headphonePulse 1.8s ease-in-out infinite',
        checkPop: 'checkPop 0.6s ease-out forwards',
      },
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
          'background-image': 'linear-gradient(135deg, rgba(251,247,242,0.78), rgba(229,195,151,0.35))',
          'background-color': 'rgba(248,242,236,0.45)',
          'border': '1px solid rgba(229,195,151,0.45)',
          'box-shadow': '0 24px 52px rgba(165,100,90,0.18)',
          'border-radius': '1.5rem',
          '-webkit-backdrop-filter': 'blur(24px) saturate(160%)',
          'backdrop-filter': 'blur(24px) saturate(160%)',
          'overflow': 'hidden',
          'position': 'relative',
          'will-change': 'transform, backdrop-filter',
        },
        '.glass-dark': {
          'background-image': 'linear-gradient(135deg, rgba(74,48,42,0.72), rgba(118,76,66,0.38))',
          'background-color': 'rgba(63,42,38,0.48)',
          'border': '1px solid rgba(225,167,158,0.38)',
          'box-shadow': '0 28px 60px rgba(46,28,24,0.6)',
          'border-radius': '1.5rem',
          '-webkit-backdrop-filter': 'blur(26px) saturate(185%)',
          'backdrop-filter': 'blur(26px) saturate(185%)',
          'overflow': 'hidden',
          'position': 'relative',
          'will-change': 'transform, backdrop-filter',
        },
      });
    })
  ],
}
