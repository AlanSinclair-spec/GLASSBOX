import { RATE_LIMIT } from '@/lib/constants'

const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = requestCounts.get(key)

  if (!record || now > record.resetTime) {
    requestCounts.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs
    })
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1 }
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count }
}
