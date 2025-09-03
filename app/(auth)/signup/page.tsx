'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassBoxLogo } from '@/components/logo'
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    
    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!authData.user) {
      setError('Failed to create account')
      setLoading(false)
      return
    }

    // Set up account data
    try {
      const response = await fetch('/api/setup-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: authData.user.id,
          orgName: orgName || `${email.split('@')[0]}'s Organization`,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Setup failed')
      }

      // Check if email confirmation is required
      if (authData.user.email_confirmed_at) {
        // Email already confirmed (shouldn't happen but just in case)
        router.push('/dashboard')
      } else {
        // Show success message for email confirmation
        setError('') // Clear any errors
        alert('Success! Please check your email to confirm your account.')
        router.push('/login')
      }

    } catch (err: any) {
      console.error('Setup error:', err)
      setError('Account created but setup failed. Please contact support.')
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <GlassBoxLogo className="h-10 w-10" />
        </div>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Start monitoring your AI agents today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:text-red-400 dark:bg-red-950 dark:border-red-800">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center space-x-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md dark:text-green-400 dark:bg-green-950 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <span>{success}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name (Optional)</Label>
            <Input
              id="orgName"
              type="text"
              placeholder="My Company"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline ml-1">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
