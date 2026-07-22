"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

/**
 * AuthProvider
 *
 * Wraps the app and provides global authentication state.
 * Exposes:
 *   isAuthenticated  — boolean | null (null = still loading)
 *   isLoading        — boolean
 *   openAuthModal()  — imperatively open the "Login Required" modal
 *   closeAuthModal() — imperatively close it
 *   authModalOpen    — boolean
 *   refreshAuth()    — re-check authentication status on demand
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = unknown
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Keep a stable ref so withAuth() closures never stale
  const isAuthenticatedRef = useRef(null);
  isAuthenticatedRef.current = isAuthenticated;

  // ── Check auth via the server-side route handler ─────────────────────────
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // ensure cookies are sent
        cache: "no-store",
      });

      if (!res.ok) {
        setIsAuthenticated(false);
        return false;
      }

      const data = await res.json();
      const authed = data.authenticated === true;
      setIsAuthenticated(authed);
      return authed;
    } catch {
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run once on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  /**
   * withAuth(action)
   *
   * Call this instead of directly navigating to a protected route.
   * If authenticated  → execute `action` immediately.
   * If not            → show the "Login Required" modal.
   *
   * @param {() => void} action
   */
  const withAuth = useCallback(
    (action) => {
      if (isAuthenticatedRef.current === true) {
        action();
      } else {
        openAuthModal();
      }
    },
    [openAuthModal]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        withAuth,
        refreshAuth: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * useAuth()
 *
 * Access auth state and helpers from any client component.
 *
 * Example:
 *   const { withAuth } = useAuth();
 *   <button onClick={() => withAuth(() => router.push('/history'))}>History</button>
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
