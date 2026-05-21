// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const useSettings = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)

    async function fetchSettings() {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('id', 'store')
                .maybeSingle()
            if (error) throw error
            if (data) setSettings(data)
        } catch (err) {
            console.error('Error fetching settings:', err)
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

    useEffect(() => { fetchSettings() }, [])

    return { settings, loading, fetchSettings, updateSettings }
}

export default useSettings