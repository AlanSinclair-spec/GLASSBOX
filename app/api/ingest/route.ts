import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { IngestEventSchema } from '@/types/api'
import { hashApiKey } from '@/lib/utils'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { PLANS } from '@/lib/constants'

interface ApiKeyData {
  org_id: string
  revoked_at: string | null
}

interface SubscriptionData {
  plan: string
}

interface EventData {
  id: string
}

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get('x-glassbox-key')
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key' },
        { status: 401 }
      )
    }

    // Rate limiting
    const { allowed, remaining } = checkRateLimit(apiKey)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60'
          }
        }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const validation = IngestEventSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error.errors },
        { status: 400 }
      )
    }

    const supabase = await createServiceSupabaseClient()
    
    // Verify API key and get org
    const keyHash = hashApiKey(apiKey)
    const { data: apiKeyData, error: keyError } = await supabase
      .from('api_keys')
      .select('org_id, revoked_at')
      .eq('key_hash', keyHash)
      .single() as { data: ApiKeyData | null; error: any }

    if (keyError || !apiKeyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Check if API key is revoked
    if (apiKeyData.revoked_at) {
      return NextResponse.json(
        { error: 'API key is revoked' },
        { status: 401 }
      )
    }

    // Check plan limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('org_id', apiKeyData.org_id)
      .single() as { data: SubscriptionData | null; error: any }

    const plan = subscription?.plan || 'hacker'
    const planLimits = PLANS[plan as keyof typeof PLANS]

    // Check monthly event count
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', apiKeyData.org_id)
      .gte('created_at', thirtyDaysAgo.toISOString())

    if (count && count >= planLimits.events) {
      return NextResponse.json(
        { error: 'Monthly event limit exceeded. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Insert event
    const { data: event, error: insertError } = await (supabase as any)
      .from('events')
      .insert({
        org_id: apiKeyData.org_id,
        ...validation.data
      })
      .select()
      .single() as { data: EventData | null; error: any }

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to ingest event' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        event_id: event?.id,
        remaining_events: planLimits.events - (count || 0) - 1
      },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Remaining': remaining.toString()
        }
      }
    )
  } catch (error) {
    console.error('Ingest error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
