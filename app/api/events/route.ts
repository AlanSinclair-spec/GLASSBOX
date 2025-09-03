import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api/auth'

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireAuth()
    const supabase = await createServerSupabaseClient()
    
    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get('request_id')

    if (requestId) {
      // Get specific run details
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('org_id', profile.org_id)
        .eq('request_id', requestId)
        .order('index', { ascending: true })

      if (error) throw error

      return NextResponse.json({ events })
    }

    // Get grouped runs
    const { data: runs, error } = await supabase
      .from('events')
      .select('request_id, created_at, input_tokens, output_tokens, cost_usd, latency_ms, status, cache_hit')
      .eq('org_id', profile.org_id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    // Group by request_id
    const grouped = runs.reduce((acc: any, event: any) => {
      if (!acc[event.request_id]) {
        acc[event.request_id] = {
          request_id: event.request_id,
          created_at: event.created_at,
          events_count: 0,
          total_tokens: 0,
          total_cost: 0,
          total_latency: 0,
          status: 'ok',
          cache_hits: 0
        }
      }
      
      acc[event.request_id].events_count++
      acc[event.request_id].total_tokens += event.input_tokens + event.output_tokens
      acc[event.request_id].total_cost += event.cost_usd
      acc[event.request_id].total_latency += event.latency_ms
      if (event.cache_hit) acc[event.request_id].cache_hits++
      if (event.status === 'error') acc[event.request_id].status = 'error'
      else if (event.status === 'partial' && acc[event.request_id].status !== 'error') {
        acc[event.request_id].status = 'partial'
      }
      
      return acc
    }, {})

    const groupedArray = Object.values(grouped)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 50)

    return NextResponse.json({ runs: groupedArray })
  } catch (error) {
    console.error('Events error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
