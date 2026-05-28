/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            colors: {

                // =========================
                // CARTMATE BRAND COLORS
                // =========================

                primary: {
                    DEFAULT: '#2563EB', // Blue
                    dark: '#1D4ED8',
                    light: '#DBEAFE',
                },

                brand: {
                    black: '#0F172A',
                    charcoal: '#111827',
                },

                neutral: {
                    slate: '#6B7280',
                    light: '#F9FAFB',
                    border: '#E5E7EB',
                },

                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444',
                info: '#3B82F6',
            },

            boxShadow: {
                soft: '0 2px 10px rgba(0,0,0,0.05)',
                card: '0 4px 20px rgba(0,0,0,0.06)',
            },

            borderRadius: {
                xl2: '1rem',
            },
        },
    },

    plugins: [],
}