/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Every shade below resolves to a CSS custom property (see styles.css)
        // with separate light/dark values, so existing className strings like
        // bg-stone-50 or text-brand-700 automatically repaint for dark mode —
        // no per-component changes needed for the base palette.
        stone: {
          50: 'rgb(var(--stone-50) / <alpha-value>)',
          100: 'rgb(var(--stone-100) / <alpha-value>)',
          200: 'rgb(var(--stone-200) / <alpha-value>)',
          300: 'rgb(var(--stone-300) / <alpha-value>)',
          400: 'rgb(var(--stone-400) / <alpha-value>)',
          500: 'rgb(var(--stone-500) / <alpha-value>)',
          600: 'rgb(var(--stone-600) / <alpha-value>)',
          700: 'rgb(var(--stone-700) / <alpha-value>)',
          800: 'rgb(var(--stone-800) / <alpha-value>)',
          900: 'rgb(var(--stone-900) / <alpha-value>)',
        },
        // Deep teal-green — the primary accent. RGB-channel CSS vars (not hex
        // strings) wrapped in rgb(... / <alpha-value>) so Tailwind's opacity
        // modifiers work (e.g. ring-brand-500/25) even though the underlying
        // value is a theme-swappable custom property.
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
        },
        // Warm clay/terracotta — secondary accent, used sparingly and
        // deliberately (see design notes in styles.css) rather than for every
        // interactive element.
        clay: {
          50: 'rgb(var(--clay-50) / <alpha-value>)',
          100: 'rgb(var(--clay-100) / <alpha-value>)',
          200: 'rgb(var(--clay-200) / <alpha-value>)',
          300: 'rgb(var(--clay-300) / <alpha-value>)',
          400: 'rgb(var(--clay-400) / <alpha-value>)',
          500: 'rgb(var(--clay-500) / <alpha-value>)',
          600: 'rgb(var(--clay-600) / <alpha-value>)',
          700: 'rgb(var(--clay-700) / <alpha-value>)',
          800: 'rgb(var(--clay-800) / <alpha-value>)',
          900: 'rgb(var(--clay-900) / <alpha-value>)',
        },
        // Card/panel surface — distinct from the page background (stone-50)
        // so cards visibly lift off the page in both themes.
        surface: 'rgb(var(--surface) / <alpha-value>)',
        // Semantic status colors for membership/credential state.
        status: {
          pending: 'rgb(var(--status-pending) / <alpha-value>)',
          'pending-bg': 'rgb(var(--status-pending-bg) / <alpha-value>)',
          approved: 'rgb(var(--status-approved) / <alpha-value>)',
          'approved-bg': 'rgb(var(--status-approved-bg) / <alpha-value>)',
          denied: 'rgb(var(--status-denied) / <alpha-value>)',
          'denied-bg': 'rgb(var(--status-denied-bg) / <alpha-value>)',
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
