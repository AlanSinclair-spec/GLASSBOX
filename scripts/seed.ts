import { createClient } from '@supabase/supabase-js'
import { generateApiKey, hashApiKey } from '../lib/utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log('🌱 Starting seed...')

  // Create demo org
  const { data: org, error: orgError } = await supabase
    .from('orgs')
    .insert({ name: 'Demo Organization' })
    .select()
    .single()

  if (orgError) {
    console.error('Failed to create org:', orgError)
    return
  }

  console.log('✅ Created demo org:', org.id)

  // Create API key
  const apiKey = generateApiKey()
  const keyHash = hashApiKey(apiKey)

  const { error: keyError } = await supabase
    .from('api_keys')
    .insert({
      org_id: org.id,
      key_hash: keyHash,
      name: 'Demo Key'
    })

  if (keyError) {
    console.error('Failed to create API key:', keyError)
    return
  }

  console.log('✅ Created API key:', apiKey)

  // Create subscription
  const { error: subError } = await supabase
    .from('subscriptions')
    .insert({
      org_id: org.id,
      plan: 'startup',
      status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })

  if (subError) {
    console.error('Failed to create subscription:', subError)
    return
  }

  console.log('✅ Created subscription')

  // Create demo events
  const requestIds = [
    'req_demo_001',
    'req_demo_002',
    'req_demo_003',
    'req_demo_004',
    'req_demo_005'
  ]

  const tools = ['gpt-4', 'claude-3', 'dalle-3', 'whisper', 'embeddings']
  const statuses = ['ok', 'ok', 'ok', 'error', 'partial']

  for (let i = 0; i < requestIds.length; i++) {
    const requestId = requestIds[i]
    const numSteps = Math.floor(Math.random() * 5) + 3

    for (let j = 0; j < numSteps; j++) {
      const inputTokens = Math.floor(Math.random() * 500) + 100
      const outputTokens = Math.floor(Math.random() * 800) + 200
      const costUsd = (inputTokens * 0.00003 + outputTokens * 0.00006)
      const latencyMs = Math.floor(Math.random() * 2000) + 500
      const cacheHit = Math.random() > 0.7

      const { error: eventError } = await supabase
        .from('events')
        .insert({
          org_id: org.id,
          request_id: requestId,
          step_type: 'llm',
          tool_name: tools[Math.floor(Math.random() * tools.length)],
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          cost_usd: costUsd,
          latency_ms: latencyMs,
          cache_hit: cacheHit,
          status: j === numSteps - 1 ? statuses[i % statuses.length] : 'ok',
          payload: {
            model: tools[Math.floor(Math.random() * tools.length)],
            temperature: Math.random(),
            max_tokens: outputTokens
          },
          index: j,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        })

      if (eventError) {
        console.error('Failed to create event:', eventError)
      }
    }
  }

  console.log('✅ Created demo events')
  console.log('\n📝 Demo Credentials:')
  console.log('API Key:', apiKey)
  console.log('Org ID:', org.id)
  console.log('\n🚀 Seed complete!')
}

seed().catch(console.error)
