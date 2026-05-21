// @ts-nocheck
import { supabase } from '../lib/supabase'

export async function uploadImage(file) {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random()
        .toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path)

    return publicUrl
}

export async function uploadMultipleImages(files) {
    const urls = await Promise.all(
        Array.from(files).map(file => uploadImage(file))
    )
    return urls
}