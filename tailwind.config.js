/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 90%, 50%)',
        accent: 'hsl(160, 80%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        bg: 'hsl(230, 10%, 95%)',
        text: 'hsl(230, 20%, 20%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 4px 10px hsla(0, 0%, 0%, 0.08)',
      },
    },
  },
  plugins: [],
}