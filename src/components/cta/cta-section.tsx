'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Download, Smartphone, CreditCard } from 'lucide-react'

export function CTASection() {
  return (
    <div className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of developers who are already using Tuma to access AI models with local currency support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">1. Create Account</h3>
              <p className="text-blue-100 leading-relaxed">
                Sign up in 2 minutes with your email. No credit card required to get started.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">2. Top Up Wallet</h3>
              <p className="text-blue-100 leading-relaxed">
                Add funds using your preferred local payment method. M-Pesa, UPI, Pix, and more.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">3. Start Building</h3>
              <p className="text-blue-100 leading-relaxed">
                Access AI models immediately. Get your API key and start building amazing applications.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-blue-100 mb-8">Trusted by developers worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-white font-semibold">OpenAI</div>
            <div className="text-white font-semibold">Anthropic</div>
            <div className="text-white font-semibold">Google</div>
            <div className="text-white font-semibold">Meta</div>
            <div className="text-white font-semibold">Mistral</div>
          </div>
        </div>
      </div>
    </div>
  )
}
