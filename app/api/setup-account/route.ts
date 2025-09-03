import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { generateApiKey, hashApiKey } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { userId, orgName } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createServiceSupabaseClient()

    // Create organization
    const { data: org, error: orgError } = await (supabase as any)
      .from('orgs')
      .insert({ 
        name: orgName || 'My Organization' 
      })
      .select()
      .single()

    if (orgError) {
      console.error('Org creation error:', orgError)
      throw orgError
    }

    // Create profile
    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .insert({
        user_id: userId,
        org_id: org.id,
        role: 'owner'
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      throw profileError
    }

    // Generate and create API key
    const apiKey = generateApiKey()
    const keyHash = hashApiKey(apiKey)

    const { error: keyError } = await (supabase as any)
      .from('api_keys')
      .insert({
        org_id: org.id,
        key_hash: keyHash,
        name: 'Default Key'
      })

    if (keyError) {
      console.error('API key creation error:', keyError)
      throw keyError
    }

    // Create trial subscription
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 7)

    const { error: subError } = await (supabase as any)
      .from('subscriptions')
      .insert({
        org_id: org.id,
        plan: 'hacker',
        status: 'trialing',
        current_period_end: trialEnd.toISOString()
      })

    if (subError) {
      console.error('Subscription creation error:', subError)
      throw subError
    }

    return NextResponse.json({ 
      success: true, 
      apiKey,
      orgId: org.id 
    })

  } catch (error) {
    console.error('Setup account error:', error)
    return NextResponse.json(
      { error: 'Failed to set up account', details: error },
      { status: 500 }
    )
  }
}
