# Keymoji Browser Extension MVP

This folder contains the first browser extension MVP for Keymoji.

## Build

```bash
npm run build:extension
```

The unpacked extension is emitted to:

```text
build-extension/
```

Load this folder via `chrome://extensions` → Developer mode → Load unpacked.

## MVP Scope

- Generate emoji passwords locally with `crypto.getRandomValues`.
- Use the existing Keymoji emoji list from `public/emojisArray.json`.
- Support levels 3-9, matching the web app concept.
- Show a small prompt when a password field is focused.
- Fill the field only after explicit user confirmation.
- Store settings only, never generated Keymojis.

## Security Notes

- The content script does not read existing password field values.
- Generated Keymojis are not sent to any server.
- No n8n, account system, AI Story Mode, analytics, or backend calls are used in this MVP.
- Autofill is user-initiated to avoid silent credential exposure.
