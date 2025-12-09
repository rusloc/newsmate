import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const COINDESK_API_URL = 'https://developers.coindesk.com/documentation/data-api/news_v1_article_list'
const ACTUAL_API_URL = 'https://data-api.coindesk.com/news/v1/article/list'

interface CoinDeskItem {
    TITLE: string
    PUBLISHED_ON: string
    URL: string
    BODY: string
    SENTIMENT: any
    CREATED_ON: string
    CATEGORY_DATA: any
    GUID: string
}

interface CoinDeskResponse {
    Data: CoinDeskItem[]
}

export async function fetchAndProcessCoinDeskNews() {
    // Use Service Role Key for backend processing to bypass RLS
    const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Fetch from CoinDesk
    console.log('Fetching from CoinDesk...')
    const response = await fetch(ACTUAL_API_URL)
    if (!response.ok) {
        throw new Error(`Failed to fetch CoinDesk news: ${response.statusText}`)
    }

    const data: CoinDeskResponse = await response.json()
    const items = data.Data || []

    if (items.length === 0) {
        console.log('No items found in CoinDesk response.')
        return { added: 0, errors: 0 }
    }

    console.log(`Fetched ${items.length} items. Processing...`)

    let addedCount = 0
    let errorCount = 0

    // 2. Process items
    for (const item of items) {
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('news_items')
                .select('id')
                .eq('guid', item.GUID)
                .single()

            if (existing) {
                continue // Skip duplicates
            }

            // Insert new item
            // We need a source_id. We should probably look up or create a "CoinDesk" source.
            // For now, let's try to find a source named 'CoinDesk' or create it.
            let sourceId = ''
            const { data: source } = await supabase
                .from('news_sources')
                .select('id')
                .eq('name', 'CoinDesk')
                .maybeSingle()

            if (source) {
                sourceId = source.id
            } else {
                // Create CoinDesk source if not exists
                const { data: newSource, error: sourceError } = await supabase
                    .from('news_sources')
                    .insert({
                        name: 'CoinDesk',
                        url: 'https://coindesk.com',
                        type: 'api',
                        active: true
                    })
                    .select()
                    .single()

                if (sourceError || !newSource) {
                    console.error('Failed to create CoinDesk source:', sourceError)
                    errorCount++
                    continue
                }
                sourceId = newSource.id
            }

            // Map fields
            const { error: insertError } = await supabase.from('news_items').insert({
                source_id: sourceId,
                title: item.TITLE,
                content: item.BODY,
                url: item.URL,
                published_at: new Date(item.PUBLISHED_ON).toISOString(), // Assuming it's parsable
                guid: item.GUID,
                sentiment: item.SENTIMENT,
                category_data: item.CATEGORY_DATA,
                // created_at is handled by default
            })

            if (insertError) {
                console.error(`Failed to insert item ${item.GUID}:`, insertError)
                errorCount++
            } else {
                addedCount++
            }

        } catch (err) {
            console.error('Error processing item:', err)
            errorCount++
        }
    }

    return { added: addedCount, errors: errorCount }
}
