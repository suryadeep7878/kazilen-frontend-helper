"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { X, LogIn, ShieldCheck } from "lucide-react";

/**
 * AuthModal
 *
 * Instagram-style "Login Required" bottom-sheet modal.
 * Appears when a non-authenticated user triggers a protected action.
 * On mobile: slides in from the bottom.
 * On desktop: centers as a floating card.
 *
 * Reads open/close state from AuthContext — no props needed.
 */
export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth();
  const router = useRouter();

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") closeAuthModal();
    },
    [closeAuthModal]
  );

  useEffect(() => {
    if (authModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll while modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [authModalOpen, handleKeyDown]);

  const handleLogin = () => {
    closeAuthModal();
    router.push("/login");
  };

  if (!authModalOpen) return null;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        onClick={closeAuthModal}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 9998,
          animation: "kz-fadeIn 0.2s ease",
        }}
      />

      {/* ── Modal Card ───────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-desc"
        style={{
          position: "fixed",
          zIndex: 9999,
          // Mobile: bottom sheet
          bottom: 0,
          left: 0,
          right: 0,
          // Desktop: centred card
          background: "linear-gradient(160deg, #ffffff 0%, #f9f9fb 100%)",
          borderRadius: "24px 24px 0 0",
          padding: "32px 28px 40px",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
          animation: "kz-slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          maxWidth: "480px",
          margin: "0 auto",
        }}
        className="kz-auth-modal"
      >
        {/* Drag handle (mobile feel) */}
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: "#d1d5db",
            margin: "0 auto 24px",
          }}
        />

        {/* Close button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close login modal"
          id="auth-modal-close"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "#f3f4f6",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6b7280",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
          }}
        >
          <ShieldCheck size={28} color="#fff" strokeWidth={2} />
        </div>

        {/* Title */}
        <h2
          id="auth-modal-title"
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            textAlign: "center",
            color: "#111827",
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Login Required
        </h2>

        {/* Description */}
        <p
          id="auth-modal-desc"
          style={{
            fontSize: "0.9rem",
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 1.55,
            marginBottom: 32,
          }}
        >
          Please login to access this feature.
          <br />
          It only takes a moment.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Primary: Login */}
          <button
            id="auth-modal-login-btn"
            onClick={handleLogin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff",
              fontSize: "0.975rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(249,115,22,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(249,115,22,0.4)";
            }}
          >
            <LogIn size={18} />
            Login
          </button>

          {/* Secondary: Cancel */}
          <button
            id="auth-modal-cancel-btn"
            onClick={closeAuthModal}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 14,
              border: "1.5px solid #e5e7eb",
              background: "transparent",
              color: "#374151",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ── Animations ───────────────────────────────────────────────────── */}
      <style>{`
        @keyframes kz-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes kz-slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        /* On wider screens: center the card instead of bottom-sheet */
        @media (min-width: 640px) {
          .kz-auth-modal {
            bottom: auto !important;
            top: 50% !important;
            left: 50% !important;
            right: auto !important;
            transform: translate(-50%, -50%) !important;
            border-radius: 24px !important;
            animation: kz-scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1) !important;
          }
          @keyframes kz-scaleIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            to   { opacity: 1; transform: translate(-50%, -50%) scale(1);   }
          }
        }
      `}</style>
    </>
  );
}
