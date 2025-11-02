# 🧪 Custom API Testing Guide

## Lokale API-Tests mit CORS

Du kannst deine eigene LLM-API lokal testen, ohne CORS-Probleme zu haben!

---

## 🚀 Schnellstart: Mock-Mode

### **Option 1: Mock-Mode (ohne echten API-Server)**

```bash
# Öffne Keymoji mit Mock-Mode
http://localhost:8080/?mock-custom-api=true

# Dann in UserSettings → Story Mode AI → Custom API testen
```

✅ **Mock-Mode liefert sofortige Test-Emoji**
- Kein CORS-Problem
- Kein API-Server nötig
- Perfekt für UI/UX-Testing

---

## ⚙️ Option 2: Echter API-Server mit CORS

⚠️ **KRITISCH**: OPTIONS-Requests brauchen CORS-Header!

```http
OPTIONS /v1/completions HTTP/1.1
Host: 127.0.0.1:1234
Origin: http://localhost:8080
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type,authorization
```

**Required Response Headers für OPTIONS:**
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:8080
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

---

### **Beispiel: Node.js/Express**

```javascript
const express = require('express');
const app = express();

// CRITICAL: CORS Middleware BEFORE any routes!
app.use((req, res, next) => {
    // ALWAYS set these headers for every request
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    
    // Handle preflight requests (MUST return 200 with headers!)
    if (req.method === 'OPTIONS') {
        console.log('✅ Handling OPTIONS preflight with CORS headers');
        return res.status(200).end();
    }
    
    next();
});

app.post('/v1/completions', (req, res) => {
    console.log('✅ Handling POST request');
    res.json({
        choices: [{
            message: {
                content: '🧪 ✅ 🎯 🔑 💡 🌟'
            }
        }]
    });
});

app.listen(1234, () => {
    console.log('✅ Custom API running on http://127.0.0.1:1234');
});
```

### **Beispiel: Python/Flask**

**✅ Mit korrekten CORS-Headern:**

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

# CRITICAL: CORS Middleware BEFORE routes
@app.before_request
def handle_cors():
    # Set CORS headers for every request
    from flask import make_response
    if request.method == 'OPTIONS':
        response = make_response('', 200)
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8080'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '86400'
        return response
    
    # Add CORS headers to all responses
    if request.method == 'POST':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8080'
        return None  # Continue to route handler

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8080'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route('/v1/completions', methods=['POST', 'OPTIONS'])
def completions():
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        "choices": [{
            "message": {
                "content": "🧪 ✅ 🎯 🔑 💡 🌟"
            }
        }]
    })

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=1234)
```

**🔄 Alternative: Mit Flask-CORS (einfacher):**

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# CRITICAL: CORS middleware handles OPTIONS automatically
CORS(app, origins=["http://localhost:8080"], 
     methods=["POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

@app.route('/v1/completions', methods=['POST', 'OPTIONS'])
def completions():
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        "choices": [{
            "message": {
                "content": "🧪 ✅ 🎯 🔑 💡 🌟"
            }
        }]
    })

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=1234)
```

### **Beispiel: Python/FastAPI**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=86400
)

@app.post("/v1/completions")
async def completions():
    return {
        "choices": [{
            "message": {
                "content": "🧪 ✅ 🎯 🔑 💡 🌟"
            }
        }]
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=1234)
```

---

## 📝 Konfiguration in Keymoji

### **UserSettings → Story Mode AI → Custom API**

**⚠️ WICHTIG**: Wähle das richtige Format für deine API!

```
API URL: http://127.0.0.1:1234
Endpoint: /v1/completions
Format: [siehe unten]
Model: dein-model-name (z.B. apertus-8b-instruct-2509)
API Key: dein-key
```

### **Format-Optionen:**

1. **OpenAI Compatible** (Standard):
   - Request: `{ "model": "...", "messages": [...] }`
   - Response: `{ "choices": [{ "message": { "content": "..." } }] }`
   - ✅ Für OpenAI-kompatible APIs (vLLM, Together AI, etc.)

2. **Raw JSON** (für eigene APIs):
   - Request: `{ "prompt": "...", "model": "...", "max_tokens": ..., "temperature": ... }`
   - Response: `{ "response": "..." }` oder `{ "text": "..." }` oder `{ "content": "..." }`
   - ✅ Für eigene Models mit einfachem Prompt-Format

3. **Claude Compatible**:
   - Request: `{ "model": "...", "messages": [...] }`
   - Response: `{ "content": [{ "text": "..." }] }`
   - ✅ Für Anthropic Claude APIs

---

## 🔍 Erwartete Request/Response

### **Request (OpenAI Format)**

```http
POST http://127.0.0.1:1234/v1/completions
Content-Type: application/json
Authorization: Bearer dein-api-key

{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "You are an emoji generator. Respond ONLY with emojis."
    },
    {
      "role": "user",
      "content": "Test connection: respond with a single emoji"
    }
  ],
  "max_tokens": 150,
  "temperature": 0.7
}
```

### **Response (OpenAI Format)**

```json
{
  "choices": [{
    "message": {
      "content": "🧪 ✅ 🎯 🔑 💡 🌟"
    }
  }]
}
```

### **Alternative: Raw Format Request**

```http
POST http://127.0.0.1:1234/v1/completions
Content-Type: application/json
Authorization: Bearer dein-api-key

{
  "prompt": "You are an emoji generator. Convert this text into emojis: Test connection",
  "model": "apertus-8b-instruct-2509",
  "max_tokens": 150,
  "temperature": 0.7
}
```

### **Raw Format Response**

```json
{
  "response": "🧪 ✅ 🎯 🔑 💡 🌟"
}
```

**oder**

```json
{
  "text": "🧪 ✅ 🎯 🔑 💡 🌟"
}
```

**oder**

```json
{
  "content": "🧪 ✅ 🎯 🔑 💡 🌟"
}
```

---

## 🐛 Fehlerbehandlung

### **CORS Error (OPTIONS Preflight fails)**

```
❌ CORS_ERROR: Cross-Origin Request Blocked. No 'Access-Control-Allow-Origin' header
```

**Symptom im LLM-Log:**
```
Received request: OPTIONS to /v1/completions
Unexpected endpoint or method. (OPTIONS /v1/completions). Returning 200 anyway
```

**Problem:** LLM returned 200 but WITHOUT CORS headers!

**Required Response Headers für OPTIONS (MUST be present!):**
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:8080
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

💡 **Lösung:** 
1. **Beste Option:** Nutze Mock-Mode: `http://localhost:8080/?mock-custom-api=true`
2. **Alternative:** Fix dein LLM-Server Code (siehe Beispiele oben)
3. **Quick Fix:** Füge Proxy mit CORS-Header vor dein LLM (z.B. nginx)

---

### **Network Error**

```
❌ NETWORK_ERROR: Cannot connect to http://127.0.0.1:1234
```

💡 **Lösung:**
1. Starte deinen API-Server: `python app.py` oder `node server.js`
2. Prüfe ob Port 1234 frei ist: `lsof -i :1234`
3. Teste in Browser: `http://127.0.0.1:1234/v1/completions`
4. Oder nutze Mock-Mode: `/?mock-custom-api=true`

---

### **Timeout Error**

```
❌ Request timeout - API took too long to respond
```

💡 **Lösung:**
1. Beschleunige deine API (lese Caching, optimiere Model)
2. Nutze kleinere Models für Tests
3. Prüfe Server-Logs

---

## 🧪 Debug-Tools (Development)

```javascript
// Console (F12)

// Check Story Mode Settings
const settings = getCurrentUserSettings();
console.log('Story Mode:', settings.storyMode);

// Test API Connection
await testAIProvider({
    provider: 'custom',
    apiKey: 'dein-key',
    customApiUrl: 'http://127.0.0.1:1234',
    customEndpoint: '/v1/completions',
    customFormat: 'openai',
    customModel: 'test-model'
});

// Mock Response testen
window.location.search = '?mock-custom-api=true';
```

---

## ✅ Best Practices

1. **Development:** Nutze Mock-Mode für schnelle UI-Tests
2. **Production:** Echte API mit korrekten CORS-Headern
3. **Security:** API-Keys niemals in Code committen
4. **Testing:** Teste erst lokal, dann deployment
5. **Monitoring:** Logge Requests/Responses in Dev-Mode

---

## 🎯 Checklist

- [ ] Mock-Mode getestet: `/?mock-custom-api=true`
- [ ] Lokaler API-Server läuft auf Port 1234
- [ ] CORS-Header konfiguriert
- [ ] OPTIONS Preflight gehandhabt
- [ ] Request-Format validiert (OpenAI/Raw)
- [ ] Response-Format korrekt (choices[0].message.content)
- [ ] API-Key Authentication funktioniert
- [ ] Timeout-Handling implementiert (30s max)
- [ ] Error-Logging aktiviert
- [ ] Production-CORS nur allowed origins

---

## 📚 Weitere Ressourcen

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Google Gemini API](https://ai.google.dev/docs)

---

**Hilfe benötigt?** Öffne ein Issue auf GitHub! 🐙

