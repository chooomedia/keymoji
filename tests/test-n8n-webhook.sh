#!/bin/bash
# Test Script für n8n Apertus Webhook

# Navigate to project root (script may be called from tests/ or project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

# Farben für Output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Testing n8n Apertus Webhook"
echo "════════════════════════════════════════════════════════════════"

# Token und URL aus .env.local lesen
if [ -f .env.local ]; then
    TOKEN=$(grep VITE_N8N_APERTUS_TOKEN .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
    if [ -z "$TOKEN" ]; then
        echo -e "${RED}❌ Token nicht in .env.local gefunden${NC}"
        echo "Führe aus: npm run generate:token:dev"
        exit 1
    fi
    echo -e "${GREEN}✅ Token gefunden${NC}"
    
    # Webhook URL aus .env.local lesen (falls gesetzt), sonst Fallback
    N8N_BASE=$(grep VITE_N8N_URL .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
    if [ -z "$N8N_BASE" ]; then
        echo -e "${YELLOW}⚠️  VITE_N8N_URL nicht in .env.local gefunden, verwende Fallback${NC}"
        N8N_BASE="https://n8n.chooomedia.com/webhook"
    fi
    WEBHOOK_URL="${N8N_BASE}/apertus-test"
else
    echo -e "${RED}❌ .env.local nicht gefunden${NC}"
    exit 1
fi

echo ""
echo "📡 Sende Test-Request an: $WEBHOOK_URL"
echo ""

# Test-Request senden
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"prompt\": \"Erstelle eine Landingpage für mein Startup\",
    \"model\": \"apertus-8b-2509\",
    \"max_tokens\": 512,
    \"temperature\": 0.7,
    \"language\": \"Deutsch\",
    \"token\": \"$TOKEN\"
  }")

# HTTP Status Code extrahieren
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "════════════════════════════════════════════════════════════════"
echo "📥 Response:"
echo "════════════════════════════════════════════════════════════════"

# Status Code prüfen
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ HTTP Status: $HTTP_CODE (OK)${NC}"
else
    echo -e "${RED}❌ HTTP Status: $HTTP_CODE${NC}"
fi

echo ""
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"

echo ""
echo "════════════════════════════════════════════════════════════════"

# Response analysieren
if echo "$BODY" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Success: true${NC}"
    echo -e "${GREEN}✅ Webhook funktioniert korrekt!${NC}"
elif echo "$BODY" | grep -q '"error_code":"INVALID_TOKEN"'; then
    echo -e "${YELLOW}⚠️  Invalid Token${NC}"
    echo "Prüfe:"
    echo "  1. Token in n8n Environment Variables gesetzt?"
    echo "  2. Variable Name: N8N_APERTUS_TOKEN"
    echo "  3. Token identisch mit .env.local?"
elif echo "$BODY" | grep -q '"error"'; then
    echo -e "${RED}❌ Error in Response${NC}"
    echo "Prüfe n8n Workflow Logs"
else
    echo -e "${YELLOW}⚠️  Unbekannte Response${NC}"
fi

echo ""

