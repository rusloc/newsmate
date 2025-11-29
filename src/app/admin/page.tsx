import SourceManager from '@/components/admin/source-manager'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <span className="ml-4 font-semibold text-lg">Admin Configuration</span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">News Sources</h1>
                        <p className="text-slate-500">Configure where NewsMate gathers intelligence from.</p>
                    </div>
                    <SourceManager />
                </div>
            </main>
        </div>
    )
}
