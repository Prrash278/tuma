import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { DocumentationInterface } from '@/components/docs/documentation-interface'

export default function DocumentationPage() {
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
                <p className="text-gray-600">Complete API documentation and integration guides</p>
              </div>
              
              <DocumentationInterface />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
