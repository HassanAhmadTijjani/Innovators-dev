/* eslint-disable react-hooks/set-state-in-effect */
// @ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { sendEmail } from '../utils/sendEmail'

export function useOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchOrders = useCallback(async (statusFilter = '') => {
        setLoading(true)
        let query = supabase
            .from('orders')
            .select(`*, order_items (id, name, price, quantity, subtotal)`)
            .order('created_at', { ascending: false })

        if (statusFilter) query = query.eq('status', statusFilter)

        const { data, error } = await query
        if (error) setError(error.message)
        else setOrders(data)
        setLoading(false)
    }, [])

    const fetchOrderById = useCallback(async (id) => {
        const { data, error } = await supabase
            .from('orders')
            .select(`
            *,
            order_items (
              id, name, price, quantity, subtotal,
              selected_color,
              product_id,
              products (cover_image, slug)
            )
          `)
            .eq('id', id)
            .single()
        if (error) throw error
        return data
      }, [])

    async function updateOrderStatus(id, status) {
        const { error } = await supabase
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) throw error

        // Run promo usage logic
        await supabase.rpc('handle_order_promo', { p_order_id: id })

        // fetch the order to get customer email
        const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()

        if (order?.customer_email) {
            await sendEmail('order_status_update', {
                order,
                newStatus: status,
            })
        }

        await fetchOrders()
      }

    useEffect(() => { fetchOrders() }, [fetchOrders])

    return { orders, loading, error, fetchOrders, fetchOrderById, updateOrderStatus }
}