import { NextRequest, NextResponse } from 'next/server'
import { clearAllData } from '@/lib/memory-store'

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Clearing all data...')
    
    // Clear all data from memory store
    clearAllData()
    
    return NextResponse.json({
      success: true,
      message: 'All data cleared successfully',
      data: {
        cleared: {
          apiKeys: true,
          shadowLedgers: true,
          apiUsage: true
        }
      }
    })
  } catch (error) {
    console.error('Error clearing data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
