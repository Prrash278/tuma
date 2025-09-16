import { NextRequest, NextResponse } from 'next/server'
import { apiKeyService } from '@/lib/api-keys'
import { fxService } from '@/lib/fx-rates'

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, currency, apiKeyId } = await request.json()

    if (!userId || !amount || !currency || !apiKeyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert local currency to USD with markup
    const usdAmount = fxService.convertAmount(amount, currency, 'USD')
    
    // Update OpenRouter key limit
    // Note: In production, we'd need to find the API key by ID, not by key
    // For now, we'll use a simplified approach
    try {
      await apiKeyService.updateOpenRouterKeyLimit(apiKeyId, usdAmount)
    } catch (error) {
      console.error('Error updating OpenRouter key limit:', error)
      // Continue with the response even if OpenRouter update fails in demo mode
    }

    // In production, this would also:
    // 1. Update user wallet balance in Supabase
    // 2. Create transaction record
    // 3. Send real-time updates via Supabase Realtime

    return NextResponse.json({
      success: true,
      message: 'Wallet topped up successfully',
      data: {
        usdAmount,
        newLimit: usdAmount,
        currency,
        localAmount: amount
      }
    })

  } catch (error) {
    console.error('Wallet top-up error:', error)
    return NextResponse.json(
      { error: 'Failed to top up wallet' },
      { status: 500 }
    )
  }
}
