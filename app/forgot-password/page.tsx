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
    <div
      style={{
        background: 'linear-gradient(125deg, #ECFCFF 0%, #ECFCFF 40%, #B2FCFF calc(40% + 1px), #B2FCFF 60%, #3E64FF calc(60% + 1px), #3E64FF 72%, #5EDFFF calc(72% + 1px),#5EDFFF  100%)'
      }}
      className="flex items-center justify-center min-h-screen   p-4">
      <div style={{
        background: " #3E64FF",
        boxShadow: '0px 0px 24px rgb(92, 86, 150)'
      }}
        className=" max-w-md rounded-2xl   overflow-hidden">
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center  text-white p-8">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tight">
                Forgot Your Password?
              </h1>
              <p className="text-lg opacity-90 mt-2">
                Enter your email to receive a password reset link
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}
            style={{
              background: " #5EDFFF"
            }}
            className=" rounded-t-3xl  px-8 pt-10 pb-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}

                className="w-full px-4 py-3 rounded-xl border border-blue-300 border-opacity-50  text-black placeholder-gray-600 focus:outline-none  focus:ring-blue-300 focus:border-transparent transition duration-200 ease-in-out"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Success Message */}
            {success && (
              <div className="mt-5 rounded-xl bg-green-100 p-6 text-center">
                <p className="text-green-700">
                  If an account exists with that email, you will receive a password reset link shortly.
                  Please check your email.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-4 flex justify-center">
              {loading ? (
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black" />
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 border border-transparent rounded-xl shadow-sm text-lg  font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 transition duration-200 ease-in-out"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>


  )
}

export default ForgotPassword