'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="border-yellow-200">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-800">
              Payment Cancelled
            </CardTitle>
            <p className="text-gray-600">
              You cancelled the payment process
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">No charges were made</h4>
              <p className="text-sm text-yellow-800">
                Your payment was cancelled and no money has been charged to your account.
                You can try again anytime.
              </p>
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
                Need help? Contact our support team for assistance.
                <br />
                We're here to help you complete your payment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
