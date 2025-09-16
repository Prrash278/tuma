'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Key, 
  DollarSign, 
  Settings, 
  BarChart3, 
  Wallet,
  Zap,
  Users,
  Activity,
  BookOpen,
  Terminal,
  CreditCard
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'API Keys',
    href: '/keys',
    icon: Key,
  },
  {
    name: 'API Management',
    href: '/api-management',
    icon: Terminal,
  },
  {
    name: 'Wallet',
    href: '/wallet',
    icon: Wallet,
  },
  {
    name: 'Pricing',
    href: '/pricing',
    icon: DollarSign,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Documentation',
    href: '/docs',
    icon: BookOpen,
  },
  {
    name: 'Test Payments',
    href: '/test-payments',
    icon: CreditCard,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

const stats = [
  { label: 'Active Keys', value: '3', icon: Key },
  { label: 'Total Usage', value: '$24.50', icon: Activity },
  { label: 'This Month', value: '$156.80', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-purple-100 h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-purple-100">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tuma</h1>
          <p className="text-xs text-gray-500">Developer Platform</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 border-b border-purple-100">
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-purple-100">
        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Developer</p>
            <p className="text-xs text-gray-500 truncate">dev@tuma.ai</p>
          </div>
        </div>
      </div>
    </div>
  )
}
