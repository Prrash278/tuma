import { NextResponse } from 'next/server'
import { rapydCheckoutService } from '@/lib/rapyd-checkout'

export async function GET() {
  try {
    const countries = await rapydCheckoutService.getSupportedCountries()
    
    return NextResponse.json({
      success: true,
      data: countries
    })
  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    )
  }
}
