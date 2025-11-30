'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
    redirectTo?: string
}

export default function AuthForm({ redirectTo = '/dashboard' }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()

    // Safely initialize client
    let supabase: ReturnType<typeof createClient> | null = null
    try {
        supabase = createClient()
    } catch (e) {
        console.error(e)
    }

    const logLogin = async () => {
        try {
            const metadata = {
                screen_width: window.screen.width,
                screen_height: window.screen.height,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language,
                platform: navigator.platform,
            }

            await fetch('/api/log-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event_type: 'login',
                    metadata,
                }),
            })
        } catch (error) {
            console.error('Failed to log login:', error)
        }
    }


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!supabase) {
            setMessage('Supabase not configured. Check console.')
            return
        }
        if (!email || !password) {
            setMessage('Please enter both email and password.')
            return
        }
        setLoading(true)
        setMessage(null)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) setMessage(error.message)
        else {
            setMessage('Logged in successfully!')
            await logLogin()
            router.push(redirectTo)
            router.refresh()
        }
        setLoading(false)
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!supabase) {
            setMessage('Supabase not configured. Check console.')
            return
        }
        if (!email || !password) {
            setMessage('Please enter both email and password.')
            return
        }
        setLoading(true)
        setMessage(null)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Confirmation code sent to your email.')
            setShowOtpInput(true)
        }
        setLoading(false)
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!supabase) return
        if (!otp) {
            setMessage('Please enter the code.')
            return
        }
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'signup'
        })

        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Email verified! Logging you in...')
            await logLogin()
            router.push(redirectTo)
            router.refresh()
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        if (!supabase) {
            setMessage('Supabase not configured.')
            return
        }
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (error) setMessage(error.message)
        } catch (error: any) {
            setMessage(error.message || 'An error occurred')
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Welcome to NewsMate</CardTitle>
                <CardDescription>Login or create an account to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                {!showOtpInput ? (
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Button onClick={handleLogin} disabled={loading}>
                                {loading ? 'Loading...' : 'Sign In'}
                            </Button>
                            <Button variant="outline" onClick={handleSignUp} disabled={loading}>
                                Sign Up
                            </Button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>
                        <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
                            Google
                        </Button>
                        {message && <p className="text-sm text-red-500 text-center">{message}</p>}
                    </form>
                ) : (
                    <form className="space-y-4" onSubmit={handleVerifyOtp}>
                        <div className="space-y-2">
                            <p className="text-sm text-slate-500">Enter the code sent to {email}</p>
                            <Input
                                type="text"
                                placeholder="Confirmation Code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </Button>
                        <Button
                            variant="ghost"
                            type="button"
                            className="w-full"
                            onClick={() => setShowOtpInput(false)}
                            disabled={loading}
                        >
                            Back
                        </Button>
                        {message && <p className="text-sm text-red-500 text-center">{message}</p>}
                    </form>
                )}
            </CardContent>
        </Card>
    )
}
