import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // handle the submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        // password reset caller. tells supabase to send a password reset link to the email thats been provided. (https://mayurhub.com/reset-password)
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password`, })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Password reset link sent! Check your email.')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-primary">MayorHub</h1>
                    <p className="text-neutral-slate mt-1 text-sm">Reset your password</p>
                </div>

                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm
                          rounded-lg px-4 py-3 mb-6">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                          rounded-lg px-4 py-3 mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold
                       py-3 rounded-lg transition-all duration-200 hover:scale-[1.02]
                       disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-slate mt-6">
                    Remembered it?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Back to Login
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default ForgotPassword