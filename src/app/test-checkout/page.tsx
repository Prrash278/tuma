'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  ShoppingCart,
  Globe,
  Settings
} from 'lucide-react'

export default function TestCheckoutPage() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [country, setCountry] = useState('US')
  const [description, setDescription] = useState('')
  const [customer, setCustomer] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutResult, setCheckoutResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [customElements, setCustomElements] = useState({
    save_card_default: false,
    display_description: true,
    payment_fees_display: true,
    merchant_currency_only: false,
    billing_address_collect: false,
    dynamic_currency_conversion: false
  })

  const currencies = ['USD', 'EUR', 'GBP', 'NGN', 'INR', 'BRL', 'KES', 'IDR', 'MYR', 'MXN', 'SGD']
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'SG', name: 'Singapore' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'KE', name: 'Kenya' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MX', name: 'Mexico' }
  ]

  const paymentMethodCategories = [
    'card',
    'bank_redirect',
    'bank_transfer',
    'cash',
    'ewallet'
  ]

  const handleCreateCheckout = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    setIsProcessing(true)
    setError(null)
    setCheckoutResult(null)

    try {
      const checkoutData = {
        amount: parseFloat(amount),
        currency: currency,
        country: country,
        description: description || `Test checkout for ${amount} ${currency}`,
        customer: customer || undefined,
        merchant_reference_id: `test_checkout_${Date.now()}`,
        complete_payment_url: `${window.location.origin}/checkout/success`,
        error_payment_url: `${window.location.origin}/checkout/error`,
        cancel_checkout_url: `${window.location.origin}/checkout/cancelled`,
        complete_checkout_url: `${window.location.origin}/checkout/complete`,
        language: 'en',
        custom_elements: customElements,
        payment_method_type_categories: paymentMethodCategories,
        metadata: {
          test_checkout: true,
          amount: parseFloat(amount),
          currency: currency,
          country: country
        }
      }

      const response = await fetch('/api/rapyd/checkout-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      })

      const result = await response.json()

      if (result.success) {
        setCheckoutResult(result.data)
      } else {
        setError(result.error || 'Checkout page creation failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ACT':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'CLO':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'CAN':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'New'
      case 'ACT':
        return 'Active'
      case 'CLO':
        return 'Closed'
      case 'CAN':
        return 'Cancelled'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Rapyd Checkout Pages</h1>
          <p className="text-gray-600">Create hosted checkout pages for customer payments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Create Checkout Page
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Payment description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Customer ID (Optional)</Label>
                <Input
                  id="customer"
                  placeholder="cus_..."
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
              </div>

              {/* Custom Elements */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Custom Elements</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save_card_default"
                      checked={customElements.save_card_default}
                      onCheckedChange={(checked) => 
                        setCustomElements(prev => ({ ...prev, save_card_default: !!checked }))
                      }
                    />
                    <Label htmlFor="save_card_default" className="text-sm">Save card by default</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="display_description"
                      checked={customElements.display_description}
                      onCheckedChange={(checked) => 
                        setCustomElements(prev => ({ ...prev, display_description: !!checked }))
                      }
                    />
                    <Label htmlFor="display_description" className="text-sm">Display description</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="payment_fees_display"
                      checked={customElements.payment_fees_display}
                      onCheckedChange={(checked) => 
                        setCustomElements(prev => ({ ...prev, payment_fees_display: !!checked }))
                      }
                    />
                    <Label htmlFor="payment_fees_display" className="text-sm">Display payment fees</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="billing_address_collect"
                      checked={customElements.billing_address_collect}
                      onCheckedChange={(checked) => 
                        setCustomElements(prev => ({ ...prev, billing_address_collect: !!checked }))
                      }
                    />
                    <Label htmlFor="billing_address_collect" className="text-sm">Collect billing address</Label>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreateCheckout}
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                {isProcessing ? 'Creating Checkout Page...' : 'Create Checkout Page'}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checkout Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Checkout Page Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {checkoutResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Checkout ID</span>
                    <span className="text-sm font-mono text-gray-900">{checkoutResult.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Amount</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {checkoutResult.currency} {checkoutResult.amount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <Badge className={getStatusColor(checkoutResult.status)}>
                      {getStatusText(checkoutResult.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Country</span>
                    <span className="text-sm text-gray-900">{checkoutResult.country}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Language</span>
                    <span className="text-sm text-gray-900">{checkoutResult.language}</span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Checkout URLs</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Redirect URL</span>
                        <a 
                          href={checkoutResult.redirect_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="text-xs text-gray-500 break-all">
                        {checkoutResult.redirect_url}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Details</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Description: {checkoutResult.payment.description}</div>
                      <div>Reference: {checkoutResult.payment.merchant_reference_id}</div>
                      <div>Customer: {checkoutResult.payment.customer_token}</div>
                      <div>Expires: {new Date(checkoutResult.payment.expiration * 1000).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={() => window.open(checkoutResult.redirect_url, '_blank')}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Checkout Page
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No checkout page created yet</p>
                  <p className="text-sm">Create a checkout page to see the result here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              API Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Endpoints</h4>
                <ul className="space-y-1 text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/rapyd/checkout-page</code></li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/rapyd/checkout-page</code></li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/rapyd/checkout-page/[id]</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Features</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>✅ Hosted checkout pages</li>
                  <li>✅ No PCI certification required</li>
                  <li>✅ Multiple payment methods</li>
                  <li>✅ Custom branding</li>
                  <li>✅ Multi-language support</li>
                  <li>✅ Cart items support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
