import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import PricingTable from '@/components/pricing/pricing-table'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing</h1>
                <p className="text-gray-600">Transparent pricing for AI models across multiple currencies</p>
              </div>
              
              <PricingTable />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}