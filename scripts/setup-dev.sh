#!/bin/bash

# Tuma MVP Development Setup Script

echo "🚀 Setting up Tuma MVP for development..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your actual Supabase credentials"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - OPENROUTER_API_KEY"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Please install it:"
    echo "   npm install -g supabase"
    echo "   or visit: https://supabase.com/docs/guides/cli"
else
    echo "✅ Supabase CLI found"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run 'supabase start' to start local development"
echo "3. Run 'npm run dev' to start the Next.js development server"
echo "4. Visit http://localhost:3000 to see the application"
echo ""
echo "📚 For more information, see README.md"
