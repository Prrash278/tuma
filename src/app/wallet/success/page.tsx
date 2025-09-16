'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const [checkoutId, setCheckoutId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get checkout ID from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('checkout_id')
    setCheckoutId(id)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
          <CardDescription>
            Your wallet has been topped up successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checkoutId && (
            <div className="text-sm text-gray-600">
              <p><strong>Transaction ID:</strong> {checkoutId}</p>
            </div>
          )}
          <p className="text-sm text-gray-600">
            You can now use your wallet to access LLM services. The funds have been added to your account.
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={() => router.push('/')} 
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
