export const STRIPE_CONFIG = {
  prices: {
    hacker: process.env.STRIPE_PRICE_ID_HACKER!,
    startup: process.env.STRIPE_PRICE_ID_STARTUP!,
    scale: process.env.STRIPE_PRICE_ID_SCALE!,
  },
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
  cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=true`,
}
