'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, you would fetch payment details using the payment ID
    // from the URL parameters or query string
    const paymentId = searchParams.get('payment_id')
    const checkoutId = searchParams.get('checkout_id')
    
    if (paymentId || checkoutId) {
      // Simulate fetching payment details
      setTimeout(() => {
        setPaymentDetails({
          id: paymentId || checkoutId,
          amount: 75.00,
          currency: 'USD',
          status: 'completed',
          description: 'Payment completed successfully',
          timestamp: new Date().toISOString()
        })
        setLoading(false)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="border-green-200">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Payment Successful!
            </CardTitle>
            <p className="text-gray-600">
              Your payment has been processed successfully
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {paymentDetails && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">
                      {paymentDetails.currency} {paymentDetails.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600 capitalize">
                      {paymentDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium text-right">
                      {paymentDetails.description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-xs">
                      {paymentDetails.id}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/test-checkout">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Create Another Payment
                </Link>
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>
                A receipt has been sent to your email address.
                <br />
                If you have any questions, please contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
