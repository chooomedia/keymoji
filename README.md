# Keymoji

> Privacy-first emoji password generation for the web and browser extensions.

[![Version](https://img.shields.io/badge/version-0.8.3-blue.svg)](https://github.com/chooomedia/keymoji)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Svelte](https://img.shields.io/badge/Svelte-3.59-ff3e00.svg)](https://svelte.dev)
[![Privacy](https://img.shields.io/badge/privacy-first-green.svg)](https://keymoji.wtf/privacy)

Keymoji creates memorable emoji-based passwords locally in the browser. The
main web app supports random emoji generation, OTP-based accounts, AI Story
Mode, local usage history, and a browser extension MVP that can offer Keymoji
inside password fields after explicit user confirmation.

- Live app: [keymoji.wtf](https://keymoji.wtf)
- Privacy policy: [keymoji.wtf/privacy](https://keymoji.wtf/privacy)
- Contact: [hello@keymoji.wtf](mailto:hello@keymoji.wtf)
- Author: Christopher Matt

![Keymoji Showcase - Story Mode, Random Mode, Contact Form and Version History](docs/keymoji-showcase.gif)

## Table of Contents

- [What Keymoji Does](#what-keymoji-does)
- [Current Feature Set](#current-feature-set)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Browser Extension](#browser-extension)
- [AI Story Mode](#ai-story-mode)
- [Privacy and Security](#privacy-and-security)
- [Useful Scripts](#useful-scripts)
- [Project Structure](#project-structure)
- [Release Status](#release-status)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## What Keymoji Does

Keymoji turns password creation into a memorable emoji sequence. The core
random generator runs client-side and uses browser cryptography. Generated
passwords are not sent to Keymoji servers.

The project has two user-facing surfaces:

1. The Keymoji web app at `keymoji.wtf`
2. A Manifest V3 browser extension MVP for local generation and explicit
   password-field insertion

## Current Feature Set

- Random emoji password generation with configurable emoji count.
- One-click copy flow for generated Keymojis.
- OTP authentication by email for account access.
- Guest, Free, and Pro usage tiers.
- Local usage history and interactive usage charts.
- AI Story Mode with multiple providers.
- Built-in Apertus support through an n8n workflow token.
- Multi-language UI with 15 language packs.
- Privacy consent modal for optional local usage history and analytics.
- Browser extension MVP with local generation, popup UI, settings, and
  password-field prompt.
- Extension promo modal and rotating top announcement banner in the web app.
- Static route generation, SEO metadata pre-rendering, sitemap generation, and
  robots.txt generation during production builds.

## Architecture

This repository currently uses the production Svelte 3/Webpack codebase.
Svelte 5 migration notes exist in `docs/SVELTE5_MIGRATION_GUIDE.md`, but the
active app in this repository is not fully migrated to Svelte 5.

| Layer | Current implementation |
| --- | --- |
| Web frontend | Svelte 3.59, JavaScript/TypeScript, Tailwind CSS, Webpack |
| Extension | Manifest V3, TypeScript, Webpack |
| Styling | Tailwind CSS plus component CSS where needed |
| Auth | OTP code by email |
| Backend orchestration | n8n workflows |
| Account storage | Google Sheets through n8n workflows |
| AI Story Mode | Apertus, OpenAI-compatible providers, Gemini, Mistral, Claude/custom endpoints |
| Local storage | Browser localStorage and extension storage for local preferences |
| Deployment | GitHub Actions build and production deploy on `main` |

High-level account and AI flow:

```text
Web app -> API/webhook boundary -> n8n workflow -> Google Sheets / AI provider -> web app
```

The random emoji generator and browser extension generation flow remain local
to the user's browser.

## Getting Started

Requirements:

- Node.js
- npm

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build the web app:

```bash
npm run build
```

The dev server defaults to `http://localhost:8080`.

## Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

The most important variable for Apertus/n8n integration is:

```text
VITE_N8N_APERTUS_TOKEN=your_apertus_n8n_token_here
```

Generate a token when needed:

```bash
npm run generate:token:dev
npm run generate:token:prod
```

Use the same token in the related n8n workflow node that validates incoming
requests. See `docs/ENVIRONMENT_VARIABLES.md` for the full setup details.

Never commit `.env`, `.env.local`, production tokens, or workflow secrets.

## Browser Extension

The extension MVP lives in `src/extension`.

Build the unpacked extension:

```bash
npm run build:extension
```

Create store-specific ZIP packages:

```bash
npm run package:extension
```

This creates:

```text
keymoji-extension-chrome-edge-brave-v0.1.0.zip
keymoji-extension-firefox-v0.1.0.zip
```

Use the Chromium ZIP for:

- Chrome Web Store
- Microsoft Edge Add-ons
- Brave users through the Chrome Web Store

Use the Firefox ZIP for Firefox Add-ons (AMO). It includes the required
Firefox data collection declaration for the current MVP:

```json
{
    "browser_specific_settings": {
        "gecko": {
            "data_collection_permissions": {
                "required": ["none"]
            }
        }
    }
}
```

Extension MVP scope:

- Generate Keymojis locally with browser cryptography.
- Store local preferences only.
- Detect password fields with a content script.
- Show a prompt before inserting a generated Keymoji.
- Insert only after explicit user confirmation.
- Do not store generated Keymojis.
- Do not call n8n, AI providers, analytics, or account APIs.

Publishing details are documented in
[`docs/EXTENSION_PUBLISHING.md`](docs/EXTENSION_PUBLISHING.md).

## AI Story Mode

Story Mode transforms user-provided text into emoji sequences through supported
AI providers. It is separate from the local random generator and from the
browser extension MVP.

Supported provider types include:

- Apertus through the configured n8n webhook token
- OpenAI-compatible APIs
- Google Gemini
- Mistral
- Claude/custom provider flows where configured

The built-in Apertus path requires `VITE_N8N_APERTUS_TOKEN` and the matching
n8n workflow configuration.

## Privacy and Security

Keymoji's core privacy principles:

- Random emoji generation happens locally in the browser.
- Generated random Keymojis are not sent to Keymoji servers.
- The browser extension does not transmit generated Keymojis.
- Existing password-field values are not stored by the extension.
- Extension settings are stored in local browser extension storage.
- Web app account and AI features are separate from the extension MVP.
- Optional analytics and local history are governed by the consent flow.
- Secrets belong in `.env.local`, hosting provider environment variables, or
  n8n credentials, never in source control.

Review the live privacy policy at
[keymoji.wtf/privacy](https://keymoji.wtf/privacy).

## Useful Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Webpack development server |
| `npm run build` | Build the production web app and generate static SEO assets |
| `npm run build:extension` | Build the unpacked browser extension into `build-extension/` |
| `npm run package:extension` | Create Chromium and Firefox extension ZIP packages |
| `npm run generate:token:dev` | Generate a development n8n token |
| `npm run generate:token:prod` | Generate a production n8n token |
| `npm run check:apertus-token` | Check Apertus token setup |
| `npm run validate:schema` | Validate structured data |
| `npm run version:patch` | Bump the patch version |
| `npm run version:minor` | Bump the minor version |
| `npm run version:major` | Bump the major version |

## Project Structure

```text
src/
  components/
    Core/              Main generator UI
    Features/          Feature-specific UI such as extension promo
    Layout/            Header, banners, layout shell
    UI/                Reusable UI components and modal system
  config/              API, storage, limits and app config
  data/                Language files, static page data, settings data
  extension/           Browser extension MVP
  routes/              Main route-level Svelte components
  stores/              Account, consent, modal and app state
  types/               Shared TypeScript types
  utils/               Versioning, API cache, SEO and helper utilities

docs/                  Setup, publishing and migration notes
n8n-workflows/         Local workflow exports, ignored in this repository
webpack/               Web and extension Webpack configs
scripts/               Build, version and extension packaging helpers
```

## Release Status

Current app version:

```text
0.8.3 - Browser Extension MVP
```

Recent highlights:

- Browser extension MVP with Manifest V3 support.
- Store-specific extension packaging for Chromium and Firefox.
- Extension promo modal using the existing modal system.
- Rotating top announcement banner for Story Mode and Extension launch.
- Privacy policy updated to include the browser extension MVP.
- Browser extension publishing guide added.

Full release data lives in `src/data/versions.js` and on
[keymoji.wtf/versions](https://keymoji.wtf/versions).

## Deployment

Production deploys are triggered from `main` through GitHub Actions.

Best-practice workflow:

1. Create a feature branch.
2. Open a pull request.
3. Let CI checks run.
4. Merge to `main`.
5. GitHub Actions builds and deploys the web app.

The normal web deploy uses `npm run build`. Extension artifacts are separate
and ignored by Git:

- `build-extension/`
- `keymoji-extension-*.zip`
- unpacked extension test folders

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feat/your-feature
   ```

3. Make focused changes.
4. Run the relevant build/check commands.
5. Commit in English with the repository prefix style:

   ```text
   feat: add focused feature
   fix: resolve specific bug
   docs: update project documentation
   chore: maintain tooling
   ```

6. Open a pull request.

Please keep changes scoped, avoid committing secrets or generated release ZIPs,
and follow the local Cursor rules in `.cursor/rules/`.

## License

MIT License. See [LICENSE](LICENSE).

Made in Switzerland. Keymoji: smile is your key.
