export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    created_at: string
                    role: 'user' | 'admin'
                }
                Insert: {
                    id: string
                    email: string
                    created_at?: string
                    role?: 'user' | 'admin'
                }
                Update: {
                    id?: string
                    email?: string
                    created_at?: string
                    role?: 'user' | 'admin'
                }
            }
            news_sources: {
                Row: {
                    id: string
                    name: string
                    url: string
                    type: 'telegram' | 'website' | 'api'
                    active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    url: string
                    type: 'telegram' | 'website' | 'api'
                    active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    url?: string
                    type?: 'telegram' | 'website' | 'api'
                    active?: boolean
                    created_at?: string
                }
            }
            news_items: {
                Row: {
                    id: string
                    source_id: string
                    title: string
                    content: string
                    url: string
                    published_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    source_id: string
                    title: string
                    content: string
                    url: string
                    published_at: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    source_id?: string
                    title?: string
                    content?: string
                    url?: string
                    published_at?: string
                    created_at?: string
                }
            }
            summaries: {
                Row: {
                    id: string
                    start_time: string
                    end_time: string
                    short_summary: string
                    detailed_summary: string
                    sentiment_analysis: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    start_time: string
                    end_time: string
                    short_summary: string
                    detailed_summary: string
                    sentiment_analysis: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    start_time?: string
                    end_time?: string
                    short_summary?: string
                    detailed_summary?: string
                    sentiment_analysis?: string
                    created_at?: string
                }
            }
        }
    }
}
