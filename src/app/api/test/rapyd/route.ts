import { NextRequest, NextResponse } from 'next/server'
import { rapydService } from '@/lib/rapyd'

export async function GET(request: NextRequest) {
  try {
    // Test Rapyd connection by getting supported countries
    const countries = await rapydService.getSupportedCountries()
    const currencies = await rapydService.getSupportedCurrencies()
    
    return NextResponse.json({
      success: true,
      message: 'Rapyd API connection successful',
      data: {
        countries: countries.slice(0, 5), // First 5 countries
        currencies: currencies.slice(0, 5), // First 5 currencies
        totalCountries: countries.length,
        totalCurrencies: currencies.length,
      }
    })
  } catch (error) {
    console.error('Rapyd API test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to connect to Rapyd API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
