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
    setSuccess('')

    const supabase = createClient()
    
    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      // Handle email confirmation errors gracefully
      if (authError.message.includes('confirmation') || authError.message.includes('email') || authError.message.includes('sending')) {
        // Email confirmation failed, but user might be created - try to proceed
        setSuccess('Account created! Email confirmation failed, but you can still access your dashboard. Please contact support if needed.')
        
        // Try to sign in the user directly
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (!signInError && signInData.user) {
          await setupUserAccount(signInData.user.id)
          return
        }
        
        // If sign in also fails, show helpful message
        setError('Account may have been created. Try signing in manually, or contact support.')
        setLoading(false)
        return
      }
      
      setError(authError.message)
      setLoading(false)
      return
    }

    // If we get here, signup was successful
    if (authData.user) {
      // Try to proceed with setup regardless of email confirmation status
      try {
        await setupUserAccount(authData.user.id)
      } catch (setupError) {
        // If setup fails, still show success for account creation
        setSuccess('Account created! Please check your email and click the confirmation link to complete setup.')
        setLoading(false)
      }
    }
  }

  const setupUserAccount = async (userId: string) => {
    try {
      const response = await fetch('/api/setup-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          orgName: orgName || `${email.split('@')[0]}'s Organization`,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Setup failed')
      }

      // Setup successful - redirect to dashboard
      setSuccess('Account created successfully! Redirecting to dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)

    } catch (err: any) {
      console.error('Setup error:', err)
      throw err // Re-throw to be handled by caller
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
