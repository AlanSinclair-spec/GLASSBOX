'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    )
  }

  const totalEvents = metrics?.daily?.reduce((sum: number, d: any) => sum + d.events, 0) || 0
  const totalCost = metrics?.daily?.reduce((sum: number, d: any) => sum + d.cost, 0) || 0
  const totalTokens = metrics?.daily?.reduce((sum: number, d: any) => sum + d.tokens, 0) || 0
  const successRate = metrics?.status ? 
    ((metrics.status.ok / (metrics.status.ok + metrics.status.error + metrics.status.partial)) * 100).toFixed(1) : 
    '0'

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Metrics</h1>
        <p className="text-muted-foreground mt-2">Analyze your agent performance and costs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalEvents.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTokens.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{successRate}%</p>
          </CardContent>
        </Card>
      </div>

      {metrics?.latency && (
        <Card>
          <CardHeader>
            <CardTitle>Latency Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">P50</span>
                <span className="font-mono">{metrics.latency.p50}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">P95</span>
                <span className="font-mono">{metrics.latency.p95}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">P99</span>
                <span className="font-mono">{metrics.latency.p99}ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
