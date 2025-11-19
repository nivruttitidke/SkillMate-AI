/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(150%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },

        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },

        "scale-in": {
          "0%": { transform: "scale(0.8)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },

      animation: {
        "slide-in": "slide-in 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-in",
        "scale-in": "scale-in 0.25s ease-out",
      },
    },
  },

  plugins: [],
};
