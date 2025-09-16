# Tuma - Local Currency LLM Platform

A modern, multi-currency platform for accessing AI models with local currency wallets, designed for emerging markets.

## 🌟 Features

### Multi-Currency Support
- **8 Supported Currencies**: USD, INR, MYR, NGN, MXN, BRL, KES, IDR
- **Individual API Key Wallets**: Each API key has its own wallet in a specific currency
- **Real-time Currency Conversion**: USD to local currency with 10% spread
- **Currency Breakdown Dashboard**: View usage and spending by currency

### AI Model Integration
- **OpenRouter Integration**: Access to multiple AI models through OpenRouter
- **Model Selection**: Choose from GPT-4, Claude, Llama, and more
- **Usage Tracking**: Real-time monitoring of API usage and costs
- **Spending Limits**: Set per-API key spending caps

### Payment Processing
- **Rapyd Integration**: Multi-currency payment processing
- **Wallet Top-ups**: Add funds to individual API key wallets
- **Credit Card Support**: Auto-billing capabilities
- **Mock Payment System**: Development-friendly fallbacks

### Modern UI/UX
- **Purple Theme**: Beautiful, modern design
- **Desktop-First**: Optimized for developer tools
- **Shadcn UI Components**: High-quality, accessible components
- **Responsive Design**: Works across all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenRouter API key
- Rapyd account (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prrash278/tuma.git
   cd tuma
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # OpenRouter
   OPENROUTER_API_KEY=your_openrouter_key
   OPENROUTER_PROVISIONING_KEY=your_provisioning_key
   
   # Rapyd (optional)
   RAPYD_ACCESS_KEY=your_rapyd_access_key
   RAPYD_SECRET_KEY=your_rapyd_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
tuma/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── pricing/           # Pricing page
│   │   └── wallet/            # Wallet pages
│   ├── components/            # React components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── ui/               # Shadcn UI components
│   │   └── modals/           # Modal components
│   ├── lib/                  # Utility libraries
│   │   ├── currencies.ts     # Currency data and utilities
│   │   ├── openrouter.ts     # OpenRouter API integration
│   │   └── rapyd.ts          # Rapyd payment integration
│   └── types/                # TypeScript type definitions
├── supabase/                 # Supabase configuration
└── public/                   # Static assets
```

## 🔧 Configuration

### Currency Settings
The platform supports 8 currencies with real-time conversion rates:

| Currency | Code | Symbol | Flag |
|----------|------|--------|------|
| US Dollar | USD | $ | 🇺🇸 |
| Indian Rupee | INR | ₹ | 🇮🇳 |
| Malaysian Ringgit | MYR | RM | 🇲🇾 |
| Nigerian Naira | NGN | ₦ | 🇳🇬 |
| Mexican Peso | MXN | $ | 🇲🇽 |
| Brazilian Real | BRL | R$ | 🇧🇷 |
| Kenyan Shilling | KES | KSh | 🇰🇪 |
| Indonesian Rupiah | IDR | Rp | 🇮🇩 |

### AI Models Supported
- **OpenAI**: GPT-4, GPT-4o, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Sonnet, Haiku
- **Meta**: Llama 3.1 8B
- **And more** through OpenRouter

## 💳 Payment Integration

### Rapyd Setup
1. Create a Rapyd account
2. Get your Access Key and Secret Key
3. Add them to your `.env.local` file
4. The platform will automatically use Rapyd for payments

### Mock Payments
For development, the platform includes mock payment systems that simulate:
- Payment processing
- Webhook notifications
- Transaction confirmations

## 🎨 UI Components

Built with modern design principles:
- **Purple Theme**: Consistent purple color scheme
- **Shadcn UI**: High-quality, accessible components
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile and desktop optimized

## 📊 Dashboard Features

### Currency Breakdown
- View usage by individual API key currency
- Converted totals in your primary currency
- Native currency amounts for context

### API Key Management
- Create API keys with specific models and currencies
- Set spending limits per key
- Monitor usage in real-time
- Wallet management per key

### Analytics
- Usage trends and patterns
- Cost analysis by currency
- Spending projections

## 🔒 Security

- **Environment Variables**: Sensitive data stored securely
- **API Key Management**: Secure storage and rotation
- **Payment Security**: PCI-compliant through Rapyd
- **Rate Limiting**: Built-in usage controls

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` page in the app
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

## 🎯 Roadmap

- [ ] Mobile app
- [ ] Additional payment methods
- [ ] Advanced analytics
- [ ] Team collaboration features
- [ ] API rate limiting
- [ ] Webhook management

---

Built with ❤️ for developers in emerging markets