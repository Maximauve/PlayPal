
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
        background: {
          dark: '#2C2830',
          light: '#F0F0F0',
        },
        text: {
          light: '#FFFFFF',
          dark: '#2C2830',
        },
        button: {
          active: '#FFFFFF',
          hover: '#FFFFFF',
          default: '#2F2C34',
        },
        admin: {
          background: {
            light: '#2F2C34',
          }
        }
      },
      boxShadow: {
        admin: "4px -4px 10px 0px rgba(187, 187, 187, 0.25), -4px 4px 10px 0px rgba(0, 0, 0, 0.25)"
      }
    },
  },
  plugins: [],
};

