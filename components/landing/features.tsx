import { Database, DollarSign, BarChart3, Activity, Code2, Shield } from 'lucide-react'

export function Features() {
  const features = [
    {
      name: 'Real-time Logging',
      description: 'Stream events from your agents with our simple REST API. One endpoint, infinite insights.',
      icon: Database,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Cost Tracking',
      description: 'Monitor token usage and costs across all your agents. Never get surprised by your bill again.',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Performance Metrics',
      description: 'Track latency, cache hits, and success rates. Find bottlenecks before your users do.',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Timeline Debugging',
      description: 'Step through agent runs to understand exactly what happened and why.',
      icon: Activity,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      name: 'Developer First',
      description: 'Built by developers, for developers. Simple API, comprehensive docs, no BS.',
      icon: Code2,
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      name: 'Enterprise Ready',
      description: 'SOC2 compliant, 99.9% uptime SLA, and dedicated support when you scale.',
      icon: Shield,
      gradient: 'from-slate-500 to-slate-700'
    }
  ]

  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Everything you need to debug and optimize
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Stop flying blind. Get complete visibility into your AI agents with tools built for modern development.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-slate-100">
                  <div className={`mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient}`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
