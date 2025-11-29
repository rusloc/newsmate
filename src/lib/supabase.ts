import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export const createClient = () =>
    createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'
    )
