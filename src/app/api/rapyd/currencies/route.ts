import { NextResponse } from 'next/server'
import { rapydCheckoutService } from '@/lib/rapyd-checkout'

export async function GET() {
  try {
    const currencies = await rapydCheckoutService.getSupportedCurrencies()
    
    return NextResponse.json({
      success: true,
      data: currencies
    })
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch currencies' },
      { status: 500 }
    )
  }
}
