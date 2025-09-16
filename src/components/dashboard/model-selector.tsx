'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Bot, Send, Zap, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Model, Currency, ChatRequest } from '@/types'

export function ModelSelector() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState<number>(0)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD')

  // Mock data for now
  useEffect(() => {
    setModels([
      {
        id: '1',
        name: 'gpt-4',
        provider: 'openai',
        pricing_per_1k_tokens: 0.03,
        context_length: 8192,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'gpt-4-turbo',
        provider: 'openai',
        pricing_per_1k_tokens: 0.01,
        context_length: 128000,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'gpt-3.5-turbo',
        provider: 'openai',
        pricing_per_1k_tokens: 0.002,
        context_length: 16384,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'claude-3-opus',
        provider: 'anthropic',
        pricing_per_1k_tokens: 0.015,
        context_length: 200000,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'claude-3-sonnet',
        provider: 'anthropic',
        pricing_per_1k_tokens: 0.003,
        context_length: 200000,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'claude-3-haiku',
        provider: 'anthropic',
        pricing_per_1k_tokens: 0.00025,
        context_length: 200000,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
  }, [])

  const currentModel = models.find(m => m.id === selectedModel)

  const estimateCost = (text: string, model: Model) => {
    if (!text || !model) return 0
    
    // Rough estimation: 1 token ≈ 4 characters for English text
    const estimatedTokens = Math.ceil(text.length / 4)
    const costUsd = (estimatedTokens / 1000) * model.pricing_per_1k_tokens
    
    // Convert to local currency (simplified - would use actual FX rates)
    const fxRates: Record<Currency, number> = {
      USD: 1,
      NGN: 800,
      INR: 83,
      BRL: 5,
    }
    
    return costUsd * fxRates[selectedCurrency] * 1.05 // 5% markup
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedModel) return
    
    setLoading(true)
    setResponse('')
    
    try {
      // TODO: Implement actual API call to OpenRouter
      // For now, simulate a response
      setTimeout(() => {
        setResponse(`This is a simulated response from ${currentModel?.name}. In a real implementation, this would be the actual response from the LLM API.`)
        setLoading(false)
      }, 2000)
    } catch (error) {
      setResponse('Error: Failed to get response from the model.')
      setLoading(false)
    }
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    setResponse('')
  }

  const handleMessageChange = (text: string) => {
    setMessage(text)
    if (currentModel) {
      setEstimatedCost(estimateCost(text, currentModel))
    }
  }

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Model Selection
          </CardTitle>
          <CardDescription>
            Choose an LLM model and send messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="model-select">Select Model</Label>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{model.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {model.provider}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="currency-select">Currency</Label>
              <Select value={selectedCurrency} onValueChange={(value: Currency) => setSelectedCurrency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="BRL">BRL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentModel && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <div className="text-sm font-medium">Provider</div>
                <div className="text-sm text-muted-foreground capitalize">{currentModel.provider}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Pricing</div>
                <div className="text-sm text-muted-foreground">
                  ${currentModel.pricing_per_1k_tokens}/1k tokens
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Context Length</div>
                <div className="text-sm text-muted-foreground">
                  {currentModel.context_length.toLocaleString()} tokens
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Chat Interface
          </CardTitle>
          <CardDescription>
            Send messages to the selected model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              rows={4}
            />
          </div>

          {estimatedCost > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Estimated cost: {formatCurrency(estimatedCost, selectedCurrency)}
              </span>
            </div>
          )}

          <Button 
            onClick={handleSendMessage} 
            disabled={loading || !message.trim() || !selectedModel}
            className="w-full"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>

          {response && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">Response:</div>
              <div className="text-sm whitespace-pre-wrap">{response}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
