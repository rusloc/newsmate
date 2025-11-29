'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/database'
import { Trash2, Plus, RefreshCw } from 'lucide-react'

type NewsSource = Database['public']['Tables']['news_sources']['Row']

export default function SourceManager() {
    const [sources, setSources] = useState<NewsSource[]>([])
    const [newSourceName, setNewSourceName] = useState('')
    const [newSourceUrl, setNewSourceUrl] = useState('')
    const [newSourceType, setNewSourceType] = useState<'telegram' | 'website' | 'api'>('website')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchSources()
    }, [])

    const fetchSources = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('news_sources')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setSources(data)
        setLoading(false)
    }

    const addSource = async () => {
        if (!newSourceName || !newSourceUrl) return

        const { data, error } = await supabase
            .from('news_sources')
            .insert({
                name: newSourceName,
                url: newSourceUrl,
                type: newSourceType,
                active: true
            } as any)
            .select()

        if (data) {
            setSources([data[0], ...sources])
            setNewSourceName('')
            setNewSourceUrl('')
        }
    }

    const deleteSource = async (id: string) => {
        await supabase.from('news_sources').delete().eq('id', id)
        setSources(sources.filter(s => s.id !== id))
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Source</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                value={newSourceName}
                                onChange={(e) => setNewSourceName(e.target.value)}
                                placeholder="e.g. TechCrunch"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">URL / ID</label>
                            <Input
                                value={newSourceUrl}
                                onChange={(e) => setNewSourceUrl(e.target.value)}
                                placeholder="https://... or @channel"
                            />
                        </div>
                        <div className="w-32 space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                value={newSourceType}
                                onChange={(e) => setNewSourceType(e.target.value as any)}
                            >
                                <option value="website">Website</option>
                                <option value="telegram">Telegram</option>
                                <option value="api">API</option>
                            </select>
                        </div>
                        <Button onClick={addSource}>
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Managed Sources
                        <Button variant="ghost" size="sm" onClick={fetchSources}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sources.length === 0 && !loading && (
                            <p className="text-center text-slate-500 py-4">No sources configured.</p>
                        )}
                        {sources.map((source) => (
                            <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h4 className="font-semibold">{source.name}</h4>
                                    <p className="text-sm text-slate-500">{source.type} • {source.url}</p>
                                </div>
                                <Button variant="destructive" size="icon" onClick={() => deleteSource(source.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
