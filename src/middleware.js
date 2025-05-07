import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request });
  const isAuth = !!token;
  const isAdmin = token?.role === 'admin';
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users trying to access protected pages
  if (!isAuth && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Redirect non-admin users trying to access admin pages
  if (isAuth && !isAdmin && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users trying to create an event to the signup page
  if (!isAuth && pathname === '/events/create') {
    return NextResponse.redirect(new URL('/auth/signup', request.url));
  }

  // Check for /events/[code] that doesn't include /capture or /invite
  if (
    pathname.match(/^\/events\/[^/]+$/) && 
    !pathname.includes('/capture') &&
    !pathname.includes('/invite')
  ) {
    // If user is not authenticated, redirect to the capture page
    if (!isAuth) {
      // Extract the event code from the URL
      const eventCode = pathname.split('/').pop();
      return NextResponse.redirect(new URL(`/capture/${eventCode}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/admin/:path*',
    // Event admin pages (will check if authenticated)
    '/events/:code',
    // Event creation page
    '/events/create'
  ],
}; 