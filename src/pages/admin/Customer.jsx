// @ts-nocheck
import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'

const Customer = () => {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        setLoading(true)

        // fetch a;l customers
        const { data, error } = await supabase.from('profiles').select(`*, orders (id)`).eq('role', 'customer').order('created_at', { ascending: false })
        if (!error && data) setCustomers(data)
        setLoading(false)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', })
    }

    // search customer
    const filtered = customers.filter(c => c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search))
    return (
        <AdminLayout>
            <div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-charcoal">
                            Customers
                        </h1>
                        <p className="text-neutral-slate text-sm mt-1">
                            {customers.length} registered customer
                            {customers.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100
                      p-4 mb-6">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2
                           text-neutral-slate">
                            🔍
                        </span>
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

                {/* Customers Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">

                    {loading ? (
                        <div className="p-8 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i}
                                    className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>

                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-3">👥</p>
                            <p className="font-semibold text-brand-charcoal mb-1">
                                {search ? 'No customers found' : 'No customers yet'}
                            </p>
                            <p className="text-neutral-slate text-sm">
                                {search
                                    ? 'Try a different search term'
                                    : 'Customers will appear here once they register'
                                }
                            </p>
                        </div>

                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {[
                                            'Customer', 'Email', 'Phone',
                                            'Joined', 'Orders', 'Status'
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
                                    {filtered.map((customer) => (
                                        <tr key={customer.id}
                                            className="hover:bg-gray-50 transition-colors">

                                            {/* Customer Name + Avatar */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary
                                        flex items-center justify-center
                                        text-white font-bold text-sm
                                        shrink-0">
                                                        {customer.full_name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <p className="font-medium text-brand-charcoal text-sm">
                                                        {customer.full_name || '—'}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-neutral-slate">
                                                    {customer.email}
                                                </span>
                                            </td>

                                            {/* Phone */}
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-neutral-slate">
                                                    {customer.phone || '—'}
                                                </span>
                                            </td>

                                            {/* Joined Date */}
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-neutral-slate">
                                                    {formatDate(customer.created_at)}
                                                </span>
                                            </td>

                                            {/* Order Count */}
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-semibold
                        ${customer.orders?.length > 0
                                                        ? 'text-primary'
                                                        : 'text-neutral-slate'
                                                    }`}>
                                                    {customer.orders?.length || 0} order
                                                    {customer.orders?.length !== 1 ? 's' : ''}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full
                                        text-xs font-semibold
                        ${customer.is_active
                                                        ? 'bg-primary-light text-primary-dark'
                                                        : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {customer.is_active ? 'Active' : 'Suspended'}
                                                </span>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>)
}

export default Customer