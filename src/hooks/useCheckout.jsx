// @ts-nocheck
import { supabase } from '../lib/supabase'
import { sendEmail } from '../utils/sendEmail'

export function useCheckout() {

    async function validatePromoCode(code, orderSubtotal) {
        const { data, error } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .single()

        if (error || !data) throw new Error('Invalid promo code')

        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            throw new Error('This promo code has expired')
        }

        if (data.max_uses && data.used_count >= data.max_uses) {
            throw new Error('This promo code has reached its usage limit')
        }

        if (orderSubtotal < data.min_order_amount) {
            throw new Error(
                `Minimum order amount for this code is ₦${Number(
                    data.min_order_amount
                ).toLocaleString()}`
            )
        }

        let discountAmount = 0
        if (data.discount_type === 'percentage') {
            discountAmount = (orderSubtotal * data.discount_value) / 100
        } else {
            discountAmount = data.discount_value
        }

        return { promoData: data, discountAmount }
    }

    async function placeOrder({
        userId,
        cartItems,
        deliveryMethod,
        customerName,
        customerEmail,
        customerPhone,
        address,
        promoCode,
        subtotal,
        discount,
        total,
        deliveryFee,
        deliveryZone,
    }) {
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_id: userId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                type: 'online',
                status: 'pending',
                delivery_method: deliveryMethod,
                address: deliveryMethod === 'delivery' ? address : null,
                subtotal: subtotal,
                discount: discount,
                total: total,
                payment_method: 'bank_transfer',
                payment_status: 'pending',
                delivery_fee: deliveryFee,
                delivery_zone: deliveryZone,

            })
            .select()
            .single()

        if (orderError) throw orderError


        const orderItems = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            name: item.products.name,
            price: Number(item.products.price),
            quantity: item.quantity,
            subtotal: Number(item.products.price) * item.quantity,
            selected_color: item.selected_color || null,
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) throw itemsError

        for (const item of cartItems) {
            const newStock = item.products.stock - item.quantity
            await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.product_id)
        }

        if (promoCode) {
            const { data: promo } = await supabase
                .from('promo_codes')
                .select('used_count')
                .eq('code', promoCode.toUpperCase())
                .single()

            if (promo) {
                await supabase
                    .from('promo_codes')
                    .update({ used_count: promo.used_count + 1 })
                    .eq('code', promoCode.toUpperCase())
            }
        }

        // send admin notification email
        // await sendEmail('new_order', {
        //     order: {
        //         ...order,
        //         order_items: orderItems,
        //     },
        // })

        await Promise.allSettled([
            sendEmail('new_order', {
                order: { ...order, order_items: orderItems }
            }),
            sendEmail('customer_receipt', {
                order: { ...order, order_items: orderItems }
            }),
        ])
        return order
    }

    async function uploadPaymentProof(orderId, file) {
        const ext = file.name.split('.').pop()
        const fileName = `${orderId}-${Date.now()}.${ext}`

        const { data, error } = await supabase.storage
            .from('payment-proofs')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            })

        if (error) throw error

        const { error: updateError } = await supabase
            .from('orders')
            .update({
                payment_proof: data.path,
                payment_status: 'pending',
            })
            .eq('id', orderId)

        if (updateError) throw updateError
        // await sendEmail('payment_proof', { order: { id: orderId } })
        // fetch full order details
        const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        // send email
        await sendEmail('payment_proof', { order })
        return data.path
    }

    return { validatePromoCode, placeOrder, uploadPaymentProof }
}