// src/middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth'; // You'll need to implement this

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const publicPaths = ['/auth', '/login', '/signup'];
  const isPublicPath = publicPaths.some(publicPath => 
    path.startsWith(publicPath)
  );

  // Get token from cookies
  const token = request.cookies.get('token')?.value || '';

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access auth pages, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected pages, redirect to login
    return NextResponse.redirect(new URL('/auth', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', // Protect all dashboard routes
    '/auth', // Handle auth route
    '/login', // Handle login route
    '/signup' // Handle signup route
  ]
}