import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSettings from '../../hooks/useSettings'

const About = () => {
  const navigate = useNavigate()
  const { settings, loading } = useSettings()

  const storeName = settings?.store_name || 'Our Store'
  const storeDesc = settings?.store_description ||
    'Your trusted shop for quality products and accessories.'
  const phone = settings?.store_phone || ''
  const email = settings?.store_email || ''
  const address = settings?.store_address || ''
  const hours = settings?.business_hours || 'Mon - Sat: 9am - 6pm'
  const whatsapp = settings?.whatsapp_number || ''
  const instagram = settings?.instagram_url || ''
  const twitter = settings?.twitter_url || ''
  const facebook = settings?.facebook_url || ''
  const logo = settings?.logo_url || ''
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '').replace(/^0/, '234')}` : null

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6 animate-pulse">
      <div className="h-64 bg-gray-100 rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-light">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-brand-black">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/20
                          rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64
                          bg-primary/10 rounded-full blur-2xl
                          translate-y-1/2" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center
                            gap-8">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden
                              border-2 border-primary/30 shrink-0">
              {logo ? (
                <img src={logo} alt={storeName}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-linear-to-br
                                  from-primary to-blue-400 flex items-center
                                  justify-center">
                  <span className="text-white font-bold text-2xl">
                    {storeName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-2
                                bg-primary/20 border border-primary/30
                                rounded-full px-4 py-1.5 mb-3">
                <div className="w-2 h-2 bg-primary rounded-full
                                  animate-pulse" />
                <span className="text-primary text-xs font-semibold
                                   uppercase tracking-wider">
                  About Us
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold
                               text-white mb-3">
                {storeName}
              </h1>
              <p className="text-gray-400 text-base max-w-xl
                              leading-relaxed">
                {storeDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* ── CONTACT CARDS ── */}
        <div>
          <h2 className="text-xl font-bold text-brand-charcoal mb-6">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-3 gap-4">

            {/* Phone */}
            {phone && (
              <a href={`tel:${phone}`}
                className="bg-white rounded-2xl p-6 shadow-sm border
                              border-gray-100 hover:shadow-md hover:border-primary
                              transition-all group">
                <div className="w-12 h-12 bg-primary-light rounded-xl
                                  flex items-center justify-center text-2xl
                                  mb-4 group-hover:scale-110 transition-transform">
                  📞
                </div>
                <p className="font-bold text-brand-charcoal text-sm mb-1">
                  Phone
                </p>
                <p className="text-primary font-semibold text-sm">
                  {phone}
                </p>
                <p className="text-neutral-slate text-xs mt-1">
                  Tap to call
                </p>
              </a>
            )}

            {/* WhatsApp */}
            {whatsappLink && (
              <a href={whatsappLink} target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 shadow-sm border
                              border-gray-100 hover:shadow-md
                              hover:border-blue-300 transition-all group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl
                                  flex items-center justify-center text-2xl
                                  mb-4 group-hover:scale-110 transition-transform">
                  💬
                </div>
                <p className="font-bold text-brand-charcoal text-sm mb-1">
                  WhatsApp
                </p>
                <p className="text-blue-600 font-semibold text-sm">
                  Chat with us
                </p>
                <p className="text-neutral-slate text-xs mt-1">
                  Tap to chat
                </p>
              </a>
            )}

            {/* Email */}
            {email && (
              <a href={`mailto:${email}`}
                className="bg-white rounded-2xl p-6 shadow-sm border
                              border-gray-100 hover:shadow-md hover:border-blue-200
                              transition-all group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl
                                  flex items-center justify-center text-2xl
                                  mb-4 group-hover:scale-110 transition-transform">
                  ✉️
                </div>
                <p className="font-bold text-brand-charcoal text-sm mb-1">
                  Email
                </p>
                <p className="text-blue-600 font-semibold text-sm
                                truncate">
                  {email}
                </p>
                <p className="text-neutral-slate text-xs mt-1">
                  Tap to email
                </p>
              </a>
            )}

            {/* Address */}
            {address && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border
                                border-gray-100 sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-amber-50 rounded-xl
                                  flex items-center justify-center text-2xl
                                  mb-4">
                  📍
                </div>
                <p className="font-bold text-brand-charcoal text-sm mb-1">
                  Store Location
                </p>
                <p className="text-neutral-slate text-sm leading-relaxed">
                  {address}
                </p>
              </div>
            )}

            {/* Business Hours */}
            {hours && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border
                                border-gray-100">
                <div className="w-12 h-12 bg-purple-50 rounded-xl
                                  flex items-center justify-center text-2xl
                                  mb-4">
                  🕐
                </div>
                <p className="font-bold text-brand-charcoal text-sm mb-1">
                  Business Hours
                </p>
                <p className="text-neutral-slate text-sm leading-relaxed">
                  {hours}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── SOCIAL LINKS ── */}
        {(instagram || twitter || facebook) && (
          <div>
            <h2 className="text-xl font-bold text-brand-charcoal mb-6">
              Follow Us
            </h2>
            <div className="flex gap-4 flex-wrap">
              {[
                {
                  url: instagram, label: 'Instagram', icon: '📸',
                  color: 'hover:border-pink-300 hover:bg-pink-50'
                },
                {
                  url: twitter, label: 'Twitter/X', icon: '🐦',
                  color: 'hover:border-blue-300 hover:bg-blue-50'
                },
                {
                  url: facebook, label: 'Facebook', icon: '👥',
                  color: 'hover:border-blue-400 hover:bg-blue-50'
                },
              ].filter(s => s.url).map((social) => (
                <a key={social.label}
                  href={social.url} target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 bg-white
                                 rounded-xl px-5 py-3 shadow-sm border
                                 border-gray-100 transition-all
                                 hover:shadow-md ${social.color}`}>
                  <span className="text-xl">{social.icon}</span>
                  <span className="font-semibold text-brand-charcoal
                                     text-sm">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── WHY CHOOSE US ── */}
        {settings?.why_choose_us?.length > 0 && (
          <div className="bg-brand-black rounded-3xl p-8 md:p-10">
            <h2 className="text-xl font-bold text-white text-center mb-8">
              Why Choose {storeName}?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {settings.why_choose_us.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <p className="text-white font-bold text-sm">
                    {item.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-1
                                  leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="bg-linear-to-r from-primary to-blue-500
                          rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10
                            rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white mb-2">
              Ready to Shop?
            </h2>
            <p className="text-white/80 text-sm mb-6">
              Browse our full collection and find exactly what you need.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/shop')}
                className="bg-white text-primary font-bold px-8 py-3
                             rounded-xl text-sm hover:bg-gray-50 transition-all
                             hover:scale-[1.03] shadow-lg"
              >
                Browse Products →
              </button>
              {whatsappLink && (
                <a href={whatsappLink} target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white
                                font-bold px-8 py-3 rounded-xl text-sm
                                transition-all border border-white/30">
                  💬 WhatsApp Us
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default About