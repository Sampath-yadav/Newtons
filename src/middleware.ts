import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The admin login page itself is public — never gate it, or admins could
  // never reach a sign-in screen.
  if (pathname === "/admin") {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminRoute = pathname.startsWith("/admin");

  // Unauthenticated → send to the login surface that matches the portal.
  if (!token) {
    const loginPath = isAdminRoute ? "/admin" : "/teacher";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  // Enforce strict role separation between the two portals.
  if (isAdminRoute && token.role !== "admin") {
    // A teacher must never see the admin dashboard.
    return NextResponse.redirect(new URL("/teacher/upload", request.url));
  }
  if (pathname.startsWith("/teacher/upload") && token.role === "admin") {
    // An admin belongs on the admin dashboard, not the teacher upload flow.
    return NextResponse.redirect(new URL("/admin/marks", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/upload/:path*", "/admin/:path*"],
};
