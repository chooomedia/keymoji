export const versions = {
    '0.4.3': {
        date: 'July 2025',
        core: {
            seo: {
                title: 'SEO & Favicon Optimization',
                improvements: [
                    'Complete favicon setup for all platforms',
                    'Added structured data for rich snippets',
                    'Enhanced meta tags for social sharing',
                    'Improved Open Graph implementation',
                    'Added Twitter Card support',
                    'Microsoft Tile configuration',
                    'Safari Pinned Tab support'
                ]
            },
            performance: {
                title: 'Performance Enhancements',
                improvements: [
                    'Added DNS prefetch for external domains',
                    'Preconnect optimization for API calls',
                    'Improved resource loading priorities'
                ]
            }
        },
        technical: {
            favicon: {
                title: 'Favicon Implementation',
                improvements: [
                    'Multi-size favicon.ico support',
                    'Apple Touch Icons (120px, 152px, 180px)',
                    'Android Chrome icons (192px, 512px)',
                    'Microsoft Tile images',
                    'Safari mask icon preparation'
                ]
            }
        }
    },
    '0.4.2': {
        date: 'May 2025',
        core: {
            email: {
                title: 'Email Integration',
                improvements: [
                    'Enhanced contact form email system',
                    'Added dark/light mode support for emails',
                    'Improved newsletter subscription flow',
                    'Multi-language email templates'
                ]
            },
            backend: {
                title: 'Backend Integration',
                improvements: [
                    'Optimized Vercel serverless functions',
                    'Streamlined API communications',
                    'Enhanced error handling and validation',
                    'Improved form submission process'
                ]
            }
        },
        technical: {
            security: {
                title: 'Security Enhancements',
                improvements: [
                    'Better honeypot implementation',
                    'Email sanitization improvements',
                    'Robust input validation'
                ]
            }
        },
        features: {
            feedback: {
                title: 'User Feedback',
                improvements: [
                    'Clearer form response messaging',
                    'Improved error modal integration',
                    'Context-specific error handling'
                ]
            }
        }
    },
    '0.4.0': {
        date: 'April 2025',
        core: {
            optimization: {
                title: 'Optimization & Refactoring',
                improvements: [
                    'Centralized language configuration',
                    'Fixed routing and display issues',
                    'Standardized component styling',
                    'Improved ContactForm integration'
                ]
            },
            structure: {
                title: 'Project Structure',
                improvements: [
                    'Single source of truth for configuration',
                    'Consistent component layouts',
                    'Tailwind utility classes optimization',
                    'Centralized version management'
                ]
            }
        },
        technical: {
            accessibility: {
                title: 'Accessibility Improvements',
                improvements: [
                    'Consistent focus management',
                    'Enhanced keyboard navigation',
                    'Better screen reader support'
                ]
            }
        }
    },
    '0.3.0': {
        date: 'November 2024',
        core: {
            performance: {
                title: 'Performance Optimization',
                improvements: [
                    'Streamlined import structure',
                    'Improved initial load times',
                    'Enhanced state management'
                ]
            },
            accessibility: {
                title: 'Accessibility',
                improvements: ['Added comprehensive ARIA support']
            },
            errorHandling: {
                title: 'Error Handling',
                improvements: ['Enhanced clipboard operations']
            }
        },
        features: {
            storyMode: {
                title: 'Story Mode',
                improvements: ['Prepared foundation for upcoming release']
            },
            ui: {
                title: 'UI/UX',
                improvements: [
                    'Improved visual feedback',
                    'Enhanced user messaging'
                ]
            }
        }
    },
    '0.2.0': {
        date: 'October 2024',
        core: {
            languages: {
                title: 'Multi-language Support',
                improvements: [
                    'Added 15+ language options',
                    'Implemented language switching system',
                    'Added localized content'
                ]
            },
            darkMode: {
                title: 'Dark Mode',
                improvements: [
                    'Introduced system-wide dark theme',
                    'Added theme toggle',
                    'Improved color contrast'
                ]
            }
        },
        technical: {
            pwa: {
                title: 'PWA Support',
                improvements: [
                    'Added service worker',
                    'Implemented offline functionality',
                    'Added "Add to Home Screen" capability'
                ]
            }
        }
    },
    '0.1.1': {
        date: 'September 2024',
        features: {
            emojiGeneration: {
                title: 'Emoji Generation',
                improvements: [
                    'Improved randomization algorithm',
                    'Added emoji diversity',
                    'Enhanced generation speed'
                ]
            },
            interface: {
                title: 'User Interface',
                improvements: [
                    'Added copy to clipboard functionality',
                    'Improved mobile responsiveness',
                    'Enhanced button feedback'
                ]
            }
        }
    },
    '0.1.0': {
        date: 'August 2024',
        core: {
            initial: {
                title: 'Initial Release',
                improvements: [
                    'Basic emoji password generation',
                    'Simple copy functionality',
                    'Basic mobile support',
                    'Initial UI implementation'
                ]
            }
        }
    }
};
