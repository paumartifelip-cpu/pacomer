/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Taken from the Paco Mer artwork: tiled kitchen wall, burgundy sign
        // lettering, terracotta pots and the checked tablecloth.
        meson: {
          50: '#FBEDEC',
          100: '#F5D6D4',
          200: '#E5A9A5',
          300: '#D07C77',
          400: '#B04E49',
          500: '#8B2320', // primary burgundy
          600: '#7B1E1E',
          700: '#5E1512',
          800: '#460F0D',
          900: '#2E0908'
        },
        crema: {
          50: '#FFFBF2',
          100: '#FAF3E3',
          200: '#F2E8D2',
          300: '#E8D9BC',
          400: '#D9C9A8'
        },
        terracota: '#C87137',
        azulejo: '#7A96B8',
        oliva: '#6B7F47'
      },
      fontFamily: {
        display: ['"Baloo 2"', 'cursive'],
        sans: ['Nunito', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
