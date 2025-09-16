import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateWalletRequest {
  currency: 'NGN' | 'INR' | 'BRL' | 'USD'
  spending_cap?: number
  spending_cap_type?: 'monthly' | 'session'
}

interface TopUpRequest {
  wallet_id: string
  amount: number
  payment_method: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (action) {
      case 'create':
        return await handleCreateWallet(req, supabaseClient, user.id)
      case 'topup':
        return await handleTopUp(req, supabaseClient, user.id)
      case 'list':
        return await handleListWallets(supabaseClient, user.id)
      case 'update_cap':
        return await handleUpdateSpendingCap(req, supabaseClient, user.id)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Error in wallet management function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleCreateWallet(req: Request, supabaseClient: any, userId: string) {
  const { currency, spending_cap, spending_cap_type = 'monthly' }: CreateWalletRequest = await req.json()

  if (!currency) {
    return new Response(
      JSON.stringify({ error: 'Currency is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Check if wallet already exists
  const { data: existingWallet } = await supabaseClient
    .from('wallets')
    .select('id')
    .eq('user_id', userId)
    .eq('currency', currency)
    .single()

  if (existingWallet) {
    return new Response(
      JSON.stringify({ error: 'Wallet for this currency already exists' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Create new wallet
  const { data: wallet, error: walletError } = await supabaseClient
    .from('wallets')
    .insert({
      user_id: userId,
      currency,
      balance: 0.00,
      spending_cap,
      spending_cap_type,
    })
    .select()
    .single()

  if (walletError) {
    return new Response(
      JSON.stringify({ error: 'Failed to create wallet', details: walletError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, data: wallet }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleTopUp(req: Request, supabaseClient: any, userId: string) {
  const { wallet_id, amount, payment_method }: TopUpRequest = await req.json()

  if (!wallet_id || !amount || amount <= 0) {
    return new Response(
      JSON.stringify({ error: 'Valid wallet_id and amount are required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get wallet
  const { data: wallet, error: walletError } = await supabaseClient
    .from('wallets')
    .select('*')
    .eq('id', wallet_id)
    .eq('user_id', userId)
    .single()

  if (walletError || !wallet) {
    return new Response(
      JSON.stringify({ error: 'Wallet not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // For MVP, we'll simulate a successful payment
  // In production, integrate with actual payment providers
  const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Update wallet balance
  const { error: updateError } = await supabaseClient
    .from('wallets')
    .update({ 
      balance: wallet.balance + amount,
      updated_at: new Date().toISOString()
    })
    .eq('id', wallet_id)

  if (updateError) {
    return new Response(
      JSON.stringify({ error: 'Failed to update wallet balance' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Record transaction
  const { error: transactionError } = await supabaseClient
    .from('transactions')
    .insert({
      user_id: userId,
      wallet_id: wallet_id,
      type: 'credit',
      amount: amount,
      currency: wallet.currency,
      description: `Wallet top-up via ${payment_method}`,
      reference: paymentIntentId,
    })

  if (transactionError) {
    console.error('Error recording transaction:', transactionError)
  }

  // Record payment intent
  const { error: paymentError } = await supabaseClient
    .from('payment_intents')
    .insert({
      user_id: userId,
      amount: amount,
      currency: wallet.currency,
      provider: payment_method as any,
      provider_intent_id: paymentIntentId,
      status: 'succeeded',
    })

  if (paymentError) {
    console.error('Error recording payment intent:', paymentError)
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      data: { 
        wallet_id, 
        new_balance: wallet.balance + amount,
        amount_added: amount,
        currency: wallet.currency
      }
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleListWallets(supabaseClient: any, userId: string) {
  const { data: wallets, error } = await supabaseClient
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch wallets', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true, data: wallets }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleUpdateSpendingCap(req: Request, supabaseClient: any, userId: string) {
  const { wallet_id, spending_cap, spending_cap_type } = await req.json()

  if (!wallet_id) {
    return new Response(
      JSON.stringify({ error: 'wallet_id is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { error } = await supabaseClient
    .from('wallets')
    .update({ 
      spending_cap,
      spending_cap_type,
      updated_at: new Date().toISOString()
    })
    .eq('id', wallet_id)
    .eq('user_id', userId)

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update spending cap', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
