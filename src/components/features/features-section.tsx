'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Smartphone, 
  Globe, 
  Shield, 
  Zap, 
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: CreditCard,
    title: "Local Payment Methods",
    description: "Pay with M-Pesa, UPI, Pix, and other local payment methods. No need for international cards.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Optimized for mobile devices. Access AI models on the go with our responsive interface.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Available in 8+ currencies across Africa, Asia, and Latin America. Expanding rapidly.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your funds are protected with enterprise-grade security and regulatory compliance.",
    color: "from-red-500 to-red-600"
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Start using AI models immediately after top-up. No waiting periods or approval processes.",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    icon: TrendingUp,
    title: "Transparent Pricing",
    description: "See exactly what you'll pay in your local currency. No hidden fees or surprise charges.",
    color: "from-indigo-500 to-indigo-600"
  }
]

const benefits = [
  "No hidden fees or charges",
  "Real-time currency conversion",
  "24/7 customer support",
  "Enterprise-grade security",
  "Mobile money integration",
  "Transparent pricing"
]

export function FeaturesSection() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 mb-6">
            <Zap className="h-4 w-4 mr-1" />
            Why Choose Tuma
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built for the Next Billion
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're making AI accessible to everyone, everywhere, with local currency support and payment methods that work for you.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Everything you need to get started
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Tuma provides all the tools and features you need to access AI models with confidence, 
                no matter where you are in the world.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 mb-2">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 mb-2">&lt;1min</div>
                <div className="text-sm text-gray-600">Setup Time</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 mb-2">8+</div>
                <div className="text-sm text-gray-600">Currencies</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-900 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
