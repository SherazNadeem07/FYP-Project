// src/middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth'; // You'll need to implement this

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Public paths 
  const publicPaths = ['/auth', '/login', '/signup'];
  const isPublicPath = publicPaths.some(publicPath => 
    path.startsWith(publicPath)
  );

  // token
  const token = request.cookies.get('token')?.value || '';

  // Redirect logic
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/auth', 
    '/login', 
    '/signup' 
  ]
}