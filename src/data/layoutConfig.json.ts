/**
 * Layout Configuration
 * 
 * Definiert die UI-Elemente für Header, Footer und Layout-Komponenten
 * Diese Konfiguration wird von den Layout-Komponenten verwendet
 */

export interface LayoutElement {
    component: string;
    props?: Record<string, unknown>;
    slots?: Record<string, unknown>;
    visible?: boolean;
}

export interface LayoutConfig {
    header: LayoutElement;
    footer: LayoutElement;
    fixedMenu?: LayoutElement;
    modals?: LayoutElement[];
}

export interface RouteLayoutConfig {
    [routeSlug: string]: LayoutConfig;
}

/**
 * Standard-Layout-Konfiguration für alle Routes
 */
export const defaultLayoutConfig: LayoutConfig = {
    header: {
        component: 'Header',
        props: {},
        visible: true
    },
    footer: {
        component: 'FooterInfo',
        props: {},
        visible: true
    },
    fixedMenu: {
        component: 'FixedMenu',
        props: {
            align: 'bottom'
        },
        visible: true
    },
    modals: [
        {
            component: 'Modal',
            props: {},
            visible: true
        },
        {
            component: 'ModalDebug',
            props: {},
            visible: true
        }
    ]
};

/**
 * Route-spezifische Layout-Konfigurationen
 * Überschreibt Standard-Konfiguration für bestimmte Routes
 */
export const routeLayoutConfigs: RouteLayoutConfig = {
    // Index/Home Route
    index: {
        ...defaultLayoutConfig,
        footer: {
            component: 'FooterInfo',
            props: {},
            visible: true
        }
    },
    
    // Contact Form Route
    contact: {
        ...defaultLayoutConfig,
        footer: {
            component: 'FooterInfo',
            props: {},
            visible: true
        }
    },
    
    // Account Manager Route
    account: {
        ...defaultLayoutConfig,
        footer: {
            component: 'FooterInfo',
            props: {},
            visible: true
        }
    },
    
    // Static Pages (Privacy, Legal, etc.)
    static: {
        ...defaultLayoutConfig,
        footer: {
            component: 'FooterInfo',
            props: {},
            visible: true
        }
    },
    
    // Version History Route
    versions: {
        ...defaultLayoutConfig,
        footer: {
            component: 'FooterInfo',
            props: {},
            visible: true
        }
    },
    
    // Blog Routes
    blog: {
        ...defaultLayoutConfig,
        footer: {
            component: 'FooterInfo',
            props: {},
            visible: true
        }
    },
    
    // 404 Not Found Route
    notFound: {
        ...defaultLayoutConfig,
        footer: {
            component: 'FooterInfo',
            props: {},
            visible: true
        }
    }
};

/**
 * Holt die Layout-Konfiguration für eine Route
 * @param routeSlug - Der Route-Slug (z.B. 'index', 'contact', 'account')
 * @returns Layout-Konfiguration für die Route
 */
export function getLayoutConfig(routeSlug: string): LayoutConfig {
    return routeLayoutConfigs[routeSlug] || defaultLayoutConfig;
}

