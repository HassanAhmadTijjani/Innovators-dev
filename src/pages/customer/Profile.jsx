
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import { useAuth } from '../../context/AuthContext'
// import  useAuth  from '../../context/AuthContext'
import  useProfile  from '../../hooks/useProfile'
import useSettings from '../../hooks/useSettings'
import toast from 'react-hot-toast'

export default function Profile() {
    const { user, profile, refreshProfile } = useAuth()
    const { saving, uploading, updateProfile,
        uploadAvatar, fetchOrderStats } = useProfile()
    const { settings } = useSettings()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)

    const [form, setForm] = useState({
        full_name: '',
        phone: '',
    })
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [stats, setStats] = useState({
        count: 0, totalSpent: 0
    })

    const currency = settings?.currency_symbol || '₦'

    // fill form when profile loads
    useEffect(() => {
        if (profile) {
            setForm({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
            })
            if (profile.avatar_url) {
                setAvatarPreview(profile.avatar_url)
            }
        }
    }, [profile])

    // load order stats
    useEffect(() => {
        fetchOrderStats().then(setStats)
    }, [])

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleAvatarChange(e) {
        const file = e.target.files[0]
        if (!file) return

        // show preview immediately
        setAvatarPreview(URL.createObjectURL(file))

        try {
            const url = await uploadAvatar(file)
            setAvatarPreview(url)
            toast.success('Profile photo updated!')
        } catch (err) {
            toast.error('Failed to upload photo')
        }
    }

    async function handleSave(e) {
        e.preventDefault()
        if (!form.full_name.trim()) {
            return toast.error('Name cannot be empty')
        }
        try {
            await updateProfile(form)
            await refreshProfile() 
            toast.success('Profile updated successfully!')
        } catch (err) {
            toast.error('Failed to update profile')
        }
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-NG', {
            day: 'numeric', month: 'long', year: 'numeric'
        })
    }

    const initials = (profile?.full_name || user?.email || 'U')
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-brand-charcoal">
                        My Profile
                    </h1>
                    <p className="text-neutral-slate text-sm mt-1">
                        Manage your account information
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border
                        border-gray-100 p-6 mb-6">

                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 mb-8 pb-8
                          border-b border-gray-100">
                        <div className="relative shrink-0">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-2xl overflow-hidden
                              border-2 border-primary/20">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile"
                                        className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br
                                  from-primary to-green-400 flex items-center
                                  justify-center">
                                        <span className="text-white font-bold text-2xl">
                                            {initials}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Upload button overlay */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary
                           hover:bg-primary-dark text-white rounded-full
                           flex items-center justify-center text-sm
                           transition-all shadow-lg
                           disabled:opacity-50"
                                title="Change photo"
                            >
                                {uploading ? '⏳' : '📷'}
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-brand-charcoal
                             truncate">
                                {profile?.full_name || 'Customer'}
                            </h2>
                            <p className="text-neutral-slate text-sm mt-0.5 truncate">
                                {user?.email}
                            </p>
                            {profile?.created_at && (
                                <p className="text-neutral-slate text-xs mt-1">
                                    Member since {formatDate(profile.created_at)}
                                </p>
                            )}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="text-primary text-xs font-semibold mt-2
                           hover:underline transition-colors"
                            >
                                {uploading ? 'Uploading...' : 'Change profile photo'}
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8 pb-8
                          border-b border-gray-100">
                        <div className="bg-primary-light rounded-xl p-4 text-center">
                            <p className="text-2xl font-extrabold text-primary">
                                {stats.count}
                            </p>
                            <p className="text-primary-dark text-xs font-medium mt-0.5">
                                Total Orders
                            </p>
                        </div>
                        <div className="bg-primary-light rounded-xl p-4 text-center">
                            <p className="text-2xl font-extrabold text-primary">
                                {currency}{stats.totalSpent.toLocaleString()}
                            </p>
                            <p className="text-primary-dark text-xs font-medium mt-0.5">
                                Total Spent
                            </p>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <form onSubmit={handleSave} className="space-y-5">
                        <h3 className="font-semibold text-brand-charcoal">
                            Personal Information
                        </h3>

                        <div>
                            <label className="block text-sm font-medium
                                text-brand-charcoal mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full border border-gray-300 rounded-xl
                           px-4 py-3 text-sm focus:outline-none
                           focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium
                                text-brand-charcoal mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="e.g. 08012345678"
                                className="w-full border border-gray-300 rounded-xl
                           px-4 py-3 text-sm focus:outline-none
                           focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium
                                text-brand-charcoal mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full border border-gray-200 rounded-xl
                           px-4 py-3 text-sm bg-neutral-light
                           text-neutral-slate cursor-not-allowed"
                            />
                            <p className="text-xs text-neutral-slate mt-1">
                                Email cannot be changed
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-primary hover:bg-primary-dark text-white
                         py-3.5 rounded-xl font-bold text-sm transition-all
                         hover:scale-[1.01] disabled:opacity-50
                         disabled:cursor-not-allowed"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-2xl shadow-sm border
                        border-gray-100 p-6">
                    <h3 className="font-semibold text-brand-charcoal mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        {[
                            {
                                icon: '📦',
                                label: 'My Orders',
                                desc: 'View and track your orders',
                                path: '/orders',
                            },
                            {
                                icon: '🛒',
                                label: 'Continue Shopping',
                                desc: 'Browse our latest products',
                                path: '/shop',
                            },
                        ].map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="w-full flex items-center gap-4 p-4
                           rounded-xl border border-gray-100
                           hover:border-primary hover:bg-primary-light
                           transition-all text-left group"
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <p className="font-semibold text-brand-charcoal text-sm
                                group-hover:text-primary transition-colors">
                                        {item.label}
                                    </p>
                                    <p className="text-neutral-slate text-xs mt-0.5">
                                        {item.desc}
                                    </p>
                                </div>
                                <span className="ml-auto text-neutral-slate
                                 group-hover:text-primary transition-colors">
                                    →
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    )
}