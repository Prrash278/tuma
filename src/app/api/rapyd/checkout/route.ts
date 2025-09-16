import { NextRequest, NextResponse } from 'next/server'
import { rapydCheckoutService } from '@/lib/rapyd-checkout'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, country, payment_method_types, customer, apiKeyId } = body

    if (!amount || !currency || !country) {
      return NextResponse.json(
        { error: 'Amount, currency, and country are required' },
        { status: 400 }
      )
    }

    const checkout = await rapydCheckoutService.createCheckout({
      amount,
      currency,
      country,
      payment_method_types: payment_method_types || [],
      customer: customer || {
        name: 'Tuma User',
        email: 'user@tuma.app'
      },
      merchant_reference_id: `tuma_${apiKeyId}_${Date.now()}`,
      metadata: {
        apiKeyId,
        type: 'wallet_topup'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: checkout
    })
  } catch (error) {
    console.error('Error creating checkout:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    )
  }
}