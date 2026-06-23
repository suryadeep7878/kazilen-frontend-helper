import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/create-account", "/verify"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  const session = req.cookies.get("session_id")?.value;

  if (!session && !isPublicPath) {
    const loginUrl = new URL("/login", req.url);
    if (req.nextUrl.pathname !== loginUrl.pathname) {
      return NextResponse.redirect(loginUrl);
    }
  }

  if (session && isPublicPath) {
    const homeUrl = new URL("/", req.url);
    if (req.nextUrl.pathname !== homeUrl.pathname) {
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Ignore API routes, static files, images, and favicons
    "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
  ],
};
