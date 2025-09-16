'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Chen",
    role: "AI Developer",
    location: "Singapore",
    content: "Tuma has revolutionized how I access AI models. The local currency support means I can budget in SGD without worrying about exchange rates.",
    rating: 5,
    flag: "🇸🇬"
  },
  {
    name: "Ahmed Hassan",
    role: "Startup Founder",
    location: "Nigeria",
    content: "Finally, an AI platform that understands African markets. The NGN support and mobile money integration is exactly what we needed.",
    rating: 5,
    flag: "🇳🇬"
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist",
    location: "India",
    content: "The transparent pricing in INR makes it so much easier to manage our AI costs. No more surprise charges or hidden fees.",
    rating: 5,
    flag: "🇮🇳"
  },
  {
    name: "Carlos Rodriguez",
    role: "Tech Lead",
    location: "Brazil",
    content: "Tuma's multi-currency support is game-changing. We can now scale our AI operations across Latin America with local payment methods.",
    rating: 5,
    flag: "🇧🇷"
  },
  {
    name: "Grace Mwangi",
    role: "Product Manager",
    location: "Kenya",
    content: "The KES wallet integration is seamless. I can top up with M-Pesa and start using AI models immediately. Perfect for our workflow.",
    rating: 5,
    flag: "🇰🇪"
  },
  {
    name: "David Kim",
    role: "AI Researcher",
    location: "Malaysia",
    content: "Tuma's pricing calculator helps me optimize costs across different models. The MYR support makes budgeting so much clearer.",
    rating: 5,
    flag: "🇲🇾"
  }
]

export function TestimonialsSection() {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Loved by Developers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of developers, researchers, and businesses who trust Tuma for their AI model access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <Quote className="h-8 w-8 text-blue-100 mb-4" />
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                    {testimonial.flag}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">50M+</div>
            <div className="text-gray-600">API Calls</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">8</div>
            <div className="text-gray-600">Currencies</div>
          </div>
        </div>
      </div>
    </div>
  )
}
