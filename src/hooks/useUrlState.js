// src/hooks/useUrlState.js
'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useUrlState() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setParams = useCallback((newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(newParams).forEach(key => {
      if (newParams[key] !== undefined && newParams[key] !== '') {
        params.set(key, String(newParams[key]));
      } else {
        params.delete(key);
      }
    });

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const getParams = useCallback(() => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }, [searchParams]);

  return { getParams, setParams };
}
