import { NextRequest, NextResponse } from 'next/server'
import { rapydCheckoutPageService, RapydCheckoutPageRequest } from '@/lib/rapyd-checkout-page'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.currency || !body.country) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: currency and country are required' 
        },
        { status: 400 }
      )
    }

    // Create checkout page request object
    const checkoutRequest: RapydCheckoutPageRequest = {
      amount: body.amount,
      currency: body.currency,
      country: body.country,
      customer: body.customer,
      description: body.description || `Tuma checkout for ${body.amount} ${body.currency}`,
      merchant_reference_id: body.merchant_reference_id || `tuma_checkout_${Date.now()}`,
      complete_payment_url: body.complete_payment_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/checkout/success`,
      error_payment_url: body.error_payment_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/checkout/error`,
      cancel_checkout_url: body.cancel_checkout_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/checkout/cancelled`,
      complete_checkout_url: body.complete_checkout_url || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/checkout/complete`,
      language: body.language || 'en',
      expiration: body.expiration,
      page_expiration: body.page_expiration,
      payment_expiration: body.payment_expiration,
      capture: body.capture !== false, // Default to true
      escrow: body.escrow || false,
      escrow_release_days: body.escrow_release_days,
      ewallet: body.ewallet,
      ewallets: body.ewallets,
      fixed_side: body.fixed_side || 'buy',
      requested_currency: body.requested_currency,
      payment_method_type: body.payment_method_type,
      payment_method_type_categories: body.payment_method_type_categories,
      payment_method_types_include: body.payment_method_types_include,
      payment_method_types_exclude: body.payment_method_types_exclude,
      payment_method_required_fields: body.payment_method_required_fields,
      merchant_fields: body.merchant_fields,
      custom_elements: body.custom_elements,
      cart_items: body.cart_items,
      account_funding_transaction: body.account_funding_transaction,
      recurrence_type: body.recurrence_type || 'unscheduled',
      require_card_cvv: body.require_card_cvv || false,
      statement_descriptor: body.statement_descriptor || 'TUMA CHECKOUT',
      metadata: {
        ...body.metadata,
        created_by: 'tuma_platform',
        created_at: new Date().toISOString()
      }
    }

    console.log('Creating Rapyd checkout page with data:', {
      amount: checkoutRequest.amount,
      currency: checkoutRequest.currency,
      country: checkoutRequest.country,
      customer: checkoutRequest.customer,
      description: checkoutRequest.description
    })

    const checkoutPage = await rapydCheckoutPageService.createCheckoutPage(checkoutRequest)

    return NextResponse.json({
      success: true,
      data: checkoutPage
    })

  } catch (error) {
    console.error('Error creating checkout page:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create checkout page' 
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

    const checkoutPages = await rapydCheckoutPageService.listCheckoutPages(filters)

    return NextResponse.json({
      success: true,
      data: checkoutPages
    })

  } catch (error) {
    console.error('Error listing checkout pages:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to list checkout pages' 
      },
      { status: 500 }
    )
  }
}
