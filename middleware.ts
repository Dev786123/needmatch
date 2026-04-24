import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = ["/", "/login", "/signup"];

  const isPublicPath = publicPaths.includes(path);

  const isProtectedPath =
    path.startsWith("/dashboard") ||
    path.startsWith("/profile") ||
    path.startsWith("/needs") ||
    path.startsWith("/apply") ||
    path.startsWith("/post-need") ||
    path.startsWith("/my-needs") ||
    path.startsWith("/my-applications") ||
    path.startsWith("/credits");

  if (!isProtectedPath || isPublicPath) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/needs/:path*",
    "/apply/:path*",
    "/post-need/:path*",
    "/my-needs/:path*",
    "/my-applications/:path*",
    "/credits/:path*",
  ],
};