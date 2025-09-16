'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Key, DollarSign, Zap } from 'lucide-react'
import { CURRENCIES } from '@/lib/currencies'

const models = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', cost: '$0.15/1M tokens' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', cost: '$5.00/1M tokens' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', cost: '$0.25/1M tokens' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', cost: '$3.00/1M tokens' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', cost: '$0.50/1M tokens' },
  { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', provider: 'Meta', cost: '$0.20/1M tokens' },
]

export function CreateAPIKeyModal() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    currency: 'USD',
    limit: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle API key creation
    console.log('Creating API key:', formData)
    setOpen(false)
    // Reset form
    setFormData({
      name: '',
      model: '',
      currency: 'USD',
      limit: '',
      description: ''
    })
  }

  const selectedModel = models.find(m => m.id === formData.model)
  
  const getCurrencySymbol = (code: string) => {
    const currency = CURRENCIES.find(c => c.code === code)
    return currency ? currency.symbol : '$'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Create New API Key</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                API Key Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Production API, Development Key"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this API key will be used for..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                rows={3}
              />
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700">AI Model *</Label>
            <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
              <SelectTrigger className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                          <Zap className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-gray-500">{model.provider}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {model.cost}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency and Limit */}
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Currency Note:</strong> Each API key can be created in a specific currency. 
                Your dashboard will show all amounts converted to your primary currency for easy comparison.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Currency *</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger className="mt-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="limit" className="text-sm font-medium text-gray-700">
                Monthly Limit *
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <Input
                  id="limit"
                  type="number"
                  placeholder="100"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  className="pl-8 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            </div>
          </div>

          {/* Model Info */}
          {selectedModel && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Key className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedModel.name}</h4>
                  <p className="text-sm text-gray-600">Provider: {selectedModel.provider}</p>
                  <p className="text-sm text-purple-600">Cost: {selectedModel.cost}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              Create API Key
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
