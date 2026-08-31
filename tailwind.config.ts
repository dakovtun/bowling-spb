import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#201e1d',
        paper: '#f3f2f2',
        paper2: '#eae9e9',
        bg: '#e6e4e4',
        mapbg: '#d7d3d3',
        gridline: '#e3e0e0',
        accent: {
          DEFAULT: '#ec3013',
          dark: '#ae1800',
          soft: '#ffe0d9'
        },
        promo: '#fff2ef',
        muted: '#7d7979',
        muted2: '#605d5d'
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}

export default config
