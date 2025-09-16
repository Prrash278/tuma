import { NextRequest, NextResponse } from 'next/server'
import { rapydService } from '@/lib/rapyd'

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

    const checkout = await rapydService.getCheckoutStatus(checkoutId)
    
    return NextResponse.json({ 
      success: true, 
      data: checkout 
    })
  } catch (error) {
    console.error('Error fetching checkout status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch checkout status' 
      },
      { status: 500 }
    )
  }
}
