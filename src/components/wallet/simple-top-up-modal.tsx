'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wallet, CreditCard, Loader2 } from 'lucide-react'
import { Wallet as WalletType } from '@/types/wallet'
import { fxService } from '@/lib/fx-rates'

interface SimpleTopUpModalProps {
  isOpen: boolean
  onClose: () => void
  wallet: WalletType | null
  onTopUp: (amount: number, currency: string) => void
}

export function SimpleTopUpModal({ isOpen, onClose, wallet, onTopUp }: SimpleTopUpModalProps) {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!wallet) return null

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) <= 0) return

    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Call the top-up function
      onTopUp(parseFloat(amount), wallet.currency)
      
      // Close modal and reset form
      onClose()
      setAmount('')
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const usdAmount = fxService.convertAmount(parseFloat(amount || '0'), wallet.currency, 'USD')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Top Up Wallet
          </DialogTitle>
          <DialogDescription>
            Add funds to your {wallet.currency} wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({wallet.currency})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            {amount && (
              <p className="text-sm text-gray-500">
                ≈ ${usdAmount.toFixed(2)} USD
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit/Debit Card
                  </div>
                </SelectItem>
                <SelectItem value="bank_transfer">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Bank Transfer
                  </div>
                </SelectItem>
                <SelectItem value="mobile_money">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Mobile Money
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Summary */}
          {amount && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Payment Summary</h4>
              <div className="flex justify-between text-sm">
                <span>Amount:</span>
                <span>{fxService.formatAmount(parseFloat(amount), wallet.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>USD Equivalent:</span>
                <span>${usdAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Payment Method:</span>
                <span className="capitalize">{paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTopUp}
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Top Up Wallet'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
