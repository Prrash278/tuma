'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Key, Plus, Copy, Trash2, Eye, EyeOff, DollarSign } from 'lucide-react'
import { APIKey } from '@/types/wallet'
import { apiKeyService } from '@/lib/api-keys'
import { fxService, SUPPORTED_CURRENCIES } from '@/lib/fx-rates'

const AVAILABLE_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
]

export function APIKeyManager() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newKey, setNewKey] = useState({
    model: 'gpt-4' as APIKey['model'],
    currency: 'USD' as APIKey['currency'],
    spendingCap: '',
  })
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const userId = 'user-1' // In production, get from auth context

  useEffect(() => {
    loadAPIKeys()
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
      // Fallback to client-side storage
      const keys = apiKeyService.getUserAPIKeys(userId)
      setApiKeys(keys)
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
    } finally {
      setIsCreating(false)
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

  const deleteAPIKey = (keyId: string) => {
    const updatedKeys = apiKeys.filter(key => key.id !== keyId)
    setApiKeys(updatedKeys)
    localStorage.setItem(`api_keys_${userId}`, JSON.stringify(updatedKeys))
  }

  const formatAPIKey = (key: string, isVisible: boolean) => {
    if (isVisible) return key
    return key.substring(0, 8) + '••••••••••••••••••••••••••••••••'
  }

  return (
    <div className="space-y-6">
      {/* Create New API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Management
          </CardTitle>
          <CardDescription>
            Create API keys for specific models and currencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showCreateForm ? (
            <Button onClick={() => setShowCreateForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New API Key
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select value={newKey.model} onValueChange={(value) => setNewKey(prev => ({ ...prev, model: value as APIKey['model'] }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_MODELS.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2">{model.provider}</Badge>
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
                            <span>{currency.code} - {currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spending-cap">Spending Cap (USD) - Optional</Label>
                <Input
                  id="spending-cap"
                  type="number"
                  placeholder="100"
                  value={newKey.spendingCap}
                  onChange={(e) => setNewKey(prev => ({ ...prev, spendingCap: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Set a monthly spending limit in USD for this API key
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateAPIKey}
                  disabled={!newKey.model || !newKey.currency || isCreating}
                  className="flex-1"
                >
                  {isCreating ? 'Creating...' : 'Create API Key'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No API keys created yet</p>
                <p className="text-sm">Create your first API key to start using the Tuma API</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map((apiKey) => {
            const isVisible = visibleKeys.has(apiKey.id)
            const ledger = apiKeyService.getShadowUSDLedger(apiKey.id)
            const usage = apiKeyService.getAPIUsage(apiKey.id)
            const totalUsage = usage.reduce((sum, u) => sum + u.cost_usd, 0)

            return (
              <Card key={apiKey.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {AVAILABLE_MODELS.find(m => m.id === apiKey.model)?.name} - {apiKey.currency}
                      </CardTitle>
                      <CardDescription>
                        Created {new Date(apiKey.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
                        {apiKey.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAPIKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* API Key */}
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
                        ${apiKey.openrouter_usd_limit.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">OpenRouter Limit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${totalUsage.toFixed(2)}
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
                        {ledger ? `$${ledger.remaining_balance_usd.toFixed(2)}` : '$0.00'}
                      </div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                  </div>

                  {/* Usage Progress */}
                  {apiKey.spending_cap_usd && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Usage Progress</span>
                        <span>{((totalUsage / apiKey.spending_cap_usd) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((totalUsage / apiKey.spending_cap_usd) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
