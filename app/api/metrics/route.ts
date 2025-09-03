import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api/auth'

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireAuth()
    const supabase = await createServerSupabaseClient()
    
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || '7d'

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    if (period === '7d') {
      startDate.setDate(now.getDate() - 7)
    } else if (period === '30d') {
      startDate.setDate(now.getDate() - 30)
    } else {
      startDate.setFullYear(2020) // All time
    }

    // Fetch all events in period
    const { data: events, error } = await supabase
      .from('events')
      .select('created_at, input_tokens, output_tokens, cost_usd, latency_ms, status, request_id')
      .eq('org_id', profile.org_id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate daily metrics
    const dailyMetrics = events.reduce((acc: any, event: any) => {
      const date = new Date(event.created_at).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, tokens: 0, cost: 0, events: 0 }
      }
      acc[date].tokens += event.input_tokens + event.output_tokens
      acc[date].cost += event.cost_usd
      acc[date].events++
      return acc
    }, {})

    // Status distribution
    const statusCounts = { ok: 0, error: 0, partial: 0 }
    events.forEach((event: any) => {
      statusCounts[event.status as keyof typeof statusCounts]++
    })

    // Latency percentiles
    const latencies = events.map((e: any) => e.latency_ms).sort((a: number, b: number) => a - b)
    const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0
    const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0
    const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0

    // Top 5 costly runs
    const runCosts = events.reduce((acc: any, event: any) => {
      if (!acc[event.request_id]) {
        acc[event.request_id] = {
          request_id: event.request_id,
          cost: 0,
          tokens: 0,
          created_at: event.created_at
        }
      }
      acc[event.request_id].cost += event.cost_usd
      acc[event.request_id].tokens += event.input_tokens + event.output_tokens
      return acc
    }, {})

    const topRuns = Object.values(runCosts)
      .sort((a: any, b: any) => b.cost - a.cost)
      .slice(0, 5)

    return NextResponse.json({
      daily: Object.values(dailyMetrics).sort((a: any, b: any) => a.date.localeCompare(b.date)),
      status: statusCounts,
      latency: { p50, p95, p99 },
      topRuns
    })
  } catch (error) {
    console.error('Metrics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
