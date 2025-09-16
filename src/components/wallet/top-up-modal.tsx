'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, CreditCard, Globe, Smartphone } from 'lucide-react'
import { Wallet } from '@/types/wallet'
// Removed direct Rapyd import - using API routes instead
import { fxService } from '@/lib/fx-rates'

interface TopUpModalProps {
  wallet: Wallet
  onClose: () => void
  onSuccess: () => void
}

export function TopUpModal({ wallet, onClose, onSuccess }: TopUpModalProps) {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false)

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    setIsLoading(true)
    try {
      // Get payment methods via API route
      const response = await fetch(`/api/rapyd/payment-methods?country=US&currency=${wallet.currency}`)
      const data = await response.json()
      
      if (data.success) {
        setPaymentMethods(data.data)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error loading payment methods:', error)
      // Fallback to mock data
      setPaymentMethods([
        {
          id: 'card',
          type: 'card',
          name: 'Credit/Debit Card',
          category: 'card',
          image: '💳',
          is_online: true,
          is_offline: false,
          supported_currencies: [wallet.currency],
          supported_countries: ['US']
        },
        {
          id: 'bank_transfer',
          type: 'bank_transfer',
          name: 'Bank Transfer',
          category: 'bank',
          image: '🏦',
          is_online: true,
          is_offline: false,
          supported_currencies: [wallet.currency],
          supported_countries: ['US']
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopUp = async () => {
    if (!amount || !paymentMethod) return

    setIsCreatingCheckout(true)
    try {
      const response = await fetch('/api/rapyd/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: wallet.currency,
          country: 'US', // In production, this would be dynamic
          payment_method_types: [paymentMethod],
          wallet_id: wallet.id,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Redirect to Rapyd checkout
        window.location.href = data.data.redirect_url
      } else {
        throw new Error(data.error)
      }
      
    } catch (error) {
      console.error('Error creating checkout:', error)
      alert('Failed to create checkout. Please try again.')
    } finally {
      setIsCreatingCheckout(false)
    }
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-4 w-4" />
      case 'bank_transfer':
        return <Globe className="h-4 w-4" />
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const usdAmount = fxService.convertAmount(parseFloat(amount || '0'), wallet.currency, 'USD')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Up Wallet</CardTitle>
            <CardDescription>
              Add funds to your {wallet.currency} wallet
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({wallet.currency})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {amount && (
              <p className="text-sm text-muted-foreground">
                ≈ ${usdAmount.toFixed(2)} USD
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(method.type)}
                      <span>{method.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleTopUp}
              disabled={!amount || !paymentMethod || isCreatingCheckout}
              className="flex-1"
            >
              {isCreatingCheckout ? 'Creating...' : 'Top Up'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
