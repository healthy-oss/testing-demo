import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

export async function middleware(request: NextRequest) {
    const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
    const authCookie = request.cookies.get('pb_auth');

    // SSR-friendly auth state recovery
    if (authCookie) {
        pb.authStore.loadFromCookie(authCookie.value);
    }

    const isLoggedIn = pb.authStore.isValid;
    const isAdmin = pb.authStore.model?.role === 'admin';
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

    // 1. Redirect to login if not authenticated
    if (!isLoggedIn && !isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 2. Redirect to home if already logged in and trying to access login page
    if (isLoggedIn && isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // 3. Admin-only route protection
    if (isAdminPage && !isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = '/403'; // Access Denied
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

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
