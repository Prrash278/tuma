'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Key, DollarSign, Home, Bot } from 'lucide-react'

const navigation = [
  {
    name: 'Home',
    href: '/home',
    icon: Home,
  },
  {
    name: 'API Keys',
    href: '/',
    icon: Key,
  },
  {
    name: 'Pricing',
    href: '/pricing',
    icon: DollarSign,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'flex items-center gap-2',
                isActive && 'bg-primary text-primary-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
