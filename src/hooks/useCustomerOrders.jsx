// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useCustomerOrders() {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    // fetch all users order
    async function fetchMyOrders() {
        if (!user) return
        setLoading(true)

        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (
          id, name, price, quantity, subtotal, selected_color,
          products (cover_image, slug)
        )
      `)
            .eq('customer_id', user.id)
            .order('created_at', { ascending: false })

        if (!error && data) setOrders(data)
        setLoading(false)
    }

    // fetch users single order
    async function fetchOrderById(id) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (
          id, name, price, quantity, subtotal, selected_color,
          products (cover_image, slug)
        )
      `)
            .eq('id', id)
            .eq('customer_id', user.id)
            .single()

        if (error) throw error
        return data
    }

    useEffect(() => {
        if (user) fetchMyOrders()
    }, [user])

    return { orders, loading, fetchMyOrders, fetchOrderById }
}