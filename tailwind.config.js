/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grey: "#f2f7f6",
        disabled: "#eaedec",
      },
    },
  },
  plugins: [require("@tailwindcss/forms", "flowbite/plugin")],
};
