import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    // If we are at the root path and have an auth code, redirect to the callback route
    // This handles cases where Supabase redirects to root instead of /auth/callback
    if (requestUrl.pathname === '/' && code) {
        const callbackUrl = new URL('/auth/callback', request.url)
        callbackUrl.searchParams.set('code', code)
        // Preserve other params like 'next' if they exist
        const next = requestUrl.searchParams.get('next')
        if (next) callbackUrl.searchParams.set('next', next)

        return NextResponse.redirect(callbackUrl)
    }

    return NextResponse.next()
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
}
