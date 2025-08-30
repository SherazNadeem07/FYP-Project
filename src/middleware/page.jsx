import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  // Public routes that don't require authentication
  const publicPaths = ["/auth", "/login", "/signup"];
  const isPublicPath = publicPaths.some((p) => path.startsWith(p));

  // If user has a token and tries to access public auth pages, redirect to appropriate dashboard
  if (isPublicPath && token) {
    try {
      // Verify token and extract role (you might need to implement this function)
      const userRole = await getUserRoleFromToken(token);
      
      if (userRole === 'entrepreneur') {
        return NextResponse.redirect(new URL("/dashboard/entrepreneur", request.url));
      } else if (userRole === 'investor') {
        return NextResponse.redirect(new URL("/dashboard/investor", request.url));
      }
    } catch (error) {
      // If token is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // Protect dashboard routes
  if (path.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Role-specific dashboard protection
  if (token && path.startsWith("/dashboard")) {
    try {
      const userRole = await getUserRoleFromToken(token);
      
      // If user tries to access entrepreneur dashboard but is an investor
      if (path.startsWith("/dashboard/entrepreneur") && userRole !== 'entrepreneur') {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
      }
      
      // If user tries to access investor dashboard but is an entrepreneur
      if (path.startsWith("/dashboard/investor") && userRole !== 'investor') {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
      }
    } catch (error) {
      // If token is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

// Helper function to extract role from JWT token
async function getUserRoleFromToken(token) {
  try {
    // You'll need to implement JWT verification based on your setup
    // This is a simplified example - you should use proper JWT verification
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.role;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/login",
    "/signup"
  ],
};