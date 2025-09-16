'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { ChatRequest, ChatResponse } from '@/types'

export function useChat() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.sendMessage(request)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    sendMessage,
  }
}
