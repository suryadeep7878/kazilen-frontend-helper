// src/hooks/useNavVisibility.js
'use client'

import { usePathname } from 'next/navigation'

export function useNavVisibility() {
  const pathname = usePathname()

  if (!pathname) return false

  // Logic extracted from BottomNav.js
  return (
    pathname === '/' ||
    pathname.startsWith('/menu') ||
    pathname.startsWith('/details') ||
    pathname.startsWith('/request')
  )
}
