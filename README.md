# 🔑 Keymoji - Emoji Password Generator

> **Sichere, unvergessliche Passwörter mit Emojis. KI-resistent. Privacy-First. Open Source.**

[![Version](https://img.shields.io/badge/version-0.5.8-blue.svg)](https://github.com/chooomedia/keymoji)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Made with Svelte](https://img.shields.io/badge/made%20with-svelte-ff3e00.svg)](https://svelte.dev)

🌐 **Live App:** [keymoji.wtf](https://keymoji.wtf)  
📧 **Contact:** [hello@keymoji.wtf](mailto:hello@keymoji.wtf)  
👨‍💻 **Author:** Christopher Matt (C. Matt)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Development Server:** `http://localhost:8080`

---

## ✨ Features

### 🎯 **Core Features**
- **Random Emoji Generation** - Sichere, zufällige Emoji-Kombinationen
- **Story Mode** - KI-basierte Emoji-Generierung aus Texten
- **15+ Languages** - inkl. Klingonisch & Elbisch! 🖖
- **Dark/Light Mode** - Automatische Theme-Erkennung
- **PWA-Ready** - Offline-fähig, installierbar

### 🔐 **Security**
- **KI-resistent** - Unknackbar für moderne AI-Systeme
- **Privacy-First** - Keine Daten auf fremden Servern
- **Client-Side Processing** - Alles lokal im Browser
- **Zero-Knowledge** - Wir sehen deine Passwörter nie

### 👤 **Account System**
- **FREE Tier** - 9 tägliche Generierungen
- **PRO Tier** - 35 tägliche Generierungen
- **Magic Link Login** - Kein Passwort nötig
- **Usage Charts** - SVG Charts mit 365-Tage Historie
- **Settings Sync** - localStorage + Backend + Google Sheets

---

## 🏗️ Tech Stack

### **Frontend**
- **Svelte** - Reactive Framework
- **Tailwind CSS** - Utility-First Styling
- **Webpack** - Module Bundler
- **PostCSS** - CSS Processing

### **Backend**
- **Vercel Serverless** - API Functions
- **n8n Automation** - Workflow Engine
- **Google Sheets** - Database
- **Brevo** - Email Service
- **Stripe** - Payment Processing (coming soon)

### **Architecture**
```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                      │
│  Svelte + Tailwind + Stores + localStorage      │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│              VERCEL SERVERLESS                  │
│         /api/account, /api/magic-link           │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│               N8N WORKFLOWS                     │
│    Smart Merge, Validation, Routing             │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│              GOOGLE SHEETS                      │
│   accounts, usageHistory, settings, metadata    │
└─────────────────────────────────────────────────┘
```

---

## 📊 Data Flow (v0.5.8)

### **Bi-Directional Sync**
```
User Action → Frontend Store → localStorage → Backend API
              ↓                                    ↓
         Update UI                            n8n Workflow
              ↑                                    ↓
         Sync Back ← Backend Response ← Google Sheets
```

### **UsageHistory Tracking**
```
Emoji Generation
  → incrementDailyUsage()
  → saveToUsageHistory() (merge today's data)
  → saveUsageToAPI() (send to backend)
  → n8n Smart Merge (preserve existing!)
  → Google Sheets Update
  → Sync Response Back
  → All Stores Updated
  → Charts Auto-Refresh
```

### **Settings Update**
```
Change Name
  → Get LATEST usageHistory (store > localStorage)
  → saveSettingsToAPI()
  → Send: { metadata: { settings: {...}, usageHistory: [...] } }
  → n8n preserves usageHistory (smart merge!)
  → Sync response to all stores
  → UsageHistory NEVER lost!
```

---

## 🧪 Development

### **Localhost Helpers**

```javascript
// Load real data from n8n (bypasses Vercel 404 on localhost)
await window.loadRealData()

// Debug tools
window.keymojiDebug.showStores()
window.testUserSettings()
```

### **Key Files**

- `src/stores/dailyUsageStore.js` - Usage tracking & limits
- `src/stores/userDataStore.js` - User settings & usageHistory
- `src/stores/accountStore.js` - Authentication & session
- `src/components/Core/EmojiDisplay.svelte` - Main generator
- `src/routes/AccountManager.svelte` - Account & charts
- `n8n-workflows/process-update-node-FIXED.js` - n8n smart merge logic

### **Important Patterns**

**Fresh Metadata Pattern:**
```javascript
// ❌ NEVER use stale data from stores:
const metadata = account.metadata;

// ✅ ALWAYS get fresh from localStorage:
const currentPrefs = storageHelpers.get(STORAGE_KEYS.USER_PREFERENCES, {});
const freshMetadata = currentPrefs.metadata || {};
```

**Bi-Directional Sync Pattern:**
```javascript
// After API call:
const result = await fetch(...);
if (result.success && result.account) {
  // Parse response
  const parsedMetadata = JSON.parse(result.account.metadata);
  
  // Sync back to stores
  localStorage.setItem(KEY, JSON.stringify(parsedMetadata));
  usageHistoryStore.update(state => ({ ...state, data: parsedMetadata.usageHistory }));
  syncAccountData({ ...account, metadata: parsedMetadata });
}
```

---

## 🔧 n8n Workflow Setup

### **Critical: Process Update Node**

Der n8n Workflow **MUSS** die `usageHistory` mit Smart Merge behandeln!

**Code für n8n "Process Update" Node:**
```javascript
// Get existing from Google Sheets
const existingUsageHistory = existingMetadata.usageHistory || [];

// Get incoming from webhook
const incomingUsageHistory = incomingMetadata.usageHistory || [];

// SMART MERGE: Use longest list (never delete!)
const finalUsageHistory = 
  incomingUsageHistory.length > existingUsageHistory.length 
    ? incomingUsageHistory 
    : existingUsageHistory;

// Merge metadata
const mergedMetadata = {
  ...existingMetadata,
  ...incomingMetadata,
  usageHistory: finalUsageHistory  // PRESERVE!
};

// Output as JSON string
return {
  metadata: JSON.stringify(mergedMetadata)
};
```

**Siehe:** `n8n-workflows/process-update-node-FIXED.js` für kompletten Code!

---

## 📈 Version History

### **v0.5.8** - Complete Data Flow Refactor (October 10, 2025)
- 🔄 Bi-directional sync: Frontend ↔ Backend ↔ Google Sheets
- 🎯 Unified generation system (single source of truth)
- 🧭 Language-aware navigation everywhere
- 📊 SVG Charts optimization (larger, edge-to-edge)
- 👤 Smart username fallback (no more "User" placeholder)
- ⚡ n8n workflow with robust smart merge
- 🔐 UsageHistory preservation guaranteed

### **v0.5.7** - UserSettings System Overhaul (October 10, 2025)
- Complete settings architecture refactor
- Tier-aware defaults (FREE vs PRO)
- Bidirectional sync: Buttons ↔ Settings
- Session restore optimization

**Siehe:** `src/data/versions.js` für komplette Version History!

---

## 🧪 Testing

### **Manual Testing**

```bash
# Test 1: Settings Update (should preserve usageHistory)
1. Change name in UserSettings
2. Save
3. Check localStorage: metadata.usageHistory should have entries
4. Reload page → Charts still show data!

# Test 2: Daily Usage Increment
1. Generate emoji
2. Check localStorage: usageHistory updated with today's data
3. Reload page → Chart shows new data point!

# Test 3: Logout → Login
1. Logout (complete cleanup)
2. Login again
3. UsageHistory loaded from backend
4. All data restored correctly
```

### **Console Testing**

```javascript
// Check current usage
JSON.parse(localStorage.getItem('keymoji_user_preferences')).metadata.usageHistory

// Load real data (localhost)
await window.loadRealData()

// Check stores
window.keymojiDebug.showStores()
```

---

## 🐛 Known Issues & Solutions

### **Issue: Charts show "No Data" on localhost**
**Solution:** Run `await window.loadRealData()` in browser console

### **Issue: UsageHistory deleted after settings update**
**Solution:** Update n8n "Process Update" node with code from `process-update-node-FIXED.js`

### **Issue: Language-less redirects**
**Solution:** Fixed in v0.5.8 - all navigation is now language-aware

---

## 📝 Configuration

### **Daily Limits** (`src/config/limits.js`)
```javascript
DAILY_LIMITS = {
  GUEST: 5,   // Not logged in
  FREE: 9,    // Free account
  PRO: 35     // Pro account
}
```

### **Storage Keys** (`src/config/storage.js`)
```javascript
STORAGE_KEYS = {
  USER_PREFERENCES: 'keymoji_user_preferences',
  DAILY_USAGE: 'keymoji_daily_usage',
  USAGE_HISTORY: 'keymoji_usage_history',
  USER_SETTINGS: 'keymoji_user_settings'
}
```

### **API Webhooks** (`src/config/api.js`)
```javascript
WEBHOOKS = {
  ACCOUNT: {
    CRUD: '/api/account',
    UPDATE: '/api/account/update',
    CHECK_EXISTS: '/api/account'
  },
  N8N: {
    ACCOUNT: 'https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account'
  }
}
```

---

## 🎨 UI/UX Highlights

- **Apple/Airbnb-inspired Design** - Clean, modern, intuitive
- **Glassmorphism** - Backdrop blur, gradients, shadows
- **8-Point Grid** - Consistent spacing throughout
- **Accessibility** - ARIA labels, keyboard navigation, focus states
- **Responsive** - Mobile-first, works on all devices
- **Smooth Animations** - Transitions, hover effects, loading states

---

## 🌍 Supported Languages

English • Deutsch • Deutsch (Schweiz) • Español • Nederlands • Italiano • Français • Polski • Русский • Türkçe • Afrikaans • 日本語 • 한국어 • Klingonisch (tlh) • Sindarin (sjn)

---

## 📦 Project Structure

```
keymoji/
├── src/
│   ├── components/     # Svelte components
│   ├── routes/         # Page components (AccountManager, ContactForm, etc.)
│   ├── stores/         # State management (Svelte stores)
│   ├── utils/          # Utility functions
│   ├── config/         # App configuration
│   └── data/           # Static data (languages, versions)
├── keymoji-backend/    # Vercel serverless functions
├── n8n-workflows/      # n8n automation workflows
├── public/             # Static assets
└── webpack/            # Build configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- **Base Template:** [start template project 🎒](https://github.com/davi-mbatista/start)
- **Emoji Data:** Unicode Emoji Standard
- **Inspiration:** Modern password security research

---

## 📞 Support

- **Website:** [keymoji.wtf](https://keymoji.wtf)
- **Email:** [hello@keymoji.wtf](mailto:hello@keymoji.wtf)
- **GitHub Issues:** [Report a bug](https://github.com/chooomedia/keymoji/issues)

---

**Made with ❤️ by Christopher Matt in Germany 🇩🇪**

*Keymoji - Bring emojis into your passwords!* 🔑✨
