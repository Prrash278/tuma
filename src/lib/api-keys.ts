import { APIKey, ShadowUSDLedger, APIUsage } from '@/types/wallet'
import { fxService } from './fx-rates'
import { memoryStore } from './memory-store'
import { openRouterService } from './openrouter'

export class APIKeyService {
  private generateAPIKey(): string {
    const prefix = 'tuma_'
    const randomPart = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    return prefix + randomPart
  }

  getUserAPIKeys(userId: string): APIKey[] {
    // In production, this would query Supabase
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`api_keys_${userId}`)
      return stored ? JSON.parse(stored) : []
    }
    // Server-side fallback - use memory store
    return memoryStore.getAPIKeys(userId)
  }

  async createAPIKey(
    userId: string,
    model: APIKey['model'],
    currency: APIKey['currency'],
    spendingCapUSD?: number
  ): Promise<APIKey> {
    try {
      // Provision OpenRouter API key
      const openRouterKey = await openRouterService.createAPIKey({
        name: `Tuma-${model}-${currency}-${Date.now()}`,
        model: this.mapModelToOpenRouter(model),
        monthly_limit: 0 // Start with 0, will be updated when wallet is funded
      })

      const apiKey: APIKey = {
        id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tuma_key: this.generateAPIKey(),
        openrouter_key: openRouterKey.key,
        user_id: userId,
        model,
        currency,
        openrouter_usd_limit: 0, // Initially 0 until wallet is funded
        spending_cap_usd: spendingCapUSD,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        total_usage_usd: 0,
      }

      // Store in localStorage (client-side) or memory store (server-side)
      if (typeof window !== 'undefined') {
        const existingKeys = this.getUserAPIKeys(userId)
        existingKeys.push(apiKey)
        localStorage.setItem(`api_keys_${userId}`, JSON.stringify(existingKeys))
      } else {
        // Server-side fallback - use memory store
        memoryStore.addAPIKey(userId, apiKey)
      }

      // Create shadow USD ledger entry
      await this.createShadowUSDLedger(apiKey.id, userId)

      return apiKey
    } catch (error) {
      console.error('Error creating API key:', error)
      throw new Error('Failed to create API key. Please try again.')
    }
  }

  private mapModelToOpenRouter(model: APIKey['model']): string {
    const modelMap: Record<APIKey['model'], string> = {
      'gpt-4': 'openai/gpt-4',
      'gpt-4-turbo': 'openai/gpt-4-turbo',
      'gpt-5': 'openai/gpt-5',
      'gpt-5-mini': 'openai/gpt-5-mini',
      'claude-3-opus': 'anthropic/claude-3-opus',
      'claude-3-sonnet': 'anthropic/claude-3-sonnet',
    }
    return modelMap[model] || model
  }

  getAPIKeyByKey(key: string): APIKey | null {
    // In production, this would query Supabase
    if (typeof window !== 'undefined') {
      const allUsers = Object.keys(localStorage)
        .filter(key => key.startsWith('api_keys_'))
        .map(key => key.replace('api_keys_', ''))

      for (const userId of allUsers) {
        const keys = this.getUserAPIKeys(userId)
        const found = keys.find(k => k.key === key)
        if (found) return found
      }
    }
    // Server-side fallback - use memory store
    return memoryStore.findAPIKeyByKey(key)
  }

  async createShadowUSDLedger(apiKeyId: string, userId: string): Promise<ShadowUSDLedger> {
    const ledger: ShadowUSDLedger = {
      id: `ledger_${apiKeyId}`,
      api_key_id: apiKeyId,
      user_id: userId,
      total_usage_usd: 0,
      remaining_balance_usd: 0,
      last_updated: new Date().toISOString(),
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(`shadow_ledger_${apiKeyId}`, JSON.stringify(ledger))
    } else {
      // Server-side fallback - use memory store
      memoryStore.setShadowLedger(apiKeyId, ledger)
    }
    return ledger
  }

  getShadowUSDLedger(apiKeyId: string): ShadowUSDLedger | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`shadow_ledger_${apiKeyId}`)
      return stored ? JSON.parse(stored) : null
    }
    // Server-side fallback - use memory store
    return memoryStore.getShadowLedger(apiKeyId)
  }

  async updateShadowUSDLedger(apiKeyId: string, usageUSD: number): Promise<void> {
    const ledger = this.getShadowUSDLedger(apiKeyId)
    if (!ledger) return

    ledger.total_usage_usd += usageUSD
    ledger.remaining_balance_usd -= usageUSD
    ledger.last_updated = new Date().toISOString()

    if (typeof window !== 'undefined') {
      localStorage.setItem(`shadow_ledger_${apiKeyId}`, JSON.stringify(ledger))
    } else {
      // Server-side fallback - use memory store
      memoryStore.setShadowLedger(apiKeyId, ledger)
    }

    // Update API key usage
    const apiKey = this.getAPIKeyByKey(apiKeyId)
    if (apiKey) {
      apiKey.total_usage_usd += usageUSD
      apiKey.updated_at = new Date().toISOString()
      this.updateAPIKey(apiKey)
    }
  }

  updateAPIKey(apiKey: APIKey): void {
    const keys = this.getUserAPIKeys(apiKey.user_id)
    const index = keys.findIndex(k => k.id === apiKey.id)
    if (index !== -1) {
      keys[index] = apiKey
      if (typeof window !== 'undefined') {
        localStorage.setItem(`api_keys_${apiKey.user_id}`, JSON.stringify(keys))
      }
    }
  }

  async recordAPIUsage(
    apiKeyId: string,
    model: string,
    inputTokens: number,
    outputTokens: number,
    costUSD: number,
    currency: string
  ): Promise<APIUsage> {
    const usage: APIUsage = {
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      api_key_id: apiKeyId,
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: inputTokens + outputTokens,
      cost_usd: costUSD,
      cost_local: fxService.convertAmount(costUSD, 'USD', currency),
      currency,
      created_at: new Date().toISOString(),
    }

    // Store usage record
    const existingUsage = this.getAPIUsage(apiKeyId)
    existingUsage.push(usage)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`api_usage_${apiKeyId}`, JSON.stringify(existingUsage))
    } else {
      // Server-side fallback - use memory store
      memoryStore.addAPIUsage(apiKeyId, usage)
    }

    // Update shadow ledger
    await this.updateShadowUSDLedger(apiKeyId, costUSD)

    return usage
  }

  getAPIUsage(apiKeyId: string): APIUsage[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`api_usage_${apiKeyId}`)
      return stored ? JSON.parse(stored) : []
    }
    // Server-side fallback - use memory store
    return memoryStore.getAPIUsage(apiKeyId)
  }

  validateAPIKey(key: string, model: string): { valid: boolean; apiKey?: APIKey; error?: string } {
    const apiKey = this.getAPIKeyByKey(key)
    
    if (!apiKey) {
      return { valid: false, error: 'Invalid API key' }
    }

    if (!apiKey.is_active) {
      return { valid: false, error: 'API key is inactive' }
    }

    if (apiKey.model !== model) {
      return { valid: false, error: 'Model not authorized for this API key' }
    }

    return { valid: true, apiKey }
  }

  getAPIKeyById(apiKeyId: string): APIKey | null {
    // In production, this would query Supabase
    if (typeof window !== 'undefined') {
      // Search through all users' keys
      const allUsers = Object.keys(localStorage)
        .filter(key => key.startsWith('api_keys_'))
        .map(key => key.replace('api_keys_', ''))

      for (const userId of allUsers) {
        const keys = this.getUserAPIKeys(userId)
        const found = keys.find(k => k.id === apiKeyId)
        if (found) return found
      }
    } else {
      // Server-side fallback - use memory store
      return memoryStore.findAPIKeyById(apiKeyId)
    }
    return null
  }

  async updateOpenRouterKeyLimit(apiKeyId: string, newLimitUSD: number): Promise<void> {
    try {
      const apiKey = this.getAPIKeyById(apiKeyId)
      if (!apiKey) {
        throw new Error('API key not found')
      }

      // Update OpenRouter key limit
      await openRouterService.updateAPIKeyLimit(apiKey.openrouter_key, newLimitUSD)
      
      // Update local record
      apiKey.openrouter_usd_limit = newLimitUSD
      apiKey.updated_at = new Date().toISOString()
      
      if (typeof window !== 'undefined') {
        this.updateAPIKey(apiKey)
      } else {
        // Server-side fallback - use memory store
        memoryStore.updateAPIKey(apiKey.user_id, apiKeyId, { 
          openrouter_usd_limit: newLimitUSD,
          updated_at: apiKey.updated_at
        })
      }
    } catch (error) {
      console.error('Error updating OpenRouter key limit:', error)
      throw error
    }
  }

  checkSpendingCap(apiKey: APIKey, additionalCostUSD: number): { allowed: boolean; error?: string } {
    if (!apiKey.spending_cap_usd) {
      return { allowed: true }
    }

    const ledger = this.getShadowUSDLedger(apiKey.id)
    const totalUsage = (ledger?.total_usage_usd || 0) + additionalCostUSD

    if (totalUsage > apiKey.spending_cap_usd) {
      return { 
        allowed: false, 
        error: `Spending cap exceeded. Limit: $${apiKey.spending_cap_usd}, Current: $${totalUsage.toFixed(2)}` 
      }
    }

    return { allowed: true }
  }
}

export const apiKeyService = new APIKeyService()
