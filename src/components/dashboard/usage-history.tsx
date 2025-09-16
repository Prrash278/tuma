'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { History, Download, Filter, Calendar } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Usage, Currency } from '@/types'

export function UsageHistory() {
  const [usage, setUsage] = useState<Usage[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | 'ALL'>('USD')
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(false)

  // Mock data for now
  useEffect(() => {
    setUsage([
      {
        id: '1',
        user_id: 'user-1',
        model_id: '1',
        tokens_used: 150,
        cost_usd: 0.0045,
        cost_local: 3.60,
        currency: 'NGN',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: '2',
        user_id: 'user-1',
        model_id: '2',
        tokens_used: 300,
        cost_usd: 0.003,
        cost_local: 2.40,
        currency: 'NGN',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: '3',
        user_id: 'user-1',
        model_id: '3',
        tokens_used: 500,
        cost_usd: 0.001,
        cost_local: 0.80,
        currency: 'NGN',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
      {
        id: '4',
        user_id: 'user-1',
        model_id: '4',
        tokens_used: 200,
        cost_usd: 0.003,
        cost_local: 2.40,
        currency: 'NGN',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      },
      {
        id: '5',
        user_id: 'user-1',
        model_id: '5',
        tokens_used: 800,
        cost_usd: 0.0024,
        cost_local: 1.92,
        currency: 'NGN',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      },
    ])
  }, [])

  const filteredUsage = usage.filter(item => {
    if (selectedCurrency !== 'ALL' && item.currency !== selectedCurrency) return false
    
    const itemDate = new Date(item.created_at)
    const now = new Date()
    
    switch (timeRange) {
      case '24h':
        return itemDate > new Date(now.getTime() - 1000 * 60 * 60 * 24)
      case '7d':
        return itemDate > new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7)
      case '30d':
        return itemDate > new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)
      default:
        return true
    }
  })

  const totalCost = filteredUsage.reduce((sum, item) => sum + item.cost_local, 0)
  const totalTokens = filteredUsage.reduce((sum, item) => sum + item.tokens_used, 0)

  const getModelName = (modelId: string) => {
    const modelNames: Record<string, string> = {
      '1': 'GPT-4',
      '2': 'GPT-4 Turbo',
      '3': 'GPT-3.5 Turbo',
      '4': 'Claude 3 Opus',
      '5': 'Claude 3 Sonnet',
      '6': 'Claude 3 Haiku',
    }
    return modelNames[modelId] || 'Unknown Model'
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting usage data...')
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCost, selectedCurrency === 'ALL' ? 'NGN' : selectedCurrency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {timeRange === '24h' ? 'Last 24 hours' : 
               timeRange === '7d' ? 'Last 7 days' : 
               timeRange === '30d' ? 'Last 30 days' : 'All time'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTokens.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Tokens consumed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredUsage.length > 0 
                ? formatCurrency(totalCost / filteredUsage.length, selectedCurrency === 'ALL' ? 'NGN' : selectedCurrency)
                : formatCurrency(0, selectedCurrency === 'ALL' ? 'NGN' : selectedCurrency)
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Per request
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
          <CardDescription>
            Track your LLM usage and costs over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Currency</label>
              <Select value={selectedCurrency} onValueChange={(value: Currency | 'ALL') => setSelectedCurrency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Currencies</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="BRL">BRL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Usage List */}
          <div className="space-y-2">
            {filteredUsage.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No usage data found for the selected filters</p>
              </div>
            ) : (
              filteredUsage.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{getModelName(item.model_id)}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.tokens_used} tokens
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(item.cost_local, item.currency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${item.cost_usd.toFixed(4)} USD
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
