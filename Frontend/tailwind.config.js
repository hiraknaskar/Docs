/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colours used in the project 
      colors:{
        primary: 'rgba(219, 142, 0, 0.752)',
        secondary:"#EF863E",
      }
    },
  },
  plugins: [],
}

