import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createServiceSupabaseClient } from '@/lib/supabase/server'
import { STRIPE_CONFIG } from '@/lib/stripe/config'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_CONFIG.webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = await createServiceSupabaseClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get price to determine plan
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const priceId = lineItems.data[0]?.price?.id
        
        let plan: 'hacker' | 'startup' | 'scale' = 'hacker'
        if (priceId === STRIPE_CONFIG.prices.startup) plan = 'startup'
        else if (priceId === STRIPE_CONFIG.prices.scale) plan = 'scale'

        // Update subscription
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            org_id: session.metadata?.org_id,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            plan,
            status: 'active'
          })
          .eq('org_id', session.metadata?.org_id)

        if (error) throw error
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        const status = subscription.status
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
