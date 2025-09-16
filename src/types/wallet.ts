export interface Wallet {
  id: string
  user_id: string
  currency: string
  balance: number
  spending_limit?: number
  spending_limit_type?: 'monthly' | 'session' | 'none'
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  wallet_id: string
  type: 'credit' | 'debit'
  amount: number
  currency: string
  description: string
  reference_id?: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface PaymentMethod {
  id: string
  type: string
  name: string
  category: string
  image: string
  is_online: boolean
  is_offline: boolean
  supported_currencies: string[]
  supported_countries: string[]
}

export interface CheckoutSession {
  id: string
  wallet_id: string
  amount: number
  currency: string
  payment_method_types: string[]
  redirect_url: string
  status: 'pending' | 'completed' | 'failed' | 'expired'
  created_at: string
  expires_at: string
}

export interface LLMUsage {
  id: string
  wallet_id: string
  model: string
  input_tokens: number
  output_tokens: number
  total_tokens: number
  cost_usd: number
  cost_local: number
  currency: string
  created_at: string
}

export interface Model {
  id: string
  name: string
  provider: string
  description: string
  input_cost_per_1k: number
  output_cost_per_1k: number
  context_length: number
  is_available: boolean
}

export interface APIKey {
  id: string
  tuma_key: string // Internal Tuma reference
  openrouter_key: string // Real OpenRouter API key provided to user
  user_id: string
  name: string
  model: 'gpt-4' | 'gpt-4-turbo' | 'claude-3-opus' | 'claude-3-sonnet' | 'gpt-5' | 'gpt-5-mini' | 'gpt-4o-mini' | 'claude-3-haiku' | 'gpt-3.5-turbo' | 'llama-3.1-8b'
  currency: 'USD' | 'NGN' | 'INR' | 'BRL' | 'KES' | 'GHS' | 'ZAR' | 'EGP' | 'MYR' | 'MXN' | 'IDR'
  wallet_balance: number // Balance in the API key's currency
  wallet_balance_usd: number // USD equivalent for internal calculations
  openrouter_usd_limit: number // USD limit set on OpenRouter key
  spending_cap_usd?: number // Optional user spending cap
  created_at: string
  updated_at: string
  is_active: boolean
  total_usage_usd: number
  last_used?: string
  status: 'active' | 'paused' | 'inactive'
}

export interface ShadowUSDLedger {
  id: string
  api_key_id: string
  user_id: string
  total_usage_usd: number
  remaining_balance_usd: number
  last_updated: string
}

export interface APIUsage {
  id: string
  api_key_id: string
  model: string
  input_tokens: number
  output_tokens: number
  total_tokens: number
  cost_usd: number
  cost_local: number
  currency: string
  created_at: string
}

export interface APIKeyWalletTransaction {
  id: string
  api_key_id: string
  type: 'top_up' | 'usage' | 'refund' | 'adjustment'
  amount: number
  currency: string
  amount_usd: number
  description: string
  reference_id?: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface CurrencyConversion {
  from_currency: string
  to_currency: string
  rate: number
  spread: number // 10% spread
  final_rate: number
  timestamp: string
}
