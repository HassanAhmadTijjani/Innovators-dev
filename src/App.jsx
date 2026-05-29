// @ts-nocheck

/* eslint-disable react-hooks/static-components */
import { Toaster } from 'react-hot-toast'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Layout from './components/common/Layout'
import CustomerHome from './pages/customer/CustomerHome'
import AdminDashboard from './pages/admin/AdminDashboard'
import StaffDashboard from './pages/staff/StaffDashboard'
import Products from './pages/admin/Products'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProducts'
import Shop from './pages/customer/Shop'
import ProductDetailPage from './pages/customer/ProductDetailPage'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderDetail from './pages/admin/OrderDetail'
import Orders from './pages/admin/Orders'
import MyOrders from './pages/customer/MyOrders'
import OrderTracking from './pages/customer/OrderTracking'
import StaffOrders from './pages/staff/StaffOrders'
import StaffPos from './pages/staff/StaffPos'
import Customer from './pages/admin/Customer'
import LandingPage from './pages/customer/LandingPage'
import About from './pages/customer/About'
import Staff from './pages/admin/Staff'
import PromoCodes from './pages/admin/PromoCodes'
import Analytics2 from './pages/admin/Analytics'
import Settings from './pages/admin/Settings'
import { Analytics } from "@vercel/analytics/react"
import WhatsappFloat from './components/common/WhatsappFloat'
import Profile from './pages/customer/Profile'
import Reviews from './pages/admin/Reviews'


// function Home() { return <h1 className="p-8 text-2xl font-bold text-primary">🏠 Customer Home</h1> }
// function AdminHome() { return <h1 className="p-8 text-2xl font-bold text-primary">👑 Admin Dashboard</h1> }
// function StaffHome() { return <h1 className="p-8 text-2xl font-bold text-primary">👨‍💼 Staff Dashboard</h1> }

const App = () => {
  const { user, profile } = useAuth()

  const RedirectIfLoggedIn = ({ children }) => {
    if (user) {
      if (profile?.role === 'super_admin') return <Navigate to='/admin' replace />
      if (profile?.role === 'admin') return <Navigate to='/admin' replace />
      if (profile?.role === 'staff') return <Navigate to='/staff' replace />
      return <Navigate to='/' replace />
    }
    return children
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
        <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/" element={user ?
          <ProtectedRoute allowedRoles={['customer']}>
            <Layout>
              <CustomerHome />
            </Layout>
          </ProtectedRoute> : <Layout><LandingPage /></Layout>
        } />

        <Route path="/shop" element={
          // <ProtectedRoute allowedRoles={['customer']}>
            <Layout> <Shop /> </Layout>
          // </ProtectedRoute>
        } />

        <Route path="/shop/:slug" element={
          // <ProtectedRoute allowedRoles={['customer']}>
            <Layout>
              <ProductDetailPage />
            </Layout>
          // </ProtectedRoute>
        } />

        <Route path="/cart" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Cart />
          </ProtectedRoute>
        } />

        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Checkout />
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MyOrders />
          </ProtectedRoute>
        } />

        <Route path="/orders/:id" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <OrderTracking />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/products" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <Products />
          </ProtectedRoute>
        } />

        <Route path="/admin/orders" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <Orders />
          </ProtectedRoute>
        } />

        <Route path="/admin/orders/:id" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <OrderDetail />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Customer />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Analytics2 />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/admin/promos" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <PromoCodes />
          </ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <Reviews />
          </ProtectedRoute>
        } />
        <Route path="/admin/staff" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Staff />
          </ProtectedRoute>
        } />

        <Route path="/admin/products/add" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <AddProduct />
          </ProtectedRoute>
        } />

        <Route path="/admin/products/edit/:id" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <EditProduct />
          </ProtectedRoute>
        } />

        {/* Staff */}
        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />

        <Route path='/staff/orders' element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffOrders />
          </ProtectedRoute>
        } />
        <Route path='/staff/pos' element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffPos />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WhatsappFloat />
      <Analytics />
    </>
  )
}

export default App
