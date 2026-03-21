// src/hooks/useScrollRestore.js
'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cacheKey = `scroll_${pathname}`;
    // Restore on mount
    const saved = window.sessionStorage.getItem(cacheKey);
    if (saved) {
      window.scrollTo(0, parseInt(saved, 10));
    }

    // Save on unmount/scroll
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(() => {
        window.sessionStorage.setItem(cacheKey, window.scrollY.toString());
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);
}
