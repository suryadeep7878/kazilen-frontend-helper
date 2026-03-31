// src/app/components/LayoutWrapper.js
'use client'

import { useNavVisibility } from '../../hooks/useNavVisibility'

export default function LayoutWrapper({ children }) {
  const isNavVisible = useNavVisibility()

  // The BottomNav has h-20 (5rem). 
  // We apply padding-bottom equal to the nav height plus the safe area inset.
  // This ensures that scrollable content doesn't hide behind the navbar.
  return (
    <div className={isNavVisible ? "pb-[calc(5rem+env(safe-area-inset-bottom))]" : ""}>
      {children}
    </div>
  )
}
