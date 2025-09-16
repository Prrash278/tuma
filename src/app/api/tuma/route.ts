import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Tuma API - Direct OpenRouter Flow',
    info: 'Users should call OpenRouter directly with their provisioned API keys',
    documentation: {
      flow: [
        '1. Create API key via /api/keys endpoint',
        '2. Top up wallet to set OpenRouter key limit',
        '3. Use OpenRouter API directly with provisioned key',
        '4. Tuma monitors usage via OpenRouter webhooks'
      ],
      endpoints: {
        'POST /api/keys': 'Create new API key with OpenRouter provisioning',
        'POST /api/wallet/top-up': 'Top up wallet and update OpenRouter limits',
        'GET /api/keys/usage': 'Get usage statistics'
      }
    }
  })
}