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

  // A disabled account may still hold a valid (not-yet-expired) JWT. Deny it at
  // every protected route so a just-disabled user loses access on their next
  // navigation, with a clear reason.
  if (token.status !== "ACTIVE") {
    return NextResponse.redirect(new URL("/access-denied?reason=disabled", request.url));
  }

  // Enforce strict role separation between the two portals.
  if (isAdminRoute && token.role !== "ADMIN") {
    // A teacher must never see the admin dashboard.
    return NextResponse.redirect(new URL("/teacher/upload", request.url));
  }
  if (pathname.startsWith("/teacher/upload") && token.role === "ADMIN") {
    // An admin belongs on the admin dashboard, not the teacher upload flow.
    return NextResponse.redirect(new URL("/admin/marks", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/upload/:path*", "/admin/:path*"],
};
