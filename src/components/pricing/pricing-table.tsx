'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CURRENCIES } from '@/lib/currencies'
import { CurrencyConversionService } from '@/lib/currency-conversion'
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react'

const models = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable model for complex reasoning',
    inputPrice: 5.00,
    outputPrice: 15.00,
    context: '128k',
    speed: 'Fast',
    quality: 'Excellent',
    popular: true
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Fast and efficient for most tasks',
    inputPrice: 0.15,
    outputPrice: 0.60,
    context: '128k',
    speed: 'Very Fast',
    quality: 'Very Good',
    popular: false
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced performance and speed',
    inputPrice: 3.00,
    outputPrice: 15.00,
    context: '200k',
    speed: 'Fast',
    quality: 'Excellent',
    popular: false
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fastest model for simple tasks',
    inputPrice: 0.25,
    outputPrice: 1.25,
    context: '200k',
    speed: 'Very Fast',
    quality: 'Good',
    popular: false
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Cost-effective for basic tasks',
    inputPrice: 0.50,
    outputPrice: 1.50,
    context: '16k',
    speed: 'Very Fast',
    quality: 'Good',
    popular: false
  },
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B',
    provider: 'Meta',
    description: 'Open source alternative',
    inputPrice: 0.20,
    outputPrice: 0.20,
    context: '128k',
    speed: 'Fast',
    quality: 'Good',
    popular: false
  }
]

const features = [
  'Pay-as-you-go pricing',
  'No monthly commitments',
  'Real-time usage tracking',
  'Multi-currency support',
  'API key management',
  'Usage analytics',
  'Webhook notifications',
  '24/7 support'
]

export function PricingTable() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  const getCurrencyRate = (currencyCode: string) => {
    const currency = CURRENCIES.find(c => c.code === currencyCode)
    return currency?.rate || 1
  }

  const convertPrice = (usdPrice: number, currencyCode: string) => {
    if (currencyCode === 'USD') return usdPrice
    
    try {
      const conversion = CurrencyConversionService.convertFromUSD(usdPrice, currencyCode)
      return conversion.convertedAmount
    } catch {
      // Fallback to basic rate if conversion fails
      const rate = getCurrencyRate(currencyCode)
      return usdPrice * rate
    }
  }

  const formatPrice = (price: number, currencyCode: string) => {
    const convertedPrice = convertPrice(price, currencyCode)
    const currency = CURRENCIES.find(c => c.code === currencyCode)
    return `${currency?.symbol || '$'}${convertedPrice.toFixed(2)}`
  }

  return (
    <div className="space-y-8">
      {/* Currency Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4 p-6 bg-white rounded-lg border border-purple-100">
          <span className="text-sm font-medium text-gray-700">View pricing in:</span>
          <div className="flex items-center gap-2">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => setSelectedCurrency(currency.code)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCurrency === currency.code
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <span className="mr-2">{currency.flag}</span>
                {currency.code}
              </button>
            ))}
          </div>
        </div>
        
        {/* Currency Conversion Notice */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Currency Conversion with 10% Spread</p>
              <p>
                All prices are converted from USD using current exchange rates plus a 10% spread. 
                This ensures competitive pricing while covering operational costs and providing 
                reliable service across all supported currencies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-purple-100">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-3 gap-6">
        {models.map((model) => (
          <Card 
            key={model.id} 
            className={`border-purple-100 hover:shadow-purple transition-shadow ${
              model.popular ? 'ring-2 ring-purple-200' : ''
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{model.name}</CardTitle>
                    <p className="text-sm text-gray-500">{model.provider}</p>
                  </div>
                </div>
                {model.popular && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">{model.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Input (per 1M tokens)</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(model.inputPrice, selectedCurrency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Output (per 1M tokens)</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(model.outputPrice, selectedCurrency)}
                  </span>
                </div>
              </div>

              {/* Model Specs */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Context Length</span>
                  <span className="text-sm font-medium text-gray-900">{model.context}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Speed</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{model.speed}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quality</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{model.quality}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                className={`w-full ${
                  model.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                Create API Key
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Calculator */}
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Cost Calculator</CardTitle>
          <p className="text-gray-600">Estimate your monthly costs based on usage</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                {models.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Tokens (per month)
              </label>
              <input 
                type="number" 
                placeholder="1000000"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Tokens (per month)
              </label>
              <input 
                type="number" 
                placeholder="500000"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Cost
              </label>
              <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="text-lg font-semibold text-purple-700">
                  {formatPrice(25.50, selectedCurrency)}/month
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PricingTable
