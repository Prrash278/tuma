'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, Send, CheckCircle, XCircle, Key, DollarSign } from 'lucide-react'

export function TumaAPITest() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4')
  const [messages, setMessages] = useState('Hello, how are you?')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTestAPI = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/tuma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          model,
          messages: [{ role: 'user', content: messages }],
          maxTokens: 1000,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API call failed')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const models = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Tuma API Test
        </CardTitle>
        <CardDescription>
          Test the Tuma API with your API keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              placeholder="tuma_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="messages">Message</Label>
          <Textarea
            id="messages"
            placeholder="Enter your message here..."
            value={messages}
            onChange={(e) => setMessages(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleTestAPI}
          disabled={isLoading || !apiKey.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing API...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Test API Call
            </>
          )}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Success!</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Response</h4>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{result.choices?.[0]?.message?.content || 'No response'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {result.usage?.total_tokens || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    ${result.cost?.usd?.toFixed(4) || '0.0000'}
                  </div>
                  <div className="text-xs text-muted-foreground">Cost (USD)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {result.cost?.formatted || '$0.00'}
                  </div>
                  <div className="text-xs text-muted-foreground">Cost (Local)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {result.remaining_balance?.formatted || '$0.00'}
                  </div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <p><strong>Model:</strong> {result.model}</p>
                <p><strong>Currency:</strong> {result.cost?.currency}</p>
                <p><strong>Request ID:</strong> {result.id}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>This test demonstrates the complete Tuma flow:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>API key validation and model authorization</li>
            <li>Token calculation and cost estimation</li>
            <li>Wallet balance checking and deduction</li>
            <li>Shadow USD ledger updates</li>
            <li>Usage tracking and spending caps</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
