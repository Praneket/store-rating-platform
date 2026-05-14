/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in-up':    'fadeInUp 0.5s ease forwards',
        'fade-in-scale': 'fadeInScale 0.4s ease forwards',
        'slide-in-left': 'slideInLeft 0.4s ease forwards',
        'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
        'spin-slow':     'spinSlow 12s linear infinite',
        'gradient':      'gradientShift 4s ease infinite',
        'star-pop':      'starPop 0.3s ease',
        'float':         'float 8s ease-in-out infinite',
        'morph':         'morph 10s ease-in-out infinite',
        'shimmer':       'shimmer 1.8s infinite',
      },
      keyframes: {
        fadeInUp:      { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeInScale:   { from: { opacity: 0, transform: 'scale(0.92)' },      to: { opacity: 1, transform: 'scale(1)' } },
        slideInLeft:   { from: { opacity: 0, transform: 'translateX(-20px)' },to: { opacity: 1, transform: 'translateX(0)' } },
        pulseGlow:     { '0%,100%': { boxShadow: '0 0 20px rgba(59,130,246,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(59,130,246,0.6)' } },
        spinSlow:      { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        gradientShift: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        starPop:       { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.4) rotate(-10deg)' }, '100%': { transform: 'scale(1)' } },
        float:         { '0%,100%': { transform: 'translateY(0) scale(1)' }, '33%': { transform: 'translateY(-20px) scale(1.05)' }, '66%': { transform: 'translateY(10px) scale(0.97)' } },
        morph:         { '0%,100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }, '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' } },
        shimmer:       { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
      },
      transitionDelay: {
        '100': '100ms', '200': '200ms', '300': '300ms', '400': '400ms', '500': '500ms',
      },
    },
  },
  plugins: [],
}
