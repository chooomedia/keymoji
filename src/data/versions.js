export const versions = {
    '0.5.0': {
        date: 'August 2025',
        core: {
            debug: {
                title: 'Debug System Overhaul',
                improvements: [
                    'Fixed Debug Buttons: Top-right positioning, Header-style, 64px square dimensions',
                    'Clear All Storage: Direct access next to Debug button for immediate functionality',
                    'Comprehensive Debug Panel: Modals, Stores, Debug Tools with tab navigation',
                    'EraseButton Integration: Clear & Reload directly in Debug panel',
                    'UX/UI Best Practices: Consistent colors, hover effects, smooth animations'
                ]
            },
            layout: {
                title: 'Layout & Navigation',
                improvements: [
                    'FixedMenu Buttons: Unified 64px × 64px dimensions across all platforms',
                    'Desktop Donation Button: Text display, mobile icon-only in FixedMenu',
                    'Scrollbar Optimization: Eliminated layout shifts, overflow-x-hidden implementation',
                    'Mobile Responsiveness: Prevented horizontal scrollbars on mobile devices',
                    'Header-Style Consistency: All buttons use identical color schemes'
                ]
            },
            errorHandling: {
                title: 'Error Handling & Warnings',
                improvements: [
                    'Webpack Warnings Fixed: devError → devWarn, currentVersion → const',
                    'Manifest.json Cleanup: Removed invalid URL properties',
                    'Meta Tag Updates: Added mobile-web-app-capable meta tag',
                    'Service Worker Robustness: Eliminated uncaught promises',
                    'Graceful Degradation: Proper error responses instead of exceptions'
                ]
            }
        },
        technical: {
            scrollbar: {
                title: 'Scrollbar & Layout Fixes',
                improvements: [
                    'White Stripe Elimination: Systematic overflow-x-hidden application',
                    'Mobile Overflow Prevention: No horizontal scrollbars on mobile',
                    'EmojiDisplay Protection: overflow: visible for all devices',
                    'Layout Shift Prevention: Elegant scrollbar solution with Tailwind'
                ]
            },
            environment: {
                title: 'Environment & Debug Tools',
                improvements: [
                    'Centralized Environment Utils: isDebugMode(), isDevelopment()',
                    'Debug Panel Enhancement: Tab navigation, store tests, modal tests',
                    'Storage Management: Clear All Storage + Clear & Reload',
                    'App State Logging: Comprehensive debug information'
                ]
            }
        },
        features: {
            navigation: {
                title: 'Navigation & Routing',
                improvements: [
                    'Back Button Consistency: All pages use navigateToHome()',
                    'Mobile Menu Optimization: Compact button arrangement',
                    'Visual Hierarchy: Debug buttons above panel, no overlaps',
                    'Smooth Transitions: Slide animations for debug panel'
                ]
            }
        },
        lessons: {
            git: {
                title: 'CRITICAL LESSON LEARNED',
                improvements: [
                    '12 hours of work lost: Due to ignorance towards GitHub/Git',
                    'Best Practice: Always commit before major changes',
                    'Solution: Now systematic version updates with all changes',
                    'Learning: Git is not optional - it is ESSENTIAL for development',
                    'Silver Lining: Now we have a robust debug system!'
                ]
            }
        }
    },
    '0.4.9': {
        date: 'July 2025',
        core: {
            refactoring: {
                title: 'Code Refactoring & Optimization',
                improvements: [
                    'Centralized environment utilities: Consolidated debug functions',
                    'Service worker error handling: Proper error responses instead of throws',
                    'Component structure optimization: Removed unused imports and variables',
                    'CSS class consolidation: Eliminated duplicate scrollbar styling',
                    'Performance improvements: Reduced bundle size and improved load times'
                ]
            },
            seo: {
                title: 'SEO & Meta Tag Enhancements',
                improvements: [
                    'Dynamic title generation: Language-specific page titles',
                    'Meta tag optimization: Enhanced social sharing capabilities',
                    'Structured data improvements: Better search engine indexing',
                    'Canonical URL handling: Proper language-specific URLs',
                    'Open Graph enhancements: Improved social media previews'
                ]
            }
        },
        technical: {
            build: {
                title: 'Build System & Warnings',
                improvements: [
                    'Webpack warning resolution: Fixed all compilation warnings',
                    'Manifest.json validation: Removed invalid PWA properties',
                    'Meta tag standardization: Added mobile-web-app-capable',
                    'Service worker robustness: Eliminated uncaught promise errors',
                    'Development environment cleanup: Streamlined debug utilities'
                ]
            }
        }
    },
    '0.4.8': {
        date: 'June 2025',
        core: {
            scrollbar: {
                title: 'Scrollbar System Overhaul',
                improvements: [
                    'White stripe elimination: Systematic overflow-x-hidden implementation',
                    'Mobile overflow prevention: No horizontal scrollbars on mobile',
                    'Layout shift prevention: Elegant scrollbar solution with Tailwind',
                    'EmojiDisplay protection: overflow: visible for all devices',
                    'Cross-device compatibility: Consistent behavior across platforms'
                ]
            },
            layout: {
                title: 'Layout & Component Structure',
                improvements: [
                    'FixedMenu button standardization: Unified 64px × 64px dimensions',
                    'Header-style consistency: All buttons use identical styling',
                    'Debug button positioning: Top-right fixed with proper z-index',
                    'Mobile menu optimization: Compact button arrangement',
                    'Visual hierarchy improvements: Better component organization'
                ]
            }
        },
        technical: {
            css: {
                title: 'CSS & Styling Optimization',
                improvements: [
                    'Tailwind utility consolidation: Eliminated duplicate classes',
                    'Dark mode consistency: Unified color scheme across components',
                    'Responsive design improvements: Better mobile experience',
                    'Animation optimization: Smooth transitions and hover effects',
                    'Layout shift elimination: Proper overflow handling'
                ]
            }
        }
    },
    '0.4.7': {
        date: 'May 2025',
        core: {
            debug: {
                title: 'Debug System Implementation',
                improvements: [
                    'Debug panel creation: Comprehensive tab navigation system',
                    'Storage management tools: Clear All Storage + Clear & Reload',
                    'Environment utilities: Centralized debug and development functions',
                    'Modal testing framework: Complete modal system testing',
                    'Store state debugging: Real-time store state monitoring'
                ]
            },
            navigation: {
                title: 'Navigation & Routing Improvements',
                improvements: [
                    'Back button consistency: All pages use navigateToHome()',
                    'Language router optimization: Improved route handling',
                    'URL synchronization: Proper language-specific URL management',
                    'Navigation state management: Better route state handling',
                    'Mobile navigation enhancement: Improved mobile menu experience'
                ]
            }
        },
        technical: {
            environment: {
                title: 'Environment & Development Tools',
                improvements: [
                    'isDebugMode() implementation: Centralized debug detection',
                    'isDevelopment() utility: Environment-specific functionality',
                    'Debug logging system: Comprehensive error and warning logging',
                    'Development utilities: Streamlined development workflow',
                    'Environment configuration: Better development/production handling'
                ]
            }
        }
    },
    '0.4.6': {
        date: 'April 2025',
        core: {
            errorHandling: {
                title: 'Error Handling & Warnings',
                improvements: [
                    'Webpack warning resolution: Fixed devError import issues',
                    'Service worker robustness: Eliminated uncaught promise errors',
                    'Manifest.json cleanup: Removed invalid URL properties',
                    'Meta tag standardization: Added mobile-web-app-capable',
                    'Build system optimization: Clean compilation without warnings'
                ]
            },
            seo: {
                title: 'SEO & Meta Tag Updates',
                improvements: [
                    'Dynamic title generation: Language-specific page titles',
                    'Meta tag optimization: Enhanced social sharing capabilities',
                    'Structured data improvements: Better search engine indexing',
                    'Canonical URL handling: Proper language-specific URLs',
                    'Open Graph enhancements: Improved social media previews'
                ]
            }
        },
        technical: {
            build: {
                title: 'Build System & Performance',
                improvements: [
                    'Webpack optimization: Reduced bundle size and improved load times',
                    'Service worker error handling: Proper error responses',
                    'Development environment cleanup: Streamlined debug utilities',
                    'CSS optimization: Eliminated duplicate styles and classes',
                    'Performance monitoring: Better error tracking and logging'
                ]
            }
        }
    },
    '0.4.5': {
        date: 'April 2025',
        core: {
            layout: {
                title: 'Layout & Component Structure',
                improvements: [
                    'FixedMenu button standardization: Unified 64px × 64px dimensions',
                    'Header-style consistency: All buttons use identical styling',
                    'Debug button positioning: Top-right fixed with proper z-index',
                    'Mobile menu optimization: Compact button arrangement',
                    'Visual hierarchy improvements: Better component organization'
                ]
            },
            scrollbar: {
                title: 'Scrollbar System Implementation',
                improvements: [
                    'White stripe elimination: Systematic overflow-x-hidden application',
                    'Mobile overflow prevention: No horizontal scrollbars on mobile',
                    'Layout shift prevention: Elegant scrollbar solution with Tailwind',
                    'EmojiDisplay protection: overflow: visible for all devices',
                    'Cross-device compatibility: Consistent behavior across platforms'
                ]
            }
        },
        technical: {
            css: {
                title: 'CSS & Styling Optimization',
                improvements: [
                    'Tailwind utility consolidation: Eliminated duplicate classes',
                    'Dark mode consistency: Unified color scheme across components',
                    'Responsive design improvements: Better mobile experience',
                    'Animation optimization: Smooth transitions and hover effects',
                    'Layout shift elimination: Proper overflow handling'
                ]
            }
        }
    },
    '0.4.4': {
        date: 'March 2025',
        core: {
            debug: {
                title: 'Debug System Foundation',
                improvements: [
                    'Debug panel architecture: Tab navigation system design',
                    'Storage management implementation: Clear All Storage functionality',
                    'Environment utilities: Centralized debug and development functions',
                    'Modal testing framework: Complete modal system testing',
                    'Store state debugging: Real-time store state monitoring'
                ]
            },
            navigation: {
                title: 'Navigation & Routing Foundation',
                improvements: [
                    'Back button consistency: All pages use navigateToHome()',
                    'Language router optimization: Improved route handling',
                    'URL synchronization: Proper language-specific URL management',
                    'Navigation state management: Better route state handling',
                    'Mobile navigation enhancement: Improved mobile menu experience'
                ]
            }
        },
        technical: {
            environment: {
                title: 'Environment & Development Foundation',
                improvements: [
                    'isDebugMode() implementation: Centralized debug detection',
                    'isDevelopment() utility: Environment-specific functionality',
                    'Debug logging system: Comprehensive error and warning logging',
                    'Development utilities: Streamlined development workflow',
                    'Environment configuration: Better development/production handling'
                ]
            }
        }
    },
    '0.4.3': {
        date: 'February 2025',
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
        date: 'January 2025',
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
        date: 'December 2024',
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
