import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    fontFamily: {
      'hero': ['Hero']
    },
    colors: {
      'ochre': '#D37715',
      'amber': '#FFA019',
      'white': '#FFFFFF',
      'black': '#000000',
      'coolgraylight': '#3E404A',
      'coolgraymid': '#272A37',
      'coolgraydark': '#22242E',
      'lightoutline': '#D4D6DD',
      'lightbg': '#E9EAEE',
      'lightaccentbg': '#F2F3F7',
      'burgundy': '#C70039',
      'viridian': '#1f885f',
      'violet': '#4f1f88'
    }
  },
  plugins: [],
}
export default config
