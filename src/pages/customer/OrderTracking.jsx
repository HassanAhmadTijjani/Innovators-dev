// @ts-nocheck
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import { useCustomerOrders } from '../../hooks/useCustomerOrders'

// Order status steps in order
const ORDER_STEPS = [
    {
        key: 'pending',
        label: 'Order Placed',
        desc: 'Your order has been received',
        icon: '📋',
    },
    {
        key: 'processing',
        label: 'Processing',
        desc: 'Your order is being prepared',
        icon: '⚙️',
    },
    {
        key: 'shipped',
        label: 'Shipped',
        desc: 'Your order is on the way',
        icon: '🚚',
    },
    {
        key: 'delivered',
        label: 'Delivered',
        desc: 'Your order has been delivered',
        icon: '✅',
    },
]

// for pickup orders
const PICKUP_STEPS = [
    {
        key: 'pending',
        label: 'Order Placed',
        desc: 'Your order has been received',
        icon: '📋',
    },
    {
        key: 'processing',
        label: 'Processing',
        desc: 'Your order is being prepared',
        icon: '⚙️',
    },
    {
        key: 'delivered',
        label: 'Ready for Pickup',
        desc: 'Come collect your order at the store',
        icon: '🏪',
    },
]

const STATUS_STYLES = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-primary-light text-primary-dark',
    cancelled: 'bg-red-100 text-red-600',
}

// get the step index for a given status
function getStepIndex(status, steps) {
    if (status === 'cancelled') return -1
    return steps.findIndex(s => s.key === status)
}

export default function OrderTracking() {
    const { id } = useParams()
    const { fetchOrderById } = useCustomerOrders()
    const navigate = useNavigate()

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function load() {
            try {
                // window.scrollTo(0, 0)
                const data = await fetchOrderById(id)
                setOrder(data)
            } catch {
                setError('Order not found')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [fetchOrderById, id])

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-NG', {
            day: 'numeric', month: 'long',
            year: 'numeric', hour: '2-digit', minute: '2-digit',
        })
    }

    // Loading
    if (loading) return (
        <Layout>
            <div className="max-w-3xl mx-auto px-6 py-10 space-y-4 animate-pulse">
                <div className="h-8  bg-gray-100 rounded w-1/3" />
                <div className="h-32 bg-gray-100 rounded-xl" />
                <div className="h-48 bg-gray-100 rounded-xl" />
            </div>
        </Layout>
    )

    // Error
    if (error) return (
        <Layout>
            <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                <p className="text-5xl mb-4">😕</p>
                <h1 className="text-xl font-bold text-brand-charcoal mb-2">
                    {error}
                </h1>
                <button
                    onClick={() => navigate('/orders')}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg
                     font-semibold text-sm mt-4"
                >
                    Back to My Orders
                </button>
            </div>
        </Layout>
    )

    const isCancelled = order.status === 'cancelled'
    const steps = order.delivery_method === 'pickup'
        ? PICKUP_STEPS
        : ORDER_STEPS
    const currentStep = getStepIndex(order.status, steps)

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="text-neutral-slate hover:text-brand-charcoal
                       transition-colors"
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-charcoal">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                        </h1>
                        <p className="text-neutral-slate text-sm mt-0.5">
                            Placed on {formatDate(order.created_at)}
                        </p>
                    </div>
                    <span className={`ml-auto text-xs px-3 py-1.5 rounded-full
                            font-semibold capitalize shrink-0
            ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                    </span>
                </div>

                {/* Order Progress Tracker */}
                {!isCancelled ? (
                    <div className="bg-white rounded-xl p-6 shadow-sm border
                          border-gray-100 mb-6">
                        <h2 className="font-semibold text-brand-charcoal mb-6">
                            Order Progress
                        </h2>
                        <div className="flex items-start justify-between relative">

                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 right-0 h-0.5
                              bg-gray-200 mx-8 z-0">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{
                                        width: currentStep <= 0
                                            ? '0%'
                                            : `${(currentStep / (steps.length - 1)) * 100}%`
                                    }}
                                />
                            </div>

                            {steps.map((step, index) => {
                                const isCompleted = index < currentStep
                                const isCurrent = index === currentStep
                                const isFuture = index > currentStep

                                return (
                                    <div key={step.key}
                                        className="flex flex-col items-center z-10 flex-1">

                                        {/* Step Circle */}
                                        <div className={`w-10 h-10 rounded-full flex items-center
                                    justify-center text-lg mb-2 transition-all
                                    border-2
                      ${isCompleted
                                                ? 'bg-primary border-primary'
                                                : isCurrent
                                                    ? 'bg-white border-primary ring-4 ring-primary-light'
                                                    : 'bg-white border-gray-200'
                                            }`}>
                                            {isCompleted
                                                ? <span className="text-white text-sm font-bold">✓</span>
                                                : <span className={isFuture ? 'opacity-40' : ''}>
                                                    {step.icon}
                                                </span>
                                            }
                                        </div>

                                        {/* Step Label */}
                                        <p className={`text-xs font-semibold text-center
                                   leading-tight max-w-17.5
                      ${isCompleted || isCurrent
                                                ? 'text-primary'
                                                : 'text-neutral-slate'
                                            }`}>
                                            {step.label}
                                        </p>

                                        {/* Step Description */}
                                        <p className="text-xs text-neutral-slate text-center
                                  leading-tight max-w-20 mt-0.5 hidden sm:block">
                                            {step.desc}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                ) : (
                    /* Cancelled State */
                    <div className="bg-red-50 border border-red-200 rounded-xl
                          p-6 mb-6 text-center">
                        <p className="text-3xl mb-2">❌</p>
                        <p className="font-bold text-red-700 mb-1">Order Cancelled</p>
                        <p className="text-red-600 text-sm">
                            This order has been cancelled.
                            Contact us if you have any questions.
                        </p>
                    </div>
                )}

                {/* Delivery Info */}
                <div className="bg-white rounded-xl p-6 shadow-sm border
                        border-gray-100 mb-6">
                    <h2 className="font-semibold text-brand-charcoal mb-4">
                        Delivery Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {[
                            { label: 'Name', value: order.customer_name },
                            { label: 'Phone', value: order.customer_phone },
                            {
                                label: 'Method',
                                value: order.delivery_method === 'delivery'
                                    ? '🚚 Home Delivery'
                                    : '🏪 Store Pickup'
                            },
                            ...(order.delivery_method === 'delivery' ? [{
                                label: 'Address',
                                value: order.address
                            }] : []),
                        ].map((info) => (
                            <div key={info.label}>
                                <p className="text-neutral-slate text-xs mb-0.5">
                                    {info.label}
                                </p>
                                <p className="font-medium text-brand-charcoal">
                                    {info.value || '—'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl p-6 shadow-sm border
                        border-gray-100 mb-6">
                    <h2 className="font-semibold text-brand-charcoal mb-4">
                        Items Ordered ({order.order_items?.length})
                    </h2>
                    <div className="space-y-4">
                        {order.order_items?.map((item) => (
                            <div key={item.id}
                                className="flex items-center gap-4 py-3 border-b
                              border-gray-50 last:border-0">
                                <div className="w-14 h-14 rounded-lg bg-neutral-light
                                overflow-hidden shrink-0">
                                    {item.products?.cover_image ? (
                                        <img
                                            src={item.products.cover_image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center
                                    justify-center text-xl">
                                            📦
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-brand-charcoal text-sm
                                line-clamp-1">
                                        {item.name}
                                    </p>
                                    {/* ✅ Show color */}
                                    {item.selected_color && (
                                        <span className="inline-flex items-center gap-1 mt-0.5 bg-primary-light
                     text-primary-dark text-xs px-2 py-0.5 rounded-full
                     font-medium">
                                             {item.selected_color}
                                        </span>
                                    )}

                                    <p className="text-neutral-slate text-xs mt-0.5">
                                        ₦{Number(item.price).toLocaleString()} × {item.quantity}
                                    </p>
                                </div>
                                <p className="font-bold text-brand-charcoal text-sm
                               shrink-0">
                                    ₦{Number(item.subtotal).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-xl p-6 shadow-sm border
                        border-gray-100 mb-8">
                    <h2 className="font-semibold text-brand-charcoal mb-4">
                        Price Summary
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-neutral-slate">Subtotal</span>
                            <span className="font-medium text-brand-charcoal">
                                ₦{Number(order.subtotal).toLocaleString()}
                            </span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between">
                                <span className="text-primary">Discount</span>
                                <span className="font-medium text-primary">
                                    − ₦{Number(order.discount).toLocaleString()}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="text-neutral-slate">Delivery</span>
                            <span className="font-medium text-brand-charcoal">
                                {Number(order.delivery_fee) === 0
                                    ? order.delivery_method === 'pickup'
                                        ? 'Free (Pickup)'
                                        : 'Free'
                                    : `₦${Number(order.delivery_fee).toLocaleString()}`
                                }
                            </span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between">
                            <span className="font-bold text-brand-charcoal">Total</span>
                            <span className="font-extrabold text-primary text-xl">
                                ₦{Number(order.total).toLocaleString()}
                            </span>
                        </div>
                        
                        
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        to="/orders"
                        className="flex-1 border border-gray-300 text-neutral-slate
                       hover:text-brand-charcoal py-3 rounded-xl
                       font-semibold text-sm text-center transition-all"
                    >
                        ← All Orders
                    </Link>
                    <Link
                        to="/shop"
                        className="flex-1 bg-primary hover:bg-primary-dark text-white
                       py-3 rounded-xl font-bold text-sm text-center
                       transition-all"
                    >
                        Continue Shopping
                    </Link>
                </div>

            </div>
        </Layout>
    )
}