// @ts-nocheck
import React from 'react'
import { useLocation } from 'react-router-dom'
import useSettings from '../../hooks/useSettings'

const WhatsappFloat = () => {
    const { settings } = useSettings()
    const location = useLocation()
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff')) {
        return null
    }

    // Extract phone and ensure it has the country code (defaulting to Nigeria '234')
    const rawPhone = settings?.store_phone || settings?.super_admin_phone
    const phone = (rawPhone || '').replace(/\D/g, '').replace(/^0/, '234')

    const message = encodeURIComponent(
        // Added fallback for store name to prevent "Hello undefined"
        `Hello ${settings?.store_name}, I would like to make an enquiry.`
    )

    if (!phone) return null

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
                fixed bottom-5 right-5 z-50
                bg-green-500 hover:bg-green-600
                text-white rounded-full
                w-14 h-14
                flex items-center justify-center
                shadow-xl hover:scale-110
                transition-all duration-300 animate-bounce
            "
            aria-label="Chat on WhatsApp"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-7 h-7 fill-current"
            >
                <path d="M16 .396C7.163.396 0 7.559 0 16.396c0 2.821.737 5.578 2.137 8.009L0 32l7.826-2.053a15.93 15.93 0 008.174 2.24h.006C24.837 32.187 32 25.024 32 16.187 32 7.35 24.837.396 16 .396zm0 29.104a13.22 13.22 0 01-6.737-1.846l-.482-.287-4.644 1.218 1.239-4.526-.314-.465a13.167 13.167 0 01-2.028-7.004C3.034 9.28 8.884 3.43 16.104 3.43c7.221 0 13.07 5.85 13.07 13.07 0 7.22-5.85 13.07-13.07 13.07zm7.218-9.845c-.395-.198-2.337-1.154-2.699-1.285-.362-.132-.626-.198-.89.198-.264.395-1.022 1.285-1.253 1.55-.23.264-.461.297-.857.099-.395-.198-1.67-.615-3.18-1.962-1.175-1.048-1.968-2.34-2.198-2.736-.23-.395-.025-.608.173-.806.178-.177.395-.462.593-.692.198-.23.264-.395.395-.659.132-.264.066-.494-.033-.692-.099-.198-.89-2.14-1.22-2.93-.322-.773-.65-.668-.89-.68l-.758-.013c-.264 0-.692.099-1.055.494-.362.395-1.385 1.352-1.385 3.297s1.418 3.825 1.616 4.089c.198.264 2.79 4.262 6.763 5.976.945.408 1.682.652 2.257.834.948.301 1.811.258 2.493.157.76-.113 2.337-.955 2.666-1.88.329-.923.329-1.715.23-1.88-.099-.165-.362-.264-.758-.461z" />
            </svg>
        </a>
    )
}

export default WhatsappFloat