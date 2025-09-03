'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Copy, Eye, EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('gb_xxxxxxxxxxxxxxxxxxxxxxxx')
  const [showKey, setShowKey] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      const response = await fetch('/api/regenerate-key', { method: 'POST' })
      const data = await response.json()
      if (data.api_key) {
        setApiKey(data.api_key)
        setShowKey(true)
      }
    } catch (error) {
      console.error('Failed to regenerate key:', error)
    } finally {
      setRegenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and API keys</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>Use this key to authenticate your API requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-muted rounded font-mono text-sm">
              {showKey ? apiKey : 'gb_xxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
            </code>
            <Button size="icon" variant="ghost" onClick={() => setShowKey(!showKey)}>
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleRegenerate} disabled={regenerating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
            Regenerate Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Current Plan</span>
              <Badge>Hacker - $29/month</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Events Used</span>
              <span>12,543 / 50,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">API Keys</span>
              <span>1 / 1</span>
            </div>
            <Button className="w-full">Upgrade Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
