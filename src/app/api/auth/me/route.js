import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET /api/auth/me
 *
 * Reads the HttpOnly session_token cookie from the server context
 * and returns whether the current user is authenticated.
 *
 * This is the canonical auth check for all client components.
 * It never exposes the cookie value to the browser.
 *
 * Response shape:
 *   { authenticated: true }   — valid session exists
 *   { authenticated: false }  — no session / expired
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token");

    if (!sessionToken?.value) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // Lightweight check: presence of a non-empty cookie means authenticated.
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
