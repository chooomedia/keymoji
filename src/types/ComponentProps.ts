/**
 * Component Props Types - Zentrale Props-Definitionen
 * Modulare Basis für wiederverwendbare Props-Patterns
 * Svelte 5 Best Practice: TypeScript Interfaces für Props
 */

// ============================================
// Common UI Props (Basis für alle UI-Komponenten)
// ============================================

/**
 * Basis-Props die fast alle UI-Komponenten haben
 */
export interface BaseUIProps {
    /** Unique identifier for the element */
    id?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Accessibility label */
    'aria-label'?: string;
    /** Tooltip text */
    title?: string;
    /** CSS class names */
    class?: string;
}

/**
 * Variant Props - für Komponenten mit Varianten
 */
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'fixed' | 'yellow';
export type BadgeVariant = 'info' | 'warning' | 'success' | 'error' | 'standard';
export type CheckboxVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type ToggleColor = 'yellow' | 'green' | 'blue' | 'purple' | 'red' | 'pink' | 'indigo' | 'teal' | 'orange' | 'emerald' | 'cyan' | 'lime' | 'amber' | 'rose' | 'violet' | 'sky' | 'slate';

/**
 * Size Props - für Komponenten mit Größen
 */
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ButtonSize = 'sm' | 'md' | 'menu' | 'lg';

/**
 * Position Props - für Tooltips, Badges, etc.
 */
export type Position = 'top' | 'bottom' | 'left' | 'right' | 'auto';

// ============================================
// Button Props
// ============================================

export interface ButtonProps extends BaseUIProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: 'button' | 'submit' | 'reset';
    href?: string | null;
    fullWidth?: boolean;
    tooltip?: string;
    tooltipPosition?: Position;
    ariaLabel?: string;
    emojiOnly?: boolean;
    onclick?: (event: MouseEvent) => void;
}

// ============================================
// Input Props
// ============================================

export interface InputProps extends BaseUIProps {
    type?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    required?: boolean;
    invalid?: boolean;
    valid?: boolean;
    autocomplete?: string;
}

// ============================================
// Checkbox Props
// ============================================

export interface CheckboxProps extends BaseUIProps {
    checked?: boolean;
    name?: string;
    label?: string;
    labelHtml?: string;
    labelClass?: string;
    size?: ComponentSize;
    variant?: CheckboxVariant;
}

// ============================================
// Toggle Props
// ============================================

export interface ToggleProps extends BaseUIProps {
    checked?: boolean;
    color?: ToggleColor;
}

// ============================================
// Tooltip Props
// ============================================

export interface TooltipProps {
    text?: string;
    position?: Position;
    delay?: number;
    disabled?: boolean;
}

// ============================================
// ContextBadge Props
// ============================================

export interface ContextBadgeProps extends BaseUIProps {
    text?: string;
    position?: Position;
    variant?: BadgeVariant;
    size?: ComponentSize;
    width?: string | null;
    trigger?: 'hover' | 'click' | 'both';
    intro?: boolean;
    introDelay?: number;
    introDuration?: number;
    alwaysVisible?: boolean;
    tier?: 'free' | 'pro' | null;
    accountAgeLabel?: string;
    translations?: Record<string, string> | null;
}

// ============================================
// Form Props
// ============================================

export interface FormProps {
    onSubmit?: (event: Event) => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    isValid?: boolean;
}

// ============================================
// Layout Props
// ============================================

export interface LayoutProps {
    pageTitle?: string;
    pageDescription?: string;
    routeSlug?: string;
    class?: string;
}

// ============================================
// SEO Props
// ============================================

export interface SEOProps {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    type?: string;
    noindex?: boolean;
    keywords?: string;
    canonical?: string;
    pageType?: string;
}

// ============================================
// Route Props
// ============================================

export interface RouteProps {
    path?: string;
    component?: any;
    exact?: boolean;
}

// ============================================
// Navigation Props
// ============================================

export interface NavigationProps {
    to?: string;
    replace?: boolean;
    class?: string;
}

// ============================================
// Chart Props
// ============================================

export interface ChartProps {
    data?: unknown[];
    height?: number;
    label?: string;
    [key: string]: unknown;
}

// ============================================
// Modal Props
// ============================================

export interface ModalProps {
    isVisible?: boolean;
    onClose?: () => void;
    [key: string]: unknown;
}

// ============================================
// Pagination Props
// ============================================

export interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    isLoading?: boolean;
    onPageChange?: (page: number) => void;
}

// ============================================
// Settings Props
// ============================================

export interface SettingsItemProps {
    id: string;
    type: 'toggle' | 'select' | 'range' | 'button';
    icon?: string;
    title?: Record<string, string>;
    description?: Record<string, string>;
    defaultValue?: unknown;
    currentValue?: unknown;
    onValueChange?: (value: unknown) => void;
    onAction?: (action: string) => void;
    [key: string]: unknown;
}

// ============================================
// Account Props
// ============================================

export interface AccountFormProps {
    email?: string;
    name?: string;
    showProfileForm?: boolean;
    isSubmitting?: boolean;
    isEmailValid?: boolean;
    isNameValid?: boolean;
    isFormValid?: boolean;
    loginButtonText?: string;
    magicLinkButtonText?: string;
    intelligentButtonText?: string;
    onToggleProfileForm?: () => void;
    onSubmit?: (event: Event) => void;
    onShowExpandedView?: () => void;
    showExpandedViewToggle?: boolean;
    anonymizeEmail?: (email: string) => string;
}

// ============================================
// Blog Props
// ============================================

export interface BlogPostProps {
    slug?: string;
    [key: string]: unknown;
}

// ============================================
// Feature Card Props
// ============================================

export interface FeatureCardProps {
    icon?: string;
    title?: string;
    description?: string;
    onClick?: (event: MouseEvent | KeyboardEvent) => void;
    variant?: 'default' | 'highlighted';
    [key: string]: unknown;
}


