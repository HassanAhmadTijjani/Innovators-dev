// @ts-nocheck
import { supabase } from "../lib/supabase";
export async function sendEmail(type, data) {
    try {
        const { error } = await supabase.functions.invoke('send-email', {
            body: { type, data },
        })

        if (error) {
            console.error('Email function error:', error)
        }
    } catch (err) {
        console.error('Email failed:', err)
      }
}