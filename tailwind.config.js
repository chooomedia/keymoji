/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,ts,svelte}', './public/index.html'],
    darkMode: 'class',
    // JIT Mode ist in Tailwind CSS 3 Standard
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
            maxWidth: {
                105: '26rem'
            },
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
                27: '27rem',
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
            // Gemeinsame Utility Patterns (DRY Principle)
            // Diese Patterns werden häufig verwendet und sollten als Utilities definiert werden
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
                'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
                'button-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
            },
            // Enhanced animations für Apple/Airbnb Style
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
                'scroll-left': 'scrollLeft 30s linear infinite',
                'scroll-left-slow': 'scrollLeft 45s linear infinite',
                'scroll-left-fast': 'scrollLeft 20s linear infinite',
                'scroll-left-ultra-slow': 'scrollLeft 60s linear infinite',
                'scroll-right': 'scrollRight 30s linear infinite',
                'scroll-right-slow': 'scrollRight 45s linear infinite',
                'scroll-right-fast': 'scrollRight 20s linear infinite',
                'scroll-right-ultra-slow': 'scrollRight 60s linear infinite',
                'swiss-shine': 'swissShine 6s ease-in-out infinite',
                'swiss-pulse': 'swissPulse 7s ease-in-out infinite',
                'swiss-pulse-bg': 'swissPulseBg 7s ease-in-out infinite',
                'swiss-pulse-text': 'swissPulseText 7s ease-in-out infinite',
                'yellow-pulse': 'yellowPulse 0.6s ease-in-out',
                'yellow-pulse-bg': 'yellowPulseBg 0.6s ease-in-out',
                'yellow-pulse-text': 'yellowPulseText 0.6s ease-in-out'
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
                },
                scrollLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' }
                },
                scrollRight: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(50%)' }
                },
                swissShine: {
                    '0%, 96%, 100%': {
                        opacity: '0',
                        transform: 'translateX(-150%) skewX(-12deg)'
                    },
                    '1%, 2.5%': {
                        opacity: '1',
                        transform: 'translateX(150%) skewX(-12deg)'
                    }
                },
                swissPulse: {
                    '0%, 85%, 100%': {
                        transform: 'scale(1)'
                    },
                    '90%, 92%': {
                        transform: 'scale(1.12)'
                    }
                },
                swissPulseBg: {
                    '0%, 85%, 100%': {
                        opacity: '0',
                        backgroundColor: 'transparent'
                    },
                    '88%, 90%': {
                        opacity: '0.3',
                        backgroundColor: 'rgb(218, 41, 28)'
                    },
                    '90%, 92%': {
                        opacity: '1',
                        backgroundColor: 'rgb(218, 41, 28)'
                    }
                },
                swissPulseText: {
                    '0%, 85%, 100%': {
                        color: 'rgb(218, 41, 28)'
                    },
                    '90%, 92%': {
                        color: 'rgb(255, 255, 255)'
                    }
                },
                yellowPulse: {
                    '0%': {
                        transform: 'scale(1)'
                    },
                    '50%': {
                        transform: 'scale(1.12)'
                    },
                    '100%': {
                        transform: 'scale(1)'
                    }
                },
                yellowPulseBg: {
                    '0%': {
                        opacity: '0',
                        backgroundColor: 'transparent'
                    },
                    '50%': {
                        opacity: '1',
                        backgroundColor: 'rgb(234, 179, 8)'
                    },
                    '100%': {
                        opacity: '0',
                        backgroundColor: 'transparent'
                    }
                },
                yellowPulseText: {
                    '0%': {
                        color: 'rgb(234, 179, 8)'
                    },
                    '50%': {
                        color: 'rgb(0, 0, 0)'
                    },
                    '100%': {
                        color: 'rgb(234, 179, 8)'
                    }
                }
            }
        }
    },
    plugins: [
        // Custom Plugin für Scrollbar Styles
        function({ addUtilities, theme }) {
            const newUtilities = {
                // Scrollbar Styles (Dark Mode) - direkte CSS-Regeln
                '.scrollbar-thin': {
                    'scrollbar-width': 'thin',
                    'scrollbar-color': `${theme('colors.gray.400')} ${theme('colors.gray.100')}`,
                },
                '.scrollbar-thin-dark': {
                    'scrollbar-width': 'thin',
                    'scrollbar-color': `${theme('colors.gray.600')} ${theme('colors.aubergine.800')}`,
                },
            };
            addUtilities(newUtilities);
        }
    ],
    // PERFORMANCE: Optimierte Safelist - nur wirklich benötigte Klassen
    // WICHTIG: Pattern-Matching für alle Farb-Varianten wurde entfernt (6MB → <100KB)
    // Dynamische Klassen werden jetzt nur bei tatsächlicher Verwendung generiert
    safelist: [
        'dark',
        // Nur häufig verwendete Farb-Kombinationen (nicht alle Varianten!)
        // Diese werden tatsächlich im Code verwendet:
        'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-400', 'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-800', 'bg-yellow-900',
        'text-yellow-500', 'text-yellow-600', 'text-yellow-400', 'text-yellow-50', 'text-yellow-100', 'text-yellow-200', 'text-yellow-800', 'text-yellow-900',
        'bg-purple-100', 'bg-purple-200', 'bg-purple-400', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'bg-purple-900', 'bg-purple-50',
        'text-purple-400', 'text-purple-600', 'text-purple-800', 'text-purple-200',
        'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
        'text-gray-100', 'text-gray-200', 'text-gray-300', 'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
        'bg-aubergine-800', 'bg-aubergine-900', 'bg-aubergine-950',
        'text-aubergine-800', 'text-aubergine-900', 'text-aubergine-950',
        'bg-powder-50', 'bg-powder-200', 'bg-powder-300',
        'text-powder-50',
        'bg-creme-50', 'bg-creme-500',
        'bg-green-50', 'bg-green-400', 'bg-green-600', 'bg-green-800', 'bg-green-900',
        'text-green-200', 'text-green-400', 'text-green-600', 'text-green-800',
        'bg-red-50', 'bg-red-400', 'bg-red-600', 'bg-red-800', 'bg-red-900',
        'text-red-200', 'text-red-400', 'text-red-600', 'text-red-800',
        'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800', 'bg-blue-900',
        'text-blue-200', 'text-blue-400', 'text-blue-600', 'text-blue-800',
        'border-yellow-300', 'border-yellow-400', 'border-yellow-500',
        'border-gray-200', 'border-gray-300', 'border-gray-400', 'border-gray-600', 'border-gray-700',
        'border-purple-700',
        'border-green-200', 'border-green-400', 'border-green-700',
        'border-red-200', 'border-red-400', 'border-red-700',
        'border-blue-200', 'border-blue-400', 'border-blue-700',
        'border-aubergine-800',
        'border-creme-50',
        // Custom Utilities
        'scrollbar-thin',
        'scrollbar-thin-dark',
    ]
};
