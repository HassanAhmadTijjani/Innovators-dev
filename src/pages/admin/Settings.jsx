// @ts-nocheck
import React from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { useState, useEffect } from 'react'
import useSettings from '../../hooks/useSettings'
import toast from 'react-hot-toast'

const Settings = () => {
    const { settings, loading, updateSettings } = useSettings()
    const [form, setForm] = useState({
        bank_name: '',
        account_number: '',
        account_name: '',
        store_name: '',
        store_phone: '',
        super_admin_phone: '', // New field for super admin phone number
        store_email: '',
        store_address: '',
        store_description: '',
        logo_url: '',
        delivery_fee_lagos: '',  
        delivery_fee_nigeria: '',  
        delivery_fee_outside: '', 
    })
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    // fill form when settings load
    useEffect(() => {
        if (settings) {
            setForm({
                bank_name: settings.bank_name || '',
                account_number: settings.account_number || '',
                account_name: settings.account_name || '',
                store_name: settings.store_name || '',
                store_phone: settings.store_phone || '',
                super_admin_phone: settings.super_admin_phone || '', // Populate new field
                store_email: settings.store_email || '',
                store_address: settings.store_address || '',
                store_description: settings.store_description || '',
                logo_url: settings.logo_url || '',
                delivery_fee_lagos: settings.delivery_fee_lagos || '',
                delivery_fee_nigeria: settings.delivery_fee_nigeria || '',
                delivery_fee_outside: settings.delivery_fee_outside || '',
            })
        }
    }, [settings])
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Handle Log Upload
    const handleLogoUpload = async (e) => {
        try {
            const file = e.target.files[0]

            if (!file) return

            const fileExt = file.name.split('.').pop()

            const fileName = `logo-${Date.now()}.${fileExt}`

            const filePath = `logos/${fileName}`

            // Capture the current logo URL for cleanup after a successful upload
            const oldLogoUrl = form.logo_url

            const { error: uploadError } = await supabase.storage
                .from('store-assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // If a previous logo existed, remove it from storage to prevent orphaned files
            if (oldLogoUrl) {
                try {
                    const urlParts = oldLogoUrl.split('store-assets/')
                    if (urlParts.length > 1) {
                        const oldPath = urlParts[1]
                        await supabase.storage.from('store-assets').remove([oldPath])
                    }
                } catch (cleanupErr) {
                    console.warn('Failed to clean up old logo file:', cleanupErr)
                }
            }

            const { data } = supabase.storage
                .from('store-assets')
                .getPublicUrl(filePath)

            setForm((prev) => ({
                ...prev,
                logo_url: data.publicUrl
            }))

            toast.success('Logo uploaded successfully!')
        } catch (err) {
            console.error(err)
            toast.error('Failed to upload logo')
        }
    }
    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        try {
            await updateSettings(form)
            toast.success('Settings saved successfully!')
            // setSuccess('Settings saved successfully!')
            // setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            toast.error('Fail to save')
            setError('Failed to save: ' + err.message)
        } finally {
            setSaving(false)
        }
    }
    if (loading) return (
        <AdminLayout>
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-100 rounded w-1/4" />
                <div className="h-48 bg-gray-100 rounded-xl" />
                <div className="h-48 bg-gray-100 rounded-xl" />
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout>
            <div className="max-w-2xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-brand-charcoal">Settings</h1>
                    <p className="text-neutral-slate text-sm mt-1">
                        Manage your store and payment information
                    </p>
                </div>

                {success && (
                    <div className="bg-primary-light border border-primary
                              text-primary-dark text-sm rounded-lg
                              px-4 py-3 mb-6">
                        ✅ {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600
                              text-sm rounded-lg px-4 py-3 mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">

                    {/* Store Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border
                              border-gray-100 space-y-5">
                        <h2 className="font-semibold text-brand-charcoal">
                            🏪 Store Information
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-brand-charcoal mb-2">
                                Store Logo
                            </label>

                            {form.logo_url && (
                                <div className="mb-4">
                                    <img
                                        src={form.logo_url}
                                        alt="Store Logo"
                                        className="h-20 w-20 object-cover rounded-xl border border-gray-200"
                                    />
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="block w-full text-sm text-neutral-slate
                                file:mr-4 file:py-2 file:px-4 file:rounded-lg
                                file:border-0 file:bg-primary-light file:text-primary-dark
                                file:font-semibold file:text-sm hover:file:bg-primary
                                hover:file:text-white file:transition-all cursor-pointer"
                            />

                            <p className="text-xs text-neutral-slate mt-2">
                                Upload your store logo
                            </p>
                        </div>

                        {[
                            { label: 'Store Name', name: 'store_name', type: 'text', placeholder: 'e.g. MayorHub' },
                            { label: 'Phone Number (Customer Support)', name: 'store_phone', type: 'tel', placeholder: 'e.g. 08012345678' },
                            { label: 'Super Admin Phone Number (Enquiries)', name: 'super_admin_phone', type: 'tel', placeholder: 'e.g. 08012345678' }, // New input field
                            { label: 'Email Address', name: 'store_email', type: 'email', placeholder: 'e.g. info@mayorhub.com.ng' },
                            { label: 'Store Address', name: 'store_address', type: 'text', placeholder: 'e.g. 12 Market Street, Lagos' },
                            { label: 'Store Description', name: 'store_description', type: 'text', placeholder: 'e.g The simplest way to trade pre-owned smartphones, laptops, tablets, and accessories.' }
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium
                                      text-brand-charcoal mb-1">
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="w-full border border-gray-300 rounded-lg
                                 px-4 py-3 text-sm focus:outline-none
                                 focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Delivery Fees */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border
                border-gray-100 space-y-5">
                        <div>
                            <h2 className="font-semibold text-brand-charcoal">
                                🚚 Delivery Fees
                            </h2>
                            <p className="text-neutral-slate text-xs mt-1">
                                These fees are added to the customer's order total
                                based on their delivery zone
                            </p>
                        </div>

                        {[
                            {
                                label: 'Within Lagos',
                                name: 'delivery_fee_lagos',
                                description: 'Delivery within Lagos State',
                                icon: '🏙️',
                            },
                            {
                                label: 'Outside Lagos (Within Nigeria)',
                                name: 'delivery_fee_nigeria',
                                description: 'Delivery to other Nigerian states',
                                icon: '🇳🇬',
                            },
                            {
                                label: 'Outside Nigeria',
                                name: 'delivery_fee_outside',
                                description: 'International delivery',
                                icon: '✈️',
                            },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium
                        text-brand-charcoal mb-1">
                                    {field.icon} {field.label}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2
                         text-neutral-slate font-bold text-sm">
                                        ₦
                                    </span>
                                    <input
                                        type="number"
                                        name={field.name}
                                        value={form[field.name] || ''}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full border border-gray-300 rounded-lg
                     pl-8 pr-4 py-3 text-sm focus:outline-none
                     focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <p className="text-xs text-neutral-slate mt-1">
                                    {field.description}
                                </p>
                            </div>
                        ))}

                        {/* Preview */}
                        {(form.delivery_fee_lagos ||
                            form.delivery_fee_nigeria ||
                            form.delivery_fee_outside) ? (
                            <div className="bg-neutral-light rounded-xl p-4">
                                <p className="text-xs font-semibold text-neutral-slate
                   uppercase tracking-wider mb-3">
                                    Preview — what customers will see
                                </p>
                                {[
                                    {
                                        label: '🏙️ Within Lagos',
                                        value: form.delivery_fee_lagos
                                    },
                                    {
                                        label: '🇳🇬 Outside Lagos (Within Nigeria)',
                                        value: form.delivery_fee_nigeria
                                    },
                                    {
                                        label: '✈️ Outside Nigeria',
                                        value: form.delivery_fee_outside
                                    },
                                ].map((item) => (
                                    <div key={item.label}
                                        className="flex justify-between py-2 border-b
                        border-gray-200 last:border-0 text-sm">
                                        <span className="text-neutral-slate">{item.label}</span>
                                        <span className="font-bold text-brand-charcoal">
                                            {Number(item.value) === 0
                                                ? 'Free'
                                                : `₦${Number(item.value).toLocaleString()}`
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border
                              border-gray-100 space-y-5">
                        <h2 className="font-semibold text-brand-charcoal">
                            🏦 Bank Account Details
                        </h2>
                        <p className="text-neutral-slate text-xs -mt-2">
                            These details appear on the checkout payment page
                            for customers to make transfers to.
                        </p>

                        {[
                            { label: 'Bank Name', name: 'bank_name', placeholder: 'e.g. First Bank Nigeria' },
                            { label: 'Account Number', name: 'account_number', placeholder: 'e.g. 1234567890' },
                            { label: 'Account Name', name: 'account_name', placeholder: 'e.g. MayorHub Technologies' },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium
                                      text-brand-charcoal mb-1">
                                    {field.label}
                                </label>
                                <input
                                    type="text"
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="w-full border border-gray-300 rounded-lg
                                 px-4 py-3 text-sm focus:outline-none
                                 focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        ))}

                        {/* Preview */}
                        {(form.bank_name || form.account_number || form.account_name) && (
                            <div className="bg-neutral-light rounded-xl p-4 mt-2">
                                <p className="text-xs font-semibold text-neutral-slate
                                   uppercase tracking-wider mb-3">
                                    Preview — what customers will see
                                </p>
                                {[
                                    { label: 'Bank Name', value: form.bank_name },
                                    { label: 'Account Number', value: form.account_number },
                                    { label: 'Account Name', value: form.account_name },
                                ].map((item) => (
                                    <div key={item.label}
                                        className="flex justify-between py-2 border-b
                                      border-gray-200 last:border-0 text-sm">
                                        <span className="text-neutral-slate">{item.label}</span>
                                        <span className="font-bold text-brand-charcoal">
                                            {item.value || '—'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-primary hover:bg-primary-dark text-white
                           py-4 rounded-xl font-bold text-base transition-all
                           hover:scale-[1.01] disabled:opacity-50
                           disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>

                </form>
            </div>
        </AdminLayout>
    )

}

export default Settings