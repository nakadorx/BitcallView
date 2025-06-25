import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'open-sans-extra-bold': ['Open Sans Extra Bold', 'Open Sans', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif']
      }
    }
  }
}

export default config
