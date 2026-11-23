/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bubble: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0284C7',
          600: '#0369A1',
        },
        medipink: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
        },
        sunny: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
        },
        mint: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        lavender: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          700: '#6D28D9',
        }
      },
      boxShadow: {
        'cartoon': '4px 4px 0px 0px rgba(15, 23, 42, 0.9)',
        'cartoon-sm': '2px 2px 0px 0px rgba(15, 23, 42, 0.9)',
        'cartoon-lg': '6px 6px 0px 0px rgba(15, 23, 42, 0.9)',
        'cartoon-hover': '2px 2px 0px 0px rgba(15, 23, 42, 0.9)',
        'cartoon-mint': '4px 4px 0px 0px #059669',
        'cartoon-pink': '4px 4px 0px 0px #BE123C',
        'cartoon-sunny': '4px 4px 0px 0px #D97706',
        'cartoon-blue': '4px 4px 0px 0px #0369A1',
      },
      borderRadius: {
        'cartoon': '1.25rem',
        'cartoon-lg': '1.75rem',
      },
      fontFamily: {
        cartoon: ['"Fredoka"', '"Nunito"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2.5s infinite ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
