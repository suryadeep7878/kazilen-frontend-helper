import { NextResponse } from "next/server";
import { getCookie } from "./utils/customCookie";

const PUBLIC_PATHS = ["/login", "/create-account", "/verify"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  const session = await getCookie("session_id"); 

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude static files, images, etc.
    "/((?!_next/static|_next/image|favicon.ico|api|images).*)",
  ],
};
