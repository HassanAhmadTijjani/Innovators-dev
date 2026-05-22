import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const useHomeProducts = () => {
    const [featuredProducts, setFeeturesProducts] = useState([])
    const [topSellers, setTopSellers] = useState([])
    const [loading, setLoading] = useState(true)

    // Featured Products fetching
    const fetchFeatured = async () => {
        const { data } = await supabase.from('products').select('*, categories(id, name)').eq('is_featured', true).order('created_at', { ascending: false }).limit(8)
        if (data) setFeeturesProducts(data)
    }

    // Top selling Products
    const fetchTopSellers = async () => {
        // get products with highest order count
        const { data } = await supabase.from('order_items').select('product_id, quantity')
        if (!data) return

        // count total quantity ordered per product
        const counts = {}
        data.forEach(item => {
            counts[item.product_id] =
                (counts[item.product_id] || 0) + item.quantity
        })

        // Sort by most Order
        const sortedIds = Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([id]) => id)
        if (sortedIds.length === 0) return

        const { data: products } = await supabase
            .from('products')
            .select('*, categories(id, name)')
            .in('id', sortedIds)
            .eq('is_active', true)

        if (products) {
            // sort by order count
            const sorted = products.sort(
                (a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)
            )
            setTopSellers(sorted)
        }
    }

    useEffect(() => {
        async function loadAll() {
            setLoading(true)
            await Promise.all([fetchFeatured(), fetchTopSellers()])
            setLoading(false)
        }
        loadAll()
    }, [])
    return { featuredProducts, topSellers, loading }
}

export default useHomeProducts