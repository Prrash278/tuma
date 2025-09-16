// Simple in-memory store for demo purposes
// In production, this would be replaced with Supabase database calls

interface StoredData {
  apiKeys: Record<string, any[]>
  shadowLedgers: Record<string, any>
  apiUsage: Record<string, any[]>
}

const store: StoredData = {
  apiKeys: {},
  shadowLedgers: {},
  apiUsage: {}
}

// Clear all data function
export const clearAllData = () => {
  store.apiKeys = {}
  store.shadowLedgers = {}
  store.apiUsage = {}
  console.log('🧹 All data cleared from memory store')
}

export const memoryStore = {
  // API Keys
  getAPIKeys(userId: string): any[] {
    return store.apiKeys[userId] || []
  },

  setAPIKeys(userId: string, keys: any[]): void {
    store.apiKeys[userId] = keys
  },

  addAPIKey(userId: string, key: any): void {
    if (!store.apiKeys[userId]) {
      store.apiKeys[userId] = []
    }
    store.apiKeys[userId].push(key)
  },

  findAPIKeyByKey(key: string): any | null {
    for (const userId in store.apiKeys) {
      const keys = store.apiKeys[userId]
      const found = keys.find(k => k.key === key)
      if (found) return found
    }
    return null
  },

  findAPIKeyById(id: string): any | null {
    for (const userId in store.apiKeys) {
      const keys = store.apiKeys[userId]
      const found = keys.find(k => k.id === id)
      if (found) return found
    }
    return null
  },

  updateAPIKey(userId: string, keyId: string, updates: any): void {
    if (store.apiKeys[userId]) {
      const index = store.apiKeys[userId].findIndex(k => k.id === keyId)
      if (index !== -1) {
        store.apiKeys[userId][index] = { ...store.apiKeys[userId][index], ...updates }
      }
    }
  },

  // Shadow Ledgers
  getShadowLedger(apiKeyId: string): any | null {
    return store.shadowLedgers[apiKeyId] || null
  },

  setShadowLedger(apiKeyId: string, ledger: any): void {
    store.shadowLedgers[apiKeyId] = ledger
  },

  updateShadowLedger(apiKeyId: string, updates: any): void {
    if (store.shadowLedgers[apiKeyId]) {
      store.shadowLedgers[apiKeyId] = { ...store.shadowLedgers[apiKeyId], ...updates }
    }
  },

  // API Usage
  getAPIUsage(apiKeyId: string): any[] {
    return store.apiUsage[apiKeyId] || []
  },

  addAPIUsage(apiKeyId: string, usage: any): void {
    if (!store.apiUsage[apiKeyId]) {
      store.apiUsage[apiKeyId] = []
    }
    store.apiUsage[apiKeyId].push(usage)
  }
}
