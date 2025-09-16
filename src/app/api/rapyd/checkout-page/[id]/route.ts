import { NextRequest, NextResponse } from 'next/server'
import { rapydCheckoutPageService } from '@/lib/rapyd-checkout-page'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const checkoutId = params.id

    if (!checkoutId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Checkout ID is required' 
        },
        { status: 400 }
      )
    }

    const checkoutPage = await rapydCheckoutPageService.getCheckoutPage(checkoutId)

    return NextResponse.json({
      success: true,
      data: checkoutPage
    })

  } catch (error) {
    console.error('Error retrieving checkout page:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve checkout page' 
      },
      { status: 500 }
    )
  }
}
