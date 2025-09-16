'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, DollarSign, Zap } from 'lucide-react'
import { Model } from '@/types/wallet'
import { fxService } from '@/lib/fx-rates'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  cost?: number
  currency?: string
}

interface LLMInterfaceProps {
  selectedWallet: any
  onUsage: (usage: any) => void
}

const AVAILABLE_MODELS: Model[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Most capable GPT-4 model',
    input_cost_per_1k: 0.03,
    output_cost_per_1k: 0.06,
    context_length: 8192,
    is_available: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Faster and cheaper GPT-4 variant',
    input_cost_per_1k: 0.01,
    output_cost_per_1k: 0.03,
    context_length: 128000,
    is_available: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most powerful Claude model',
    input_cost_per_1k: 0.015,
    output_cost_per_1k: 0.075,
    context_length: 200000,
    is_available: true,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced Claude model',
    input_cost_per_1k: 0.003,
    output_cost_per_1k: 0.015,
    context_length: 200000,
    is_available: true,
  },
]

export function LLMInterface({ selectedWallet, onUsage }: LLMInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedModel, setSelectedModel] = useState<Model>(AVAILABLE_MODELS[0])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const calculateCost = (inputTokens: number, outputTokens: number, model: Model): number => {
    const inputCost = (inputTokens / 1000) * model.input_cost_per_1k
    const outputCost = (outputTokens / 1000) * model.output_cost_per_1k
    return inputCost + outputCost
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedWallet) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Mock API call - in production, this would call OpenRouter
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel.id,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          wallet_id: selectedWallet.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Mock response for demo
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a mock response from ${selectedModel.name}. In production, this would be the actual AI response.`,
        timestamp: new Date(),
        cost: calculateCost(50, 100, selectedModel), // Mock token counts
        currency: 'USD',
      }

      setMessages(prev => [...prev, assistantMessage])

      // Record usage
      const usage = {
        model: selectedModel.id,
        input_tokens: 50,
        output_tokens: 100,
        cost_usd: assistantMessage.cost,
        cost_local: fxService.convertAmount(assistantMessage.cost!, 'USD', selectedWallet.currency),
        currency: selectedWallet.currency,
      }

      onUsage(usage)

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const totalCost = messages.reduce((sum, msg) => sum + (msg.cost || 0), 0)
  const localCost = fxService.convertAmount(totalCost, 'USD', selectedWallet?.currency || 'USD')

  return (
    <div className="flex flex-col h-full">
      {/* Model Selection */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Select Model</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedModel.id} onValueChange={(value) => {
            const model = AVAILABLE_MODELS.find(m => m.id === value)
            if (model) setSelectedModel(model)
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-muted-foreground">{model.description}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div>${model.input_cost_per_1k}/1k input</div>
                      <div>${model.output_cost_per_1k}/1k output</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat with {selectedModel.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <DollarSign className="h-3 w-3 mr-1" />
                ${totalCost.toFixed(4)} USD
              </Badge>
              {selectedWallet && (
                <Badge variant="outline">
                  {fxService.formatAmount(localCost, selectedWallet.currency)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation with {selectedModel.name}</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.cost && (
                        <p className="text-xs opacity-70 mt-1">
                          Cost: ${message.cost.toFixed(4)} USD
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading || !selectedWallet}
              className="px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
