'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Search, Clock, Zap, DollarSign, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [runs, setRuns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRuns()
  }, [])

  const fetchRuns = async () => {
    try {
      const response = await fetch('/api/events')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setRuns(data.runs || [])
    } catch (error) {
      console.error('Failed to fetch runs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRuns = runs.filter(run => 
    run.request_id?.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ok': return <CheckCircle2 className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ok': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-amber-100 text-amber-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor your AI agent runs in real-time</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by request ID..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredRuns.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <p className="text-muted-foreground">No events yet. Start sending events to see them here.</p>
            <pre className="mt-4 p-4 bg-muted rounded text-xs text-left">
{`curl -X POST ${process.env.NEXT_PUBLIC_SITE_URL}/api/ingest \\
  -H "x-glassbox-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"request_id":"test_001","step_type":"llm"}'`}
            </pre>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRuns.map(run => (
            <Card 
              key={run.request_id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/dashboard/${run.request_id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(run.status)}>
                    {getStatusIcon(run.status)}
                    <span className="ml-1">{run.status}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(run.created_at).toLocaleString()}
                  </span>
                </div>
                <code className="text-sm mt-2">{run.request_id}</code>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{run.total_latency}ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span>{run.total_tokens} tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${run.total_cost?.toFixed(4) || '0.00'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{run.events_count} events</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
