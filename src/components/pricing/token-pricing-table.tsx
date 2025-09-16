'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CURRENCIES, formatCurrency, convertFromUSD } from '@/lib/currencies'
import { Calculator, Zap, DollarSign, TrendingUp } from 'lucide-react'

interface TokenPricing {
  model: string
  inputTokens: number
  outputTokens: number
  inputCostPer1K: number // USD per 1K tokens
  outputCostPer1K: number // USD per 1K tokens
  description: string
  category: 'gpt' | 'claude' | 'gemini' | 'llama' | 'other'
}

const TOKEN_PRICING: TokenPricing[] = [
  {
    model: 'GPT-4o',
    inputTokens: 1000,
    outputTokens: 1000,
    inputCostPer1K: 0.005,
    outputCostPer1K: 0.015,
    description: 'Most capable GPT-4 model',
    category: 'gpt'
  },
  {
    model: 'GPT-4o-mini',
    inputTokens: 1000,
    outputTokens: 1000,
    inputCostPer1K: 0.00015,
    outputCostPer1K: 0.0006,
    description: 'Fast and efficient GPT-4 model',
    category: 'gpt'
  },
  {
    model: 'Claude 3.5 Sonnet',
    inputTokens: 1000,
    outputTokens: 1000,
    inputCostPer1K: 0.003,
    outputCostPer1K: 0.015,
    description: 'Anthropic\'s most capable model',
    category: 'claude'
  },
  {
    model: 'Claude 3 Haiku',
    inputTokens: 1000,
    outputTokens: 1000,
    inputCostPer1K: 0.00025,
    outputCostPer1K: 0.00125,
    description: 'Fast and cost-effective Claude model',
    category: 'claude'
  },
  {
    model: 'Gemini Pro',
    inputTokens: 1000,
    outputTokens: 1000,
    inputCostPer1K: 0.0005,
    outputCostPer1K: 0.0015,
    description: 'Google\'s advanced language model',
    category: 'gemini'
  },
  {
    model: 'Llama 3.1 70B',
    inputTokens: 1000,
    outputTokens: 1000,
    inputCostPer1K: 0.0009,
    outputCostPer1K: 0.0009,
    description: 'Meta\'s open-source model',
    category: 'llama'
  }
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'gpt': return 'bg-green-100 text-green-800 border-green-200'
    case 'claude': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'gemini': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'llama': return 'bg-orange-100 text-orange-800 border-orange-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'gpt': return '🤖'
    case 'claude': return '🧠'
    case 'gemini': return '💎'
    case 'llama': return '🦙'
    default: return '⚡'
  }
}

export function TokenPricingTable() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [inputTokens, setInputTokens] = useState(1000)
  const [outputTokens, setOutputTokens] = useState(1000)

  const calculateCost = (pricing: TokenPricing) => {
    const inputCost = (inputTokens / 1000) * pricing.inputCostPer1K
    const outputCost = (outputTokens / 1000) * pricing.outputCostPer1K
    const totalCostUSD = inputCost + outputCost
    return {
      inputCost,
      outputCost,
      totalCostUSD,
      totalCostLocal: convertFromUSD(totalCostUSD, selectedCurrency)
    }
  }

  return (
    <div className="space-y-6">
      {/* Calculator Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Token Cost Calculator
          </CardTitle>
          <CardDescription>
            Calculate the cost of using different AI models in your preferred currency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="input-tokens">Input Tokens</Label>
              <Input
                id="input-tokens"
                type="number"
                value={inputTokens}
                onChange={(e) => setInputTokens(Number(e.target.value))}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="output-tokens">Output Tokens</Label>
              <Input
                id="output-tokens"
                type="number"
                value={outputTokens}
                onChange={(e) => setOutputTokens(Number(e.target.value))}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span className="text-muted-foreground">({currency.symbol})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Model Pricing Comparison
          </CardTitle>
          <CardDescription>
            Compare costs across different AI models in {getCurrencyByCode(selectedCurrency)?.flag} {selectedCurrency}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Input Cost</TableHead>
                  <TableHead>Output Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOKEN_PRICING.map((pricing) => {
                  const costs = calculateCost(pricing)
                  return (
                    <TableRow key={pricing.model}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(pricing.category)}</span>
                          {pricing.model}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(pricing.category)}>
                          {pricing.category.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(costs.inputCost, selectedCurrency)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(costs.outputCost, selectedCurrency)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          {formatCurrency(costs.totalCostUSD, selectedCurrency)}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {pricing.description}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Cost Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(calculateCost(TOKEN_PRICING[1]).totalCostUSD, selectedCurrency)}
              </div>
              <div className="text-sm text-green-700">Most Affordable</div>
              <div className="text-xs text-green-600">GPT-4o-mini</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculateCost(TOKEN_PRICING[0]).totalCostUSD, selectedCurrency)}
              </div>
              <div className="text-sm text-blue-700">Most Capable</div>
              <div className="text-xs text-blue-600">GPT-4o</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(calculateCost(TOKEN_PRICING[2]).totalCostUSD, selectedCurrency)}
              </div>
              <div className="text-sm text-purple-700">Best Balance</div>
              <div className="text-xs text-purple-600">Claude 3.5 Sonnet</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getCurrencyByCode(code: string) {
  return CURRENCIES.find(currency => currency.code === code)
}
