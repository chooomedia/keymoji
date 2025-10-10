# n8n Workflow Fix Summary

## 🔴 **Problem:**

```
Backend: action: 'get' ✓
n8n: Receives 'get' ✓
n8n: Validates 'get' ✓
n8n: NO ROUTE for 'get'! ❌
n8n: Returns empty response ❌
Backend: 500 Error ❌
```

---

## ✅ **Fix Required in n8n:**

### **Current Workflow:**

```
Webhook Trigger
  ↓
Validate Data (checks validActions)
  ↓
??? (NO ROUTE FOR 'get'!)
  ↓
Empty Response
```

### **Required Workflow:**

```
Webhook Trigger
  ↓
Validate Data
  ↓
IF Node: Check Action
  ├─ action === 'create' → Create Branch
  ├─ action === 'update' → Update Branch
  └─ action === 'get'    → Lookup Branch (ADD THIS!)
  ↓
Google Sheets Lookup (for 'get')
  ↓
Code Node: Parse JSON
  ↓
Send Response with data
```

---

## 🔧 **n8n Changes Needed:**

### **1. Add IF Node (after Validate Data)**

**Conditions:**
```javascript
Condition 1: {{ $json.action }} === "create"
Condition 2: {{ $json.action }} === "update"
Condition 3: {{ $json.action }} === "get"     // ADD THIS!
```

### **2. Connect 'get' Output**

```
IF Node (Output 3: get)
  ↓
Google Sheets Lookup
  ↓
Code Node: Parse Response
  ↓
Send Response
```

### **3. Google Sheets Lookup Config**

```json
{
  "operation": "search",
  "sheetName": "accounts",
  "filters": {
    "conditions": [{
      "column": "userId",
      "condition": "equals",
      "value": "={{ $json.userId }}"
    }]
  }
}
```

### **4. Code Node: Parse Response**

```javascript
const lookupData = $input.first().json;

function parseJSON(str, fallback = {}) {
    if (!str) return fallback;
    try {
        let parsed = typeof str === 'string' ? JSON.parse(str) : str;
        // Double-parse if still string
        if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
        }
        return parsed;
    } catch {
        return fallback;
    }
}

const profile = parseJSON(lookupData.profile);
const metadata = parseJSON(lookupData.metadata);

return {
    json: {
        userId: lookupData.userId,
        email: lookupData.email,
        tier: lookupData.tier || 'free',
        createdAt: lookupData.createdAt,
        lastLogin: lookupData.lastLogin,
        profile: profile,
        metadata: metadata,
        status: lookupData.status || 'active'
    }
};
```

---

## ⏱️ **Timeline:**

**Bis n8n gefixt ist:**
```javascript
// Use this to test UI/UX:
window.chartDebugger.injectTestData()
location.reload()
```

**Nach n8n Fix:**
```
1. Reload browser
2. Login
3. Chart lädt automatisch echte Daten aus Google Sheets
4. Alle Features funktionieren!
```

---

## 📦 **Status:**

- [x] Backend: action 'get' implemented ✓
- [x] Frontend: safeJSONParse() double-parse ✓
- [x] Google Sheets: Data available (double-escaped) ✓
- [ ] n8n: Need to add 'get' route ❌
- [ ] Testing: Use injectTestData() meanwhile ⏳

---

**Created:** 2025-10-10  
**Priority:** HIGH (blocks chart feature)  
**Workaround:** injectTestData() ✅
