/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 1s linear infinite', // Custom spin animation with a slower speed
      },
    },
  },
  plugins: [],
};
