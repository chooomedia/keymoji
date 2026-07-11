# Keymoji Browser Extension Publishing

## Build and Package

```bash
npm run package:extension
```

This creates:

```text
keymoji-extension-v0.1.0.zip
```

Upload this ZIP in the Chrome Web Store Developer Dashboard.

## Local Test

1. Run `npm run build:extension`.
2. Open `chrome://extensions`.
3. Enable Developer Mode.
4. Click "Load unpacked".
5. Select `build-extension/`.
6. Test on a page with an `input[type="password"]`.

## Store Listing Draft

### Name

Keymoji Password Generator

### Short Description

Generate secure emoji passwords locally and insert them into password fields after confirmation.

### Detailed Description

Keymoji turns password creation into a simple local browser action.

The extension detects password fields and asks before creating a Keymoji. After you confirm, it generates an emoji password locally with the Web Crypto API and inserts it into the selected password field.

Privacy-first by design:

- Generated Keymojis never leave your browser.
- Existing password field values are not read or stored.
- No account, analytics, tracking cookies, n8n workflow, or AI backend is used by the extension MVP.
- Only local preferences such as level and prompt behavior are stored.

## Permission Justification

### `storage`

Used to store local extension preferences, such as the selected Keymoji level and whether the password-field prompt is enabled.

### `clipboardWrite`

Used only when the user explicitly copies a generated Keymoji or enables the optional "copy when inserting" setting.

### Content Script on `<all_urls>`

Required to detect password fields on websites. The content script does not read existing password values. It only offers a prompt and inserts a newly generated Keymoji after explicit user confirmation.

## Privacy Policy URL

Use this after deploying the web app:

```text
https://keymoji.wtf/extension-privacy.html
```

Fallback until deployed:

```text
https://keymoji.wtf/privacy
```

## Required Store Assets

- Icon 128x128 px
- At least one screenshot, recommended 1280x800 or 640x400
- Optional promotional image
- Privacy policy URL
- Support email: `hello@keymoji.wtf`

## Release Checklist

- [ ] `npm run package:extension` succeeds
- [ ] `build-extension/manifest.json` has the correct version
- [ ] Extension loads via `chrome://extensions`
- [ ] Popup opens and generates a Keymoji
- [ ] Password-field prompt appears only after focusing a password input
- [ ] Prompt inserts only after user click
- [ ] No generated Keymoji is stored
- [ ] Privacy policy is deployed
- [ ] Store listing permission explanations match the manifest
