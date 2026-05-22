// @ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('products')
            .select(`*, categories (id, name) `)
            .order('created_at', { ascending: false })

        if (error) {
            setError(error.message)
        } else {
            setProducts(data)
        }
        setLoading(false)
    }

    const addProduct = async (productData) => {
        const { data, error } = await supabase
            .from('products')
            .insert(productData)
            .select()
            .single()

        if (error) throw error
        await fetchProducts()
        return data
    }

    const updateProduct = async (id, productData) => {
        const { error } = await supabase
            .from('products')
            .update({ ...productData, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) throw error
        await fetchProducts()
    }

    const deleteProduct = async (id) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) throw error
        await fetchProducts()
    }


    const fetchCategories = useCallback(async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name')
        if (error) throw error
        return data
    }, [])

    // Featured Toggler
    const toggleFeatured = async (productId, currentValue) => {
        const { error } = await supabase
            .from('products')
            .update({ is_featured: !currentValue })
            .eq('id', productId)

        if (error) throw error
        await fetchProducts()
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts()
    }, [])

    return {
        products,
        loading,
        error,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        fetchCategories,
        toggleFeatured,
    }
}