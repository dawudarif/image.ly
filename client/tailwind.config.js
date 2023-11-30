/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        xs: { max: "540px" },
        sm: { min: "541px", max: "767px" },
        md: { min: "768px", max: "1220px" },
        lg: { min: "1221px", max: "1279px" },
      },
    },
  },
  plugins: [],
};
