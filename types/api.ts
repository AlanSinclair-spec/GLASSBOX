import { z } from 'zod'

export const IngestEventSchema = z.object({
  request_id: z.string().min(1),
  step_type: z.string().optional(),
  tool_name: z.string().optional(),
  input_tokens: z.number().int().min(0).default(0),
  output_tokens: z.number().int().min(0).default(0),
  cost_usd: z.number().min(0).default(0),
  latency_ms: z.number().int().min(0).default(0),
  cache_hit: z.boolean().default(false),
  status: z.enum(['ok', 'error', 'partial']).default('ok'),
  payload: z.any().optional(),
  index: z.number().int().min(0).default(0)
})

export type IngestEvent = z.infer<typeof IngestEventSchema>

export type GroupedRun = {
  request_id: string
  created_at: string
  events_count: number
  total_tokens: number
  total_cost: number
  total_latency: number
  status: 'ok' | 'error' | 'partial'
  cache_hits: number
}

export type Metrics = {
  daily: {
    date: string
    tokens: number
    cost: number
    events: number
  }[]
  status: {
    ok: number
    error: number
    partial: number
  }
  latency: {
    p50: number
    p95: number
    p99: number
  }
  topRuns: {
    request_id: string
    cost: number
    tokens: number
    created_at: string
  }[]
}
