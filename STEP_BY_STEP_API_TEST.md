# Step-by-Step API Test - Chart Data Loading

## 🔍 Systematischer Test: Backend → Frontend → Chart

---

## 📋 **TEST 1: Backend Endpoint prüfen**

### **Command:**

```bash
curl -X POST https://its.keymoji.wtf/api/account \
  -H "Content-Type: application/json" \
  -H "Origin: https://keymoji.wtf" \
  -d '{"action":"read","userId":"user_1753963152928","email":"cm@chooo.de"}'
```

### **Expected Response:**

```json
{
    "success": true,
    "account": {
        "userId": "user_1753963152928",
        "email": "cm@chooo.de",
        "tier": "free",
        "metadata": "{\"usageHistory\":[...]}" // JSON string
    }
}
```

### **Check:**

-   ✅ Status 200 OK
-   ✅ success: true
-   ✅ account object present
-   ✅ metadata field present

---

## 📋 **TEST 2: n8n Workflow prüfen**

### **Manual Trigger:**

1. Open: https://n8n.chooomedia.com
2. Find Workflow: `02-account-management-COMPLETE-v2`
3. Click "Execute Workflow"
4. Set Test Data:
    ```json
    {
        "body": {
            "action": "read",
            "userId": "user_1753963152928",
            "email": "cm@chooo.de"
        }
    }
    ```
5. Execute

### **Expected Output:**

```json
{
  "success": true,
  "account": {
    "metadata": {
      "usageHistory": [28 entries]
    }
  }
}
```

### **Check:**

-   ✅ Workflow executes successfully
-   ✅ Google Sheets Lookup finds user
-   ✅ Code Node parses metadata
-   ✅ usageHistory is array (not string)

---

## 📋 **TEST 3: Frontend API Call (Browser)**

### **Im Browser Console (F12):**

```javascript
// Test API call directly from browser
const response = await fetch('https://its.keymoji.wtf/api/account', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
        action: 'read',
        userId: 'user_1753963152928',
        email: 'cm@chooo.de'
    })
});

console.log('Status:', response.status);
const data = await response.json();
console.log('Data:', data);
console.log('UsageHistory:', data.account?.metadata?.usageHistory);
```

### **Expected:**

```
Status: 200
Data: {success: true, account: {...}}
UsageHistory: "[{...},{...},...]" or [{...},{...},...]
```

### **Check:**

-   ✅ No CORS errors
-   ✅ Status 200 (not 429 Rate Limit)
-   ✅ Response has account.metadata
-   ✅ metadata has usageHistory field

---

## 📋 **TEST 4: Frontend Parsing**

### **Im Browser Console:**

```javascript
// Check if safeJSONParse works
const testMetadata = '{"usageHistory":[{"date":"2025-10-10","used":5}]}';

// Simulate parsing
function safeJSONParse(data, fallback = {}) {
    if (!data) return fallback;
    if (typeof data === 'object' && data !== null) return data;
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.warn('Parse failed:', error);
            return fallback;
        }
    }
    return fallback;
}

const parsed = safeJSONParse(testMetadata);
console.log('Parsed:', parsed);
console.log('UsageHistory type:', typeof parsed.usageHistory);
console.log('Is array:', Array.isArray(parsed.usageHistory));
```

### **Expected:**

```
Parsed: {usageHistory: Array(1)}
UsageHistory type: "object"
Is array: true
```

---

## 📋 **TEST 5: Store Update**

### **Im Browser Console:**

```javascript
// Check currentAccount store
const account = window.$currentAccount;

console.log('Has account:', !!account);
console.log('Has metadata:', !!account?.metadata);
console.log('Metadata type:', typeof account?.metadata);
console.log('Has usageHistory:', !!account?.metadata?.usageHistory);
console.log('UsageHistory type:', typeof account?.metadata?.usageHistory);
console.log('Is array:', Array.isArray(account?.metadata?.usageHistory));
console.log('Length:', account?.metadata?.usageHistory?.length);
```

### **Expected:**

```
Has account: true
Has metadata: true
Metadata type: "object"
Has usageHistory: true
UsageHistory type: "object"
Is array: true
Length: 28
```

---

## 📋 **TEST 6: Chart Data Extraction**

### **Im Browser Console:**

```javascript
// Test getUsageHistory
import { getUsageHistory } from './src/utils/usageHistoryHelpers.js';

const history = getUsageHistory(window.$currentAccount);
console.log('History:', history);
console.log('Length:', history.length);
console.log('First:', history[0]);
console.log('Last:', history[history.length - 1]);
```

### **Expected:**

```
History: Array(28) [{...}, {...}, ...]
Length: 28
First: {date: "2025-10-10", used: 5, ...}
Last: {date: "2025-09-13", used: 6, ...}
```

---

## 📋 **TEST 7: Chart Data Generation**

### **Im Browser Console:**

```javascript
// Simulate chart data generation
const history = window.$currentAccount?.metadata?.usageHistory || [];
const today = new Date();
const chartData = [];

for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const entry = history.find(h => h.date === dateStr);
    chartData.push({
        date: dateStr,
        value: entry?.used || 0,
        found: !!entry
    });
}

console.log('Chart data points:', chartData.length);
console.log('Points from history:', chartData.filter(d => d.found).length);
console.log(
    'Points with value > 0:',
    chartData.filter(d => d.value > 0).length
);
console.table(chartData);
```

### **Expected:**

```
Chart data points: 28
Points from history: 28
Points with value > 0: 28
(Table with all 28 entries)
```

---

## 📋 **TEST 8: Chart Rendering**

### **Visual Check:**

Navigate to `/account` page and verify:

-   ✅ Chart container visible
-   ✅ SVG element present
-   ✅ Path element (line) drawn
-   ✅ 28 circle elements (data points)
-   ✅ Tooltips on hover
-   ✅ Animation plays

### **DOM Inspection (F12 → Elements):**

```html
<svg width="100%" height="200">
    <path d="M 0 120 L 27 100 L ..." stroke="#eab308" />
    <circle cx="0" cy="120" r="4" />
    <circle cx="27" cy="100" r="4" />
    ... (28 circles total)
</svg>
```

---

## 🔍 **DIAGNOSTIC CHECKLIST:**

Run through each test and note results:

| Test                 | Status | Notes                    |
| -------------------- | ------ | ------------------------ |
| 1. Backend Endpoint  | ⏳     | curl test result         |
| 2. n8n Workflow      | ⏳     | Manual execution result  |
| 3. Frontend API Call | ⏳     | Browser fetch result     |
| 4. JSON Parsing      | ⏳     | safeJSONParse test       |
| 5. Store Update      | ⏳     | currentAccount check     |
| 6. Data Extraction   | ⏳     | getUsageHistory result   |
| 7. Data Generation   | ⏳     | generateChartData result |
| 8. Chart Rendering   | ⏳     | Visual verification      |

---

## 🚨 **Common Issues:**

### **Issue 1: Status 429 (Rate Limit)**

```
❌ Failed to load resource: 429
```

**Solution:** Wait 15 minutes for rate limit to reset, OR use production URL.

### **Issue 2: CORS Error**

```
❌ CORS policy blocked
```

**Solution:** Test on https://keymoji.wtf instead of localhost.

### **Issue 3: metadata is string**

```
❌ metadata type: "string"
```

**Solution:** n8n workflow needs Code Node to parse, OR frontend safeJSONParse() should handle it.

### **Issue 4: No usageHistory in response**

```
❌ metadata: {} (empty)
```

**Solution:** Update Google Sheets with complete metadata string.

---

## ⚡ **QUICK BYPASS FOR TESTING:**

If ANY test fails, use this to verify chart component works:

```javascript
window.chartDebugger.injectTestData();
location.reload();
```

**This proves:**

-   ✅ Chart component works
-   ✅ SVG rendering works
-   ✅ Animations work
-   Problem is only in data loading, not rendering!

---

## 📊 **Next Steps:**

1. **Run Test 1** (curl)
2. **Check result**
3. **If OK:** Run Test 2
4. **If FAIL:** Share error, I'll fix

Share the output of each test and we'll debug step-by-step! 🔍
