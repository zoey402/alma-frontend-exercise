import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || path === '/login';

  // Check for authentication token in cookies
  const token = request.cookies.get('authToken')?.value || '';
  const isAuthenticated = !!token;

  // If the path is dashboard/* and user is not authenticated, redirect to login
  if (path.startsWith('/dashboard') && !isAuthenticated) {
    // Create the URL to redirect to
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If already authenticated and trying to access login page, redirect to dashboard
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard/leads', request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};