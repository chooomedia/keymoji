# 🗂️ Keymoji Projektstruktur

## 📁 **Root-Level**

```
keymoji/
├── 📁 src/                    # Frontend Source Code
├── 📁 backend/                # Backend APIs & Services
├── 📁 public/                 # Static Assets
├── 📁 docs/                   # Projekt-Dokumentation
├── 📁 tests/                  # Test-Dateien
├── 📁 tools/                  # Entwicklungstools
├── 📁 scripts/                # Build & Deploy Scripts
├── 📁 webpack/                # Webpack Konfiguration
├── 📁 .github/                # GitHub Actions
├── 📁 .vscode/                # VS Code Settings
├── 📄 package.json            # Frontend Dependencies
├── 📄 tailwind.config.js      # Tailwind CSS Config
├── 📄 postcss.config.js       # PostCSS Config
├── 📄 .gitignore              # Git Ignore Rules
├── 📄 README.md               # Projekt-Übersicht
└── 📄 LICENSE                 # MIT License
```

## 🎨 **Frontend (src/)**

### **📁 components/** - Svelte Komponenten

```
components/
├── 📁 Core/                   # Kern-Komponenten
│   ├── EmojiDisplay.svelte    # Emoji Anzeige
│   └── UserCounter.svelte     # Benutzer-Zähler
├── 📁 Features/               # Feature-Komponenten
│   ├── AccountStatus.svelte   # Account Status Button
│   ├── BlogGrid.svelte        # Blog Grid Layout
│   └── BlogPost.svelte        # Blog Post Anzeige
├── 📁 Layout/                 # Layout-Komponenten
│   ├── Header.svelte          # Seiten-Header
│   └── Layout.svelte          # Haupt-Layout
├── 📁 UI/                     # UI-Komponenten
│   └── ErrorModal.svelte      # Fehler-Modal
├── 📁 A11y/                   # Accessibility
│   ├── FocusManager.svelte    # Focus Management
│   └── SkipLink.svelte        # Skip Links
└── LanguageSwitcher.svelte    # Sprach-Umschalter
```

### **📁 assets/** - Statische Assets

```
assets/
├── 📁 fonts/                  # Schriftarten
│   └── tengwar_annatar.ttf    # Elvish Font
├── 📁 images/                 # Bilder
├── 📁 icons/                  # Icons
└── shapes.js                  # SVG Shapes
```

### **📁 stores/** - Svelte Stores

```
stores/
├── accountStore.js            # Account State Management
├── appStores.js              # App State
├── featureFlags.js           # Feature Flags
├── modalStore.js             # Modal State
└── seoStore.js               # SEO State
```

### **📁 routes/** - Seiten-Routen

```
routes/
├── 📁 Pages/                  # Seiten-Komponenten
│   ├── AccountCreation.svelte # Account Erstellung
│   ├── AccountManage.svelte   # Account Verwaltung
│   ├── ContactForm.svelte     # Kontakt-Formular
│   ├── DailyLimit.svelte      # Tägliches Limit
│   └── MagicLink.svelte       # Magic Link
├── 📁 Features/               # Feature-Seiten
│   └── VersionHistory.svelte  # Versions-Historie
├── LanguageRouter.svelte      # Sprach-Router
└── NotFound.svelte            # 404 Seite
```

### **📁 utils/** - Utilities

```
utils/
├── 📁 Analytics/              # Analytics Tools
├── 📁 SEO/                    # SEO Utilities
│   ├── seo-enhancements.js    # SEO Verbesserungen
│   └── seo-optimizer.js       # SEO Optimizer
├── languages.js               # Sprach-Management
├── updatedTime.js             # Zeit-Updates
└── version.js                 # Versions-Management
```

### **📁 config/** - Konfiguration

```
config/
└── api.js                     # API Konfiguration
```

### **📄 Core Files**

```
├── index.svelte               # Haupt-App Komponente
├── index.js                   # App Entry Point
├── index.css                  # Global Styles
├── content.js                 # Content Management
└── versions.js                # Versions-Daten
```

## 🔧 **Backend (backend/)**

### **📁 api/** - API Endpoints

```
api/
├── 📁 account/                # Account APIs
│   └── update.js              # Account Update
├── 📁 magic-link/             # Magic Link APIs
│   ├── send.js                # Magic Link Senden
│   └── verify.js              # Magic Link Verifizierung
├── account.js                 # Account Management
├── contact.js                 # Kontakt-Formular
├── email-templates.js         # Email Templates
├── payment.js                 # Payment Processing
├── random.js                  # Random Emoji API
├── resend-magic-link.js       # Magic Link Resend
├── send-magic-link.js         # Magic Link Send
├── test-emails.js             # Email Testing
└── verify-magic-link.js       # Magic Link Verify
```

### **📁 config/** - Backend Konfiguration

```
config/
└── vercel.json                # Vercel Deployment
```

### **📁 utils/** - Backend Utilities

```
utils/
├── test-apis.js               # API Testing
└── deploy.sh                  # Deployment Script
```

### **📁 docs/** - Backend Dokumentation

```
docs/
├── DEPLOYMENT.md              # Deployment Guide
└── README.md                  # Backend README
```

### **📄 Backend Files**

```
├── package.json               # Backend Dependencies
└── env.example                # Environment Variables
```

## 🧪 **Tests (tests/)**

```
tests/
├── test-backend.js            # Backend Tests
├── test-backend-complete.js   # Vollständige Backend Tests
├── test-email-system.js       # Email System Tests
├── test-frontend-complete.js  # Vollständige Frontend Tests
├── test-frontend-integration.js # Frontend Integration Tests
├── test-frontend-simple.js    # Einfache Frontend Tests
├── test-frontend-ui.js        # UI Tests
└── test.txt                   # Test Dokumentation
```

## 📚 **Dokumentation (docs/)**

```
docs/
├── PROJECT_STRUCTURE.md       # Diese Datei
├── EMAIL_SETUP.md             # Email Setup Guide
├── COMPLETE_TEST_SUMMARY.md   # Test Zusammenfassung
├── FINAL_TEST_SUMMARY.md      # Finale Test Zusammenfassung
└── n8n-workflows/             # n8n Workflow Dokumentation
    ├── README.md              # n8n Workflows Guide
    ├── 01-analytics-only.json # Analytics Workflow
    ├── 02-account-management.json # Account Management
    ├── 02-counter-only.json   # Counter Workflow
    ├── 03-subscription-management.json # Subscription Management
    ├── 04-feature-flags.json  # Feature Flags
    ├── 05-usage-tracking.json # Usage Tracking
    └── 06-ab-testing.json     # A/B Testing
```

## 🛠️ **Tools (tools/)**

```
tools/
└── (Entwicklungstools)
```

## 📋 **Struktur-Prinzipien**

### **🎯 Organisations-Prinzipien:**

1. **Separation of Concerns** - Klare Trennung zwischen Frontend/Backend
2. **Feature-based Organization** - Komponenten nach Features gruppiert
3. **Scalability** - Struktur wächst mit dem Projekt
4. **Maintainability** - Einfach zu warten und zu erweitern
5. **Documentation** - Alles ist dokumentiert

### **📁 Naming Conventions:**

-   **PascalCase** für Svelte Komponenten
-   **camelCase** für JavaScript Dateien
-   **kebab-case** für HTML/CSS Klassen
-   **snake_case** für Backend APIs

### **🔧 Development Workflow:**

1. **Frontend Development** → `src/` Ordner
2. **Backend APIs** → `backend/api/` Ordner
3. **Testing** → `tests/` Ordner
4. **Documentation** → `docs/` Ordner

### **🚀 Deployment:**

-   **Frontend** → Vercel (automatisch)
-   **Backend APIs** → Vercel Functions
-   **Static Assets** → Vercel CDN

---

**📝 Letzte Aktualisierung:** $(date)
**🔧 Version:** 0.4.3
**👨‍💻 Entwickler:** Keymoji Team
