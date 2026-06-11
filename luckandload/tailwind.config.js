/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        hype: '#1ce479',
        brand: {
          400: '#2dd4d4',
          500: '#14b8b8',
          600: '#0d9696',
        },
        gold: {
          400: '#d4b33a',
          500: '#c9a53c',
          600: '#b8941e',
        },
        surface: {
          950: '#020b14',
          900: '#050e1c',
          800: '#071422',
          700: '#0a1c30',
          600: '#0e2440',
          500: '#132e50',
          400: '#1a3860',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(20,184,184,0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(20,184,184,0.5)' },
        },
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,184,184,0.12), transparent)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
