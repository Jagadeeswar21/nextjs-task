import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith('/adminDashboard') || pathname.startsWith('/dashboard') || pathname.startsWith('/manager')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    const userRoles = Array.isArray(token?.roles) ? token.roles : [];
    if (pathname.startsWith('/adminDashboard') && !userRoles.includes('admin')) {
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }
    if (pathname.startsWith('/manager') && !userRoles.includes('manager') && !userRoles.includes('admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/adminDashboard/:path*', '/dashboard/:path*', '/manager/:path*'],
};
