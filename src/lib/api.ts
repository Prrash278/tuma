import { createClientSupabase } from './supabase'
import type { ChatRequest, ChatResponse, Wallet, Model, Usage, CostEstimate } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export class TumaAPI {
  private supabase = createClientSupabase()

  // Chat API
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { data, error } = await this.supabase.functions.invoke('chat', {
      body: request,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to send message')
    }

    return data.data
  }

  // Wallet Management
  async createWallet(currency: string, spendingCap?: number, spendingCapType?: 'monthly' | 'session'): Promise<Wallet> {
    const { data, error } = await this.supabase.functions.invoke('wallet-management', {
      body: { currency, spending_cap: spendingCap, spending_cap_type: spendingCapType },
      method: 'POST',
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to create wallet')
    }

    return data.data
  }

  async topUpWallet(walletId: string, amount: number, paymentMethod: string): Promise<{ new_balance: number; amount_added: number }> {
    const { data, error } = await this.supabase.functions.invoke('wallet-management', {
      body: { wallet_id: walletId, amount, payment_method: paymentMethod },
      method: 'POST',
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to top up wallet')
    }

    return data.data
  }

  async getWallets(): Promise<Wallet[]> {
    const { data, error } = await this.supabase.functions.invoke('wallet-management', {
      method: 'GET',
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch wallets')
    }

    return data.data
  }

  async updateSpendingCap(walletId: string, spendingCap: number, spendingCapType: 'monthly' | 'session'): Promise<void> {
    const { data, error } = await this.supabase.functions.invoke('wallet-management', {
      body: { wallet_id: walletId, spending_cap: spendingCap, spending_cap_type: spendingCapType },
      method: 'POST',
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to update spending cap')
    }
  }

  // Models
  async getModels(): Promise<Model[]> {
    const { data, error } = await this.supabase
      .from('models')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Usage History
  async getUsageHistory(limit: number = 50, offset: number = 0): Promise<Usage[]> {
    const { data, error } = await this.supabase
      .from('usage')
      .select(`
        *,
        models (
          name,
          provider
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // FX Rates
  async getFxRates(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('fx_rates')
      .select('*')
      .order('from_currency, to_currency')

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Cost Estimation
  async estimateCost(text: string, modelId: string, currency: string = 'USD'): Promise<CostEstimate> {
    // Get model pricing
    const { data: model, error: modelError } = await this.supabase
      .from('models')
      .select('pricing_per_1k_tokens')
      .eq('id', modelId)
      .single()

    if (modelError || !model) {
      throw new Error('Model not found')
    }

    // Get FX rate
    const { data: fxRate, error: fxError } = await this.supabase
      .from('fx_rates')
      .select('*')
      .eq('from_currency', 'USD')
      .eq('to_currency', currency)
      .single()

    if (fxError || !fxRate) {
      throw new Error('FX rate not found')
    }

    // Estimate tokens (rough calculation)
    const estimatedTokens = Math.ceil(text.length / 4)
    const costUsd = (estimatedTokens / 1000) * model.pricing_per_1k_tokens
    const costLocal = costUsd * fxRate.effective_rate

    return {
      estimated_tokens: estimatedTokens,
      cost_usd: costUsd,
      cost_local: costLocal,
      currency: currency as any,
      fx_rate: fxRate.effective_rate,
      markup_percentage: fxRate.markup_percentage,
    }
  }
}

export const api = new TumaAPI()
