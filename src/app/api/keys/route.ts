import { NextRequest, NextResponse } from 'next/server'
import { apiKeyService } from '@/lib/api-keys'

export async function POST(request: NextRequest) {
  try {
    const { userId, model, currency, spendingCap } = await request.json()

    if (!userId || !model || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, model, currency' },
        { status: 400 }
      )
    }

    // Create API key with OpenRouter provisioning
    const apiKey = await apiKeyService.createAPIKey(
      userId,
      model,
      currency,
      spendingCap
    )

    return NextResponse.json({
      success: true,
      data: {
        id: apiKey.id,
        tuma_key: apiKey.tuma_key,
        openrouter_key: apiKey.openrouter_key,
        model: apiKey.model,
        currency: apiKey.currency,
        openrouter_usd_limit: apiKey.openrouter_usd_limit,
        spending_cap_usd: apiKey.spending_cap_usd,
        created_at: apiKey.created_at,
        updated_at: apiKey.updated_at,
        is_active: apiKey.is_active,
        total_usage_usd: apiKey.total_usage_usd
      }
    })

  } catch (error) {
    console.error('API key creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const apiKeys = apiKeyService.getUserAPIKeys(userId)

    return NextResponse.json({
      success: true,
      data: apiKeys
    })

  } catch (error) {
    console.error('API key fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}
