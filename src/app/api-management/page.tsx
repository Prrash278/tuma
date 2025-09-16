import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { APIManagementInterface } from '@/components/api-management/api-management-interface'

export default function APIManagementPage() {
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">API Management</h1>
                <p className="text-gray-600">Manage your API keys, monitor usage, and configure settings</p>
              </div>
              
              <APIManagementInterface />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
