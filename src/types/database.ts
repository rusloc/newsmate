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
                    subscription_status: 'free' | 'paid'
                }
                Insert: {
                    id: string
                    email: string
                    created_at?: string
                    role?: 'user' | 'admin'
                    subscription_status?: 'free' | 'paid'
                }
                Update: {
                    id?: string
                    email?: string
                    created_at?: string
                    role?: 'user' | 'admin'
                    subscription_status?: 'free' | 'paid'
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
                    guid?: string | null
                    sentiment?: Json | null
                    category_data?: Json | null
                }
                Insert: {
                    id?: string
                    source_id: string
                    title: string
                    content: string
                    url: string
                    published_at: string
                    created_at?: string
                    guid?: string | null
                    sentiment?: Json | null
                    category_data?: Json | null
                }
                Update: {
                    id?: string
                    source_id?: string
                    title?: string
                    content?: string
                    url?: string
                    published_at?: string
                    created_at?: string
                    guid?: string | null
                    sentiment?: Json | null
                    category_data?: Json | null
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
