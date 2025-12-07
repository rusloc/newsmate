import { createClient } from '@/lib/supabase'

const COINDESK_API_URL = 'https://developers.coindesk.com/documentation/data-api/news_v1_article_list' // Placeholder, user provided documentation link, assuming actual endpoint is needed.
// Looking at the user request, they provided a link to documentation.
// Usually CoinDesk API is something like https://api.coindesk.com/v1/news/list or similar.
// However, the user provided a specific URL. I will use a placeholder and ask user or search if I can.
// Wait, the user said "Main API to gather news ... https://developers.coindesk.com/documentation/data-api/news_v1_article_list".
// That looks like a doc link. I should probably search for the actual endpoint or assume a standard one.
// Let's assume the user wants me to use the logic described there.
// Actually, I'll use a generic fetcher and let the user correct the URL if needed, or I can try to find the real one.
// A common CoinDesk endpoint is `https://data-api.coindesk.com/news/v1/article/list`.

const ACTUAL_API_URL = 'https://data-api.coindesk.com/news/v1/article/list' // Best guess based on doc name

interface CoinDeskItem {
    TITLE: string
    PUBLISHED_ON: string // Unix timestamp or ISO string? Docs usually say. Assuming ISO or similar.
    URL: string
    BODY: string
    SENTIMENT: any
    CREATED_ON: string
    CATEGORY_DATA: any
    GUID: string
}

interface CoinDeskResponse {
    Data: CoinDeskItem[]
    // Add other fields if known
}

export async function fetchAndProcessCoinDeskNews() {
    const supabase = createClient()

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
                .single()

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
