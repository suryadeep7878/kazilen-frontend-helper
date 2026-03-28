'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Pages that do NOT require authentication
const PUBLIC_ROUTES = ['/login', '/create-account']

export default function AuthGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  useEffect(() => {
    // TEMPORARY: Bypassing auth check for easier page testing
    setIsChecking(false);
    return;

    const userId =
      localStorage.getItem('kazilen_professional_id') ||
      localStorage.getItem('kazilen_user_id')

    if (!userId && !isPublicRoute) {
      // Not logged in + trying to access a protected route → go to login
      router.replace('/login')
    } else if (userId && isPublicRoute) {
      // Already logged in + trying to access login/create-account → go home
      router.replace('/')
    } else {
      setIsChecking(false)
    }
  }, [router, pathname, isPublicRoute])

  if (isChecking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return children
}
