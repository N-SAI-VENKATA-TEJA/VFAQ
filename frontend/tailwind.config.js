/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: 'var(--brand--white)',
          'black-light': 'var(--brand--black-light)',
          aqua: 'var(--brand--aqua)',
          'aqua-50': 'var(--brand--aqua-50)',
          'aqua-30': 'var(--brand--aqua-30)',
          'aqua-20': 'var(--brand--aqua-20)',
          'neutral-dark': 'var(--brand--neutral-dark)',
          'neutral-lighter': 'var(--brand--neutral-lighter)',
          'gray-light': 'var(--brand--gray-light)',
        },
        bg: {
          primary: 'var(--bg-color--bg-primary)',
          secondary: 'var(--bg-color--bg-secondary)',
          tertiary: 'var(--bg-color--bg-tertiary)',
          alternate: 'var(--bg-color--bg-alternate)',
          aqua: 'var(--bg-color--bg-aqua)',
        },
        text: {
          primary: 'var(--text-color--text-primary)',
          secondary: 'var(--text-color--text-secondary)',
          tertiary: 'var(--text-color--text-tertiary)',
          white: 'var(--text-color--text-white)',
          aqua: 'var(--text-color--text-aqua)',
        },
        border: {
          primary: 'var(--border-color--border-primary)',
          secondary: 'var(--border-color--border-secondary)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        'tight-xl': '-0.04em',
        'tight-2xl': '-0.045em',
        'badge': '0.2em',
        'price': '0.14em',
      },
      boxShadow: {
        'card-inner': '0 4px 9px #00000008, 0 17px 17px #00000008, 0 38px 23px #00000005, 0 67px 27px #00000003',
        'button-primary': '0 0 0 1px #12376914, 0 2px 3px #2a3b5126',
        'input-inner': 'inset 0 -2px 5px #ffffff14, inset 0 2px 5px #ffffff14',
      },
      borderRadius: {
        'pill': '999rem',
        'card': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translate3d(0, 15%, 0)' },
          '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(244deg, var(--brand--aqua-30), var(--brand--aqua-20) 99.26%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
