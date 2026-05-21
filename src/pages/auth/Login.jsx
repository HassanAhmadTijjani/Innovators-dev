/* eslint-disable no-unused-vars */
// @ts-nocheck
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
    const { login, profile } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    
    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(form.email, form.password)
            // no navigate needed — App.jsx redirects automatically
        } catch (err) {
            setError('Invalid email or password')
        } finally {
            setLoading(false)
        }
      }

    return (
        <div className="min-h-screen bg-neutral-light flex items-center justify-center px-8">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-primary">MayorHub</h1>
                    <p className="text-neutral-slate mt-1 text-sm">Welcome back</p>
                </div>

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
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="text-right">
                        <Link to="/forgot-password"
                            className="text-sm text-primary hover:underline font-medium">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold
                       py-3 rounded-lg transition-all duration-200 hover:scale-[1.02]
                       disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                <p className="text-center text-sm text-neutral-slate mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-semibold hover:underline">
                        Register
                    </Link>
                </p>

            </div>
        </div>
        
    )
}