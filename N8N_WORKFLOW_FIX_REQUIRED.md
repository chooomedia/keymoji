# n8n Workflow Fix Required - Action 'read' Not Recognized

## 🔴 **ERROR: Status 500**

```json
{
  "error": "Account operation failed. Please try again later.",
  "timestamp": "2025-10-10T13:00:52.814Z"
}
```

**Ursache:** n8n Workflow kennt `action: 'read'` NICHT!

---

## 🔍 **n8n Workflow muss erweitert werden:**

### **Aktuell (Wahrscheinlich):**

```
Webhook Trigger
  ↓
IF Node: Check Action
  Conditions:
    - action === 'create'
    - action === 'update'
  ❌ KEINE Condition für action === 'read'!
  ↓
Falls action === 'read':
  → Workflow stoppt (keine Route!)
  → Error 500 zurück
```

---

## ✅ **n8n Workflow Fix:**

### **Option 1: IF Node erweitern**

In n8n Workflow `02-account-management-COMPLETE-v2`:

**Node: IF (Check Action)**

Füge hinzu:
```
Condition 3:
  {{ $json.body.action }}
  equals
  read
```

**Output:** Connect to "Google Sheets Lookup" Node

---

### **Option 2: 'get' und 'read' zusammenfassen**

**IF Node Condition:**
```
{{ $json.body.action }}
is in
get,read
```

Beide Aktionen führen zum gleichen Google Sheets Lookup!

---

## 📊 **Kompletter n8n Workflow Ablauf:**

```
┌─────────────────────────────────────────────────┐
│ 1. Webhook Trigger                              │
│    Receives: { body: { action, userId, email } }│
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ 2. IF: Check Action                             │
│    Conditions:                                   │
│    • action === 'create' → Create Branch        │
│    • action === 'update' → Update Branch        │
│    • action === 'read'   → Read Branch ← ADD!   │
│    • action === 'get'    → Read Branch ← ADD!   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼ (if action === 'read' or 'get')
┌─────────────────────────────────────────────────┐
│ 3. Google Sheets: Lookup Account                │
│    Sheet: "accounts"                             │
│    Match: userId = {{ $json.body.userId }}      │
│                                                  │
│    Returns:                                      │
│    {                                             │
│      userId, email, tier, createdAt,            │
│      profile: "{...}",  ← JSON string           │
│      metadata: "{\"usageHistory\":[...]}"       │
│    }                                             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ 4. Code Node: Parse Response                    │
│                                                  │
│    const lookupData = $input.first().json;      │
│                                                  │
│    function parseJSON(str, fallback = {}) {     │
│        try {                                     │
│            return typeof str === 'string'        │
│                ? JSON.parse(str)                │
│                : str;                           │
│        } catch { return fallback; }             │
│    }                                             │
│                                                  │
│    const profile = parseJSON(lookupData.profile);│
│    const metadata = parseJSON(lookupData.metadata);│
│                                                  │
│    return {                                      │
│        json: {                                   │
│            ...lookupData,                       │
│            profile: profile,    ← OBJECT!       │
│            metadata: metadata   ← OBJECT!       │
│        }                                         │
│    };                                            │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│ 5. Send Response                                 │
│                                                  │
│    Response Body:                                │
│    {                                             │
│      "success": true,                           │
│      "account": {                               │
│        "userId": "...",                         │
│        "metadata": {                            │
│          "usageHistory": [28 entries]           │
│        }                                         │
│      }                                           │
│    }                                             │
└──────────────────────────────────────────────────┘
```

---

## 🔧 **Schnelle n8n Fix Anleitung:**

### **1. Login zu n8n:**
```
https://n8n.chooomedia.com
```

### **2. Workflow öffnen:**
```
02-account-management-COMPLETE-v2
```

### **3. IF Node bearbeiten:**

**Node Name:** "IF: Check Action" oder "Switch: Action Router"

**Hinzufügen:**

```javascript
// Condition für 'read':
{{ $json.body.action }} === "read"

// ODER kombiniert mit 'get':
{{ $json.body.action }} in ["get", "read"]
```

**Output verbinden mit:** "Google Sheets Lookup" Node

### **4. Workflow Speichern**

### **5. Aktivieren (falls nicht aktiv)**

---

## ⚡ **Alternative: Frontend Test OHNE n8n Fix**

Während n8n Workflow gefixt wird, kannst du testen:

```javascript
// Inject test data
window.chartDebugger.injectTestData()
location.reload()

// Chart sollte funktionieren!
```

Das beweist dass Chart Component funktioniert, nur die Daten fehlen!

---

## 📋 **Checklist:**

- [x] Backend deployed (action: 'read' support)
- [ ] n8n Workflow erweitert (action: 'read' condition)
- [ ] Google Sheets updated (metadata mit usageHistory)
- [ ] Test: curl returns full account data
- [ ] Test: Browser shows chart

---

## 🎯 **Next Step:**

**Entweder:**
1. N8n Workflow erweitern (IF Node + read condition)
2. Test mit injected Data (Quick Win!)

**Welcher Weg?** 🤔

