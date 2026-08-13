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
          50: 'var(--stone-50)',
          100: 'var(--stone-100)',
          200: 'var(--stone-200)',
          300: 'var(--stone-300)',
          400: 'var(--stone-400)',
          500: 'var(--stone-500)',
          600: 'var(--stone-600)',
          700: 'var(--stone-700)',
          800: 'var(--stone-800)',
          900: 'var(--stone-900)',
        },
        // Deep teal-green — the primary accent, now a full CSS-var-backed scale.
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
        },
        // Warm clay/terracotta — secondary accent, used sparingly and
        // deliberately (see design notes in styles.css) rather than for every
        // interactive element.
        clay: {
          50: 'var(--clay-50)',
          100: 'var(--clay-100)',
          200: 'var(--clay-200)',
          300: 'var(--clay-300)',
          400: 'var(--clay-400)',
          500: 'var(--clay-500)',
          600: 'var(--clay-600)',
          700: 'var(--clay-700)',
          800: 'var(--clay-800)',
          900: 'var(--clay-900)',
        },
        // Card/panel surface — distinct from the page background (stone-50)
        // so cards visibly lift off the page in both themes.
        surface: 'var(--surface)',
        // Semantic status colors for membership/credential state.
        status: {
          pending: 'var(--status-pending)',
          'pending-bg': 'var(--status-pending-bg)',
          approved: 'var(--status-approved)',
          'approved-bg': 'var(--status-approved-bg)',
          denied: 'var(--status-denied)',
          'denied-bg': 'var(--status-denied-bg)',
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
