/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep teal-green — the accent color the POC already had, formalized into a full scale.
        brand: {
          50: '#eef4f2',
          100: '#d7e6e2',
          200: '#b0cdc5',
          300: '#84b0a4',
          400: '#598f80',
          500: '#3c6d61',
          600: '#2d4f4a',
          700: '#25403c',
          800: '#1e3330',
          900: '#152624',
        },
        // Semantic status colors for membership state.
        status: {
          pending: '#b7791f',
          'pending-bg': '#fbf3e2',
          approved: '#2f7d4f',
          'approved-bg': '#e8f5ec',
          denied: '#b3261e',
          'denied-bg': '#fbeae9',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
