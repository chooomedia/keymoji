/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    darkMode: 'class',
    theme: {
      screens: {
        sm: '380px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      colors: {
        'black': '#000000',
        'blue': '#0275ff',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#ffc82c',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
        'aubergine': '#253852',
        'aubergine-80': '#253852e0',
        'aubergine-dark': '#0e1e30',
        'creme': '#f5f5f5',
        'creme-80': '#f5f5f5cf',
        'light': '#e0e0e0',
        'white': '#ffffff',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      extend: {
        spacing: {
          '23r': '23rem',
          '8xl': '96rem',
          '9xl': '128rem',
          '52': '52px',
        },
        borderRadius: {
          '4xl': '2rem',
        },
        inset: {
          'm41': '-41px', // Ändere die Position nach Bedarf
          'm3': '-3px', // Ändere die Position nach Bedarf
        },
      }
    },
  }