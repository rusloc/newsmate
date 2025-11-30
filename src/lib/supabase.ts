import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export const createClient = () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // We can log a warning or throw. Throwing might crash the app if handled poorly, but it's better than silent failure.
        // However, for the client-side, maybe we should just return a dummy client or let createBrowserClient handle it?
        // createBrowserClient throws if URL is missing.
        // Let's just let it throw but with a clear message if possible, or just pass what we have.
        // Actually, let's throw explicitly.
        throw new Error('Missing Supabase Environment Variables')
    }
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
}
