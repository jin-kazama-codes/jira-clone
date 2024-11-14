"use client"
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast.success('Check your email for the reset link')
      } else {
        throw new Error(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error('Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Forgot Your Password?
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your email to receive a password reset link
          </p>
        </div>
        {success ? (
          <div className="mt-5 rounded-xl bg-green-50 p-6 text-center">
            <p className="text-green-800">
              If an account exists with that email, you will receive a password reset link shortly.
              Please check your email.
            </p>
          </div>
        ) : (
          <form
            className="mt-5 rounded-xl bg-white p-6 shadow-lg"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4">
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="focus:border-primary focus:ring-primary mt-3 rounded-xl border border-gray-300 px-3 py-2"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
            <div className="mt-4 flex justify-end">
              {loading ? (
                <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              ) : (
                <button
                  type="submit"
                  className="focus:ring-primary rounded-xl bg-black px-4 py-2 text-white hover:bg-slate-800 focus:outline-none focus:ring-2"
                  disabled={loading}
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword