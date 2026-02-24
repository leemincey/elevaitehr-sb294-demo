import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const key = searchParams.get('key');
    const adminKey = process.env.ADMIN_SECRET_KEY;

    if (!adminKey || key !== adminKey) {
      // Return a plain 404 — don't reveal that /admin exists
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};