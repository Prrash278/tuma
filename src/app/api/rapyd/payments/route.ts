import { NextRequest, NextResponse } from 'next/server'
import { rapydPaymentsService, RapydPaymentRequest } from '@/lib/rapyd-payments'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.amount || !body.currency) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: amount and currency are required' 
        },
        { status: 400 }
      )
    }

    // Create payment request object
    const paymentRequest: RapydPaymentRequest = {
      amount: body.amount,
      currency: body.currency,
      customer: body.customer,
      payment_method: body.payment_method,
      description: body.description || `Tuma payment for ${body.amount} ${body.currency}`,
      merchant_reference_id: body.merchant_reference_id || `tuma_${Date.now()}`,
      ewallet: body.ewallet,
      ewallets: body.ewallets,
      capture: body.capture !== false, // Default to true
      save_payment_method: body.save_payment_method || false,
      complete_payment_url: body.complete_payment_url,
      error_payment_url: body.error_payment_url,
      receipt_email: body.receipt_email,
      statement_descriptor: body.statement_descriptor || 'TUMA PAYMENT',
      metadata: body.metadata || {},
      address: body.address,
      client_details: body.client_details,
      payment_method_options: body.payment_method_options,
      fixed_side: body.fixed_side || 'buy',
      requested_currency: body.requested_currency,
      initiation_type: body.initiation_type || 'customer_present',
      escrow: body.escrow || false,
      escrow_release_days: body.escrow_release_days,
      expiration: body.expiration,
      group_payment: body.group_payment,
      merchant_ewallet: body.merchant_ewallet,
      payment_fees: body.payment_fees
    }

    console.log('Creating Rapyd payment with data:', {
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      customer: paymentRequest.customer,
      ewallet: paymentRequest.ewallet,
      description: paymentRequest.description
    })

    const payment = await rapydPaymentsService.createPayment(paymentRequest)

    return NextResponse.json({
      success: true,
      data: payment
    })

  } catch (error) {
    console.error('Error creating payment:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create payment' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      status: searchParams.get('status') || undefined,
      currency: searchParams.get('currency') || undefined,
      customer: searchParams.get('customer') || undefined
    }

    const payments = await rapydPaymentsService.listPayments(filters)

    return NextResponse.json({
      success: true,
      data: payments
    })

  } catch (error) {
    console.error('Error listing payments:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to list payments' 
      },
      { status: 500 }
    )
  }
}
