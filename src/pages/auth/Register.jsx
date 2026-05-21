// @ts-nocheck
import React from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'


const Register = () => {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // function that runs when a user types anything in the fields
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // function that run when the submit button is clicked
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirm) return setError('Passwords do not match')
        if (form.password.length < 6) return setError('Password must be at least 6 characters')

        setLoading(true)
        try {
            const data = await register(form.fullName, form.email, form.password)
            // If confirmation is required, session will be null
            if (data?.user && !data?.session) {
                navigate('/login')
            }
            // no navigate here — AuthContext + App.jsx handles redirect
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="min-h-screen bg-neutral-light flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-primary">MayorHub</h1>
                    <p className="text-neutral-slate mt-1 text-sm">Create your account</p>
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
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

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
                            // required
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
                            placeholder="Minimum 6 characters"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirm"
                            value={form.confirm}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
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
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                </form>

                <p className="text-center text-sm text-neutral-slate mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Register