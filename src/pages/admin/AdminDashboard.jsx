// @ts-nocheck
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        revenue: 0, orders: 0, customers: 0, lowStock: 0,
    })
    const [recentOrders, setRecentOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const STATUS_STYLES = {
        pending: 'bg-amber-100 text-amber-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-primary-light text-primary-dark',
        cancelled: 'bg-red-100 text-red-600',
    }

    useEffect(() => {
        async function fetchStats() {
            const [ordersRes, customersRes, productsRes, recentRes] =
                await Promise.all([
                    supabase.from('orders').select('total, payment_status, created_at'),
                        // .eq('payment_status', 'paid').order('created_at', { ascending: false, })
                    supabase.from('profiles').select('id').eq('role', 'customer'),
                    supabase.from('products').select('stock, low_stock_threshold')
                        .eq('is_active', true),
                    supabase.from('orders')
                        .select('id, customer_name, total, status, created_at')
                        .order('created_at', { ascending: false })
                        .limit(5),
                ])

            // const revenue = ordersRes.data
            //     ?.filter(o => o.payment_status === 'paid')
            //     .reduce((sum, o) => sum + Number(o.total), 0) || 0
            const now = new Date()

            const revenue = ordersRes.data
                ?.filter((o) => {
                    const orderDate = new Date(o.created_at)

                    return (
                        o.payment_status === 'paid' &&
                        orderDate.getMonth() === now.getMonth() &&
                        orderDate.getFullYear() === now.getFullYear()
                    )
                })
                .reduce((sum, o) => sum + Number(o.total), 0) || 0

            const lowStock = productsRes.data
                ?.filter(p => p.stock <= p.low_stock_threshold).length || 0

            setStats({
                revenue,
                orders: ordersRes.data?.length || 0,
                customers: customersRes.data?.length || 0,
                lowStock,
            })
            setRecentOrders(recentRes.data || [])
            setLoading(false)
        }
        fetchStats()
    }, [])

    const statCards = [
        { label: 'Revenue This Month', value: `₦${stats.revenue.toLocaleString()}`, icon: '💰', color: 'text-primary' },
        { label: 'Total Orders', value: stats.orders, icon: '🛒', color: 'text-blue-600' },
        { label: 'Total Customers', value: stats.customers, icon: '👥', color: 'text-purple-600' },
        { label: 'Low Stock Items', value: stats.lowStock, icon: '⚠️', color: 'text-amber-600' },
    ]

    return (
        <AdminLayout>
            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-brand-charcoal">Dashboard</h1>
                    <p className="text-neutral-slate text-sm mt-1">
                        Welcome back — here's what's happening in your store
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
                        gap-6 mb-8">
                    {statCards.map((stat) => (
                        <div key={stat.label}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-neutral-slate text-sm">{stat.label}</p>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                            {loading ? (
                                <div className="h-8 bg-gray-100 rounded animate-pulse w-1/2" />
                            ) : (
                                <p className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-brand-charcoal">
                            Recent Orders
                        </h2>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="text-primary text-sm font-semibold hover:underline"
                        >
                            View All →
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i}
                                    className="h-12 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-3xl mb-2">🛒</p>
                            <p className="text-neutral-slate text-sm">
                                No orders yet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                    className="flex items-center justify-between py-3
                             border-b border-gray-50 last:border-0
                             hover:bg-gray-50 px-2 rounded-lg
                             cursor-pointer transition-colors"
                                >
                                    <div>
                                        <p className="font-mono font-bold text-sm text-brand-charcoal">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-neutral-slate">
                                            {order.customer_name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary text-sm">
                                            ₦{Number(order.total).toLocaleString()}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full
                                      font-semibold capitalize
                      ${STATUS_STYLES[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}