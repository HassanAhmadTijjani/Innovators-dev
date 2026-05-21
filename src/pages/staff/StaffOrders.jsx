import React from 'react'
import StaffLayout from '../../components/staff/StaffLayout'
import { useNavigate } from 'react-router-dom'

const StaffOrders = () => {
  const navigate = useNavigate()

  return (
    <StaffLayout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          {/* Animated Illustration Placeholder */}
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-75" />
            <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center text-5xl border-2 border-primary/10 shadow-sm">
              🏗️
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-brand-charcoal mb-4">
            Order Management Coming Soon!
          </h1>

          <p className="text-neutral-slate text-lg max-w-md mx-auto mb-10 leading-relaxed">
            We're currently building a streamlined interface for tracking and processing orders.
            Stay tuned for updates!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/staff/dashboard')}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-3 
                       rounded-xl font-bold transition-all shadow-lg shadow-primary/20
                       hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              Return to Dashboard
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-3 text-xs font-bold text-neutral-slate/40 uppercase tracking-[0.2em]">
            <div className="w-12 h-px bg-gray-100" />
            Feature in progress
            <div className="w-12 h-px bg-gray-100" />
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

export default StaffOrders