/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: ["./src/toosh_co_il/templates/**/*.html.j2"],
  theme: {
    fontSize: {
      gigantic: ["25rem", { lineHeight: "20rem" }],
      big: ["3.6rem", { lineHeight: "4rem" }],
      medium: ["2rem"],
      "medium-small": ["1.6rem"],
      small: ["1.4rem"],
      smaller: ["16px"],
      "very-small": ["14px"],
      "very-very-small": ["12px"],
    },
    fontFamily: {
      narkiss: ['"miriam-libre"', "sans-serif"],
      "google-sans-code": ['"Google Sans Code"', "sans-serif"],
      // narkiss: ['"narkiss-tam"', 'sans-serif'],
    },
    extend: {
      colors: {
        "dark-sepia": "#231F18",
        "ancient-gray": "#393433",
        "greenboard-green": "#191B19",
        "dark-ancient-gray": "#2A2727",
        "darkest-ancient-gray": "#181716",
        "coral-red": "#E9443C",
      },
      animation: {
        "fade-in": "fadeIn 150ms ease-in",
        "fade-out": "fadeOut 150ms ease-out",
        "zoom-in": "zoomIn 150ms ease-in",
        "zoom-out": "zoomOut 150ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        zoomOut: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(0.9)" },
        },
      },
      gridTemplateColumns: {
        main: "1fr 4fr",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("loading", ["&.loading"]);
      addVariant("zoomed", ["&.zoomed", ".zoomed &"]);
      addVariant("currently-viewed", ["&.currently-viewed", ".currently-viewed &"]);
      addVariant("htmx-settling", ["&.htmx-settling", ".htmx-settling &"]);
      addVariant("htmx-request", ["&.htmx-request", ".htmx-request &"]);
      addVariant("htmx-swapping", ["&.htmx-swapping", ".htmx-swapping &"]);
      addVariant("htmx-added", ["&.htmx-added", ".htmx-added &"]);
    }),
  ],
  safelist: ["invert", "text-transparent"],
};
