import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export const createClient = () =>
    createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jzhbkxeqehyhnzzkugyw.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aGJreGVxZWh5aG56emt1Z3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTEyNjAsImV4cCI6MjA3OTkyNzI2MH0.aLw-2uYRns0vrldDAbHY_2hEk3yhock5FVychReeU9U'
    )
