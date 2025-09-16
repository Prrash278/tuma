'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Settings, 
  CreditCard,
  Globe,
  TrendingUp,
  Wallet,
  Bot
} from 'lucide-react'
import { APIKey } from '@/types/wallet'
import { fxService } from '@/lib/fx-rates'
import { CURRENCIES, formatCurrency, getCurrencyByCode } from '@/lib/currencies'

const AVAILABLE_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI' },
  { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'OpenAI' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
]

// Use the enhanced currency data with flags
const SUPPORTED_CURRENCIES = CURRENCIES

export function APIManagementDashboard() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [selectedApiKey, setSelectedApiKey] = useState<APIKey | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [countries, setCountries] = useState<any[]>([])
  const [currencies, setCurrencies] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  
  const [newKey, setNewKey] = useState({
    model: 'gpt-4' as APIKey['model'],
    currency: 'USD' as APIKey['currency'],
    spendingCap: '',
  })

  const [topUpData, setTopUpData] = useState({
    amount: '',
    country: 'US',
    currency: 'USD',
    paymentMethod: '',
  })

  const userId = 'user-1' // In production, get from auth context

  useEffect(() => {
    loadAPIKeys()
    loadCountries()
    loadCurrencies()
  }, [])

  const loadAPIKeys = async () => {
    try {
      const response = await fetch(`/api/keys?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setApiKeys(data.data)
      }
    } catch (error) {
      console.error('Error loading API keys:', error)
    }
  }

  const loadCountries = async () => {
    try {
      const response = await fetch('/api/rapyd/countries')
      const data = await response.json()
      if (data.success) {
        setCountries(data.data)
      }
    } catch (error) {
      console.error('Error loading countries:', error)
    }
  }

  const loadCurrencies = async () => {
    try {
      const response = await fetch('/api/rapyd/currencies')
      const data = await response.json()
      if (data.success) {
        setCurrencies(data.data)
      }
    } catch (error) {
      console.error('Error loading currencies:', error)
    }
  }

  const loadPaymentMethods = async (country: string, currency: string) => {
    try {
      const response = await fetch(`/api/rapyd/payment-methods?country=${country}&currency=${currency}`)
      const data = await response.json()
      if (data.success) {
        setPaymentMethods(data.data)
      }
    } catch (error) {
      console.error('Error loading payment methods:', error)
    }
  }

  const handleCreateAPIKey = async () => {
    if (!newKey.model || !newKey.currency) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          model: newKey.model,
          currency: newKey.currency,
          spendingCap: newKey.spendingCap ? parseFloat(newKey.spendingCap) : undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setApiKeys(prev => [...prev, data.data])
        setNewKey({ model: 'gpt-4', currency: 'USD', spendingCap: '' })
        setShowCreateForm(false)
      } else {
        throw new Error(data.error || 'Failed to create API key')
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      alert('Failed to create API key. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleTopUp = (apiKey: APIKey) => {
    setSelectedApiKey(apiKey)
    setTopUpData({
      amount: '',
      country: 'US',
      currency: apiKey.currency,
      paymentMethod: '',
    })
    setShowTopUpModal(true)
    loadPaymentMethods('US', apiKey.currency)
  }

  const handleTopUpSubmit = async () => {
    if (!selectedApiKey || !topUpData.amount || !topUpData.paymentMethod) return

    try {
      const response = await fetch('/api/rapyd/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(topUpData.amount),
          currency: topUpData.currency,
          country: topUpData.country,
          payment_method_types: [topUpData.paymentMethod],
          apiKeyId: selectedApiKey.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Redirect to Rapyd checkout
        window.location.href = data.data.redirect_url
      } else {
        throw new Error(data.error || 'Failed to create checkout')
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to create checkout. Please try again.')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const formatAPIKey = (key: string, isVisible: boolean) => {
    if (isVisible) return key
    return key.substring(0, 8) + '•'.repeat(key.length - 16) + key.substring(key.length - 8)
  }

  const getModelInfo = (model: string) => {
    return AVAILABLE_MODELS.find(m => m.id === model) || { id: model, name: model, provider: 'Unknown' }
  }

  const getCurrencyInfo = (currency: string) => {
    return getCurrencyByCode(currency) || { code: currency, name: currency, symbol: currency, flag: '🌍', country: 'Unknown', exchangeRate: 1 }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
          <p className="text-gray-600">Create and manage your OpenRouter API keys with local currency support</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiKeys.length}</div>
              <p className="text-xs text-muted-foreground">
                Active keys
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${apiKeys.reduce((sum, key) => sum + (key.total_usage_usd || 0), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                USD spent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">OpenRouter Limits</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${apiKeys.reduce((sum, key) => sum + (key.openrouter_usd_limit || 0), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total limits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Models</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(apiKeys.map(key => key.model)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique models
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Create API Key Button */}
        <div className="mb-6">
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New API Key
          </Button>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Key className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No API Keys</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first API key to start using OpenRouter with local currency support
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Create API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            apiKeys.map((apiKey) => {
              const isVisible = visibleKeys.has(apiKey.id)
              const modelInfo = getModelInfo(apiKey.model)
              const currencyInfo = getCurrencyInfo(apiKey.currency)
              
              return (
                <Card key={apiKey.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Key className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{modelInfo.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            {modelInfo.provider} • {currencyInfo.flag} {currencyInfo.name} ({currencyInfo.symbol})
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
                          {apiKey.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTopUp(apiKey)}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Top Up
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* OpenRouter API Key */}
                    <div className="space-y-2">
                      <Label>OpenRouter API Key</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={formatAPIKey(apiKey.openrouter_key, isVisible)}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.openrouter_key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use this key directly with OpenRouter API
                      </p>
                    </div>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${(apiKey.openrouter_usd_limit || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">OpenRouter Limit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ${(apiKey.total_usage_usd || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Usage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {apiKey.spending_cap_usd ? `$${apiKey.spending_cap_usd}` : '∞'}
                        </div>
                        <div className="text-xs text-muted-foreground">Spending Cap</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {apiKey.currency}
                        </div>
                        <div className="text-xs text-muted-foreground">Currency</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Create API Key Modal */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Create a new OpenRouter API key with model and currency restrictions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={newKey.model} onValueChange={(value) => setNewKey(prev => ({ ...prev, model: value as APIKey['model'] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <span>{model.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {model.provider}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={newKey.currency} onValueChange={(value) => setNewKey(prev => ({ ...prev, currency: value as APIKey['currency'] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.symbol}</span>
                          <span>{currency.name}</span>
                          <span className="text-gray-500">({currency.code})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spending-cap">Spending Cap (USD) - Optional</Label>
                <Input
                  id="spending-cap"
                  type="number"
                  placeholder="100"
                  value={newKey.spendingCap}
                  onChange={(e) => setNewKey(prev => ({ ...prev, spendingCap: e.target.value }))}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAPIKey}
                  disabled={isCreating || !newKey.model || !newKey.currency}
                  className="flex-1"
                >
                  {isCreating ? 'Creating...' : 'Create API Key'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Top Up Modal */}
        <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Top Up API Key
              </DialogTitle>
              <DialogDescription>
                Add funds to your {selectedApiKey?.currency} wallet for {selectedApiKey?.model}
              </DialogDescription>
            </DialogHeader>

            {selectedApiKey && (
              <div className="space-y-4">
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({selectedApiKey.currency})</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={topUpData.amount}
                    onChange={(e) => setTopUpData(prev => ({ ...prev, amount: e.target.value }))}
                    min="0"
                    step="0.01"
                  />
                  {topUpData.amount && (
                    <p className="text-sm text-gray-500">
                      ≈ ${fxService.convertAmount(parseFloat(topUpData.amount), selectedApiKey.currency, 'USD').toFixed(2)} USD
                    </p>
                  )}
                </div>

                {/* Country Selection */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={topUpData.country} 
                    onValueChange={(value) => {
                      setTopUpData(prev => ({ ...prev, country: value }))
                      loadPaymentMethods(value, topUpData.currency)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.iso_alpha2} value={country.iso_alpha2}>
                          <div className="flex items-center gap-2">
                            <span>{country.name}</span>
                            <span className="text-gray-500">({country.iso_alpha2})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select 
                    value={topUpData.paymentMethod} 
                    onValueChange={(value) => setTopUpData(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.type} value={method.type}>
                          <div className="flex items-center gap-2">
                            <span>{method.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {method.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowTopUpModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleTopUpSubmit}
                    disabled={!topUpData.amount || !topUpData.paymentMethod || parseFloat(topUpData.amount) <= 0}
                    className="flex-1"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
