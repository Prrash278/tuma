'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  Edit, 
  Trash2, 
  MoreVertical,
  Plus,
  Settings,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  Play
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
    usage: 24.50,
    limit: 100,
    status: 'active',
    createdAt: '2024-01-15',
    lastUsed: '2 hours ago',
    requests: 1247,
    tokens: 156789
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'tuma_sk_...d4e5f6',
    model: 'claude-3-haiku',
    currency: 'INR',
    usage: 8.20,
    limit: 50,
    status: 'active',
    createdAt: '2024-01-10',
    lastUsed: '1 day ago',
    requests: 892,
    tokens: 98765
  },
  {
    id: '3',
    name: 'Testing Key',
    key: 'tuma_sk_...g7h8i9',
    model: 'gpt-3.5-turbo',
    currency: 'NGN',
    usage: 2.10,
    limit: 25,
    status: 'paused',
    createdAt: '2024-01-05',
    lastUsed: '3 days ago',
    requests: 234,
    tokens: 45678
  }
]

export function APIManagementInterface() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({})
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    limit: '',
    currency: 'USD'
  })

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const startEditing = (key: any) => {
    setEditingKey(key.id)
    setEditForm({
      name: key.name,
      limit: key.limit.toString(),
      currency: key.currency
    })
  }

  const saveEdit = () => {
    // Handle save logic here
    setEditingKey(null)
  }

  const cancelEdit = () => {
    setEditingKey(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />
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
    <div className="grid grid-cols-3 gap-6">
      {/* API Keys List */}
      <div className="col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
            <Plus className="h-4 w-4 mr-2" />
            Create New Key
          </Button>
        </div>

        <div className="space-y-4">
          {mockAPIKeys.map((apiKey) => (
            <Card 
              key={apiKey.id} 
              className={`border-purple-100 hover:shadow-purple transition-shadow cursor-pointer ${
                selectedKey === apiKey.id ? 'ring-2 ring-purple-200' : ''
              }`}
              onClick={() => setSelectedKey(apiKey.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Key className="h-6 w-6 text-white" />
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
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Usage</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${apiKey.usage.toFixed(2)} / ${apiKey.limit}
                    </p>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                        style={{ width: `${(apiKey.usage / apiKey.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Requests</p>
                    <p className="text-lg font-semibold text-gray-900">{apiKey.requests.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Tokens</p>
                    <p className="text-lg font-semibold text-gray-900">{apiKey.tokens.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Details Panel */}
      <div className="space-y-6">
        {selectedKey ? (
          <>
            {/* Key Details */}
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Key Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const key = mockAPIKeys.find(k => k.id === selectedKey)
                  if (!key) return null

                  return (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">API Key</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            value={showKey[key.id] ? key.key : 'tuma_sk_••••••••••••••••'}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {showKey[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Model</Label>
                        <p className="text-sm text-gray-900 mt-1">{key.model}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Currency</Label>
                        <p className="text-sm text-gray-900 mt-1">{key.currency}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Created</Label>
                        <p className="text-sm text-gray-900 mt-1">{key.createdAt}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Last Used</Label>
                        <p className="text-sm text-gray-900 mt-1">{key.lastUsed}</p>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                  <Edit className="h-4 w-4 mr-3" />
                  Edit Key Settings
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                  <Activity className="h-4 w-4 mr-3" />
                  View Usage Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50">
                  <DollarSign className="h-4 w-4 mr-3" />
                  Top Up Wallet
                </Button>
                <Button variant="outline" className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-3" />
                  Delete Key
                </Button>
              </CardContent>
            </Card>

            {/* Edit Form */}
            {editingKey === selectedKey && (
              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Edit Key</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Key Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="limit">Monthly Limit</Label>
                    <Input
                      id="limit"
                      type="number"
                      value={editForm.limit}
                      onChange={(e) => setEditForm({ ...editForm, limit: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={editForm.currency} onValueChange={(value) => setEditForm({ ...editForm, currency: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.flag} {currency.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} className="flex-1">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="border-purple-100">
            <CardContent className="p-6 text-center">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an API Key</h3>
              <p className="text-gray-600">Choose an API key from the list to view details and manage settings.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
