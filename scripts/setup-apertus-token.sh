#!/bin/bash
# Setup script for Apertus n8n Token
# This script helps set up the token for both local development and n8n workflow

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "🔐 Apertus n8n Token Setup"
echo "════════════════════════════════════════════════════════════════"

# Step 1: Generate token
echo ""
echo "📝 Step 1: Generating secure token..."
TOKEN=$(node scripts/generate-n8n-token.js --env dev 2>&1 | grep -A 1 "📋 Token:" | tail -1 | xargs)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to generate token. Please run manually:"
    echo "   node scripts/generate-n8n-token.js"
    exit 1
fi

echo "✅ Token generated: ${TOKEN:0:20}..."

# Step 2: Add to .env.local
echo ""
echo "📝 Step 2: Adding token to .env.local..."

ENV_LOCAL="$PROJECT_ROOT/.env.local"

if [ ! -f "$ENV_LOCAL" ]; then
    echo "   Creating .env.local file..."
    touch "$ENV_LOCAL"
fi

# Check if token already exists
if grep -q "VITE_N8N_APERTUS_TOKEN" "$ENV_LOCAL"; then
    echo "   ⚠️  Token already exists in .env.local"
    read -p "   Do you want to replace it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove old token line
        sed -i.bak '/VITE_N8N_APERTUS_TOKEN/d' "$ENV_LOCAL"
        echo "   ✅ Old token removed"
    else
        echo "   ℹ️  Keeping existing token"
        exit 0
    fi
fi

# Add token to .env.local
echo "VITE_N8N_APERTUS_TOKEN=$TOKEN" >> "$ENV_LOCAL"
echo "   ✅ Token added to .env.local"

# Step 3: Instructions for n8n
echo ""
echo "📝 Step 3: Configure n8n Workflow"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Now you need to add this token to your n8n workflow:"
echo ""
echo "1. Open your n8n workflow: https://matt-interfaces.ch/n8n"
echo "2. Find the 'Set Expected Token' node"
echo "3. Replace 'REPLACE_WITH_YOUR_TOKEN' with:"
echo ""
echo "   $TOKEN"
echo ""
echo "4. Save and activate the workflow"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "✅ Setup complete!"
echo ""
echo "💡 Next steps:"
echo "   1. Restart your dev server (npm run dev)"
echo "   2. Test the connection in Settings → Story Mode → Test Button"
echo ""

