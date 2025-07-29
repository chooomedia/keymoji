#!/bin/bash

# Keymoji Backend Deployment Script
# Führt das Vercel Deployment durch

echo "🚀 Starting Keymoji Backend Deployment..."

# Prüfe ob Vercel CLI installiert ist
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Prüfe Environment Variables
echo "📋 Checking Environment Variables..."

# Liste der erforderlichen Environment Variables
required_vars=(
    "BREVO_API_KEY"
    "N8N_ACCOUNT_WEBHOOK_URL"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please set these variables in your Vercel dashboard or .env file"
    exit 1
fi

echo "✅ All required environment variables are set"

# Prüfe ob wir im richtigen Verzeichnis sind
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found. Please run this script from the backend directory"
    exit 1
fi

# Prüfe Dependencies
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Teste die APIs lokal (optional)
echo "🧪 Testing APIs locally..."
echo "   - Account API: http://localhost:3000/api/account"
echo "   - Magic Link API: http://localhost:3000/api/magic-link/send"
echo "   - Test Emails API: http://localhost:3000/api/test-emails"

# Deploy zu Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Set environment variables in Vercel dashboard"
    echo "   2. Test the APIs with your domain"
    echo "   3. Update frontend API configuration"
    echo ""
    echo "🔗 API Endpoints:"
    echo "   - Account Management: https://your-app.vercel.app/api/account"
    echo "   - Magic Link Send: https://your-app.vercel.app/api/magic-link/send"
    echo "   - Magic Link Verify: https://your-app.vercel.app/api/magic-link/verify"
    echo "   - Test Emails: https://your-app.vercel.app/api/test-emails"
else
    echo "❌ Deployment failed!"
    exit 1
fi 