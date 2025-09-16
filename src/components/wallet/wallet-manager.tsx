'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet, Plus, CreditCard, TrendingUp } from 'lucide-react'
import { fxService, SUPPORTED_CURRENCIES } from '@/lib/fx-rates'
import { Wallet as WalletType } from '@/types/wallet'
import { WalletCard } from './wallet-card'
import { SimpleTopUpModal } from './simple-top-up-modal'

export function WalletManager() {
  const [wallets, setWallets] = useState<WalletType[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)

  // Mock data - in production, this would come from Supabase
  useEffect(() => {
    const mockWallets: WalletType[] = [
      {
        id: '1',
        user_id: 'user-1',
        currency: 'USD',
        balance: 25.50,
        spending_limit: 100,
        spending_limit_type: 'monthly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: 'user-1',
        currency: 'NGN',
        balance: 40800,
        spending_limit: 160000,
        spending_limit_type: 'monthly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        user_id: 'user-1',
        currency: 'INR',
        balance: 2115,
        spending_limit: 8300,
        spending_limit_type: 'monthly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    setWallets(mockWallets)
  }, [])

  const handleCreateWallet = async () => {
    setIsCreatingWallet(true)
    try {
      // Mock wallet creation - in production, this would call Supabase
      const newWallet: WalletType = {
        id: Date.now().toString(),
        user_id: 'user-1',
        currency: selectedCurrency,
        balance: 0,
        spending_limit: 1000,
        spending_limit_type: 'monthly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      setWallets(prev => [...prev, newWallet])
      setSelectedCurrency('USD')
    } catch (error) {
      console.error('Error creating wallet:', error)
    } finally {
      setIsCreatingWallet(false)
    }
  }

  const handleTopUp = (wallet: WalletType) => {
    setSelectedWallet(wallet)
    setShowTopUpModal(true)
  }

  const handleTopUpComplete = async (amount: number, currency: string) => {
    try {
      // Call the wallet top-up API
      const response = await fetch('/api/wallet/top-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user-1',
          amount,
          currency,
          apiKeyId: 'demo-key' // In production, this would be the actual API key ID
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update wallet balance
        setWallets(prev => prev.map(wallet => 
          wallet.currency === currency 
            ? { ...wallet, balance: wallet.balance + amount }
            : wallet
        ))
        alert(`Successfully topped up ${amount} ${currency}!`)
      } else {
        throw new Error(data.error || 'Top-up failed')
      }
    } catch (error) {
      console.error('Error topping up wallet:', error)
      alert('Failed to top up wallet. Please try again.')
    }
  }

  const totalBalanceUSD = wallets.reduce((total, wallet) => {
    const usdAmount = fxService.convertAmount(wallet.balance, wallet.currency, 'USD')
    return total + usdAmount
  }, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalanceUSD.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across all currencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wallets.length}</div>
            <p className="text-xs text-muted-foreground">
              Multi-currency wallets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">
              Total spent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Wallet */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Wallet</CardTitle>
          <CardDescription>
            Add a new wallet in your preferred currency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code} - {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="spending-limit">Monthly Spending Limit</Label>
              <Input
                id="spending-limit"
                type="number"
                placeholder="1000"
                defaultValue="1000"
              />
            </div>
          </div>
          <Button 
            onClick={handleCreateWallet}
            disabled={isCreatingWallet}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isCreatingWallet ? 'Creating...' : 'Create Wallet'}
          </Button>
        </CardContent>
      </Card>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            onTopUp={() => handleTopUp(wallet)}
          />
        ))}
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && selectedWallet && (
        <SimpleTopUpModal
          isOpen={showTopUpModal}
          onClose={() => {
            setShowTopUpModal(false)
            setSelectedWallet(null)
          }}
          wallet={selectedWallet}
          onTopUp={handleTopUpComplete}
        />
      )}
    </div>
  )
}
