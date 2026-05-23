import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const useSettings = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const { profile, user } = useAuth()

    async function fetchSettings() {
        try {
            let data, error

            const isAdmin = profile?.role === 'super_admin'
                || profile?.role === 'admin'
            const isLoggedIn = !!user

            if (isAdmin) {
                // ✅ Admins get everything — full settings table
                const result = await supabase
                    .from('settings')
                    .select('*')
                    .eq('id', 'store')
                    .maybeSingle()
                data = result.data
                error = result.error

            } else if (isLoggedIn) {
                // ✅ Logged in customers get bank details too
                const result = await supabase
                    .from('customer_settings')
                    .select('*')
                    .maybeSingle()
                data = result.data
                error = result.error

            } else {
                // ✅ Guests get public info only — no bank details
                const result = await supabase
                    .from('public_settings')
                    .select('*')
                    .maybeSingle()
                data = result.data
                error = result.error
            }

            if (error) throw error
            if (data) setSettings(data)
        } catch (err) {
            console.error('Settings error:', err)
        } finally {
            setLoading(false)
        }
    }

    async function updateSettings(updates) {
        const { error } = await supabase
            .from('settings')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', 'store')
        if (error) throw error
        await fetchSettings()
    }

    useEffect(() => {
        fetchSettings()
    }, [profile?.role, user?.id])

    return { settings, loading, fetchSettings, updateSettings }
}

export default useSettings