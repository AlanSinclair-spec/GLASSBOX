import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/api/auth'
import { generateApiKey, hashApiKey } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireAuth()
    const supabase = await createServerSupabaseClient()

    // Generate new key
    const newKey = generateApiKey()
    const keyHash = hashApiKey(newKey)

    // Start transaction
    const now = new Date().toISOString()

    // Revoke old keys
    const { error: revokeError } = await supabase
      .from('api_keys')
      .update({ revoked_at: now })
      .eq('org_id', profile.org_id)
      .is('revoked_at', null)

    if (revokeError) throw revokeError

    // Insert new key
    const { data: apiKey, error: insertError } = await supabase
      .from('api_keys')
      .insert({
        org_id: profile.org_id,
        key_hash: keyHash,
        name: 'Default Key'
      })
      .select()
      .single()

    if (insertError) throw insertError

    return NextResponse.json({
      success: true,
      api_key: newKey,
      key_id: apiKey.id
    })
  } catch (error) {
    console.error('Regenerate key error:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate API key' },
      { status: 500 }
    )
  }
}
