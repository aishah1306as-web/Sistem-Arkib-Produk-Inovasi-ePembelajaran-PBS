/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#3977B9',
          600: '#245B8F',
          700: '#1B4770',
          800: '#163A5F', // Primary Navy
          900: '#0E243A',
          950: '#081624',
        },
        primary: {
          DEFAULT: '#163A5F',
          dark: '#0E243A',
          light: '#245B8F',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          muted: '#F1F5F9',
        },
        appbg: '#F5F7FA',
        accent: '#3977B9',
        success: {
          DEFAULT: '#21865B',
          light: '#E6F4EA',
          border: '#A3D9B8',
        },
        warning: {
          DEFAULT: '#B7791F',
          light: '#FEF3C7',
          border: '#FCD34D',
        },
        danger: {
          DEFAULT: '#C53030',
          light: '#FEE2E2',
          border: '#FCA5A5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
