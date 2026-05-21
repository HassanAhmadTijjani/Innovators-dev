// @ts-nocheck
import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const usePublicProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])

    // Fetching Products
    const fetchProducts = async (filters = {})=> {
        setLoading(true)
        let query = supabase.from('products').select('*, categories(id, name)').eq('is_active', true).order('created_at', {ascending: false})

        // Search filter
        // ilike is Supabase's case-insensitive search. The % symbols are wildcards — %samsung% matches anything containing "samsung" anywhere in the name — beginning, middle, or end. Regular like is case sensitive — ilike works regardless of uppercase or lowercase.
        if (filters.search) {
            query = query.ilike('name', `%${filters.search}%`)
        }

        // Category filter
        if (filters.category_id) {
            query = query.eq('category_id', filters.category_id)
        }

        // Price filter
        if (filters.min_price) {
            query = query.gte('price', filters.min_price)
        }
        if (filters.max_price) {
            query = query.lte('price', filters.max_price)
        }

        const { data, error } = await query

        if (!error) setProducts(data)
        setLoading(false)
    }

    // Fetch products by slug. fetch the products name and id then make it our slug
    const fetchProductBySlug = async (slug) => {
        const { data, error } = await supabase.from('products').select('*, categories(id, name)').eq('slug', slug).eq('is_active', true).single()
        if (error) throw error
        return data
    }

    // Fetch categories
   const fetchCategories = async() => {
        const { data } = await supabase
            .from('categories')
            .select('*')
            .order('name')
        if (data) setCategories(data)
    }
    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts()
        fetchCategories()
    }, [])

    return ({
        products,
        loading,
        categories,
        fetchProducts,
        fetchProductBySlug,
  }
  )
}

export default usePublicProducts