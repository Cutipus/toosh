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

