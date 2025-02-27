import { NextRequest, NextResponse } from 'next/server';

// Type for decoded token payload
interface TokenPayload {
  id: string;
  email: string;
  role: string;
  exp: number;
}

/**
 * Middleware to check if a request is authenticated
 * 
 * @param request Next.js request
 * @returns NextResponse with either error or modified request
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  try {
    // Get auth token from cookies
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify token (in a real app, this would verify JWT signature)
    try {
      // Decode the Base64 token
      const decodedJson = Buffer.from(token, 'base64').toString();
      const payload = JSON.parse(decodedJson) as TokenPayload;
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        return NextResponse.json(
          { success: false, error: 'Token expired' },
          { status: 401 }
        );
      }
      
      // For API routes, we'll return null to allow the request to proceed
      // The headers will be available in the API handler
      return null;
      
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to wrap an API handler with authentication
 * 
 * @param handler The API handler function
 * @returns A new handler function with authentication check
 */
export function withAuth<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
): (request: NextRequest, ...args: T) => Promise<NextResponse> {
  return async function authHandler(
    request: NextRequest,
    ...args: T
  ): Promise<NextResponse> {
    // Check authentication
    const authResponse = requireAuth(request);
    
    // If authentication failed, return the error response
    if (authResponse) {
      return authResponse;
    }
    
    // Otherwise, proceed to the handler
    return handler(request, ...args);
  };
}