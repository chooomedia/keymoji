# Keymoji Browser Extension Publishing

## Build Packages

Run:

```bash
npm run package:extension
```

This creates store-specific ZIP files:

```text
keymoji-extension-chrome-edge-brave-v0.1.0.zip
keymoji-extension-firefox-v0.1.0.zip
```

Use `keymoji-extension-chrome-edge-brave-v0.1.0.zip` for:

- Chrome Web Store
- Microsoft Edge Add-ons
- Brave users via Chrome Web Store

Use `keymoji-extension-firefox-v0.1.0.zip` for:

- Firefox Add-ons (AMO)

The Firefox package adds `browser_specific_settings.gecko.data_collection_permissions.required: ["none"]`, because the MVP does not collect or transmit extension data outside the local browser.

## Local Test

### Chromium Browsers

1. Run `npm run build:extension`.
2. Open `chrome://extensions` or `brave://extensions`.
3. Enable Developer Mode.
4. Click "Load unpacked".
5. Select `build-extension/`.
6. Test on a page with an `input[type="password"]`.

### Firefox

1. Run `npm run package:extension`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click "Load Temporary Add-on".
4. Select the generated Firefox ZIP or its `manifest.json` after extracting.
5. Test popup generation, copying, and password-field insertion.

## Store Listing

### Name

Keymoji Password Generator

### Short Description

Generate secure emoji passwords locally and insert them into password fields after confirmation.

### Single Purpose

Keymoji generates emoji-based passwords locally in the browser and inserts them into password fields only after explicit user confirmation.

### Detailed Description

Keymoji turns password creation into a simple local browser action.

The extension detects password fields and asks before creating a Keymoji. After you confirm, it generates an emoji password locally with the Web Crypto API and inserts it into the selected password field.

Privacy-first by design:

- Generated Keymojis never leave your browser.
- Existing password field values are not stored, transmitted, or sent to Keymoji servers.
- No account, analytics, tracking cookies, n8n workflow, or AI backend is used by the extension MVP.
- Only local extension preferences such as level, prompt visibility, and copy behavior are stored in browser extension storage.

## Permission Justification

### `storage`

Used to store local extension preferences, such as the selected Keymoji level, prompt visibility, and whether copying is enabled.

### `clipboardWrite`

Used only when the user explicitly copies a generated Keymoji or enables the optional "copy when inserting" setting.

### Content Script on `<all_urls>`

Required to detect password fields across websites. The content script does not store, transmit, or send existing password values to any server. It only displays the Keymoji prompt and inserts a newly generated Keymoji after explicit user confirmation.

## Privacy Policy URL

Use:

```text
https://keymoji.wtf/privacy
```

The privacy policy must stay consistent with the extension behavior:

- local generation only
- no analytics in the extension MVP
- no generated Keymojis sent to servers
- local preferences stored in browser extension storage

## Store-Specific Notes

### Chrome Web Store

- Upload `keymoji-extension-chrome-edge-brave-v0.1.0.zip`.
- Complete Privacy Practices with the single purpose and permission justifications above.
- Data collection: declare that the extension does not collect or transmit user data outside the local browser.
- Host/content-script access is needed for password-field detection on websites.

### Brave

- Brave users install Chromium extensions via the Chrome Web Store.
- Use the Chrome Web Store listing and mention Brave compatibility in the description only if the submitted package has been tested in Brave.

### Microsoft Edge Add-ons

- Upload `keymoji-extension-chrome-edge-brave-v0.1.0.zip`.
- Complete the Partner Center Privacy page.
- Use the same single purpose and permission justifications as Chrome.
- Declare no remote code and no data transmission outside the local browser.

### Firefox Add-ons (AMO)

- Upload `keymoji-extension-firefox-v0.1.0.zip`.
- The Firefox manifest includes:
  - `browser_specific_settings.gecko.id`
  - `browser_specific_settings.gecko.strict_min_version`
  - `browser_specific_settings.gecko.data_collection_permissions.required: ["none"]`
- If future versions add analytics, remote sync, or any data transmission, update this manifest and the privacy policy before submission.

## Required Store Assets

- Icon 128x128 px
- At least one screenshot, recommended 1280x800 or 640x400
- Optional promotional image
- Privacy policy URL: `https://keymoji.wtf/privacy`
- Support email: `hello@keymoji.wtf`
- Support URL: `https://keymoji.wtf/contact`

## Release Checklist

- [ ] `npm run package:extension` succeeds
- [ ] ZIP files are created for Chromium and Firefox
- [ ] `build-extension/manifest.json` has the correct version
- [ ] Extension loads via `chrome://extensions`
- [ ] Extension loads via `brave://extensions`
- [ ] Extension loads in Edge extensions page
- [ ] Firefox package loads via `about:debugging`
- [ ] Popup opens and generates a Keymoji
- [ ] Password-field prompt appears only after focusing a password input
- [ ] Prompt inserts only after user click
- [ ] Copying works only after user action
- [ ] No generated Keymoji is stored
- [ ] No generated Keymoji is sent over the network
- [ ] Privacy policy is deployed at `https://keymoji.wtf/privacy`
- [ ] Store listing permission explanations match the manifest
