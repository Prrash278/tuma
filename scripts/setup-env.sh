#!/bin/bash

# Tuma Environment Setup Script

echo "🔧 Setting up Tuma environment variables..."

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create .env.local from template
echo "📝 Creating .env.local with provided API credentials..."
cp env.example .env.local

echo "✅ Environment file created successfully!"
echo ""
echo "🔑 Your API credentials have been configured:"
echo "   - OpenRouter API Key: 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"
echo "   - Rapyd Access Key: rak_8842FB8957199A603890"
echo "   - Rapyd Secret Key: rsk_ebb418e372e7c2bd0f1501ac44100275977ff2352afd9a63f3b306799a1e247f36ec6d7f341ea089"
echo "   - Markup Percentage: 10%"
echo ""
echo "⚠️  Important: You still need to configure:"
echo "   - Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)"
echo "   - JWT_SECRET (generate a secure random string)"
echo "   - WEBHOOK_SECRET (generate a secure random string)"
echo ""
echo "🚀 Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Generate secure secrets for JWT_SECRET and WEBHOOK_SECRET"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📚 For Supabase setup, see README.md"
