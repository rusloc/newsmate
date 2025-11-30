import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.delete({ name, ...options })
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { event_type, metadata } = body

    // Validation
    const isValidString = (str: any, maxLength: number = 50) => {
        if (typeof str !== 'string') return false
        // Basic check for control characters or excessive length
        // SQL injection is handled by Supabase client, but we can filter weird stuff
        if (str.length > maxLength) return false
        if (/[\x00-\x1F\x7F]/.test(str)) return false // Control characters
        return true
    }

    if (event_type && !isValidString(event_type)) {
        return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 })
    }

    if (metadata) {
        if (typeof metadata !== 'object' || Array.isArray(metadata)) {
            return NextResponse.json({ error: 'Invalid metadata format' }, { status: 400 })
        }
        // Check metadata size roughly
        if (JSON.stringify(metadata).length > 5000) {
            return NextResponse.json({ error: 'Metadata too large' }, { status: 400 })
        }
    }

    // Extract IP and User Agent
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const { error } = await supabase.from('user_logs').insert({
        user_id: session.user.id,
        email: session.user.email,
        event_type: event_type || 'login',
        user_agent: userAgent,
        ip_address: ip,
        metadata: metadata || {},
    })

    if (error) {
        console.error('Error logging login:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
