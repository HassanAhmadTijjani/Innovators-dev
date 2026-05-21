// @ts-nocheck
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext({})

export function CartProvider({ children }) {
    const { user } = useAuth()
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(false)

    // fetch cart from supabase whenever user changes
    useEffect(() => {
        if (user?.id) {
            fetchCart()
        } else if (!user) {
            // only clear if we are sure user is logged out
            // not just during the auth loading phase
            setCartItems([])
        }
    }, [user?.id])

    // FetchCart function
    const fetchCart = async () => {
        if (!user?.id) return
        setLoading(true)

        // ── Step 1: Delete items older than 3 days ──────────
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

        await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .lt('created_at', threeDaysAgo.toISOString())

        // ── Step 2: Fetch remaining valid cart items ─────────
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
            *,
            products (
              id, name, price, cover_image,
              stock, slug, brand
            )
          `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (!error && data) setCartItems(data)
        setLoading(false)
    }

    async function addToCart(productId, quantity = 1, selectedColor = null) {
        if (!user?.id) return

        const existing = cartItems.find(
            item => item.product_id === productId
                && item.selected_color === selectedColor
        )

        if (existing) {
            await updateQuantity(productId, existing.quantity + quantity, selectedColor)
            return
        }

        const { error } = await supabase
            .from('cart_items')
            .insert({
                user_id: user.id,
                product_id: productId,
                quantity: quantity,
                selected_color: selectedColor,
            })

        if (!error) {
            await fetchCart()
            toast.success('Product added to cart')
        }
    }

    async function updateQuantity(productId, newQuantity, selectedColor = null) {
        if (newQuantity < 1) {
            await removeFromCart(productId, selectedColor)
            return
        }

        let query = supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('user_id', user.id)
            .eq('product_id', productId)

        if (selectedColor) {
            query = query.eq('selected_color', selectedColor)
        } else {
            query = query.is('selected_color', null)
        }

        const { error } = await query

        if (!error) await fetchCart()
    }

    async function removeFromCart(productId, selectedColor = null) {
        let query = supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId)

        if (selectedColor) {
            query = query.eq('selected_color', selectedColor)
        } else {
            query = query.is('selected_color', null)
        }

        const { error } = await query
        if (!error) {
            await fetchCart()
            toast.success('Product removed from cart')
        }
    }
    async function clearCart() {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)

        if (!error) setCartItems([])
    }

    // derived values
    // reduce loops through all cart items and adds up all quantities. If the cart has 2 phones and 3 accessories, cartCount is 5. This is what shows in the navbar badge.
    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity, 0
    )

    const cartTotal = cartItems.reduce(
        (total, item) =>
            total + (Number(item.products?.price) * item.quantity),
        0
    )

    const value = {
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}