import { ModernDashboard } from '@/components/dashboard/modern-dashboard'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1">
          <Header />
          <main>
            <ModernDashboard />
          </main>
        </div>
      </div>
    </div>
  )
}
