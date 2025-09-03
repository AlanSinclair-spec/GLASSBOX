'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export function Pricing() {
  const plans = [
    {
      name: 'Hacker',
      price: 29,
      description: 'Perfect for side projects and experiments',
      features: [
        '7-day free trial',
        '50k events/month',
        '1 API key',
        'Basic Dashboard',
        'Core Metrics',
        'Community Support'
      ],
      cta: 'Start free trial',
      highlighted: false
    },
    {
      name: 'Startup',
      price: 99,
      description: 'For teams building production agents',
      features: [
        'Everything in Hacker',
        '500k events/month',
        '5 API keys',
        'Advanced Metrics',
        'Latency Distribution',
        'Top Costly Runs',
        'Email Support'
      ],
      cta: 'Start free trial',
      highlighted: true
    },
    {
      name: 'Scale',
      price: 299,
      description: 'For companies running agents at scale',
      features: [
        'Everything in Startup',
        '5M events/month',
        'Unlimited API keys',
        'Multi-org Support',
        'Team Roles & Invites',
        'SLA Guarantee',
        'Priority Support'
      ],
      cta: 'Contact sales',
      highlighted: false
    }
  ]

  return (
    <section className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Start free, scale as you grow. No surprises, no hidden fees.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={`${plan.highlighted ? 'border-blue-500 shadow-xl scale-105' : ''}`}>
              {plan.highlighted && (
                <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium rounded-t-lg">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-slate-600 dark:text-slate-400">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
