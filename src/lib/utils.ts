import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting utilities
export function formatCurrency(amount: number, currency: string): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    NGN: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }),
    INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
    BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
  }
  
  return formatters[currency]?.format(amount) || `${currency} ${amount.toFixed(2)}`
}

// FX conversion utilities
export function convertUsdToLocal(usdAmount: number, fxRate: number, markupPercentage: number = 0): number {
  const markupMultiplier = 1 + (markupPercentage / 100)
  return usdAmount * fxRate * markupMultiplier
}

export function convertLocalToUsd(localAmount: number, fxRate: number, markupPercentage: number = 0): number {
  const markupMultiplier = 1 + (markupPercentage / 100)
  return localAmount / (fxRate * markupMultiplier)
}

// Token estimation utilities (rough estimates)
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4)
}

export function estimateChatTokens(messages: Array<{ role: string; content: string }>): number {
  const totalText = messages.map(m => m.content).join(' ')
  return estimateTokens(totalText)
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidCurrency(currency: string): boolean {
  return ['NGN', 'INR', 'BRL', 'USD'].includes(currency)
}

// Date utilities
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(date)
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}

// API response utilities
export function createApiResponse<T>(data: T, success: boolean = true) {
  return {
    success,
    data,
    timestamp: new Date().toISOString(),
  }
}

export function createApiError(message: string, code?: string) {
  return {
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  }
}
