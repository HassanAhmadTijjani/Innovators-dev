/* eslint-disable no-unused-vars */
// @ts-nocheck
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const ROLE_STYLES = {
    staff: 'bg-blue-100 text-blue-700',
    admin: 'bg-purple-100 text-purple-700',
}

export default function Staff() {
    const [staffList, setStaffList] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingStaff, setEditingStaff] = useState(null)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        fullName: '', email: '', password: '',
        phone: '', role: 'staff',
    })

    useEffect(() => { fetchStaff() }, [])

    async function fetchStaff() {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .in('role', ['staff', 'admin'])
            .order('created_at', { ascending: false })

        if (!error && data) setStaffList(data)
        setLoading(false)
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function openAddModal() {
        setEditingStaff(null)
        setForm({ fullName: '', email: '', password: '', phone: '', role: 'staff' })
        setShowModal(true)
    }

    function openEditModal(staff) {
        setEditingStaff(staff)
        setForm({
            fullName: staff.full_name || '',
            email: staff.email || '',
            password: '',
            phone: staff.phone || '',
            role: staff.role || 'staff',
        })
        setShowModal(true)
    }

    async function handleSave() {
        if (!form.fullName) return toast.error('Full name is required')
        if (!editingStaff && !form.email) return toast.error('Email is required')
        if (!editingStaff && !form.password) return toast.error('Password is required')
        if (!editingStaff && form.password.length < 6) {
            return toast.error('Password must be at least 6 characters')
        }

        setSaving(true)

        try {
            if (editingStaff) {
                // update existing staff
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: form.fullName,
                        phone: form.phone,
                        role: form.role,
                    })
                    .eq('id', editingStaff.id)

                if (error) throw error
                toast.success('Staff updated successfully')

            } else {
                // create new staff via edge function
                const { data: { session } } = await supabase.auth.getSession()

                const response = await supabase.functions.invoke('create-staff', {
                    body: {
                        fullName: form.fullName,
                        email: form.email,
                        password: form.password,
                        phone: form.phone,
                        role: form.role,
                    },
                })

                if (response.error) throw new Error(response.error.message)
                toast.success('Staff account created successfully')
            }

            setShowModal(false)
            await fetchStaff()

        } catch (err) {
            toast.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleToggleActive(staff) {
        const confirmed = window.confirm(
            staff.is_active
                ? 'Are you sure you want to deactivate this staff member?'
                : 'Are you sure you want to activate this staff member?'
        )
        if (!confirmed) return
        const { error } = await supabase
            .from('profiles')
            .update({ is_active: !staff.is_active })
            .eq('id', staff.id)

        if (error) {
            toast.error('Failed to update status: ' + error.message)
            return
        }

        toast.success(
            staff.is_active ? 'Staff deactivated' : 'Staff activated'
        )
        await fetchStaff()
    }

    async function handleDelete(staff) {
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete ${staff.full_name}? This cannot be undone.`
        )
        if (!confirmed) return

        try {
            const response = await supabase.functions.invoke('delete-staff', {
                body: { staffId: staff.id },
            })

            if (response.error) throw new Error(response.error.message)

            toast.success('Staff member deleted successfully')
            await fetchStaff()

        } catch (err) {
            toast.error('Failed to delete: ' + err.message)
        }
      }

    const filtered = staffList.filter(s =>
        s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.includes(search)
    )

    return (
        <AdminLayout>
            <div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-charcoal">
                            Staff Management
                        </h1>
                        <p className="text-neutral-slate text-sm mt-1">
                            {staffList.length} staff member{staffList.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="bg-primary hover:bg-primary-dark text-white px-5
                       py-2.5 rounded-lg font-semibold text-sm transition-all
                       hover:scale-[1.02]"
                    >
                        + Add Staff
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100
                        p-4 mb-6">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2
                             text-neutral-slate">🔍</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email or phone..."
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                         rounded-lg text-sm focus:outline-none
                         focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Staff Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {loading ? (
                        <div className="p-8 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i}
                                    className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>

                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-3">👨‍💼</p>
                            <p className="font-semibold text-brand-charcoal mb-1">
                                {search ? 'No staff found' : 'No staff members yet'}
                            </p>
                            <p className="text-neutral-slate text-sm mb-6">
                                {search
                                    ? 'Try a different search term'
                                    : 'Add your first staff member to get started'
                                }
                            </p>
                            {!search && (
                                <button
                                    onClick={openAddModal}
                                    className="bg-primary hover:bg-primary-dark text-white
                             px-6 py-2.5 rounded-lg font-semibold text-sm
                             transition-all"
                                >
                                    + Add First Staff
                                </button>
                            )}
                        </div>

                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {[
                                            'Staff Member', 'Email', 'Phone',
                                            'Role', 'Status', 'Actions'
                                        ].map((h) => (
                                            <th key={h}
                                                className="text-left px-6 py-4 text-xs font-bold
                                     text-neutral-slate uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map((staff) => (
                                        <tr key={staff.id}
                                            className="hover:bg-gray-50 transition-colors">

                                            {/* Name + Avatar */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary
                                          flex items-center justify-center
                                          text-white font-bold text-sm shrink-0">
                                                        {staff.full_name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <p className="font-medium text-brand-charcoal text-sm">
                                                        {staff.full_name || '—'}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-neutral-slate">
                                                    {staff.email}
                                                </span>
                                            </td>

                                            {/* Phone */}
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-neutral-slate">
                                                    {staff.phone || '—'}
                                                </span>
                                            </td>

                                            {/* Role Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full
                                          text-xs font-semibold capitalize
                          ${ROLE_STYLES[staff.role] || 'bg-gray-100 text-gray-600'}`}>
                                                    {staff.role}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full
                                          text-xs font-semibold
                          ${staff.is_active
                                                        ? 'bg-primary-light text-primary-dark'
                                                        : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {staff.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => openEditModal(staff)}
                                                        className="text-blue-600 hover:text-blue-800
                                       text-sm font-medium transition-colors"
                                                    >
                                                        Edit
                                                    </button>

                                                    {/* Activate / Deactivate */}
                                                    <button
                                                        onClick={() => handleToggleActive(staff)}
                                                        className={`text-sm font-medium transition-colors
                              ${staff.is_active
                                                                ? 'text-amber-600 hover:text-amber-800'
                                                                : 'text-primary hover:text-primary-dark'
                                                            }`}
                                                    >
                                                        {staff.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDelete(staff)}
                                                        className="text-red-500 hover:text-red-700
                                       text-sm font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center
                        justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-brand-charcoal">
                                {editingStaff ? 'Edit Staff Member' : 'Add New Staff'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-neutral-slate hover:text-brand-charcoal
                           text-xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium
                                  text-brand-charcoal mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="w-full border border-gray-300 rounded-lg
                             px-4 py-3 text-sm focus:outline-none
                             focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Email only shown when adding new staff */}
                            {!editingStaff && (
                                <div>
                                    <label className="block text-sm font-medium
                                    text-brand-charcoal mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        className="w-full border border-gray-300 rounded-lg
                               px-4 py-3 text-sm focus:outline-none
                               focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            )}

                            {/* Password only shown when adding new staff */}
                            {!editingStaff && (
                                <div>
                                    <label className="block text-sm font-medium
                                    text-brand-charcoal mb-1">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Minimum 6 characters"
                                        className="w-full border border-gray-300 rounded-lg
                               px-4 py-3 text-sm focus:outline-none
                               focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            )}

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
                                    className="w-full border border-gray-300 rounded-lg
                             px-4 py-3 text-sm focus:outline-none
                             focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium
                                  text-brand-charcoal mb-1">
                                    Role *
                                </label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg
                             px-4 py-3 text-sm focus:outline-none
                             focus:ring-2 focus:ring-primary bg-white"
                                >
                                    {/* <option value="staff">Staff — Orders & POS</option> */}
                                    <option value="admin">Staff — Limited Access </option>
                                </select>
                                <p className="text-xs text-neutral-slate mt-1">
                                    {form.role === 'admin'
                                        ? 'Admin can manage products, orders, customers and promos'
                                        : 'Staff can manage orders and record walk-in sales'
                                    }
                                </p>
                            </div>

                        </div>

                        {/* Modal Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 border border-gray-300 text-neutral-slate
                           hover:text-brand-charcoal py-3 rounded-xl
                           font-semibold text-sm transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-primary hover:bg-primary-dark text-white
                           py-3 rounded-xl font-bold text-sm transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving
                                    ? 'Saving...'
                                    : editingStaff ? 'Save Changes' : 'Create Staff'
                                }
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </AdminLayout>
    )
}