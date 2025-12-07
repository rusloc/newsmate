import { NextResponse } from 'next/server'
import { fetchAndProcessCoinDeskNews } from '@/lib/services/coindesk'

export const dynamic = 'force-dynamic' // Ensure it's not cached

export async function GET(request: Request) {
    try {
        // Verify cron secret if needed (Vercel automatically protects cron jobs, but good to check header if strictly needed)
        // const authHeader = request.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { ... }

        const result = await fetchAndProcessCoinDeskNews()
        return NextResponse.json({ success: true, ...result })
    } catch (error: any) {
        console.error('Cron job failed:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
