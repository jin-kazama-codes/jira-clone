import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const token = request.cookies.get('user');

  // Protecting the dashboard route
  if (!token && request.nextUrl.pathname === '/project/backlog') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/project/backlog'], // Apply middleware to the dashboard route
};