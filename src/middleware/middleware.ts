import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith('/adminDashboard') || pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else if (pathname.startsWith('/adminDashboard') && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/adminDashboard/:path*', '/dashboard/:path*'],
};
