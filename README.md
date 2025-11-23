# 🔑 Keymoji – Emoji Password Generator

> Secure, memorable passwords with emojis. AI-resistant. Privacy-first. Open Source.

[![Version](https://img.shields.io/badge/version-0.7.7-blue.svg)](https://github.com/chooomedia/keymoji)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Made with Svelte](https://img.shields.io/badge/made%20with-svelte-ff3e00.svg)](https://svelte.dev)

🌐 **Live:** [keymoji.wtf](https://keymoji.wtf)
📧 **Contact:** [hello@keymoji.wtf](mailto:hello@keymoji.wtf)  
👨‍💻 **Author:** Christopher Matt

---

## 📚 Table of Contents

-   [Overview](#-overview)
-   [Key Features](#-key-features)
-   [Architecture & Stack](#-architecture--stack)
-   [Getting Started](#-getting-started)
-   [AI Story Mode & n8n Integration](#-ai-story-mode--n8n-integration)
-   [Custom API Testing](#-custom-api-testing)
-   [Modular Input Architecture](#-modular-input-architecture)
-   [Release Highlights](#-release-highlights)
-   [Roadmap](#-roadmap)
-   [Development Tips](#-development-tips)
-   [Contributing](#-contributing)
-   [License & Support](#-license--support)

---

## 🌟 Overview

Keymoji generates secure passwords exclusively from emojis. The goal: maximum memorability with AI resistance – fully client-side, ensuring your passwords never leave your device.

---

## 🎯 Key Features

-   **Random Emoji Generator** – Instant, random emoji combinations for secure passwords.
-   **🤖 AI Story Mode** – Transforms text into emojis, supports multiple AI providers (OpenAI, Gemini, Mistral, Claude, Apertus, and Custom APIs) with multi-key management and 7-day caching.
-   **Account System** – Magic-link login, daily usage limits (Guest 5 / Free 9 / Pro 35), usage analytics with interactive charts.
-   **Multi-Language** – 15+ languages (including Klingon & Sindarin), automatic theme detection, PWA-ready.
-   **Privacy & Security** – Fully client-side, zero-knowledge approach, AI-resistant passwords.

---

## 🏗️ Architecture & Stack

| Layer         | Technology / Purpose                              |
| ------------- | ------------------------------------------------- |
| Frontend      | Svelte, Tailwind, Webpack, PostCSS, Svelte Stores |
| API Layer     | Vercel Serverless Functions                       |
| Orchestration | n8n Workflows (automation, validation, logging)   |
| Backend       | Serverless architecture with secure data handling |
| Emails        | Magic-link authentication system                  |

Data Flow:

```
Frontend → Vercel API → n8n Workflows → Backend Services → Sync to Frontend
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:8080)
npm run dev

# Production build
npm run build
```

**Environment Setup:**

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your values in `.env.local` (never commit this file)

3. Generate tokens:
   ```bash
   npm run generate:token:dev   # Development
   npm run generate:token:prod  # Production
   ```

See [`docs/ENVIRONMENT_VARIABLES.md`](docs/ENVIRONMENT_VARIABLES.md) for detailed documentation.

---

## 🤖 AI Story Mode & n8n Integration

Keymoji leverages [n8n](https://matt-interfaces.ch/n8n) – a powerful workflow automation tool – to orchestrate AI-powered emoji generation and manage backend processes seamlessly.

### Apertus (Swiss LLM) – Exclusively on Keymoji

Apertus is a Swiss language model hosted on HuggingFace, made accessible to users through Keymoji's n8n workflow integration. This is the first time Apertus is available in a user-facing application.

**Setup Steps:**

1. Generate token (`npm run generate:token:dev`)
2. Add token to `.env.local` or Vercel environment variable `VITE_N8N_APERTUS_TOKEN`
3. Import workflow `n8n-workflows/n8n-workflow-apertus-keymoji.json` into your n8n instance
4. Update the "Set Expected Token" node with your generated token (replaces Enterprise variables)
5. Activate & test (`./tests/test-n8n-webhook.sh` or cURL)
6. Ready to use – tokens can be rotated anytime by updating the Set node

The workflow uses Apertus-8B model from HuggingFace, delivered via n8n for optimal performance and reliability.

### Smart Merge & Workflow Optimization

The n8n "Process Update" node preserves usage history via Longest-List-Merge algorithm (`n8n-workflows/process-update-node-FIXED.js`), ensuring data consistency across updates.

---

## 🔌 Custom API Testing

-   **Mock Mode:** `http://localhost:8080/?mock-custom-api=true` delivers instant emoji responses – perfect for UI testing without backend dependencies.
-   **Custom Endpoint:** Your server must correctly handle OPTIONS preflight requests:
    -   `Access-Control-Allow-Origin: http://localhost:8080`
    -   `Access-Control-Allow-Methods: POST, OPTIONS`
    -   `Access-Control-Allow-Headers: Content-Type, Authorization`
-   Example implementations available in the repository (`n8n-workflows/story-generator-ai-node.js`, `scripts/generate-n8n-token.js`) – ready-to-use snippets for Express, Flask, and FastAPI.

---

## 🧱 Modular Input Architecture

Reusable UI layer for all forms:

-   **Core Components:** `ModularInput`, `ModularForm`, `ModularLoginForm`
-   **Features:** 10+ input types, validation, i18n, accessibility, JSON-based configuration
-   **Demos:**
    -   `/demo` – Advanced demo (all input types & live preview)
    -   `/account` – Account settings use the same architecture
-   **Best Practices:** JSDoc, type safety, modular extensibility

---

## 📜 Release Highlights

| Version | Date       | Highlights                                                                           |
| ------- | ---------- | ------------------------------------------------------------------------------------ |
| 0.7.7   | 2025-11-16 | Loading screen consolidation, debug info improvements, code cleanup, version update |
| 0.7.4   | 2025-11-13 | Performance optimization, API call reduction (50-70%), code quality improvements, centralized utilities |
| 0.7.3   | 2025-11-13 | Data integrity fixes, Magic-Link settings fix, metadata cleaner, dailyUsage preservation |
| 0.7.2   | 2025-11-07 | Security improvements, environment variables best practices, configuration cleanup   |
| 0.7.1   | 2025-11-02 | Deep-merge fixes, temperature slider UX, dev tools for localStorage, emoji masking   |
| 0.7.0   | 2025-11-02 | Stability fixes, session management, nested settings deep merge, PostCSS build fixes |
| 0.6.0   | 2025-10-11 | AI Story Mode launch, multi-provider API keys, story cache, static pages             |

> For detailed release history, see the commit log or `src/data/versions.js`.

---

## 🔭 Roadmap

-   Clean up CSRF helper functions & exports in `accountStore.js`
-   Refactor `UserSettings.svelte` + CSS selectors
-   Cache account existence checks & throttle API calls
-   Improve error boundaries & generic error flows
-   Complete email template translations for all languages

---

## 🧪 Development Tips

```javascript
// Load real data from n8n (to test charts locally)
await window.loadRealData();

// Debug helpers
window.keymojiDebug.showStores();
window.testUserSettings();
```

Key Files:

-   `src/stores/dailyUsageStore.js` – Usage tracking & limits
-   `src/stores/userDataStore.js` – Settings & usage history
-   `src/stores/accountStore.js` – Session & authentication
-   `src/components/Core/EmojiDisplay.svelte` – Main generator
-   `src/routes/AccountManager.svelte` – Account page with charts

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request – contributions welcome!

---

## 📄 License & Support

-   MIT License – see [LICENSE](LICENSE)
-   Website: [keymoji.wtf](https://keymoji.wtf)
-   Email: [hello@keymoji.wtf](mailto:hello@keymoji.wtf)
-   GitHub Issues: [Report a bug](https://github.com/chooomedia/keymoji/issues)

---

**Made with ❤️ in Germany 🇩🇪** – _Keymoji: Bring emojis into your passwords!_ 🔑✨
