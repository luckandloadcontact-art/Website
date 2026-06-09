/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0e',
        },
        surface: {
          950: '#07070f',
          900: '#0d0d14',
          800: '#12121e',
          700: '#181828',
          600: '#1e1e32',
          500: '#25253c',
          400: '#2e2e4a',
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
          '0%': { boxShadow: '0 0 20px rgba(249,115,22,0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(249,115,22,0.5)' },
        },
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.12), transparent)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
