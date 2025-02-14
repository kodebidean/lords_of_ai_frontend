import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const isAuthPage = request.nextUrl.pathname.startsWith('/(auth)');
    const isPublicPage = ['/login', '/register'].includes(request.nextUrl.pathname);

    // Si no hay token y la ruta no es pública, redirigir a login
    if (!token && !isPublicPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si hay token y está intentando acceder a páginas de auth, redirigir a dashboard
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}; 