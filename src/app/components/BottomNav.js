'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Info, Wallet, ClipboardList } from 'lucide-react'
import { memo } from 'react'

export default function BottomNav() {
  const pathname = usePathname()

  // Only show nav on allowed pages (including nested routes)
  if (
    pathname !== '/' &&
    !pathname.startsWith('/menu') &&
    !pathname.startsWith('/details') &&
    // !pathname.startsWith('/wallet') &&
    !pathname.startsWith('/request')
  ) {
    return null
  }

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    // { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Request', href: '/request', icon: ClipboardList },
    { name: 'Details', href: '/details', icon: Info }
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-lg"
      style={{ zIndex: 50 }}
      aria-label="Bottom navigation"
    >
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-20 flex items-center justify-around">
          {navItems.map((item, index) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      </div>
    </nav>
  )
}

// Small helper so we don't repeat
const NavLink = memo(function NavLink({ item, pathname }) {
  const isActive = pathname === item.href
  const Icon = item.icon

  return (
    <Link 
      href={item.href} 
      className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-60 scale-95'}`}
    >
      <div className={`p-2 rounded-2xl transition-colors duration-300 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span
        className={`text-[10px] font-extrabold uppercase tracking-widest ${
          isActive ? 'text-indigo-600' : 'text-slate-400'
        }`}
      >
        {item.name}
      </span>
    </Link>
  )
})
