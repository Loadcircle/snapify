import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  // Get the token with explicit configuration
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production'
  });

  const isAuth = !!token;
  const isAdmin = token?.role === 'admin';
  const { pathname } = request.nextUrl;

  // Debug logging
  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Is Auth:', isAuth);
  console.log('Middleware - Token:', token ? 'Present' : 'Missing');

  // Redirect unauthenticated users trying to access protected pages
  if (!isAuth && (pathname.startsWith('/admin') || pathname === '/dashboard')) {
    console.log('Middleware - Redirecting to signin');
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Redirect non-admin users trying to access admin pages
  if (isAuth && !isAdmin && pathname.startsWith('/admin')) {
    console.log('Middleware - Redirecting non-admin to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users trying to create an event to the signup page
  if (!isAuth && pathname === '/events/create') {
    console.log('Middleware - Redirecting to signup');
    return NextResponse.redirect(new URL('/auth/signup', request.url));
  }

  // Check for /events/[code] that doesn't include /capture or /invite
  if (
    pathname.match(/^\/events\/[^/]+$/) && 
    !pathname.includes('/capture') &&
    !pathname.includes('/invite') &&
    !pathname.includes('/invitations')
  ) {
    // If user is not authenticated, redirect to the signin page
    if (!isAuth) {
      console.log('Middleware - Redirecting to signin for event access');
      const eventCode = pathname.split('/').pop();
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/admin/:path*',
    '/dashboard',
    // Event admin pages (will check if authenticated)
    '/events/:code',
    // Event creation page
    '/events/create'
  ],
}; 