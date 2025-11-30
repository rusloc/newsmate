import SummaryFeed from '@/components/dashboard/summary-feed'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl text-slate-900">NewsMate</div>
                    <div className="flex items-center gap-4">

                        <form action="/auth/signout" method="post">
                            <Button variant="ghost" size="sm">
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">Latest Briefings</h2>
                    <SummaryFeed />
                </div>
            </main>
        </div>
    )
}
