
import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  console.log('Middleware - Path:', path, 'Token:', token ? 'Present' : 'Missing');

  const publicPaths = ["/auth", "/login", "/signup"];
  const isPublicPath = publicPaths.some((p) => path.startsWith(p));

  if (isPublicPath && token) {
    try {
      const userRole = await getUserRoleFromToken(token);
      console.log('User role:', userRole);
      
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
      const userRole = await getUserRoleFromToken(token);
      
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

async function getUserRoleFromToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    console.log('Token payload:', payload);
    if (!payload.role) {
      throw new Error('Role not found in token');
    }
    return payload.role;
  } catch (error) {
    console.error('Token parsing error:', error.message);
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
