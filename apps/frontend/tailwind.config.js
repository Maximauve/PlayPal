
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background : {
          dark : '#2C2830',
          light : '#2F2C34',
        },
        text : {
          light : '#FFFFFF',
          dark : '#2C2830',
        },
        button : {
          active : '#FFFFFF',
          hover : '#FFFFFF',
          default : '#2F2C34',
        }
      }
    },
  },
  plugins: [],
};

