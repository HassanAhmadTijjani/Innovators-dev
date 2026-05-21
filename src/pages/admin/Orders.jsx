// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useOrders } from '../../hooks/useOrders'

const Orders = () => {
    const STATUS_TABS = [
        { label: 'All', value: '' },
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
    ]

    const STATUS_STYLES = {
        pending: 'bg-amber-100 text-amber-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-primary-light text-primary-dark',
        cancelled: 'bg-red-100 text-red-600',
    }
    
    const { orders, loading, fetchOrders } = useOrders()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('')

    function handleTabChange(value) {
        setActiveTab(value)
        fetchOrders(value)
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-NG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }

  return (
      <AdminLayout>
          <div>

              {/* Header */}
              <div className="mb-8">
                  <h1 className="text-2xl font-bold text-brand-charcoal">Orders</h1>
                  <p className="text-neutral-slate text-sm mt-1">
                      Manage and track all customer orders
                  </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                  {STATUS_TABS.map((tab) => (
                      <button
                          key={tab.value}
                          onClick={() => handleTabChange(tab.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium
                          transition-all
                ${activeTab === tab.value
                                  ? 'bg-primary text-white'
                                  : 'bg-white text-neutral-slate border border-gray-200 hover:border-primary hover:text-primary'
                              }`}
                      >
                          {tab.label}
                      </button>
                  ))}
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">

                  {loading ? (
                      <div className="p-8 space-y-4">
                          {[...Array(5)].map((_, i) => (
                              <div key={i}
                                  className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                          ))}
                      </div>

                  ) : orders.length === 0 ? (
                      <div className="text-center py-16">
                          <p className="text-4xl mb-3">📭</p>
                          <p className="font-semibold text-brand-charcoal mb-1">
                              No orders found
                          </p>
                          <p className="text-neutral-slate text-sm">
                              {activeTab
                                  ? `No ${activeTab} orders at the moment`
                                  : 'Orders will appear here once customers start buying'
                              }
                          </p>
                      </div>

                  ) : (
                      <div className="overflow-x-auto">
                          <table className="w-full">
                              <thead>
                                  <tr className="border-b border-gray-100">
                                      {[
                                          'Order ID', 'Customer', 'Date',
                                          'Items', 'Total', 'Method', 'Status', 'Action'
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
                                  {orders.map((order) => (
                                      <tr key={order.id}
                                          className="hover:bg-gray-50 transition-colors">

                                          {/* Order ID */}
                                          <td className="px-6 py-4">
                                              <span className="font-mono text-sm font-bold
                                         text-brand-charcoal">
                                                  #{order.id.slice(0, 8).toUpperCase()}
                                              </span>
                                          </td>

                                          {/* Customer */}
                                          <td className="px-6 py-4">
                                              <p className="text-sm font-medium text-brand-charcoal">
                                                  {order.customer_name}
                                              </p>
                                              <p className="text-xs text-neutral-slate">
                                                  {order.customer_phone}
                                              </p>
                                          </td>

                                          {/* Date */}
                                          <td className="px-6 py-4">
                                              <span className="text-sm text-neutral-slate">
                                                  {formatDate(order.created_at)}
                                              </span>
                                          </td>

                                          {/* Items Count */}
                                          <td className="px-6 py-4">
                                              <span className="text-sm text-brand-charcoal">
                                                  {order.order_items?.length} item
                                                  {order.order_items?.length !== 1 ? 's' : ''}
                                              </span>
                                          </td>

                                          {/* Total */}
                                          <td className="px-6 py-4">
                                              <span className="text-sm font-bold text-primary">
                                                  ₦{Number(order.total).toLocaleString()}
                                              </span>
                                          </td>

                                          {/* Delivery Method */}
                                          <td className="px-6 py-4">
                                              <span className="text-sm text-neutral-slate capitalize">
                                                  {order.delivery_method === 'delivery'
                                                      ? '🚚 Delivery'
                                                      : '🏪 Pickup'
                                                  }
                                              </span>
                                          </td>

                                          {/* Status Badge */}
                                          <td className="px-6 py-4">
                                              <span className={`inline-flex px-2.5 py-1 rounded-full
                                          text-xs font-semibold capitalize
                          ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}
                        `}>
                                                  {order.status}
                                              </span>
                                          </td>

                                          {/* Action */}
                                          <td className="px-6 py-4">
                                              <button
                                                  onClick={() =>
                                                      navigate(`/admin/orders/${order.id}`)
                                                  }
                                                  className="text-blue-600 hover:text-blue-800
                                     text-sm font-medium transition-colors"
                                              >
                                                  View →
                                              </button>
                                          </td>

                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}
              </div>

          </div>
      </AdminLayout>  )
}

export default Orders