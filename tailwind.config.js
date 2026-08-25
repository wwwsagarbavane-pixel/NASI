/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', '-apple-system', 'sans-serif'],
      },
      colors: {
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          600: '#2F7D4A',
          700: '#226338',
          800: '#195B30',
          900: '#14532D',
          950: '#0F3D21',
        },
        saffron: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#E59A2F',
          700: '#C99A3E',
          800: '#A16207',
          900: '#78350F',
        },
        ivory: {
          50: '#FAF9F5',
          100: '#F7F7F2',
          200: '#EFEFEA',
          300: '#E4E4DC',
        },
        charcoal: {
          600: '#66736A',
          700: '#47554D',
          800: '#2D3A32',
          900: '#17211B',
          950: '#0C120F',
        },
        border: {
          warm: '#DCE3DC',
          input: '#D7DED8',
        }
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'DEFAULT': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'summary': '0 4px 20px -2px rgba(20, 83, 45, 0.06), 0 0 0 1px #DCE3DC',
      },
    },
  },
  plugins: [],
}
