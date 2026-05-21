import React from 'react'
import StaffLayout from '../../components/staff/StaffLayout'
import { Box } from 'lucide-react'

const StaffDashboard = () => {
  return (
        <StaffLayout>
            <div>
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-brand-charcoal">Staff Dashboard</h1>
                    <p className="text-neutral-slate text-sm mt-1">
                        Manage orders and record in-store sales
                    </p>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {[
                        { label: 'Pending Orders', value: '0', icon: '⏳', color: 'text-amber-600', desc: 'Orders waiting for approval' },
                        { label: 'Completed Today', value: '0', icon: '✅', color: 'text-primary', desc: 'Orders completed today' },
                    ].map((stat) => (
                        <div key={stat.label}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-neutral-slate text-sm">{stat.label}</p>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-neutral-slate mt-1">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Pending Orders Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-brand-charcoal mb-4">
                        Pending Orders
                    </h2>
                    <div className="text-center py-12">
                        <p className="text-4xl mb-3">📭</p>
                      <p className="text-neutral-slate text-sm">
                            No pending orders right now.
                        </p>
                    </div>
                </div>
            </div>
        </StaffLayout>)
}

export default StaffDashboard