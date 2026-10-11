/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jvb-pink': {
          50: '#fdf2f7',
          100: '#fce7f0',
          200: '#fbcfe2',
          300: '#f472b0',
          400: '#e11d74',
          500: '#cb1662', // Rich Fuchsia / Rani Pink
          600: '#b50e54',
          700: '#960b45',
          800: '#7d0d3b',
          900: '#680e34',
        },
        'jvb-wine': {
          50: '#fbf3f5',
          100: '#f6e4e8',
          200: '#edccd4',
          500: '#6b1426',
          600: '#58101e', // Deep Burgundy / Wine
          700: '#480b17',
          800: '#390711',
          900: '#2c050c',
        },
        'jvb-ivory': '#fdfbf7',
        'jvb-beige': '#f8f4ee',
        'jvb-sand': '#f0e8dc',
        'jvb-charcoal': '#1a1d20',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(181, 14, 84, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 25px -5px rgba(88, 16, 30, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
