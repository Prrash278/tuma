'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Wallet as WalletIcon, CreditCard, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Wallet, Currency } from '@/types'

export function WalletCard() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD')
  const [topUpAmount, setTopUpAmount] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock data for now
  useEffect(() => {
    setWallets([
      {
        id: '1',
        user_id: 'user-1',
        currency: 'USD',
        balance: 25.50,
        spending_cap: 100.00,
        spending_cap_type: 'monthly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: 'user-1',
        currency: 'NGN',
        balance: 20400.00,
        spending_cap: 80000.00,
        spending_cap_type: 'monthly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
  }, [])

  const currentWallet = wallets.find(w => w.currency === selectedCurrency)

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return
    
    setLoading(true)
    // TODO: Implement actual top-up logic
    setTimeout(() => {
      setLoading(false)
      setTopUpAmount('')
    }, 1000)
  }

  const handleCreateWallet = async (currency: Currency) => {
    setLoading(true)
    // TODO: Implement wallet creation logic
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Wallet Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5" />
            Wallet Management
          </CardTitle>
          <CardDescription>
            Manage your multi-currency wallets and spending limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="currency-select">Select Currency</Label>
              <Select value={selectedCurrency} onValueChange={(value: Currency) => setSelectedCurrency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  <SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => handleCreateWallet(selectedCurrency)}
              disabled={loading || !!currentWallet}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Wallet */}
      {currentWallet ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(currentWallet.balance, currentWallet.currency)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Available balance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(currentWallet.spending_cap || 0, currentWallet.currency)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {currentWallet.spending_cap_type === 'monthly' ? 'Monthly limit' : 'Per session limit'}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <WalletIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No {selectedCurrency} wallet found</p>
              <p className="text-sm">Create a wallet to start using this currency</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Up Section */}
      {currentWallet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Top Up Wallet
            </CardTitle>
            <CardDescription>
              Add funds to your {selectedCurrency} wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="topup-amount">Amount</Label>
                <Input
                  id="topup-amount"
                  type="number"
                  placeholder="0.00"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleTopUp} disabled={loading || !topUpAmount}>
                  {loading ? 'Processing...' : 'Top Up'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Quick amounts:</p>
              <div className="flex gap-2 mt-2">
                {[10, 25, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setTopUpAmount(amount.toString())}
                  >
                    {formatCurrency(amount, selectedCurrency)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Wallets Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Wallets</CardTitle>
          <CardDescription>
            Overview of all your currency wallets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  wallet.currency === selectedCurrency ? 'bg-accent' : 'bg-background'
                }`}
              >
                <div>
                  <div className="font-medium">{wallet.currency}</div>
                  <div className="text-sm text-muted-foreground">
                    {wallet.spending_cap_type === 'monthly' ? 'Monthly' : 'Per session'} limit
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of {formatCurrency(wallet.spending_cap || 0, wallet.currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
