import { NextRequest, NextResponse } from 'next/server'
import { rapydCheckoutService } from '@/lib/rapyd-checkout'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const currency = searchParams.get('currency')

    if (!country || !currency) {
      return NextResponse.json(
        { error: 'Country and currency are required' },
        { status: 400 }
      )
    }

    const paymentMethods = await rapydCheckoutService.getPaymentMethods(country, currency)
    
    return NextResponse.json({
      success: true,
      data: paymentMethods
    })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    )
  }
}