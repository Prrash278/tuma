'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, CreditCard, CheckCircle, XCircle } from 'lucide-react'

export default function TestPaymentsPage() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const currencies = ['USD', 'EUR', 'GBP', 'NGN', 'INR', 'BRL', 'KES', 'IDR', 'MYR', 'MXN']

  const handleCreatePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    setIsProcessing(true)
    setError(null)
    setPaymentResult(null)

    try {
      const paymentData = {
        amount: parseFloat(amount),
        currency: currency,
        description: `Test payment for ${amount} ${currency}`,
        merchant_reference_id: `test_${Date.now()}`,
        customer: {
          name: 'Test Customer',
          email: 'test@tuma.ai'
        },
        payment_method: {
          type: 'us_visa_card'
        },
        save_payment_method: false,
        complete_payment_url: `${window.location.origin}/wallet/success`,
        error_payment_url: `${window.location.origin}/wallet/error`,
        statement_descriptor: 'TUMA TEST',
        metadata: {
          test_payment: true,
          amount: parseFloat(amount),
          currency: currency
        }
      }

      const response = await fetch('/api/rapyd/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })

      const result = await response.json()

      if (result.success) {
        setPaymentResult(result.data)
      } else {
        setError(result.error || 'Payment creation failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CLO':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'ACT':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CAN':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CLO':
        return 'Completed'
      case 'ACT':
        return 'Active'
      case 'CAN':
        return 'Cancelled'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Rapyd Payments</h1>
          <p className="text-gray-600">Test the Rapyd Create Payment API integration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Create Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleCreatePayment}
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                {isProcessing ? 'Creating Payment...' : 'Create Payment'}
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

          {/* Payment Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payment Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Payment ID</span>
                    <span className="text-sm font-mono text-gray-900">{paymentResult.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Amount</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {paymentResult.currency_code} {paymentResult.amount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <Badge className={getStatusColor(paymentResult.status)}>
                      {getStatusText(paymentResult.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Paid</span>
                    <div className="flex items-center gap-1">
                      {paymentResult.paid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-gray-900">
                        {paymentResult.paid ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Description</span>
                    <span className="text-sm text-gray-900">{paymentResult.description}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">
                      {new Date(paymentResult.created_at * 1000).toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Type: {paymentResult.payment_method_type}</div>
                      <div>Category: {paymentResult.payment_method_type_category}</div>
                      <div>Last 4: {paymentResult.payment_method_data.last4}</div>
                      <div>Brand: {paymentResult.payment_method_data.bin_details.brand}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No payment created yet</p>
                  <p className="text-sm">Create a payment to see the result here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Endpoints</h4>
                <ul className="space-y-1 text-gray-600">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/rapyd/payments</code></li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/rapyd/payments</code></li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/rapyd/payments/[id]</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Features</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>✅ Direct payment collection</li>
                  <li>✅ Multiple currencies</li>
                  <li>✅ Mock fallback for development</li>
                  <li>✅ Real Rapyd integration</li>
                  <li>✅ Payment status tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
