import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function usePromoCodes() {
    const [codes, setCodes] = useState([])
    const [loading, setLoading] = useState(true)

    async function fetchCodes() {
        setLoading(true)
        const { data, error } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('is_system_generated', false)
            .order('created_at', { ascending: false })

        if (!error && data) setCodes(data)
        setLoading(false)
    }

    async function createCode(form) {
        const payload = {
            code: form.code.toUpperCase().trim(),
            description: form.description,
            discount_type: form.discount_type,
            discount_value: form.discount_type === 'free_delivery'
                ? 0
                : Number(form.discount_value),
            min_order_amount: Number(form.min_order_amount) || 0,
            max_uses: form.max_uses ? Number(form.max_uses) : null,
            expires_at: form.expires_at || null,
            is_active: true,
            used_count: 0,
        }

        const { error } = await supabase
            .from('promo_codes')
            .insert(payload)

        if (error) throw error
        await fetchCodes()
    }

    async function updateCode(id, form) {
        const payload = {
            code: form.code.toUpperCase().trim(),
            description: form.description,
            discount_type: form.discount_type,
            discount_value: form.discount_type === 'free_delivery'
                ? 0
                : Number(form.discount_value),
            min_order_amount: Number(form.min_order_amount) || 0,
            max_uses: form.max_uses ? Number(form.max_uses) : null,
            expires_at: form.expires_at || null,
        }

        const { error } = await supabase
            .from('promo_codes')
            .update(payload)
            .eq('id', id)

        if (error) throw error
        await fetchCodes()
    }

    async function toggleActive(id, currentValue) {
        const { error } = await supabase
            .from('promo_codes')
            .update({ is_active: !currentValue })
            .eq('id', id)

        if (error) throw error
        await fetchCodes()
    }

    async function deleteCode(id) {
        const { error } = await supabase
            .from('promo_codes')
            .delete()
            .eq('id', id)

        if (error) throw error
        await fetchCodes()
    }

    function generateCode(prefix = '') {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const random = Array.from({ length: 6 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('')
        return prefix ? `${prefix.toUpperCase()}${random}` : random
    }

    useEffect(() => { fetchCodes() }, [])

    return {
        codes, loading,
        fetchCodes, createCode, updateCode,
        toggleActive, deleteCode, generateCode,
    }
}