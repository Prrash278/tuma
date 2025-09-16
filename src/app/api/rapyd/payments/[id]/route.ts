import { NextRequest, NextResponse } from 'next/server'
import { rapydPaymentsService } from '@/lib/rapyd-payments'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id

    if (!paymentId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment ID is required' 
        },
        { status: 400 }
      )
    }

    const payment = await rapydPaymentsService.getPayment(paymentId)

    return NextResponse.json({
      success: true,
      data: payment
    })

  } catch (error) {
    console.error('Error retrieving payment:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve payment' 
      },
      { status: 500 }
    )
  }
}
