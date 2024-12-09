
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
    
  ],
  theme: {
    extend: {
      colors: {
        background : {
          dark : '#2C2830',
          light : '#FFFFFF',
        },
        text : {
          light : '#2C2830',
          dark : '#FFFFFF',
        },
        button : {
          active : '#FFFFFF',
          hover : '#FFFFFF',
          default : '#2F2C34',
        },
        admin: {
          background: {
            light : '#2F2C34',
          }
        }
      }
    },
  },
  plugins: [],
};

