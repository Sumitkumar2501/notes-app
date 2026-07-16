/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'note-default',
    'note-yellow',
    'note-orange',
    'note-pink',
    'note-green',
    'note-blue',
    'note-purple',
    'font-sans-note',
    'font-serif-note',
    'font-handwriting-note',
    'font-typewriter-note',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        primary: '#4f46e5',
        secondary: '#64748b',
        surface: 'rgba(255, 255, 255, 0.7)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
