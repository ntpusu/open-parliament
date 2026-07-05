module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F2D4B',
          50: '#E8F0F5',
          100: '#D1E1EB',
          200: '#A3C3D7',
          300: '#75A5C3',
          400: '#4787AF',
          500: '#0F2D4B',
          600: '#0C243C',
          700: '#091B2D',
          800: '#06121E',
          900: '#03090F',
        },
      },
    },
  },
  plugins: [],
};
