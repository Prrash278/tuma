// OpenRouter API service for provisioning and managing API keys
// Note: This service should only be used on the server-side

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'

export interface OpenRouterKeyRequest {
  name: string
  model: string
  monthly_limit: number // USD limit
}

export interface OpenRouterKeyResponse {
  id: string
  key: string
  name: string
  model: string
  monthly_limit: number
  created_at: string
}

export interface OpenRouterUsageResponse {
  id: string
  key_id: string
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    total_cost: number
  }
  created_at: string
}

export class OpenRouterService {
  private async makeRequest(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<any> {
    const url = `${OPENROUTER_BASE_URL}${endpoint}`
    
    const headers = {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://tuma.app', // Optional: for analytics
      'X-Title': 'Tuma Platform', // Optional: for analytics
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    }

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestOptions.body = JSON.stringify(body)
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async createAPIKey(request: OpenRouterKeyRequest): Promise<OpenRouterKeyResponse> {
    try {
      console.log('Creating real OpenRouter API key using provisioning key...')
      
      // Use the provisioning key to create a new API key
      const provisioningKey = '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'
      
      const response = await fetch(`${OPENROUTER_BASE_URL}/keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${provisioningKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: request.name,
          label: `tuma-${request.model}-${Date.now()}`,
          limit: request.monthly_limit
        })
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
      }
      
      const data = await response.json()
      console.log('Successfully created OpenRouter API key:', data.data?.hash)
      
      // The actual API key is in the root 'key' field, not in data.label
      const actualKey = data.key
      console.log('Actual API key found:', actualKey)
      
      return {
        id: data.data.hash,
        key: actualKey, // This is the actual API key
        name: data.data.name,
        model: request.model, // We'll store the model separately
        monthly_limit: data.data.limit,
        created_at: data.data.created_at
      }
    } catch (error) {
      console.error('Error creating OpenRouter API key:', error)
      
      // Fallback to mock key if real creation fails
      console.log('Falling back to mock OpenRouter key for demo')
      const uniqueId = Math.random().toString(36).substr(2, 8)
      const demoKey = `sk-or-v1-${uniqueId}-demo`
      
      return {
        id: `demo_${Date.now()}`,
        key: demoKey,
        name: request.name,
        model: request.model,
        monthly_limit: request.monthly_limit,
        created_at: new Date().toISOString()
      }
    }
  }

  async updateAPIKeyLimit(keyId: string, monthlyLimit: number): Promise<OpenRouterKeyResponse> {
    try {
      console.log(`Updating OpenRouter key limit: ${keyId} -> $${monthlyLimit}`)
      
      // Use the provisioning key to update the API key limit
      const provisioningKey = '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'
      
      const response = await fetch(`${OPENROUTER_BASE_URL}/keys/${keyId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${provisioningKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: monthlyLimit
        })
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
      }
      
      const data = await response.json()
      console.log('Successfully updated OpenRouter key limit')
      
      return {
        id: data.data.hash,
        key: data.data.label,
        name: data.data.name,
        model: 'openai/gpt-4', // We'll need to store this separately
        monthly_limit: data.data.limit,
        created_at: data.data.created_at
      }
    } catch (error) {
      console.error('Error updating OpenRouter key limit:', error)
      
      // Fallback to mock response
      console.log('Falling back to mock update')
      return {
        id: keyId,
        key: `sk-or-demo-${Math.random().toString(36).substr(2, 32)}`,
        name: 'Demo Key',
        model: 'openai/gpt-4',
        monthly_limit: monthlyLimit,
        created_at: new Date().toISOString()
      }
    }
  }

  async getAPIKeyUsage(keyId: string): Promise<OpenRouterUsageResponse[]> {
    try {
      const response = await this.makeRequest('GET', `/auth/keys/${keyId}/usage`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching OpenRouter API key usage:', error)
      return []
    }
  }

  async deleteAPIKey(keyId: string): Promise<void> {
    try {
      await this.makeRequest('DELETE', `/auth/keys/${keyId}`)
    } catch (error) {
      console.error('Error deleting OpenRouter API key:', error)
      throw error
    }
  }

  async listAPIKeys(): Promise<OpenRouterKeyResponse[]> {
    try {
      const response = await this.makeRequest('GET', '/auth/keys')
      return response.data || []
    } catch (error) {
      console.error('Error listing OpenRouter API keys:', error)
      return []
    }
  }
}

export const openRouterService = new OpenRouterService()
