'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCompletePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="border-green-200">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Checkout Complete
            </CardTitle>
            <p className="text-gray-600">
              Thank you for your purchase!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">What's next?</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• You will receive a confirmation email</li>
                <li>• Your payment is being processed</li>
                <li>• You can track your order in your dashboard</li>
                <li>• Contact support if you have any questions</li>
              </ul>
            </div>

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
                Thank you for choosing Tuma!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
