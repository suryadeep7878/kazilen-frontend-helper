// src/hooks/usePersistentState.js
'use client'

import { useState, useEffect } from 'react';

export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }, [key]);

  useEffect(() => {
    if (isMounted) {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch (e) {
        console.warn('localStorage error:', e);
      }
    }
  }, [key, state, isMounted]);

  return [state, setState, isMounted];
}
