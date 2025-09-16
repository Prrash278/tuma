'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { Wallet } from '@/types'

export function useWallet() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWallets = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getWallets()
      setWallets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallets')
    } finally {
      setLoading(false)
    }
  }

  const createWallet = async (currency: string, spendingCap?: number, spendingCapType?: 'monthly' | 'session') => {
    try {
      setError(null)
      const newWallet = await api.createWallet(currency, spendingCap, spendingCapType)
      setWallets(prev => [...prev, newWallet])
      return newWallet
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const topUpWallet = async (walletId: string, amount: number, paymentMethod: string) => {
    try {
      setError(null)
      const result = await api.topUpWallet(walletId, amount, paymentMethod)
      
      // Update the wallet in state
      setWallets(prev => prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, balance: result.new_balance }
          : wallet
      ))
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to top up wallet'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateSpendingCap = async (walletId: string, spendingCap: number, spendingCapType: 'monthly' | 'session') => {
    try {
      setError(null)
      await api.updateSpendingCap(walletId, spendingCap, spendingCapType)
      
      // Update the wallet in state
      setWallets(prev => prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, spending_cap: spendingCap, spending_cap_type: spendingCapType }
          : wallet
      ))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update spending cap'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchWallets()
  }, [])

  return {
    wallets,
    loading,
    error,
    fetchWallets,
    createWallet,
    topUpWallet,
    updateSpendingCap,
  }
}
