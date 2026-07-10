/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#040407', // Deeper premium dark background
        surface: '#0d0d12', // Dark card surface
        border: '#1f1f2e', // Tinted border color
        primary: {
          DEFAULT: '#6366f1', // Rich Indigo primary
          hover: '#4f46e5',
          accent: '#818cf8',
        },
        accent: {
          violet: '#8b5cf6',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
        'border-shine': 'border-shine 6s infinite linear',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(99, 102, 241, 0.8))' },
        },
        'border-shine': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
