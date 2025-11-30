'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    // Safely initialize client
    let supabase: ReturnType<typeof createClient> | null = null
    try {
        supabase = createClient()
    } catch (e) {
        console.error(e)
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
        else setMessage('Check your email for the login link!')
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
        if (error) setMessage(error.message)
        else setMessage('Check your email for the confirmation link!')
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
                <form className="space-y-4" onSubmit={handleLogin}>
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
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Loading...' : 'Sign In'}
                        </Button>
                        <Button variant="outline" type="button" onClick={handleSignUp} disabled={loading}>
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
            </CardContent>
        </Card>
    )
}
