'use client'

import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()

  const plans = [
    {
      name: 'Hacker',
      price: 29,
      features: ['50k events/month', '1 API key', 'Basic Dashboard', '7-day free trial']
    },
    {
      name: 'Startup', 
      price: 99,
      features: ['500k events/month', '5 API keys', 'Advanced Metrics', 'Email Support']
    },
    {
      name: 'Scale',
      price: 299,
      features: ['5M events/month', 'Unlimited API keys', 'Priority Support', 'SLA']
    }
  ]

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing</h1>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map(plan => (
          <div key={plan.name} className="border rounded-lg p-6">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className="text-3xl font-bold mt-2">${plan.price}<span className="text-sm">/mo</span></p>
            <ul className="mt-6 space-y-2">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-center">
                  <span className="mr-2">✓</span> {feature}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => router.push('/signup')}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Start Free Trial
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
