'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Zap, Book } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4" variant="secondary">
            <Zap className="mr-1 h-3 w-3" />
            Now in Public Beta
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
            See inside your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              {" "}AI agents
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            Glass Box is the developer-first observability platform for AI agents. 
            Track tokens, costs, latency, and debug failures in real-time.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="group" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs">
                <Book className="mr-2 h-4 w-4" />
                View Docs
              </Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>5-minute setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
