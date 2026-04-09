# Modular UI Components Architecture

## Overview

This directory contains a modular, performant UI component system designed for maintainability, reusability, and internationalization support. The architecture follows best practices for modern web development with Svelte.

## 🏗️ Architecture

### Core Components

#### `ModularInput.svelte` ⭐ **NEW**

-   **Purpose**: Generic, reusable input component for all input types
-   **Features**:
    -   Supports 10+ input types: text, email, password, number, select, textarea, checkbox, radio, range, toggle
    -   Built-in validation with custom rules and patterns
    -   Internationalization support with localized text objects
    -   Accessibility compliant with proper labels and ARIA attributes
    -   Color psychology-based toggle switches for light mode
    -   Custom slider styling for range inputs
    -   **Iterative Usage**: Can be used in any form or settings context

#### `ModularForm.svelte` ⭐ **NEW**

-   **Purpose**: Dynamic form generator using ModularInput iteratively
-   **Features**:
    -   JSON-based form configuration
    -   Section-based form organization
    -   Real-time validation across all inputs
    -   Internationalization support
    -   Submit/Cancel button configuration
    -   Event dispatching for form lifecycle

#### `SettingsItem.svelte` (Updated)

-   **Purpose**: Wrapper component that uses ModularInput internally
-   **Features**:
    -   Simplified interface for settings-specific use cases
    -   Maintains backward compatibility
    -   Uses ModularInput for all input rendering

#### `SettingsSection.svelte`

-   **Purpose**: Renders collapsible settings sections with accordion behavior
-   **Features**:
    -   Smooth slide transitions with Svelte transitions
    -   Tier-based content (free vs pro features)
    -   Dynamic content loading based on user tier
    -   Reusable for any settings section

#### `ModularUserSettings.svelte`

-   **Purpose**: Main container component that orchestrates the settings system
-   **Features**:
    -   JSON-based configuration loading
    -   Content caching for performance
    -   Tier-based feature availability
    -   Action handling (reset, export, import)
    -   File upload for settings import

### Content Management

#### `userSettings.json` (Moved to `/src/data/`)

-   **Location**: `/src/data/userSettings.json`
-   **Purpose**: Centralized configuration for all settings
-   **Structure**: Comprehensive settings with i18n support

#### `formExamples.json` ⭐ **NEW**

-   **Location**: `/src/data/formExamples.json`
-   **Purpose**: Example form configurations for iterative usage
-   **Structure**: Contact form, settings form with full i18n support

#### `contentLoader.js`

-   **Location**: `/src/utils/contentLoader.js`
-   **Purpose**: Efficient content loading with caching
-   **Features**:
    -   Automatic caching for performance
    -   Error handling and fallbacks
    -   Preloading capabilities
    -   Cache management utilities

## 🚀 Iterative Usage Examples

### Basic ModularInput Usage

```svelte
<script>
  import ModularInput from './components/UI/ModularInput.svelte';

  let email = '';

  function handleEmailChange(value) {
    email = value;
  }
</script>

<ModularInput
  config={{
    id: 'email',
    type: 'email',
    icon: '📧',
    label: { en: 'Email', de: 'E-Mail' },
    placeholder: { en: 'Enter your email', de: 'E-Mail eingeben' },
    required: true,
    validation: { pattern: 'email' }
  }}
  currentLanguage="en"
  currentValue={email}
  onValueChange={handleEmailChange}
/>
```

### Advanced ModularForm Usage

```svelte
<script>
  import ModularForm from './components/UI/ModularForm.svelte';

  let formData = {};

  async function handleSubmit(data) {
    console.log('Form submitted:', data);
    // Send to API
  }
</script>

<ModularForm
  formConfig={[
    {
      section: 'personal',
      sectionIcon: '👤',
      sectionTitle: { en: 'Personal Info', de: 'Persönliche Info' },
      config: {
        id: 'name',
        type: 'text',
        label: { en: 'Name', de: 'Name' },
        required: true,
        validation: { minLength: 2 }
      }
    },
    {
      config: {
        id: 'email',
        type: 'email',
        label: { en: 'Email', de: 'E-Mail' },
        required: true,
        validation: { pattern: 'email' }
      }
    }
  ]}
  currentLanguage="en"
  {formData}
  onSubmit={handleSubmit}
  submitConfig={{
    text: { en: 'Submit', de: 'Absenden' },
    icon: '✅'
  }}
/>
```

### JSON-Based Form Configuration

```json
{
    "contactForm": {
        "title": { "en": "Contact Form", "de": "Kontaktformular" },
        "config": [
            {
                "section": "personal",
                "sectionTitle": {
                    "en": "Personal Info",
                    "de": "Persönliche Info"
                },
                "config": {
                    "id": "name",
                    "type": "text",
                    "label": { "en": "Name", "de": "Name" },
                    "required": true
                }
            }
        ],
        "submitConfig": {
            "text": { "en": "Send", "de": "Senden" },
            "icon": "📤"
        }
    }
}
```

## 🎨 Customization

### Adding New Input Types

1. **Extend ModularInput.svelte**:

    ```svelte
    {:else if config.type === 'newType'}
      <!-- Custom input implementation -->
    {/if}
    ```

2. **Update JSON Schema**:
    ```json
    {
        "type": "newType",
        "customProperty": "value"
    }
    ```

### Adding New Validation Rules

1. **Extend VALIDATION_PATTERNS**:

    ```javascript
    const VALIDATION_PATTERNS = {
        // ... existing patterns
        custom: /your-regex-pattern/
    };
    ```

2. **Add Validation Messages**:
    ```javascript
    const patternMessages = {
        // ... existing messages
        custom: {
            en: 'Custom validation message',
            de: 'Benutzerdefinierte Validierungsnachricht'
        }
    };
    ```

### Adding New Languages

1. **Update Text Objects**:

    ```json
    {
        "label": {
            "en": "English",
            "de": "Deutsch",
            "fr": "Français"
        }
    }
    ```

2. **Pass Language to Component**:
    ```svelte
    <ModularInput currentLanguage="fr" />
    ```

## 🔧 Performance Features

### Content Caching

-   Automatic caching of JSON content
-   Cache invalidation utilities
-   Preloading capabilities

### Lazy Loading

-   Components load only when needed
-   Efficient memory usage
-   Smooth transitions

### Optimized Rendering

-   Reactive updates only when needed
-   Efficient Svelte reactivity
-   Minimal DOM manipulation

## 🌐 Internationalization

### Text Structure

```json
{
    "label": {
        "en": "English Label",
        "de": "Deutscher Label",
        "fr": "Label Français"
    }
}
```

### Language Support

-   Dynamic language switching
-   Fallback to English
-   RTL support ready

## 🎯 Best Practices

### Component Design

-   **Single Responsibility**: Each component has one clear purpose
-   **Props Interface**: Clear prop documentation with JSDoc
-   **Event Handling**: Consistent event dispatching
-   **Accessibility**: ARIA labels and keyboard navigation

### Performance

-   **Caching**: Content caching for faster loads
-   **Lazy Loading**: Load only what's needed
-   **Efficient Updates**: Minimal re-renders
-   **Memory Management**: Proper cleanup

### Maintainability

-   **JSON Configuration**: Easy to modify without code changes
-   **Modular Structure**: Reusable components
-   **Clear Documentation**: Comprehensive JSDoc comments
-   **Type Safety**: Clear prop interfaces

## 🔍 Debugging

### Common Issues

1. **Content Not Loading**:

    - Check file path in `/public/content/`
    - Verify JSON syntax
    - Check network tab for 404 errors

2. **Validation Not Working**:

    - Verify validation rules in config
    - Check validation pattern definitions
    - Ensure error messages are localized

3. **Language Not Switching**:
    - Verify `currentLanguage` prop
    - Check text object structure
    - Ensure fallback language exists

### Debug Tools

-   Browser DevTools for network requests
-   Svelte DevTools for component state
-   Console logging for debugging

## 📚 API Reference

### ModularInput Props

| Prop              | Type     | Required | Description                   |
| ----------------- | -------- | -------- | ----------------------------- |
| `config`          | Object   | Yes      | Input configuration object    |
| `currentLanguage` | string   | No       | Language code (default: 'en') |
| `currentValue`    | any      | Yes      | Current input value           |
| `onValueChange`   | Function | Yes      | Value change callback         |
| `onValidation`    | Function | No       | Validation callback           |

### ModularForm Props

| Prop              | Type     | Required | Description                   |
| ----------------- | -------- | -------- | ----------------------------- |
| `formConfig`      | Array    | Yes      | Array of input configurations |
| `currentLanguage` | string   | No       | Language code                 |
| `formData`        | Object   | Yes      | Current form data             |
| `onSubmit`        | Function | Yes      | Form submission callback      |
| `onCancel`        | Function | No       | Form cancellation callback    |
| `submitConfig`    | Object   | No       | Submit button configuration   |
| `cancelConfig`    | Object   | No       | Cancel button configuration   |

### SettingsItem Props

| Prop              | Type     | Required | Description                 |
| ----------------- | -------- | -------- | --------------------------- |
| `item`            | Object   | Yes      | Settings item configuration |
| `currentLanguage` | string   | No       | Language code               |
| `currentValue`    | any      | Yes      | Current setting value       |
| `onValueChange`   | Function | Yes      | Value change callback       |
| `onAction`        | Function | No       | Action callback             |

### SettingsSection Props

| Prop              | Type     | Required | Description              |
| ----------------- | -------- | -------- | ------------------------ |
| `section`         | Object   | Yes      | Section configuration    |
| `currentLanguage` | string   | No       | Language code            |
| `activeSection`   | string   | Yes      | Currently active section |
| `currentSettings` | Object   | Yes      | Current settings         |
| `userTier`        | string   | No       | User tier                |
| `onSectionToggle` | Function | Yes      | Section toggle callback  |
| `onSettingChange` | Function | Yes      | Setting change callback  |
| `onAction`        | Function | No       | Action callback          |

## 🚀 Future Enhancements

### Planned Features

-   **Real-time Sync**: Settings synchronization across devices
-   **Advanced Validation**: Custom validation rules
-   **Theme Support**: Multiple visual themes
-   **Plugin System**: Extensible settings system
-   **Analytics**: Usage tracking and insights

### Performance Optimizations

-   **Virtual Scrolling**: For large settings lists
-   **Progressive Loading**: Load settings progressively
-   **Service Worker**: Offline support
-   **WebAssembly**: For complex calculations

## 📝 Contributing

### Development Guidelines

1. **Follow Svelte Best Practices**
2. **Add Comprehensive JSDoc Comments**
3. **Test All Input Types**
4. **Verify Accessibility**
5. **Update Documentation**

### Testing Checklist

-   [ ] All input types work correctly
-   [ ] Internationalization functions properly
-   [ ] Accessibility standards met
-   [ ] Performance benchmarks passed
-   [ ] Cross-browser compatibility verified

## 🎉 Demo Component

### FormDemo.svelte

A comprehensive demo component showcasing:

-   **Iterative Usage**: How to use ModularInput and ModularForm
-   **Multiple Form Types**: Contact form and settings form
-   **Live Data Preview**: Real-time form data display
-   **Feature Showcase**: All supported input types
-   **Interactive Examples**: Switch between different forms

**Usage**:

```svelte
<script>
  import FormDemo from './components/UI/FormDemo.svelte';
</script>

<FormDemo />
```

**Access**: Navigate to `/demo` or include in any route to see the modular form system in action!

# UI Components

## ContextBadge

Eine flexible Context-Badge-Komponente für Tooltips und Kontextinformationen mit **echter Account-Erstellungszeit** und **Tailwind-Animationen**.

### Props

| Prop            | Type                                        | Default | Description                  |
| --------------- | ------------------------------------------- | ------- | ---------------------------- |
| `text`          | string                                      | ''      | Text to display in the badge |
| `position`      | 'top' \| 'bottom' \| 'left' \| 'right'      | 'top'   | Position relative to parent  |
| `variant`       | 'info' \| 'warning' \| 'success' \| 'error' | 'info'  | Visual variant               |
| `size`          | 'sm' \| 'md' \| 'lg'                        | 'md'    | Size of the badge            |
| `width`         | 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'      | 'md'    | Maximum width of the badge   |
| `trigger`       | 'hover' \| 'click' \| 'both'                | 'hover' | How to trigger the badge     |
| `intro`         | boolean                                     | false   | Auto-show/hide animation     |
| `introDelay`    | number                                      | 2000    | Delay before showing (ms)    |
| `introDuration` | number                                      | 3000    | How long to show (ms)        |
| `disabled`      | boolean                                     | false   | Disable the badge            |
| `parentElement` | HTMLElement                                 | null    | Reference to parent element  |
| `alwaysVisible` | boolean                                     | false   | Always show the badge        |
| `tier`          | 'free' \| 'pro' \| null                     | null    | Account tier for tier badge  |
| `accountAgeLabel`| string                                     | ''      | Pre-formatted age label      |
| `translations`  | object                                      | null    | Translation object for age   |

### Events

| Event         | Payload | Description             |
| ------------- | ------- | ----------------------- |
| `show`        | -       | Badge is shown          |
| `hide`        | -       | Badge is hidden         |
| `intro:start` | -       | Intro animation started |
| `intro:end`   | -       | Intro animation ended   |

### Usage Examples

```svelte
<!-- Basic hover tooltip -->
<ContextBadge text="This is a helpful tooltip" position="top">
    <button>Hover me</button>
</ContextBadge>

<!-- Click to show with custom width -->
<ContextBadge text="Click to see more info" trigger="click" variant="info" width="lg">
    <button>Click me</button>
</ContextBadge>

<!-- Auto-intro animation -->
<ContextBadge
    text="Welcome! Here's a tip"
    intro={true}
    introDelay={1000}
    introDuration={5000}
    variant="success"
    position="bottom"
    width="xl"
>
    <div>New feature</div>
</ContextBadge>

<!-- Tier Badge with real account age -->
<ContextBadge
    tier="free"
    translations={translations.accountAge}
    position="top"
    variant="standard"
    trigger="hover"
    intro={true}
    introDelay={2000}
    introDuration={4000}
    alwaysVisible={true}
    width="lg"
>
    <div>Account Status</div>
</ContextBadge>

<!-- Warning variant -->
<ContextBadge text="This action cannot be undone" variant="warning" position="left">
    <button>Delete</button>
</ContextBadge>

<!-- Error variant -->
<ContextBadge text="Connection failed" variant="error" position="right">
    <div>Status: Offline</div>
</ContextBadge>
```

### Features

-   **🎯 Smart Positioning:** Automatically positions relative to parent
-   **🎨 Multiple Variants:** Info, warning, success, error styles
-   **📏 Flexible Sizing:** Small, medium, large options
-   **📐 Custom Widths:** sm, md, lg, xl, 2xl width options
-   **⚡ Tailwind Animations:** Smooth fade-in/out with scale effects
-   **♿ Accessibility:** Proper ARIA labels and roles
-   **🎪 Intro Animation:** Auto-show/hide with configurable timing
-   **🖱️ Multiple Triggers:** Hover, click, or both
-   **🌙 Dark Mode:** Full dark mode support
-   **📱 Responsive:** Works on all screen sizes
-   **⏰ Real Account Age:** Displays actual days since account creation
-   **🌍 Localized:** Supports multiple languages for account age
-   **💎 Tier Badges:** Special styling for FREE/PRO accounts
-   **🎭 Always Visible:** Option to always show the badge
