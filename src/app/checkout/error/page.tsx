'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutErrorPage() {
  const searchParams = useSearchParams()
  const [errorDetails, setErrorDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, you would fetch error details using the error code
    // from the URL parameters or query string
    const errorCode = searchParams.get('error_code')
    const errorMessage = searchParams.get('error_message')
    
    setTimeout(() => {
      setErrorDetails({
        code: errorCode || 'PAYMENT_FAILED',
        message: errorMessage || 'Payment could not be processed',
        timestamp: new Date().toISOString()
      })
      setLoading(false)
    }, 1000)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing error details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="border-red-200">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800">
              Payment Failed
            </CardTitle>
            <p className="text-gray-600">
              We were unable to process your payment
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {errorDetails && (
              <div className="bg-red-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-red-900">Error Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-600">Error Code:</span>
                    <span className="font-medium text-red-800">
                      {errorDetails.code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Message:</span>
                    <span className="font-medium text-right text-red-800">
                      {errorDetails.message}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Time:</span>
                    <span className="font-medium">
                      {new Date(errorDetails.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">What can you do?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check your payment method details</li>
                <li>• Ensure you have sufficient funds</li>
                <li>• Try a different payment method</li>
                <li>• Contact your bank if the issue persists</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                <Link href="/test-checkout">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>
                If you continue to experience issues, please contact our support team.
                <br />
                We're here to help!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
