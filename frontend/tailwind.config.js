/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#334155',
          600: '#0f172a', // Slate 900 (Main Brand Black)
          700: '#020617', // Slate 950
          900: '#000000',
        },
        // Keep functional colors but make them distinct
        secondary: {
          500: '#10b981',
          600: '#059669',
        },
        dark: {
          900: '#020617',
          800: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}