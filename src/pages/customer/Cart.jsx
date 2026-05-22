// @ts-nocheck
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react';
import Layout from '../../components/common/Layout'
import { useCart } from '../../context/CartContext'
import useSettings from '../../hooks/useSettings';

export default function Cart() {
    const { settings } = useSettings()

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const {
        cartItems,
        cartTotal,
        cartCount,
        loading,
        removeFromCart,
        updateQuantity,
    } = useCart()

    const navigate = useNavigate()

    if (loading) return (
        <Layout>
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl" />
                    ))}
                </div>
            </div>
        </Layout>
    )

    // Empty cart
    if (cartItems.length === 0) return (
        <Layout>
            <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                <p className="text-6xl mb-4">🛒</p>
                <h1 className="text-2xl font-bold text-brand-charcoal mb-2">
                    Your cart is empty
                </h1>
                <p className="text-neutral-slate text-sm mb-8">
                    Looks like you haven't added anything yet
                </p>
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-primary hover:bg-primary-dark text-white px-8
                     py-3 rounded-lg font-semibold transition-all"
                >
                    Start Shopping
                </button>
            </div>
        </Layout>
    )

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-brand-charcoal">
                        Your Cart
                    </h1>
                    <p className="text-neutral-slate text-sm mt-1">
                        {cartCount} item{cartCount > 1 ? 's' : ''} in your cart
                    </p>
                </div>
                {/* Expiry Warning */}
                {cartItems.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl
                  px-4 py-3 mb-6 flex items-center gap-3">
                        <span className="text-xl shrink-0">⏰</span>
                        <p className="text-amber-800 text-sm">
                            <span className="font-semibold">Items expire after {settings?.cart_expiry_days} days.</span>{' '}
                            Complete your purchase before your cart is automatically cleared.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Cart Items — left side */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl p-4 shadow-sm border
                           border-gray-100 flex gap-4"
                            >
                                {/* Product Image */}
                                <div
                                    onClick={() => navigate(`/shop/${item.products?.slug}`)}
                                    className="w-20 h-20 rounded-lg bg-neutral-light
                             overflow-hidden shrink-0 cursor-pointer"
                                >
                                    {item.products?.cover_image ? (
                                        <img
                                            src={item.products.cover_image}
                                            alt={item.products.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center
                                    justify-center text-2xl">
                                            📦
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
<div className="flex-1 min-w-0">
  <p className="text-xs text-neutral-slate mb-0.5">
    {item.products?.brand}
  </p>
  <h3 className="font-semibold text-brand-charcoal text-sm
                 leading-snug cursor-pointer hover:text-primary
                 transition-colors line-clamp-2"
      onClick={() => navigate(`/shop/${item.products?.slug}`)}>
    {item.products?.name}
  </h3>

  {/* ✅ Show selected color */}
  {item.selected_color && (
    <span className="inline-flex items-center gap-1 mt-1 bg-primary-light
                     text-primary-dark text-xs px-2 py-0.5 rounded-full
                     font-medium">
       {item.selected_color}
    </span>
  )}

  <p className="text-primary font-bold mt-1">
    ₦{Number(item.products?.price).toLocaleString()}
  </p>
</div>

                                {/* Quantity + Remove — right side */}
                                <div className="flex flex-col items-end justify-between
                                shrink-0">

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.product_id, item.selected_color)}
                                        className="text-gray-400 hover:text-red-500
                               transition-colors text-sm"
                                    >
                                        ✕
                                    </button>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(
                                                item.product_id, item.quantity - 1, item.selected_color
                                              )}
                                            className="w-7 h-7 rounded-lg border border-gray-200
                                 flex items-center justify-center text-sm
                                 font-bold text-brand-charcoal
                                 hover:bg-gray-50 transition-all"
                                        >
                                            −
                                        </button>
                                        <span className="w-6 text-center text-sm font-bold
                                     text-brand-charcoal">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(
                                                item.product_id, item.quantity + 1, item.selected_color
                                            )} disabled={item.quantity >= item.products?.stock}
                                            className="w-7 h-7 rounded-lg border border-gray-200
                                 flex items-center justify-center text-sm
                                 font-bold text-brand-charcoal
                                 hover:bg-gray-50 transition-all
                                 disabled:opacity-40
                                 disabled:cursor-not-allowed"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Item Total */}
                                    <p className="text-sm font-bold text-brand-charcoal">
                                        ₦{(
                                            Number(item.products?.price) * item.quantity
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <Link
                            to="/shop"
                            className="inline-block text-primary text-sm font-semibold
                         hover:underline mt-2"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary — right side */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border
                            border-gray-100 p-6 sticky top-24">
                            <h2 className="font-bold text-brand-charcoal text-lg mb-6">
                                Order Summary
                            </h2>

                            {/* Items breakdown */}
                            <div className="space-y-3 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id}
                                        className="flex justify-between text-sm">
                                        <span className="text-neutral-slate line-clamp-1 flex-1 mr-2">
                                            {item.products?.name} × {item.quantity}
                                        </span>
                                        <span className="text-brand-charcoal font-medium
                                     shrink-0">
                                            ₦{(
                                                Number(item.products?.price) * item.quantity
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                                {/* Subtotal */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-slate">Subtotal</span>
                                    <span className="font-semibold text-brand-charcoal">
                                        ₦{cartTotal.toLocaleString()}
                                    </span>
                                </div>
                                {/* Delivery */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-slate">Delivery</span>
                                    <span className="text-neutral-slate">
                                        Calculated at checkout
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="font-bold text-brand-charcoal">Total</span>
                                    <span className="font-extrabold text-primary text-xl">
                                        ₦{cartTotal.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-slate mt-1">
                                    Delivery fee added at checkout
                                </p>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-primary hover:bg-primary-dark text-white
                           py-4 rounded-xl font-bold text-base transition-all
                           hover:scale-[1.01]"
                            >
                                Proceed to Checkout →
                            </button>

                            <p className="text-xs text-neutral-slate text-center mt-3">
                                🔒 Secure checkout
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    )
}