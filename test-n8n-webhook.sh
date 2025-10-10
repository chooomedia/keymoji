#!/bin/bash
# Test n8n Webhook direkt - Überprüfe ob Response kommt

echo "🧪 Testing n8n Account Webhook..."
echo ""

# Test 1: UPDATE Action (das ist das Problem!)
echo "📊 Test 1: UPDATE action"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update",
    "userId": "test_user_123456",
    "email": "test@keymoji.wtf",
    "tier": "free",
    "profile": {
      "name": "Test User"
    },
    "metadata": {
      "settings": {
        "theme": "dark",
        "language": "en"
      },
      "usageHistory": [
        {"date": "2025-10-10", "used": 5},
        {"date": "2025-10-09", "used": 3},
        {"date": "2025-10-08", "used": 7}
      ]
    },
    "lastLogin": "2025-10-10T18:00:00.000Z",
    "timestamp": "2025-10-10T18:00:00.000Z"
  }' | jq '.'

echo ""
echo ""

# Test 2: GET Action (sollte funktionieren)
echo "📊 Test 2: GET action"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -H "Content-Type: application/json" \
  -d '{
    "action": "get",
    "userId": "test_user_123456",
    "email": "test@keymoji.wtf",
    "timestamp": "2025-10-10T18:00:00.000Z"
  }' | jq '.'

echo ""
echo ""

# Test 3: CREATE Action
echo "📊 Test 3: CREATE action"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST https://n8n.chooomedia.com/webhook/xn--moji-pb73c-account \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create",
    "userId": "test_user_new_789",
    "email": "newuser@keymoji.wtf",
    "tier": "free",
    "profile": {
      "name": "New User"
    },
    "metadata": {
      "createdAt": "2025-10-10T18:00:00.000Z",
      "settings": {},
      "usageHistory": []
    },
    "timestamp": "2025-10-10T18:00:00.000Z"
  }' | jq '.'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Tests complete!"
echo ""
echo "📋 Erwartete Responses:"
echo "  - Test 1 (UPDATE): {success: true, account: {...}}"
echo "  - Test 2 (GET):    {success: true, account: {...}}"
echo "  - Test 3 (CREATE): {success: true, account: {...}}"
echo ""
echo "❌ Wenn UPDATE leer ist:"
echo "  → n8n Switch Node fehlt 'update' Case!"
echo "  → Siehe: FIX_N8N_WORKFLOW.md"
echo ""

