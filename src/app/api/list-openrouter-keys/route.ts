import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
const PROVISIONING_KEY = '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'

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Listing OpenRouter API keys...')
    
    const response = await fetch(`${OPENROUTER_BASE_URL}/keys`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PROVISIONING_KEY}`,
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
    }
    
    const data = await response.json()
    console.log(`Found ${data.data?.length || 0} OpenRouter API keys`)
    
    return NextResponse.json({
      success: true,
      message: `Found ${data.data?.length || 0} OpenRouter API keys`,
      data: {
        keys: data.data || [],
        count: data.data?.length || 0
      }
    })
  } catch (error) {
    console.error('Error listing OpenRouter keys:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to list OpenRouter keys',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
