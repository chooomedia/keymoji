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
        'blue': '#fefefa',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#f4ab25',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
        'aubergine': '#253852',
        'aubergine-80': '#253852d0',
        'aubergine-dark': '#0e1e30',
        'creme': '#f5f5f5',
        'creme-80': '#f5f5f5de',
        'powder': '#fefefa',
        'light': '#e0e0e0',
        'white': '#ffffff',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      extend: {
        scale: {
          '117': '1.17',
        },
        spacing: {
          '26r': '26rem',
          '8xl': '96rem',
          '9xl': '128rem',
          '42': '42px',
          '52': '52px',
          '71': '71px',
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