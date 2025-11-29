'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/database'
import { format } from 'date-fns'
import { TrendingUp, FileText, List } from 'lucide-react'

type Summary = Database['public']['Tables']['summaries']['Row']

export default function SummaryFeed() {
    const [summaries, setSummaries] = useState<Summary[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchSummaries = async () => {
            const { data } = await supabase
                .from('summaries')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10)

            if (data) setSummaries(data)
            setLoading(false)
        }

        fetchSummaries()
    }, [])

    if (loading) {
        return <div className="text-center py-10">Loading summaries...</div>
    }

    if (summaries.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500">
                <p>No summaries generated yet.</p>
                <p className="text-sm">Summaries appear every 4 hours.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {summaries.map((summary) => (
                <Card key={summary.id} className="overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b flex justify-between items-center">
                        <div className="font-semibold text-slate-900">
                            Summary Period: {format(new Date(summary.start_time), 'HH:mm')} - {format(new Date(summary.end_time), 'HH:mm')}
                        </div>
                        <div className="text-sm text-slate-500">
                            {format(new Date(summary.created_at), 'PPP')}
                        </div>
                    </div>

                    <div className="divide-y">
                        {/* Block 1: Ultra Short Summary */}
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
                                <List className="w-5 h-5" />
                                <h3>Key Facts</h3>
                            </div>
                            <div className="prose prose-sm max-w-none text-slate-700">
                                {summary.short_summary.split('\n').map((line, i) => (
                                    <p key={i} className="mb-1">• {line}</p>
                                ))}
                            </div>
                        </div>

                        {/* Block 2: Detailed Summary */}
                        <div className="p-6 bg-white">
                            <div className="flex items-center gap-2 mb-3 text-indigo-600 font-semibold">
                                <FileText className="w-5 h-5" />
                                <h3>Detailed Analysis</h3>
                            </div>
                            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                                {summary.detailed_summary}
                            </div>
                        </div>

                        {/* Block 3: Sentiment & Effects */}
                        <div className="p-6 bg-slate-50/50">
                            <div className="flex items-center gap-2 mb-3 text-emerald-600 font-semibold">
                                <TrendingUp className="w-5 h-5" />
                                <h3>Sentiment & Market Effects</h3>
                            </div>
                            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                                {summary.sentiment_analysis}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
