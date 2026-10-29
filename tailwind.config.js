import tokens from './src/styles/tokens.json';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tzm: {
          green: tokens.color.primary.default,
          'green-dark': tokens.color.primary.dark,
          'green-light': tokens.color.primary.light,
          lime: tokens.color.secondary.default,
          'lime-dark': tokens.color.secondary.hover,
          blue: tokens.color.accent.blue,
          'blue-dark': tokens.color.accent['blue-hover'],
          red: tokens.color.danger.default,
          'red-dark': tokens.color.danger.hover,
          bg: tokens.color.surface.bg,
          card: tokens.color.surface.card,
          muted: tokens.color.surface.muted,
          border: tokens.color.surface.border,
          'text-primary': tokens.color.text.primary,
          'text-muted': tokens.color.text.muted,
          'text-light': tokens.color.text.light,
        }
      },
      fontFamily: {
        rubik: ['Rubik', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: tokens.shadows.card,
        'card-hover': tokens.shadows['card-hover'],
        drawer: tokens.shadows.drawer,
        modal: tokens.shadows.modal,
      },
      borderRadius: {
        sm: tokens.radii.sm,
        md: tokens.radii.md,
        lg: tokens.radii.lg,
        xl: tokens.radii.xl,
      }
    },
  },
  plugins: [],
};
