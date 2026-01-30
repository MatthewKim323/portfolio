/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.tsx",
    "./src/**/*.ts",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#070F2B',
        'secondary': '#1B1A55',
        'tertiary': '#535C91',
        'accent': '#9290C3',
      },
    },
    fontFamily: {
      'sans': ['"DM Sans"', 'sans-serif'],
      'serif': ['"Yeseva One"', 'serif'],
    }
  },
  plugins: [],
}
