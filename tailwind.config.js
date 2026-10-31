/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        landing: {
          bg: '#F5F0E5',
          paper: '#FFFEFA',
          border: '#E7E0D5',
          text: '#222723',
          muted: '#636D65',
        },
        dark: {
          bg: '#111713',
          surface: '#1C251F',
          elevated: '#253129',
          border: '#303B33',
          text: '#F7F5EF',
          muted: '#A6B2A8',
        },
        brand: {
          emerald: '#38C98A',
          'emerald-hover': '#2FB278',
          'emerald-subtle': 'rgba(56, 201, 138, 0.12)',
          mint: '#B8E6CB',
          cream: '#F5F0E5',
          yellow: '#F3D66B',
          coral: '#F17E69',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        handwritten: ['"Caveat"', 'cursive'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'scrapbook': '2px 4px 14px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
        'scrapbook-deep': '6px 12px 30px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
        'sticky': '3px 6px 16px rgba(40, 30, 10, 0.15)',
        'glow-emerald': '0 0 24px rgba(56, 201, 138, 0.25)',
      },
    },
  },
  plugins: [],
}

