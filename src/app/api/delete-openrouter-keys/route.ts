import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
const PROVISIONING_KEY = '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'

// List of OpenRouter key hashes we created during testing (Tuma-related keys)
const TUMA_KEY_HASHES = [
  '448ee5eeffefb1b95814e27305a70f092cb87ae8433f31db501435fcb3b1531e', // Tuma-gpt-4o-mini-USD-1758044521891
  '6d7795408f818a5b10c8fd6407ece43eb9ff5a78b8657f491ef6b04be35f2e8b', // Tuma-gpt-4o-mini-USD-1758044825445
  '786363065206eba96f594e01d03bfaee13f659342861d4acbf404259862673c4', // Tuma-gpt-4o-mini-USD-1758045006180
  '5e85767c039a301325f1620af2d0bbca67dd2200254e7a1c100313c3b0423313', // Tuma-gpt-4o-mini-USD-1758045439444
  '162eaace1e30d7bc3d8caa5548671cecb737cc780a7f6420f760a35c492a4f23', // Tuma Test Key
  '2434dda326165f246de1f2f7db56ebac6b4eeae29fe8c4cdc9280ee400d377ff'  // Tuma Test Key
]

export async function POST(request: NextRequest) {
  try {
    console.log('🗑️ Deleting OpenRouter API keys...')
    
    const results = []
    
    for (const keyHash of TUMA_KEY_HASHES) {
      try {
        console.log(`Deleting key: ${keyHash}`)
        
        const response = await fetch(`${OPENROUTER_BASE_URL}/keys/${keyHash}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${PROVISIONING_KEY}`,
            'Content-Type': 'application/json',
          }
        })
        
        if (response.ok) {
          console.log(`✅ Successfully deleted key: ${keyHash}`)
          results.push({
            hash: keyHash,
            status: 'deleted',
            success: true
          })
        } else {
          const error = await response.text()
          console.log(`❌ Failed to delete key ${keyHash}: ${response.status} - ${error}`)
          results.push({
            hash: keyHash,
            status: 'failed',
            success: false,
            error: `${response.status} - ${error}`
          })
        }
      } catch (error) {
        console.error(`❌ Error deleting key ${keyHash}:`, error)
        results.push({
          hash: keyHash,
          status: 'error',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    const successCount = results.filter(r => r.success).length
    const totalCount = results.length
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${successCount}/${totalCount} OpenRouter API keys`,
      data: {
        results,
        summary: {
          total: totalCount,
          deleted: successCount,
          failed: totalCount - successCount
        }
      }
    })
  } catch (error) {
    console.error('Error deleting OpenRouter keys:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete OpenRouter keys',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
