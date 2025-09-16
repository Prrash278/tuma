import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  max_tokens?: number
  temperature?: number
}

interface CostEstimate {
  estimated_tokens: number
  cost_usd: number
  cost_local: number
  currency: string
  fx_rate: number
  markup_percentage: number
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

    const { model, messages, max_tokens = 1000, temperature = 0.7 } = await req.json() as ChatRequest

    if (!model || !messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: model, messages' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get model pricing
    const { data: modelData, error: modelError } = await supabaseClient
      .from('models')
      .select('*')
      .eq('name', model)
      .eq('is_active', true)
      .single()

    if (modelError || !modelData) {
      return new Response(
        JSON.stringify({ error: 'Model not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's primary wallet (USD for now)
    const { data: wallet, error: walletError } = await supabaseClient
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .eq('currency', 'USD')
      .single()

    if (walletError || !wallet) {
      return new Response(
        JSON.stringify({ error: 'No wallet found. Please create a wallet first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Estimate cost
    const totalText = messages.map(m => m.content).join(' ')
    const estimatedTokens = Math.ceil(totalText.length / 4) + max_tokens // Rough estimation
    const costUsd = (estimatedTokens / 1000) * modelData.pricing_per_1k_tokens

    // Check if user has sufficient balance
    if (wallet.balance < costUsd) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient balance',
          required: costUsd,
          available: wallet.balance,
          currency: wallet.currency
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check spending cap
    if (wallet.spending_cap && wallet.spending_cap < costUsd) {
      return new Response(
        JSON.stringify({ 
          error: 'Request exceeds spending cap',
          required: costUsd,
          cap: wallet.spending_cap,
          currency: wallet.currency
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Make request to OpenRouter
    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': Deno.env.get('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000',
        'X-Title': 'Tuma',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature,
      }),
    })

    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text()
      return new Response(
        JSON.stringify({ error: 'OpenRouter API error', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openrouterData = await openrouterResponse.json()

    // Calculate actual cost based on usage
    const actualTokens = openrouterData.usage?.total_tokens || estimatedTokens
    const actualCostUsd = (actualTokens / 1000) * modelData.pricing_per_1k_tokens

    // Deduct from wallet
    const { error: updateError } = await supabaseClient
      .from('wallets')
      .update({ 
        balance: wallet.balance - actualCostUsd,
        updated_at: new Date().toISOString()
      })
      .eq('id', wallet.id)

    if (updateError) {
      console.error('Error updating wallet:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update wallet balance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Record transaction
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        type: 'debit',
        amount: actualCostUsd,
        currency: wallet.currency,
        description: `LLM usage: ${model}`,
        reference: openrouterData.id,
      })

    if (transactionError) {
      console.error('Error recording transaction:', transactionError)
    }

    // Record usage
    const { error: usageError } = await supabaseClient
      .from('usage')
      .insert({
        user_id: user.id,
        model_id: modelData.id,
        tokens_used: actualTokens,
        cost_usd: actualCostUsd,
        cost_local: actualCostUsd, // For USD wallet
        currency: wallet.currency,
      })

    if (usageError) {
      console.error('Error recording usage:', usageError)
    }

    // Update shadow USD ledger
    const { error: ledgerError } = await supabaseClient
      .from('shadow_usd_ledger')
      .update({
        total_usd_consumed: supabaseClient.raw('total_usd_consumed + ?', [actualCostUsd]),
        last_updated: new Date().toISOString()
      })
      .eq('id', 1) // Assuming single ledger record

    if (ledgerError) {
      console.error('Error updating shadow ledger:', ledgerError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: openrouterData,
        cost: {
          tokens: actualTokens,
          cost_usd: actualCostUsd,
          currency: wallet.currency
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
