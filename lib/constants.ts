export const PLANS = {
  hacker: {
    name: 'Hacker',
    price: 29,
    priceId: process.env.STRIPE_PRICE_ID_HACKER!,
    events: 50000,
    apiKeys: 1,
    features: [
      '7-day free trial',
      '50k events/month',
      '1 API key',
      'Basic Dashboard',
      'Core Metrics',
      'Community Support'
    ]
  },
  startup: {
    name: 'Startup',
    price: 99,
    priceId: process.env.STRIPE_PRICE_ID_STARTUP!,
    events: 500000,
    apiKeys: 5,
    features: [
      'Everything in Hacker',
      '500k events/month',
      '5 API keys',
      'Advanced Metrics',
      'Latency Distribution',
      'Top Costly Runs',
      'Email Support'
    ]
  },
  scale: {
    name: 'Scale',
    price: 299,
    priceId: process.env.STRIPE_PRICE_ID_SCALE!,
    events: 5000000,
    apiKeys: 999,
    features: [
      'Everything in Startup',
      '5M events/month',
      'Unlimited API keys',
      'Multi-org Support',
      'Team Roles & Invites',
      'SLA Guarantee',
      'Priority Support'
    ]
  }
}

export const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60
}
