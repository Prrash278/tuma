'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreateAPIKeyModal } from '@/components/modals/create-api-key-modal'
import { WalletTopUpModal } from '@/components/modals/wallet-topup-modal'
import { 
  Plus, 
  Key, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Zap,
  Eye,
  Copy,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  Wallet,
  CreditCard,
  ArrowUpRight,
  Settings
} from 'lucide-react'
import { CURRENCIES } from '@/lib/currencies'

// Mock data for demonstration
const mockAPIKeys = [
  {
    id: '1',
    name: 'Production API',
    key: 'tuma_sk_...a1b2c3',
    model: 'gpt-4o-mini',
    currency: 'USD',
    wallet_balance: 75.50,
    wallet_balance_usd: 75.50,
    usage: 24.50, // USD
    limit: 100, // USD
    status: 'active',
    createdAt: '2024-01-15',
    lastUsed: '2 hours ago'
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'tuma_sk_...d4e5f6',
    model: 'claude-3-haiku',
    currency: 'INR',
    wallet_balance: 4200.00,
    wallet_balance_usd: 50.00,
    usage: 680.00, // INR (converted from $8.20 USD)
    limit: 4150.00, // INR (converted from $50 USD)
    status: 'active',
    createdAt: '2024-01-10',
    lastUsed: '1 day ago'
  },
  {
    id: '3',
    name: 'Testing Key',
    key: 'tuma_sk_...g7h8i9',
    model: 'gpt-3.5-turbo',
    currency: 'NGN',
    wallet_balance: 18000.00,
    wallet_balance_usd: 25.00,
    usage: 3465.00, // NGN (converted from $2.10 USD)
    limit: 41250.00, // NGN (converted from $25 USD)
    status: 'paused',
    createdAt: '2024-01-05',
    lastUsed: '3 days ago'
  }
]

const mockUsage = [
  { date: '2024-01-01', requests: 120, cost: 12.50 },
  { date: '2024-01-02', requests: 95, cost: 9.80 },
  { date: '2024-01-03', requests: 150, cost: 15.20 },
  { date: '2024-01-04', requests: 180, cost: 18.40 },
  { date: '2024-01-05', requests: 110, cost: 11.30 },
  { date: '2024-01-06', requests: 200, cost: 20.10 },
  { date: '2024-01-07', requests: 165, cost: 16.80 },
]

export function ModernDashboard() {
  const [userPrimaryCurrency, setUserPrimaryCurrency] = useState('USD')

  // Convert USD amounts to user's primary currency
  const convertToUserCurrency = (usdAmount: number) => {
    const userCurrency = CURRENCIES.find(c => c.code === userPrimaryCurrency)
    return usdAmount * (userCurrency?.rate || 1)
  }

  const getCurrencySymbol = (code: string) => {
    const currency = CURRENCIES.find(c => c.code === code)
    return currency ? currency.symbol : '$'
  }

  const formatCurrency = (usdAmount: number) => {
    const convertedAmount = convertToUserCurrency(usdAmount)
    const symbol = getCurrencySymbol(userPrimaryCurrency)
    return `${symbol}${convertedAmount.toFixed(2)}`
  }

  // Calculate totals in USD first, then convert to user currency
  // Convert individual API key usage from their native currencies to USD
  const totalUsageUSD = mockAPIKeys.reduce((sum, key) => {
    if (key.currency === 'USD') {
      return sum + key.usage
    } else {
      // Convert from native currency to USD using the wallet_balance_usd ratio
      const conversionRate = key.wallet_balance_usd / key.wallet_balance
      return sum + (key.usage * conversionRate)
    }
  }, 0)
  const totalUsageInUserCurrency = convertToUserCurrency(totalUsageUSD)
  
  const totalLimitUSD = mockAPIKeys.reduce((sum, key) => {
    if (key.currency === 'USD') {
      return sum + key.limit
    } else {
      // Convert from native currency to USD using the wallet_balance_usd ratio
      const conversionRate = key.wallet_balance_usd / key.wallet_balance
      return sum + (key.limit * conversionRate)
    }
  }, 0)
  const totalLimitInUserCurrency = convertToUserCurrency(totalLimitUSD)
  
  const activeKeys = mockAPIKeys.filter(key => key.status === 'active').length
  
  // Mock monthly usage in USD, then convert
  const thisMonthUsageUSD = 156.80
  const thisMonthUsageInUserCurrency = convertToUserCurrency(thisMonthUsageUSD)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'paused':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'paused':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default:
        return 'bg-red-50 text-red-700 border-red-200'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your AI API keys and monitor usage across currencies</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            <Activity className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <CreateAPIKeyModal />
        </div>
      </div>

      {/* Currency Selector */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-purple-100">
        <span className="text-sm font-medium text-gray-700">Primary Currency:</span>
        <div className="flex items-center gap-2">
          {CURRENCIES.map((currency) => (
            <button
              key={currency.code}
              onClick={() => setUserPrimaryCurrency(currency.code)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                userPrimaryCurrency === currency.code
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <span className="mr-1">{currency.flag}</span>
              {currency.code}
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs text-gray-500">
          Usage breakdown by currency • Totals converted to {userPrimaryCurrency}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="border-purple-100 hover:shadow-purple transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="space-y-2">
                {mockAPIKeys.map((apiKey) => {
                  const usageInUserCurrency = apiKey.currency === userPrimaryCurrency 
                    ? apiKey.usage 
                    : (apiKey.usage * (apiKey.wallet_balance_usd / apiKey.wallet_balance))
                  const convertedUsage = convertToUserCurrency(usageInUserCurrency)
                  
                  return (
                    <div key={apiKey.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCurrencySymbol(apiKey.currency)}</span>
                        <span className="text-xs text-gray-500">{apiKey.currency}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {apiKey.currency === userPrimaryCurrency 
                            ? `${getCurrencySymbol(apiKey.currency)}${apiKey.usage.toFixed(2)}`
                            : `${getCurrencySymbol(userPrimaryCurrency)}${convertedUsage.toFixed(2)}`
                          }
                        </p>
                        {apiKey.currency !== userPrimaryCurrency && (
                          <p className="text-xs text-gray-500">
                            {getCurrencySymbol(apiKey.currency)}{apiKey.usage.toFixed(2)} native
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(totalUsageUSD)}</span>
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 hover:shadow-purple transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Keys</p>
                <p className="text-2xl font-bold text-gray-900">{activeKeys}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {mockAPIKeys.length} total keys
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Key className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 hover:shadow-purple transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="space-y-2">
                {mockAPIKeys.map((apiKey) => {
                  // Mock monthly usage for each API key (proportional to their usage)
                  const monthlyUsage = (apiKey.usage / totalUsageUSD) * thisMonthUsageUSD
                  const monthlyUsageInUserCurrency = apiKey.currency === userPrimaryCurrency 
                    ? monthlyUsage 
                    : (monthlyUsage * (apiKey.wallet_balance_usd / apiKey.wallet_balance))
                  const convertedMonthlyUsage = convertToUserCurrency(monthlyUsageInUserCurrency)
                  
                  return (
                    <div key={apiKey.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCurrencySymbol(apiKey.currency)}</span>
                        <span className="text-xs text-gray-500">{apiKey.currency}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {apiKey.currency === userPrimaryCurrency 
                            ? `${getCurrencySymbol(apiKey.currency)}${monthlyUsage.toFixed(2)}`
                            : `${getCurrencySymbol(userPrimaryCurrency)}${convertedMonthlyUsage.toFixed(2)}`
                          }
                        </p>
                        {apiKey.currency !== userPrimaryCurrency && (
                          <p className="text-xs text-gray-500">
                            {getCurrencySymbol(apiKey.currency)}{monthlyUsage.toFixed(2)} native
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(thisMonthUsageUSD)}</span>
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 hover:shadow-purple transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Requests Today</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: 52 requests/hour
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Section */}
      <Card className="border-purple-100">
        <CardHeader className="border-b border-purple-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">API Keys</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Display in:</span>
              <select 
                value={userPrimaryCurrency}
                onChange={(e) => setUserPrimaryCurrency(e.target.value)}
                className="text-sm border border-purple-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-purple-100">
            {mockAPIKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-6 hover:bg-purple-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Key className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
                        <Badge className={`text-xs ${getStatusColor(apiKey.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(apiKey.status)}
                            {apiKey.status}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {apiKey.model} • {apiKey.currency} • Last used {apiKey.lastUsed}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {/* Wallet Balance */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Wallet Balance</p>
                      <p className="text-sm font-medium text-gray-900">
                        {getCurrencySymbol(apiKey.currency)}{apiKey.wallet_balance.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ≈ ${apiKey.wallet_balance_usd.toFixed(2)} USD
                      </p>
                    </div>
                    
                    {/* Usage vs Limit */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Usage / Limit</p>
                      <p className="text-sm font-medium text-gray-900">
                        {getCurrencySymbol(apiKey.currency)}{apiKey.usage.toFixed(2)} / {getCurrencySymbol(apiKey.currency)}{apiKey.limit.toFixed(2)}
                      </p>
                      <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                          style={{ width: `${(apiKey.usage / apiKey.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <WalletTopUpModal 
                        apiKey={apiKey}
                        onTopUp={(amount, currency) => {
                          console.log(`Topping up ${apiKey.name} with ${amount} ${currency}`)
                          // TODO: Implement actual top-up logic
                        }}
                      />
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Add Credit Card">
                        <CreditCard className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" title="Copy Key">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" title="Settings">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Chart */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Usage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockUsage.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-8 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                    style={{ height: `${(day.cost / 25) * 200}px` }}
                  />
                  <div className="text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs font-medium text-gray-900">{formatCurrency(day.cost)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CreateAPIKeyModal />
            <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
              <DollarSign className="h-4 w-4 mr-3" />
              Top Up Wallet
            </Button>
            <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
              <Activity className="h-4 w-4 mr-3" />
              View Detailed Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
              <Key className="h-4 w-4 mr-3" />
              Manage API Keys
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
