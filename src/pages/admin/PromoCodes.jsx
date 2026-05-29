// @ts-nocheck
import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { usePromoCodes } from '../../hooks/usePromoCodes'
import useSettings from '../../hooks/useSettings'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '',
    max_uses: '',
    expires_at: '',
}

const TYPE_LABELS = {
    percentage: { label: '% Percentage', color: 'bg-blue-100 text-blue-700' },
    fixed: { label: '₦ Fixed Amount', color: 'bg-purple-100 text-purple-700' },
    free_delivery: { label: '🚚 Free Delivery', color: 'bg-green-100 text-green-700' },
}

export default function PromoCodes() {
    const { codes, loading, createCode, updateCode,
        toggleActive, deleteCode, generateCode } = usePromoCodes()
    const { settings } = useSettings()

    const currency = settings?.currency_symbol || '₦'

    const [showModal, setShowModal] = useState(false)
    const [editingCode, setEditingCode] = useState(null)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [search, setSearch] = useState('')

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function openCreate() {
        setEditingCode(null)
        setForm(EMPTY_FORM)
        setShowModal(true)
    }

    function openEdit(code) {
        setEditingCode(code)
        setForm({
            code: code.code,
            description: code.description || '',
            discount_type: code.discount_type,
            discount_value: code.discount_value || '',
            min_order_amount: code.min_order_amount || '',
            max_uses: code.max_uses || '',
            expires_at: code.expires_at
                ? code.expires_at.slice(0, 10)
                : '',
        })
        setShowModal(true)
    }

    async function handleSave() {
        if (!form.code.trim()) return toast.error('Code is required')
        if (form.discount_type !== 'free_delivery' && !form.discount_value) {
            return toast.error('Discount value is required')
        }
        if (form.discount_type === 'percentage' && (isNaN(Number(form.discount_value)) || Number(form.discount_value) <= 0 || Number(form.discount_value) > 100)) {
            return toast.error('Percentage discount must be a valid number between 1 and 100')
        }

        setSaving(true)
        try {
            if (editingCode) {
                await updateCode(editingCode.id, form)
                toast.success('Promo code updated!')
            } else {
                await createCode(form)
                toast.success('Promo code created!')
            }
            setShowModal(false)
        } catch (err) {
            toast.error(err.message.includes('duplicate')
                ? 'This code already exists'
                : err.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleToggle(code) {
        try {
            await toggleActive(code.id, code.is_active)
            toast.success(code.is_active ? 'Code deactivated' : 'Code activated')
        } catch (err) {
            toast.error(err.message)
        }
    }

    async function handleDelete(code) {
        if (!window.confirm(
            `Delete promo code "${code.code}"? This cannot be undone.`
        )) return

        try {
            await deleteCode(code.id)
            toast.success('Promo code deleted')
        } catch (err) {
            toast.error(err.message)
        }
    }

    function formatDate(dateString) {
        if (!dateString) return '—'
        return new Date(dateString).toLocaleDateString('en-NG', {
            day: 'numeric', month: 'short', year: 'numeric'
        })
    }

    function isExpired(expiresAt) {
        if (!expiresAt) return false
        return new Date(expiresAt) < new Date()
    }

    const filtered = codes.filter(c =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    )

    // Stats
    const activeCount = codes.filter(c => c.is_active && !isExpired(c.expires_at)).length
    const totalUses = codes.reduce((sum, c) => sum + (c.used_count || 0), 0)
    const expiredCount = codes.filter(c => isExpired(c.expires_at)).length

    return (
        <AdminLayout>
            <div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-charcoal">
                            Promo Codes
                        </h1>
                        <p className="text-neutral-slate text-sm mt-1">
                            Create and manage discount codes for customers
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-primary hover:bg-primary-dark text-white
                       px-5 py-2.5 rounded-lg font-semibold text-sm
                       transition-all hover:scale-[1.02]"
                    >
                        + Create Code
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Active Codes', value: activeCount, color: 'text-primary' },
                        { label: 'Total Uses', value: totalUses, color: 'text-blue-600' },
                        { label: 'Expired Codes', value: expiredCount, color: 'text-neutral-slate' },
                    ].map(stat => (
                        <div key={stat.label}
                            className="bg-white rounded-xl p-4 shadow-sm border
                            border-gray-100 text-center">
                            <p className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                            </p>
                            <p className="text-neutral-slate text-xs mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100
                        p-4 mb-6">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2
                             text-neutral-slate">🔍</span>
                        <input
                            type="text" value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by code or description..."
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                         rounded-lg text-sm focus:outline-none
                         focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {loading ? (
                        <div className="p-8 space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i}
                                    className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>

                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-3">🎟️</p>
                            <p className="font-semibold text-brand-charcoal mb-1">
                                {search ? 'No codes found' : 'No promo codes yet'}
                            </p>
                            <p className="text-neutral-slate text-sm mb-6">
                                {search
                                    ? 'Try a different search term'
                                    : 'Create your first promo code to start offering discounts'
                                }
                            </p>
                            {!search && (
                                <button onClick={openCreate}
                                    className="bg-primary text-white px-6 py-2.5 rounded-lg
                             font-semibold text-sm transition-all">
                                    + Create First Code
                                </button>
                            )}
                        </div>

                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {['Code', 'Type', 'Discount', 'Min Order',
                                            'Uses', 'Expires', 'Status', 'Actions'].map(h => (
                                                <th key={h}
                                                    className="text-left px-6 py-4 text-xs font-bold
                                     text-neutral-slate uppercase tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map(code => {
                                        const expired = isExpired(code.expires_at)
                                        const typeInfo = TYPE_LABELS[code.discount_type] || {}

                                        return (
                                            <tr key={code.id}
                                                className="hover:bg-gray-50 transition-colors">

                                                {/* Code */}
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-mono font-bold text-brand-charcoal
                                          text-sm tracking-wider">
                                                            {code.code}
                                                        </p>
                                                        {code.description && (
                                                            <p className="text-neutral-slate text-xs mt-0.5">
                                                                {code.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Type */}
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full
                                            text-xs font-semibold
                                            ${typeInfo.color}`}>
                                                        {typeInfo.label}
                                                    </span>
                                                </td>

                                                {/* Discount Value */}
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-brand-charcoal text-sm">
                                                        {code.discount_type === 'percentage'
                                                            ? `${code.discount_value}% off`
                                                            : code.discount_type === 'fixed'
                                                                ? `${currency}${Number(code.discount_value)
                                                                    .toLocaleString()} off`
                                                                : 'Free Delivery'
                                                        }
                                                    </span>
                                                </td>

                                                {/* Min Order */}
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-neutral-slate">
                                                        {code.min_order_amount > 0
                                                            ? `${currency}${Number(code.min_order_amount)
                                                                .toLocaleString()}`
                                                            : 'None'
                                                        }
                                                    </span>
                                                </td>

                                                {/* Uses */}
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-brand-charcoal">
                                                        {code.used_count || 0}
                                                        {code.max_uses
                                                            ? ` / ${code.max_uses}`
                                                            : ' / ∞'
                                                        }
                                                    </span>
                                                </td>

                                                {/* Expires */}
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm
                            ${expired
                                                            ? 'text-red-500 font-medium'
                                                            : 'text-neutral-slate'
                                                        }`}>
                                                        {expired
                                                            ? '❌ Expired'
                                                            : formatDate(code.expires_at)
                                                        }
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full
                                            text-xs font-semibold
                            ${code.is_active && !expired
                                                            ? 'bg-primary-light text-primary-dark'
                                                            : 'bg-gray-100 text-neutral-slate'
                                                        }`}>
                                                        {expired
                                                            ? 'Expired'
                                                            : code.is_active ? 'Active' : 'Inactive'
                                                        }
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => openEdit(code)}
                                                            className="text-blue-600 hover:text-blue-800
                                         text-sm font-medium transition-colors">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleToggle(code)}
                                                            className={`text-sm font-medium transition-colors
                                ${code.is_active
                                                                    ? 'text-amber-600 hover:text-amber-800'
                                                                    : 'text-primary hover:text-primary-dark'
                                                                }`}>
                                                            {code.is_active ? 'Disable' : 'Enable'}
                                                        </button>
                                                        <button onClick={() => handleDelete(code)}
                                                            className="text-red-500 hover:text-red-700
                                         text-sm font-medium transition-colors">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* ── CREATE / EDIT MODAL ── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center
                        justify-center px-4 overflow-y-auto py-8">
                    <div className="bg-white rounded-2xl shadow-xl w-full
                          max-w-md p-6">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-brand-charcoal">
                                {editingCode ? 'Edit Promo Code' : 'Create Promo Code'}
                            </h2>
                            <button onClick={() => setShowModal(false)}
                                className="text-neutral-slate hover:text-brand-charcoal
                           text-xl transition-colors">
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">

                            {/* Code + Generate Button */}
                            <div>
                                <label className="block text-sm font-medium
                                  text-brand-charcoal mb-1">
                                    Promo Code *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text" name="code"
                                        value={form.code}
                                        onChange={e => setForm({
                                            ...form,
                                            code: e.target.value.toUpperCase()
                                        })}
                                        placeholder="e.g. SAVE20"
                                        className="flex-1 border border-gray-300 rounded-lg
                               px-4 py-3 text-sm focus:outline-none
                               focus:ring-2 focus:ring-primary
                               font-mono tracking-wider uppercase"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setForm({
                                            ...form, code: generateCode()
                                        })}
                                        className="bg-neutral-light hover:bg-gray-200 text-brand-charcoal
                               px-3 py-2 rounded-lg text-xs font-semibold
                               transition-all whitespace-nowrap"
                                    >
                                        🎲 Generate
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium
                                  text-brand-charcoal mb-1">
                                    Description
                                    <span className="text-neutral-slate font-normal ml-1">
                                        (internal note)
                                    </span>
                                </label>
                                <input
                                    type="text" name="description"
                                    value={form.description} onChange={handleChange}
                                    placeholder="e.g. New customer welcome discount"
                                    className="w-full border border-gray-300 rounded-lg
                             px-4 py-3 text-sm focus:outline-none
                             focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Discount Type */}
                            <div>
                                <label className="block text-sm font-medium
                                  text-brand-charcoal mb-2">
                                    Discount Type *
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: 'percentage', label: '% Off' },
                                        { value: 'fixed', label: `${currency} Off` },
                                        { value: 'free_delivery', label: '🚚 Free Del.' },
                                    ].map(type => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setForm({
                                                ...form,
                                                discount_type: type.value,
                                                discount_value: type.value === 'free_delivery'
                                                    ? '0' : form.discount_value
                                            })}
                                            className={`py-2.5 px-3 rounded-xl border-2 text-sm
                                  font-semibold transition-all text-center
                        ${form.discount_type === type.value
                                                    ? 'border-primary bg-primary-light text-primary'
                                                    : 'border-gray-200 text-neutral-slate hover:border-gray-300'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Discount Value — hidden for free delivery */}
                            {form.discount_type !== 'free_delivery' && (
                                <div>
                                    <label className="block text-sm font-medium
                                    text-brand-charcoal mb-1">
                                        {form.discount_type === 'percentage'
                                            ? 'Percentage (%) *'
                                            : `Amount (${currency}) *`
                                        }
                                    </label>
                                    <input
                                        type="number" name="discount_value"
                                        value={form.discount_value} onChange={handleChange}
                                        placeholder={form.discount_type === 'percentage'
                                            ? 'e.g. 15' : 'e.g. 5000'}
                                        min="0"
                                        max={form.discount_type === 'percentage' ? '100' : undefined}
                                        className="w-full border border-gray-300 rounded-lg
                               px-4 py-3 text-sm focus:outline-none
                               focus:ring-2 focus:ring-primary"
                                    />
                                    {form.discount_type === 'percentage' && (
                                        <p className="text-xs text-neutral-slate mt-1">
                                            Enter a number between 1 and 100
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Min Order Amount */}
                            <div>
                                <label className="block text-sm font-medium
                                  text-brand-charcoal mb-1">
                                    Minimum Order Amount
                                    <span className="text-neutral-slate font-normal ml-1">
                                        (optional)
                                    </span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2
                                   text-neutral-slate font-bold text-sm">
                                        {currency}
                                    </span>
                                    <input
                                        type="number" name="min_order_amount"
                                        value={form.min_order_amount} onChange={handleChange}
                                        placeholder="0 = no minimum"
                                        min="0"
                                        className="w-full border border-gray-300 rounded-lg
                               pl-8 pr-4 py-3 text-sm focus:outline-none
                               focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Max Uses */}
                            <div>
                                <label className="block text-sm font-medium
                                  text-brand-charcoal mb-1">
                                    Maximum Uses
                                    <span className="text-neutral-slate font-normal ml-1">
                                        (optional — leave empty for unlimited)
                                    </span>
                                </label>
                                <input
                                    type="number" name="max_uses"
                                    value={form.max_uses} onChange={handleChange}
                                    placeholder="e.g. 100"
                                    min="1"
                                    className="w-full border border-gray-300 rounded-lg
                             px-4 py-3 text-sm focus:outline-none
                             focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Expiry Date */}
                            <div>
                                <label className="block text-sm font-medium
                                  text-brand-charcoal mb-1">
                                    Expiry Date
                                    <span className="text-neutral-slate font-normal ml-1">
                                        (optional — leave empty for no expiry)
                                    </span>
                                </label>
                                <input
                                    type="date" name="expires_at"
                                    value={form.expires_at} onChange={handleChange}
                                    min={new Date().toISOString().slice(0, 10)}
                                    className="w-full border border-gray-300 rounded-lg
                             px-4 py-3 text-sm focus:outline-none
                             focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Preview */}
                            {form.code && (
                                <div className="bg-primary-light rounded-xl p-4">
                                    <p className="text-xs font-semibold text-neutral-slate
                                uppercase tracking-wider mb-2">
                                        Preview
                                    </p>
                                    <p className="font-mono font-bold text-primary text-lg
                                tracking-wider">
                                        {form.code}
                                    </p>
                                    <p className="text-primary-dark text-sm mt-1">
                                        {form.discount_type === 'free_delivery'
                                            ? 'Free delivery on any order'
                                            : form.discount_type === 'percentage'
                                                ? `${form.discount_value || 0}% off`
                                                : `${currency}${Number(form.discount_value || 0)
                                                    .toLocaleString()} off`
                                        }
                                        {form.min_order_amount > 0
                                            ? ` — minimum order ${currency}${Number(
                                                form.min_order_amount).toLocaleString()}`
                                            : ''
                                        }
                                    </p>
                                    {form.expires_at && (
                                        <p className="text-neutral-slate text-xs mt-1">
                                            Expires {new Date(form.expires_at)
                                                .toLocaleDateString('en-NG', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                        </p>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Modal Actions */}
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)}
                                className="flex-1 border border-gray-300 text-neutral-slate
                           hover:text-brand-charcoal py-3 rounded-xl
                           font-semibold text-sm transition-all">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-1 bg-primary hover:bg-primary-dark text-white
                           py-3 rounded-xl font-bold text-sm transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving
                                    ? 'Saving...'
                                    : editingCode ? 'Save Changes' : 'Create Code'
                                }
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </AdminLayout>
    )
}