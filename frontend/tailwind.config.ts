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
        'open-sans-semibold': ['Open Sans SemiBold', 'Open Sans', 'sans-serif'],
        'open-sans-italic': ['Open Sans Italic', 'Open Sans', 'sans-serif'],
        'open-sans-bold': ['Open Sans Bold', 'Open Sans', 'sans-serif'],
        'open-sans-condensed': ['Open Sans Condensed Bold', 'Open Sans', 'sans-serif'],
        'open-sans-regular': ['Open Sans Regular', 'Open Sans', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        // Coolvetica variants - ready for multiple weights
        coolvetica: ['Coolvetica', 'sans-serif'],
        'coolvetica-regular': ['Coolvetica', 'sans-serif'],
        'coolvetica-semibold': ['Coolvetica', 'sans-serif'],
        'coolvetica-bold': ['Coolvetica', 'sans-serif'],
        'coolvetica-black': ['Coolvetica', 'sans-serif']
      },
      fontWeight: {
        'coolvetica-regular': '400',
        'coolvetica-semibold': '600',
        'coolvetica-bold': '700',
        'coolvetica-black': '900'
      }
    }
  }
}

export default config
