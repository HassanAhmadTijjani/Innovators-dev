import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const useSettings = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const { profile } = useAuth()

    async function fetchSettings() {
        try {
            const isAdmin = profile?.role === 'super_admin'
                || profile?.role === 'admin'

            let data, error

            if (isAdmin) {
                // admins get full settings including bank details
                const result = await supabase
                    .from('settings')
                    .select('*')
                    .eq('id', 'store')
                    .maybeSingle()
                data = result.data
                error = result.error
            } else {
                // customers and guests get only public info
                const result = await supabase
                    .from('public_settings')
                    .select('*')
                    .maybeSingle()
                data = result.data
                error = result.error
            }

            if (error) throw error
            setSettings(data)
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

    useEffect(() => { fetchSettings() }, [profile?.role])

    return { settings, loading, fetchSettings, updateSettings }
}

export default useSettings