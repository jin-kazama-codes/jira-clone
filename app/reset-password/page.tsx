// app/reset-password/page.tsx
"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidToken, setIsValidToken] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    // Verify token on component mount
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid reset link')
        return
      }

      try {
        const response = await fetch('/api/auth/verify-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          setIsValidToken(true)
        } else {
          setError('This reset link is invalid or has expired')
        }
      } catch (err) {
        setError('Error verifying reset link')
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password reset successful')
        // Redirect to login page after successful reset
        router.push('/login')
      } else {
        throw new Error(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error('Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (error && !isValidToken) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground text-lg">
            Please enter your new password
          </p>
        </div>

        <form 
          className="mt-5 rounded-xl bg-white p-6 shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-6">
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:border-primary focus:ring-primary mt-3 rounded-xl border border-gray-300 px-3 py-2"
                placeholder="Enter new password"
                required
                minLength={8}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="focus:border-primary focus:ring-primary mt-3 rounded-xl border border-gray-300 px-3 py-2"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          <div className="mt-6 flex justify-end">
            {loading ? (
              <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            ) : (
              <button
                type="submit"
                className="focus:ring-primary rounded-xl bg-black px-4 py-2 text-white hover:bg-slate-800 focus:outline-none focus:ring-2"
                disabled={loading || !isValidToken}
              >
                Reset Password
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword