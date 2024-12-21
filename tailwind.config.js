/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')


module.exports = {
  content: [
    './src/toosh_co_il/templates/**/*.html.j2',
  ],
  theme: {
    fontFamily: {
      narkiss: ['"narkiss-tam"', 'sans-serif'],
    },
    extend: {
      animation: {
        'fade-in': 'fadeIn 150ms ease-in',
        'fade-out': 'fadeOut 150ms ease-out',
        'zoom-in': 'zoomIn 150ms ease-in',
        'zoom-out': 'zoomOut 150ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.9)' },
        },
      },
      gridTemplateColumns: {
        'main': '1fr 4fr',
      }
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('htmx-settling', ['&.htmx-settling', '.htmx-settling &'])
      addVariant('htmx-request', ['&.htmx-request', '.htmx-request &'])
      addVariant('htmx-swapping', ['&.htmx-swapping', '.htmx-swapping &'])
      addVariant('htmx-added', ['&.htmx-added', '.htmx-added &'])
    }),
  ],
}

