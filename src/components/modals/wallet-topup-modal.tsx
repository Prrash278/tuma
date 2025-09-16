'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Wallet, CreditCard, ArrowUpRight, Info } from 'lucide-react'
import { CURRENCIES } from '@/lib/currencies'
import { CurrencyConversionService } from '@/lib/currency-conversion'

interface WalletTopUpModalProps {
  apiKey: {
    id: string
    name: string
    currency: string
    wallet_balance: number
  }
  onTopUp: (amount: number, currency: string) => void
}

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, available: true },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: Wallet, available: true },
  { id: 'mobile_money', name: 'Mobile Money', icon: Wallet, available: true },
  { id: 'crypto', name: 'Cryptocurrency', icon: Wallet, available: false },
]

export function WalletTopUpModal({ apiKey, onTopUp }: WalletTopUpModalProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    setIsProcessing(true)
    try {
      await onTopUp(parseFloat(amount), apiKey.currency)
      setOpen(false)
      setAmount('')
    } catch (error) {
      console.error('Top-up failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getCurrencySymbol = (code: string) => {
    const currency = CURRENCIES.find(c => c.code === code)
    return currency ? currency.symbol : '$'
  }

  const calculateUSDEquivalent = (localAmount: number) => {
    if (apiKey.currency === 'USD') return localAmount
    try {
      const conversion = CurrencyConversionService.convertToUSD(localAmount, apiKey.currency)
      return conversion.convertedAmount
    } catch {
      return localAmount
    }
  }

  const usdEquivalent = amount ? calculateUSDEquivalent(parseFloat(amount)) : 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
          <Wallet className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Top Up Wallet
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Add funds to <strong>{apiKey.name}</strong> wallet
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Balance */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-2xl font-bold text-purple-700">
                  {getCurrencySymbol(apiKey.currency)}{apiKey.wallet_balance.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount to Add
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                {getCurrencySymbol(apiKey.currency)}
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="100.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            {amount && (
              <p className="text-xs text-gray-500">
                ≈ ${usdEquivalent.toFixed(2)} USD
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  disabled={!method.available}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    paymentMethod === method.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : method.available
                      ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <method.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{method.name}</span>
                    {!method.available && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Currency Conversion</p>
                <p>
                  We convert USD to {apiKey.currency} at current rates plus a 10% spread. 
                  This ensures competitive pricing while covering operational costs.
                </p>
              </div>
            </div>
          </div>

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
              onClick={handleTopUp}
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Top Up {getCurrencySymbol(apiKey.currency)}{amount || '0.00'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
