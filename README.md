# Tuma - Local Currency LLM Platform (MVP)

Tuma is an MVP platform that allows users in emerging markets to access LLM APIs (e.g., GPT-4, Claude) via post-paid, local-currency wallets. Users don't pre-buy credits; API usage is automatically deducted in their local currency (NGN, INR, BRL, etc.) with optional spending caps.

## 🚀 Features

- **Multi-Currency Wallets**: Support for USD, NGN, INR, BRL with real-time FX conversion
- **Post-Paid Model**: No pre-purchasing of credits required
- **Spending Caps**: Monthly or per-session spending limits
- **Real-Time Updates**: Live wallet balance and usage notifications via Supabase Realtime
- **Multiple LLM Providers**: Access to GPT-4, Claude, and other models via OpenRouter
- **Cost Estimation**: Real-time cost calculation before API calls
- **Payment Integration**: Support for Stripe, Flutterwave, Paystack, and more

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for modern UI
- **Supabase Auth** for authentication
- **Supabase Realtime** for live updates

### Backend
- **Supabase** (Database + Auth + Realtime + Edge Functions)
- **OpenRouter** for LLM API access
- **Shadow USD Ledger** for quota management
- **Edge Functions** for API routing and wallet management

### Database Schema
- Users and authentication
- Multi-currency wallets
- FX rates with markup
- Transaction history
- Usage tracking
- Payment intents
- Shadow USD ledger

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- Supabase account
- OpenRouter API key
- Payment provider accounts (optional for MVP)

### 1. Clone and Install
```bash
git clone <repository-url>
cd tuma-mvp
npm install
```

### 2. Environment Variables
Copy `env.example` to `.env.local` and fill in your credentials:

```bash
cp env.example .env.local
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql`
3. Deploy the Edge Functions:
   ```bash
   supabase functions deploy chat
   supabase functions deploy wallet-management
   ```

### 4. Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📱 Usage

### For Users
1. **Sign Up**: Create an account with email or Google OAuth
2. **Create Wallet**: Set up wallets in your preferred currencies
3. **Set Spending Caps**: Configure monthly or per-session limits
4. **Use LLMs**: Select models and send messages with real-time cost estimation
5. **Top Up**: Add funds to wallets via integrated payment methods

### For Developers
The platform provides a clean API for:
- Wallet management
- Cost estimation
- LLM API calls
- Usage tracking
- Payment processing

## 🔧 API Endpoints

### Chat API
```typescript
POST /api/chat
{
  "model": "gpt-4",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ],
  "max_tokens": 1000,
  "temperature": 0.7
}
```

### Wallet Management
```typescript
// Create wallet
POST /api/wallet-management?action=create
{
  "currency": "NGN",
  "spending_cap": 10000,
  "spending_cap_type": "monthly"
}

// Top up wallet
POST /api/wallet-management?action=topup
{
  "wallet_id": "wallet-id",
  "amount": 5000,
  "payment_method": "stripe"
}
```

## 💰 Pricing Model

- **FX Markup**: 5% markup on currency conversion
- **Real-Time Rates**: Live FX rates with automatic updates
- **Transparent Pricing**: All costs shown before API calls
- **No Hidden Fees**: Clear breakdown of all charges

## 🔒 Security

- **Row Level Security**: Database policies ensure data isolation
- **JWT Authentication**: Secure session management
- **API Rate Limiting**: Prevents abuse and ensures fair usage
- **Spending Caps**: User-defined limits prevent overspending
- **Shadow Ledger**: System-level quota management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Monitoring

- **Supabase Dashboard**: Database and function monitoring
- **Usage Analytics**: Built-in usage tracking and reporting
- **Error Logging**: Comprehensive error tracking and alerts
- **Performance Metrics**: API response times and success rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Additional payment methods
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Webhook support
- [ ] Multi-tenant support
- [ ] Advanced spending controls
- [ ] Batch processing
- [ ] Custom model support

---

Built with ❤️ for emerging markets
