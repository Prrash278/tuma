'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2, CreditCard, Globe } from 'lucide-react'

export function RapydTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const testRapydConnection = async () => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/test/rapyd')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Failed to test Rapyd connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Rapyd Checkout Test
        </CardTitle>
        <CardDescription>
          Test Rapyd API connection and payment methods
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testRapydConnection}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test Rapyd Connection'
          )}
        </Button>

        {testResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">Connection Successful</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-medium">Connection Failed</span>
                </>
              )}
            </div>

            {testResult.success && testResult.data && (
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Supported Countries ({testResult.data.totalCountries})</h4>
                  <div className="flex flex-wrap gap-1">
                    {testResult.data.countries.map((country: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {country.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Supported Currencies ({testResult.data.totalCurrencies})</h4>
                  <div className="flex flex-wrap gap-1">
                    {testResult.data.currencies.map((currency: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {currency.code}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!testResult.success && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {testResult.error}
                </p>
                {testResult.details && (
                  <p className="text-xs text-red-600 mt-1">
                    {testResult.details}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>This test verifies:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Rapyd API credentials are valid</li>
            <li>Network connection to Rapyd servers</li>
            <li>Supported countries and currencies</li>
            <li>Payment method availability</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
