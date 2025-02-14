import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/register');
    const isRootPage = request.nextUrl.pathname === '/';

    // Si el usuario está en la raíz, redirigir según autenticación
    if (isRootPage) {
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si el usuario está autenticado y trata de acceder a páginas de auth
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Si el usuario no está autenticado y trata de acceder a páginas protegidas
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Configurar las rutas que el middleware debe manejar
export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/dashboard/:path*',
        '/models/:path*',
        '/rankings/:path*',
        '/profile/:path*'
    ]
}; 