import React from 'react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const useProfile = () => {
    const {user, profile} = useAuth()
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Profile Update
    const updateProfile = async (updates) => {
        setSaving(true)
        try {
            const {error} = await supabase.from('profiles').update({full_name: updates.full_name, phone: updates.phone,}).eq('id', user.id)
            if(error) throw error
        } finally {
            setSaving(false)
        }
    }

    // Avatar Upload
    const uploadAvatar = async (file) => {
        setUploading(true)
        try {
            const ext = file.name.split('.').pop()
            const fileName = `avatar-${user.id}-${Date.now()}.${ext}`

            const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
            })
            if (error) throw error
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path)
            
            // Save avatar url to profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id)

            if (updateError) throw updateError

            return publicUrl
        } finally {
            setUploading(false)
        }
    }

    // Fetching Order stats
    async function fetchOrderStats() {
        const { data } = await supabase
            .from('orders')
            .select('total, status')
            .eq('customer_id', user.id)

        if (!data) return { count: 0, totalSpent: 0 }

        const totalSpent = data
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + Number(o.total), 0)

        return { count: data.length, totalSpent }
      }
    return {
      saving, uploading, updateProfile, uploadAvatar, fetchOrderStats
  }
}

export default useProfile