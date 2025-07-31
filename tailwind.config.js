/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte}', './public/index.html'],
    darkMode: 'class',
    theme: {
        screens: {
            sm: '380px',
            md: '768px',
            lg: '976px',
            xl: '1440px'
        },
        fontFamily: {
            sans: ['Graphik', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
            elvish: ['tengwar_annatar', 'serif'] // für Elbisch/sjn
        },
        extend: {
            colors: {
                // Standard Tailwind colors
                blue: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554'
                },
                purple: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7c3aed',
                    800: '#6b21a8',
                    900: '#581c87',
                    950: '#3b0764'
                },
                pink: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ec4899',
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9d174d',
                    900: '#831843',
                    950: '#500724'
                },
                orange: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407'
                },
                yellow: {
                    50: '#fefce8',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                    950: '#422006'
                },
                green: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16'
                },
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712'
                },
                'gray-dark': '#273444',
                'gray-light': '#d3dce6',

                // Original Keymoji Brand Colors (restored)
                aubergine: {
                    50: '#f8f9fa',
                    100: '#e9ecef',
                    200: '#dee2e6',
                    300: '#ced4da',
                    400: '#adb5bd',
                    500: '#6c757d',
                    600: '#495057',
                    700: '#343a40',
                    800: '#253852', // Original aubergine
                    900: '#0e1e30', // Original aubergine-900
                    950: '#0a141f'
                },
                'aubergine-80': '#253852d0',
                'aubergine-50': '#25385282',

                creme: {
                    50: '#fefefe',
                    100: '#fdfdfd',
                    200: '#fbfbfb',
                    300: '#f8f8f8',
                    400: '#f6f6f6',
                    500: '#f5f5f5', // Original creme
                    600: '#f0f0f0',
                    700: '#e8e8e8',
                    800: '#d9d9d9',
                    900: '#c4c4c4',
                    950: '#8a8a8a'
                },
                'creme-80': '#f5f5f5de',
                'creme-50': '#f5f5f57d',

                powder: {
                    50: '#fefefe',
                    100: '#fefefe',
                    200: '#fefefe',
                    300: '#fefefe',
                    400: '#fefefa', // Original powder
                    500: '#fefefa',
                    600: '#f5f5f0',
                    700: '#e8e8e3',
                    800: '#d9d9d4',
                    900: '#c4c4bf',
                    950: '#8a8a85'
                },

                light: {
                    50: '#fefefe',
                    100: '#fefefe',
                    200: '#fafafa',
                    300: '#f0f0f0',
                    400: '#e0e0e0', // Original light
                    500: '#d0d0d0',
                    600: '#c0c0c0',
                    700: '#a0a0a0',
                    800: '#808080',
                    900: '#606060',
                    950: '#404040'
                }
            },
            scale: {
                114: '1.14',
                117: '1.17'
            },
            spacing: {
                '26r': '26rem',
                '8xl': '96rem',
                '9xl': '128rem',
                42: '42px',
                52: '52px',
                71: '71px'
            },
            borderRadius: {
                '4xl': '2rem'
            },
            inset: {
                m41: '-41px',
                m3: '-3px'
            },
            // Enhanced animations für Apple/Airbnb Style
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-gentle': 'bounceGentle 0.6s ease-in-out'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                bounceGentle: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' }
                }
            }
        }
    },
    plugins: [require('tailwindcss'), require('autoprefixer')],
    future: {
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true
    }
};
