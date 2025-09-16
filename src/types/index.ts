// User and Auth Types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Wallet Types
export interface Wallet {
  id: string
  user_id: string
  currency: Currency
  balance: number
  spending_cap?: number
  spending_cap_type?: 'monthly' | 'session'
  created_at: string
  updated_at: string
}

export type Currency = 'NGN' | 'INR' | 'BRL' | 'USD'

// FX Rate Types
export interface FxRate {
  id: string
  from_currency: Currency
  to_currency: Currency
  rate: number
  markup_percentage: number
  effective_rate: number
  created_at: string
  updated_at: string
}

// Transaction Types
export interface Transaction {
  id: string
  user_id: string
  wallet_id: string
  type: 'debit' | 'credit'
  amount: number
  currency: Currency
  description: string
  reference?: string
  created_at: string
}

// Model and Usage Types
export interface Model {
  id: string
  name: string
  provider: string
  pricing_per_1k_tokens: number
  context_length: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Usage {
  id: string
  user_id: string
  model_id: string
  tokens_used: number
  cost_usd: number
  cost_local: number
  currency: Currency
  created_at: string
}

// API Request/Response Types
export interface ChatRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  max_tokens?: number
  temperature?: number
}

export interface ChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Cost Estimation Types
export interface CostEstimate {
  estimated_tokens: number
  cost_usd: number
  cost_local: number
  currency: Currency
  fx_rate: number
  markup_percentage: number
}

// Payment Types
export interface PaymentMethod {
  id: string
  user_id: string
  provider: 'stripe' | 'flutterwave' | 'paystack' | 'mobile_money' | 'upi' | 'pix'
  provider_id: string
  is_default: boolean
  created_at: string
}

export interface PaymentIntent {
  id: string
  user_id: string
  amount: number
  currency: Currency
  provider: string
  provider_intent_id: string
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled'
  created_at: string
  updated_at: string
}

// Shadow USD Ledger Types
export interface ShadowUsdLedger {
  id: string
  total_usd_consumed: number
  total_usd_available: number
  last_updated: string
}

// Error Types
export interface ApiError {
  error: string
  message: string
  code?: string
}

// Realtime Types
export interface RealtimeUpdate {
  type: 'wallet_balance' | 'usage_update' | 'spending_cap_warning'
  user_id: string
  data: any
  timestamp: string
}
