'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wallet, Bot, User, CheckCircle, CreditCard, Zap } from 'lucide-react'
import { WalletManager } from '@/components/wallet/wallet-manager'
import { LLMInterface } from '@/components/llm/llm-interface'
import { RapydTest } from '@/components/test/rapyd-test'
import { TumaAPITest } from '@/components/test/tuma-api-test'
import { APIKeyManager } from '@/components/api-keys/api-key-manager'
import { Wallet as WalletType } from '@/types/wallet'

export function SimpleDashboard() {
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)
  const [activeTab, setActiveTab] = useState('wallets')

  const handleUsage = (usage: any) => {
    console.log('LLM Usage:', usage)
    // In production, this would update the wallet balance in real-time
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Tuma</h1>
              <span className="ml-2 text-sm text-gray-500">MVP</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Local Currency LLM Platform
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Access LLM APIs with local currency wallets</p>
        </div>

        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Platform Ready!</h3>
                <p className="text-sm text-green-600">
                  Tuma platform is running with full Rapyd Checkout integration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wallets" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="llm" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              LLM Chat
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallets" className="space-y-6">
            <WalletManager />
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            <APIKeyManager />
          </TabsContent>

          <TabsContent value="llm" className="space-y-6">
            {selectedWallet ? (
              <div className="h-[600px]">
                <LLMInterface 
                  selectedWallet={selectedWallet} 
                  onUsage={handleUsage}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Select a Wallet</h3>
                    <p className="text-gray-600 mb-4">
                      Choose a wallet from the Wallets tab to start using LLM services
                    </p>
                    <Button onClick={() => setActiveTab('wallets')}>
                      Go to Wallets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Tuma API Test */}
            <TumaAPITest />
            
            {/* Rapyd Test */}
            <RapydTest />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Integration
                </CardTitle>
                <CardDescription>
                  Powered by Rapyd Checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Supported Payment Methods</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span>💳</span>
                        <span>Credit/Debit Cards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🏦</span>
                        <span>Bank Transfers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📱</span>
                        <span>Mobile Money</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🌍</span>
                        <span>Regional Payment Methods</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Supported Currencies</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>🇺🇸 USD</div>
                      <div>🇳🇬 NGN</div>
                      <div>🇮🇳 INR</div>
                      <div>🇧🇷 BRL</div>
                      <div>🇰🇪 KES</div>
                      <div>🇬🇭 GHS</div>
                      <div>🇿🇦 ZAR</div>
                      <div>🇪🇬 EGP</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Real-time Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Live FX Conversion</h4>
                      <p className="text-sm text-gray-600">
                        Real-time currency conversion with markup
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Instant Payments</h4>
                      <p className="text-sm text-gray-600">
                        Immediate wallet top-ups via Rapyd
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Usage Tracking</h4>
                      <p className="text-sm text-gray-600">
                        Real-time cost calculation and spending limits
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
