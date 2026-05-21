// @ts-nocheck
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '../../components/common/Layout'
import { useCustomerOrders } from '../../hooks/useCustomerOrders'

const STATUS_STYLES = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-primary-light text-primary-dark',
    cancelled: 'bg-red-100 text-red-600',
}

export default function MyOrders() {
    const { orders, loading } = useCustomerOrders()
    const navigate = useNavigate()

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-NG', {
            day: 'numeric', month: 'short', year: 'numeric',
        })
    }

      // Scroll to top on component mount
        useEffect(() => {
            window.scrollTo(0, 0);
        }, []);
    

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-brand-charcoal">
                        My Orders
                    </h1>
                    <p className="text-neutral-slate text-sm mt-1">
                        Track and manage all your orders
                    </p>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i}
                                className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>

                    /* Empty State */
                ) : orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">📦</p>
                        <h2 className="text-xl font-bold text-brand-charcoal mb-2">
                            No orders yet
                        </h2>
                        <p className="text-neutral-slate text-sm mb-8">
                            You haven't placed any orders yet.
                            Start shopping to see your orders here.
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-primary hover:bg-primary-dark text-white
                         px-8 py-3 rounded-lg font-semibold transition-all"
                        >
                            Start Shopping
                        </button>
                    </div>

                    /* Orders List */
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className="bg-white rounded-xl p-6 shadow-sm border
                           border-gray-100 hover:shadow-md hover:border-primary
                           transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4">

                                    {/* Order Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className="font-mono font-bold text-brand-charcoal">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </span>
                                            <span className={`text-xs px-2.5 py-1 rounded-full
                                        font-semibold capitalize
                        ${STATUS_STYLES[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <p className="text-neutral-slate text-sm mb-3">
                                            {formatDate(order.created_at)} •{' '}
                                            {order.order_items?.length} item
                                            {order.order_items?.length !== 1 ? 's' : ''} •{' '}
                                            {order.delivery_method === 'delivery'
                                                ? '🚚 Delivery'
                                                : '🏪 Pickup'
                                            }
                                        </p>

                                        {/* Product Images Preview */}
                                        <div className="flex gap-2">
                                            {order.order_items?.slice(0, 4).map((item, i) => (
                                                <div key={i}
                                                    className="w-12 h-12 rounded-lg bg-neutral-light
                                        overflow-hidden shrink-0">
                                                    {item.products?.cover_image ? (
                                                        <img
                                                            src={item.products.cover_image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center
                                            justify-center text-lg">
                                                            📦
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {order.order_items?.length > 4 && (
                                                <div className="w-12 h-12 rounded-lg bg-neutral-light
                                        flex items-center justify-center
                                        text-xs font-bold text-neutral-slate">
                                                    +{order.order_items.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Total + Arrow */}
                                    <div className="text-right shrink-0">
                                        <p className="text-xl font-extrabold text-primary mb-1">
                                            ₦{Number(order.total).toLocaleString()}
                                        </p>
                                        <p className="text-neutral-slate text-xs">
                                            View Details →
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}