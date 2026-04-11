# 🔑 Keymoji – Emoji Password Generator

> Memorable passwords, zero effort. Uncrackable emoji sequences. Privacy-first. Open Source.

[![Version](https://img.shields.io/badge/version-0.8.1-blue.svg)](https://github.com/chooomedia/keymoji)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Made with Svelte](https://img.shields.io/badge/made%20with-svelte-ff3e00.svg)](https://svelte.dev)
[![GDPR Compliant](https://img.shields.io/badge/GDPR-compliant-green.svg)](https://keymoji.wtf)

🌐 **Live:** [keymoji.wtf](https://keymoji.wtf)
📧 **Contact:** [hello@keymoji.wtf](mailto:hello@keymoji.wtf)
👨‍💻 **Author:** Christopher Matt

---

## 📚 Table of Contents

-   [Overview](#-overview)
-   [Key Features](#-key-features)
-   [Architecture & Stack](#-architecture--stack)
-   [Getting Started](#-getting-started)
-   [AI Story Mode](#-ai-story-mode)
-   [Custom API Testing](#-custom-api-testing)
-   [Modular Input Architecture](#-modular-input-architecture)
-   [Release Highlights](#-release-highlights)
-   [Roadmap](#-roadmap)
-   [Development Tips](#-development-tips)
-   [Contributing](#-contributing)
-   [License & Support](#-license--support)

---

## 🌟 Overview

Keymoji generates secure passwords exclusively from emojis. The goal: maximum memorability with zero complexity — fully client-side, so your passwords never leave your device.

Passwords are generated using `crypto.getRandomValues` XORed with `Date.now()` entropy for true randomness on every generation.

---

## 🎯 Key Features

-   **Random Emoji Generator** – Instant, cryptographically random emoji combinations. Adjustable count (3–9 emojis), copy to clipboard with one click.
-   **🤖 AI Story Mode** – Transform text into emoji sequences using multiple AI providers (OpenAI, Gemini, Mistral, Claude, Apertus built-in, or Custom API). Multi-key management, 7-day caching, auto-enabled for logged-in users.
-   **Account System** – OTP authentication (code via email), daily usage limits (Guest 5 / Free 9 / Pro 35), interactive usage charts, local usage history.
-   **Multi-Language** – 15 languages including Klingon (TLH) & Sindarin (SJN), automatic language detection, PWA-ready.
-   **Privacy & Security** – Fully client-side generation, zero-knowledge approach, GDPR-compliant, rate limiting on all API endpoints.

---

## 🏗️ Architecture & Stack

| Layer         | Technology / Purpose                                          |
| ------------- | ------------------------------------------------------------- |
| Frontend      | Svelte 5 (Runes), TypeScript, Tailwind CSS, Webpack, PostCSS |
| API Layer     | Vercel Serverless Functions (proxy + CORS)                    |
| Orchestration | n8n Workflows (account management, email dispatch)            |
| Auth          | OTP code via email (magic-link style, single-use tokens)      |
| Storage       | Google Sheets (account data), localStorage (usage history)    |
| Deployment    | Vercel (frontend + API), FTP (static assets via GitHub Actions) |

**Data Flow:**

```
Frontend → Vercel API Proxy → n8n Workflow → Google Sheets → Response → Frontend
```

**Usage History** is managed locally in `localStorage` — never sent to the backend.

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

## 🤖 AI Story Mode

Keymoji's Story Mode transforms any text input into an emoji sequence using AI. It's powered by multiple providers and uses [n8n](https://n8n.io) for orchestration.

### Supported Providers

| Provider     | Notes                                              |
| ------------ | -------------------------------------------------- |
| **Apertus**  | Swiss LLM (built-in, no API key required for users) |
| OpenAI       | GPT-4o, GPT-4, GPT-3.5                            |
| Google Gemini | Gemini Pro                                        |
| Mistral      | Open-weight models                                 |
| Anthropic    | Claude                                             |
| Custom API   | Any OpenAI-compatible endpoint                     |

### Apertus — Built-in Swiss LLM

Apertus is a Swiss language model hosted on HuggingFace, integrated directly into Keymoji. All logged-in users get access automatically — no API key required.

**Setup (self-hosted):**

1. Generate a token: `npm run generate:token:dev`
2. Add to `.env.local` as `VITE_N8N_APERTUS_TOKEN`
3. Import `n8n-workflows/n8n-workflow-apertus-keymoji.json` into your n8n instance
4. Set your token in the "Set Expected Token" node
5. Activate & test: `./tests/test-n8n-webhook.sh`

---

## 🔌 Custom API Testing

-   **Mock Mode:** `http://localhost:8080/?mock-custom-api=true` — instant emoji responses, no backend needed.
-   **Custom Endpoint Requirements:** Your server must handle OPTIONS preflight requests:
    ```
    Access-Control-Allow-Origin: http://localhost:8080
    Access-Control-Allow-Methods: POST, OPTIONS
    Access-Control-Allow-Headers: Content-Type, Authorization
    ```
-   Example implementations: `n8n-workflows/story-generator-ai-node.js` (Express, Flask, FastAPI snippets)

---

## 🧱 Modular Input Architecture

All forms in Keymoji use a unified, JSON-configured input layer:

-   **Core Components:** `ModularInput`, `ModularForm`, `ModularLoginForm`
-   **Features:** 10+ input types, built-in validation, i18n support, full accessibility (WCAG 2.1)
-   **Configuration:** Driven by `src/data/userSettings.json` — add new settings without touching components
-   **Demos:**
    -   `/demo` – All input types with live preview
    -   `/account` – Real-world usage with account settings

---

## 📜 Release Highlights

| Version | Date              | Highlights                                                                              |
| ------- | ----------------- | --------------------------------------------------------------------------------------- |
| 0.8.1   | April 9, 2026     | AI Story Mode auto-enabled for all users, Apertus built-in (no key required)           |
| 0.8.0   | April 9, 2026     | Critical fix: account data loading in all deployment environments                      |
| 0.7.9   | April 9, 2026     | TopBar & banner refinements, rate limiting, email validation, duplicate account prevention |
| 0.7.8   | April 9, 2026     | OTP code authentication (replaces magic link), multilingual email templates            |
| 0.7.7   | November 16, 2025 | Translation updates, routing improvements, UI/UX polish, code cleanup                  |
| 0.7.5   | November 14, 2025 | TypeScript migration foundation, performance optimizations, Tailwind CSS optimization  |
| 0.7.4   | November 13, 2025 | API call reduction 50–70%, centralized caching, data integrity improvements            |
| 0.6.0   | October 11, 2025  | AI Story Mode launch, multi-provider API keys, story cache, static pages               |

> Full changelog: `src/data/versions.js` or [keymoji.wtf/versions](https://keymoji.wtf/versions)

---

## 🔭 Roadmap

-   [ ] Svelte 5 Runes migration (ongoing — `$state`, `$derived`, `$effect`)
-   [ ] Full TypeScript coverage across all stores and routes
-   [ ] Pro tier features (extended limits, priority AI, export options)
-   [ ] Improved error boundaries & generic error flows
-   [ ] Complete email template translations for all 15 languages

---

## 🧪 Development Tips

```javascript
// Debug stores in browser console
window.keymojiDebug.showStores();

// Test user settings
window.testUserSettings();
```

**Key Files:**

| File                                          | Purpose                              |
| --------------------------------------------- | ------------------------------------ |
| `src/stores/dailyUsageStore.js`               | Usage tracking & API sync            |
| `src/stores/userDataStore.js`                 | Local usage history (localStorage)   |
| `src/stores/accountStore.js`                  | Session, OTP auth & account data     |
| `src/components/Core/EmojiDisplay.svelte`     | Main emoji generator                 |
| `src/routes/AccountManager.svelte`            | Account page with settings & charts  |
| `src/data/languages/*.js`                     | i18n translations (15 languages)     |
| `src/utils/metadataCleaner.ts`                | Keeps metadata clean before API sync |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes (English commit messages): `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request — contributions welcome!

Please follow the conventions in `.cursor/rules/` for code style, TypeScript usage, and Tailwind CSS practices.

---

## 📄 License & Support

-   MIT License — see [LICENSE](LICENSE)
-   Website: [keymoji.wtf](https://keymoji.wtf)
-   Email: [hello@keymoji.wtf](mailto:hello@keymoji.wtf)
-   GitHub Issues: [Report a bug](https://github.com/chooomedia/keymoji/issues)

---

**Made with ❤️ in Switzerland 🇨🇭** — _Keymoji: Smile is your key!_ 🔑✨
