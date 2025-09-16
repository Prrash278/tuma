'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, CreditCard, TrendingUp, AlertCircle } from 'lucide-react'
import { Wallet as WalletType } from '@/types/wallet'
import { fxService } from '@/lib/fx-rates'

interface WalletCardProps {
  wallet: WalletType
  onTopUp: () => void
}

export function WalletCard({ wallet, onTopUp }: WalletCardProps) {
  const usdBalance = fxService.convertAmount(wallet.balance, wallet.currency, 'USD')
  const currencyInfo = fxService.getCurrencyByCode(wallet.currency)
  const spendingLimitReached = wallet.spending_limit && wallet.balance >= wallet.spending_limit
  const lowBalance = wallet.balance < (wallet.spending_limit || 0) * 0.1

  return (
    <Card className={`relative ${lowBalance ? 'border-orange-200 bg-orange-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {currencyInfo?.flag} {wallet.currency}
          </CardTitle>
          {lowBalance && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Low Balance
            </Badge>
          )}
        </div>
        <CardDescription>
          {currencyInfo?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance */}
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {fxService.formatAmount(wallet.balance, wallet.currency)}
          </div>
          <div className="text-sm text-muted-foreground">
            ≈ ${usdBalance.toFixed(2)} USD
          </div>
        </div>

        {/* Spending Limit */}
        {wallet.spending_limit && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly Limit</span>
              <span>{fxService.formatAmount(wallet.spending_limit, wallet.currency)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  spendingLimitReached ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.min((wallet.balance / wallet.spending_limit) * 100, 100)}%`
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {((wallet.balance / wallet.spending_limit) * 100).toFixed(1)}% used
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={onTopUp}
            className="flex-1"
            size="sm"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Top Up
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3"
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>

        {/* Status */}
        <div className="text-xs text-muted-foreground">
          <div>Created: {new Date(wallet.created_at).toLocaleDateString()}</div>
          <div>Updated: {new Date(wallet.updated_at).toLocaleDateString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
