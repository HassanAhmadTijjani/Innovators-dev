// @ts-nocheck
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import useSettings from '../../hooks/useSettings'
const StaffLayout = ({children}) => {
    const navItems = [
        { label: 'Dashboard', to: '/staff', icon: '🏠' },
        { label: 'Orders', to: '/staff/orders', icon: '🛒'},
        { label: 'New Sale', to: '/staff/pos', icon: '💰'},
        { label: 'Products', to: '/staff/products', icon: '📦'},
        { label: 'Customers', to: '/staff/customers', icon: '👥'},
    ]

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { profile, logout } = useAuth()
    const navigate = useNavigate()
    const {settings} = useSettings()


    const handleLogout = async() => {
        await logout()
        navigate('/login')
    }

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
        ${isActive
            ? 'bg-primary text-white'
            : 'text-gray-400 hover:bg-white/10 hover:text-white'
        }`
    
  return (
      <div className="h-screen bg-neutral-light flex">

          {sidebarOpen && (
              <div
                  className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
              />
          )}

          {/* Sidebar */}
          <aside className={`text-white
                fixed top-0 left-0 h-full w-60 bg-brand-black z-30
                transform transition-transform duration-300 flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:z-auto
            `}>
              {/* Logo */}
              <div className="px-6 py-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-primary flex items-center
                                        justify-center text-white font-bold text-xs">
                          MH
                      </div>
                      <div>
                          <p className="text-white font-bold text-sm leading-none">{settings?.store_name}</p>
                          <p className="text-primary text-xs mt-0.5">Staff Panel</p>
                      </div>
                  </div>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                  <p className="text-gray-600 text-xs font-bold uppercase
                                  tracking-widest px-4 mb-2">
                      Operations
                  </p>
                  {navItems.map((item) => (
                      <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.to === '/staff'}
                          className={linkClass}
                          onClick={() => setSidebarOpen(false)}
                      >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                      </NavLink>
                  ))}
              </nav>

              {/* User Info + Logout */}
              <div className="px-4 py-4 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center
                                        justify-center text-white font-bold text-xs">
                          {profile?.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                          <p className="text-white text-xs font-semibold leading-none">
                              {profile?.full_name}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">Staff Member</p>
                      </div>
                  </div>
                  <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-400 hover:text-red-400
                                   text-sm px-2 py-1 transition-colors"
                  >
                      🚪 Logout
                  </button>
              </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
              <header className="bg-white border-b border-gray-200 px-4 py-3
                                   flex items-center gap-4 lg:hidden">
                  <button
                      onClick={() => setSidebarOpen(true)}
                      className="text-xl text-gray-600"
                  >
                      ☰
                  </button>
                  <p className="font-bold text-brand-charcoal">{settings?.store_name} Staff</p>
              </header>

              <main className="flex-1 p-6 overflow-y-auto">
                  {children}
              </main>
          </div>
      </div>
  )
}

export default StaffLayout