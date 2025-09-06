import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  console.log('Middleware - Path:', path, 'Token:', token ? 'Present' : 'Missing', 'Cookies:', request.cookies.getAll());

  const publicPaths = ["/auth", "/login", "/signup"];
  const isPublicPath = publicPaths.some((p) => path.startsWith(p));

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  if (isPublicPath && token) {
    try {
      const userRole = await getUserRoleFromToken(token, API_BASE_URL);
      console.log('Middleware - Validated role:', userRole);
      
      if (userRole === 'entrepreneur') {
        return NextResponse.redirect(new URL("/dashboard/entrepreneur", request.url));
      } else if (userRole === 'investor') {
        return NextResponse.redirect(new URL("/dashboard/investor", request.url));
      }
    } catch (error) {
      console.error('Middleware token error:', error.message);
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (path.startsWith("/dashboard") && !token) {
    console.log('No token, redirecting to /auth');
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (token && path.startsWith("/dashboard")) {
    try {
      const userRole = await getUserRoleFromToken(token, API_BASE_URL);
      console.log('Middleware - Validated role:', userRole);
      
      if (path.startsWith("/dashboard/entrepreneur") && userRole !== 'entrepreneur') {
        console.log('Role mismatch: User is not entrepreneur');
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
      }
      
      if (path.startsWith("/dashboard/investor") && userRole !== 'investor') {
        console.log('Role mismatch: User is not investor');
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
      }
    } catch (error) {
      console.error('Middleware token error:', error.message);
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

async function getUserRoleFromToken(token, apiBaseUrl) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    const data = await response.json();
    console.log('API /auth/me response:', { status: response.status, data });
    if (!response.ok) {
      throw new Error(data.error || `Failed to validate token: ${response.status}`);
    }
    if (!data.user || !data.user.role) {
      throw new Error('Role not found in user data');
    }
    return data.user.role;
  } catch (error) {
    console.error('Token validation error:', error.message, { token });
    throw new Error('Invalid token');
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