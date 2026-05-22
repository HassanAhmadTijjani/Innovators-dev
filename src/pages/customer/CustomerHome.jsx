// // @ts-nocheck
// import Layout from '../../components/common/Layout'
// import { Navigate, useNavigate } from 'react-router-dom'
// import ProductCard from '../../components/customer/ProductCard'
// import usePublicProducts from '../../hooks/usePublicProducts'
// import useSettings from '../../hooks/useSettings'

// const CustomerHome = () => {
//     const navigate = useNavigate()
//     // const [loading, setLoading] = useState(true)
//     const {products, loading} = usePublicProducts()
//     const {settings} = useSettings()

//     return (

//         <div className="max-w-6xl mx-auto px-2 py-12 ">

//             {/* Hero */}
//             <div className="bg-linear-to-br from-black via-[#0d0d0d] to-gray-900 rounded-2xl p-12 mb-14 flex flex-col items-center text-center shadow-lg">
//                 <h1 className="text-4xl font-extrabold text-white mb-3">
//                     Welcome to <span className="text-primary">{ settings?.store_name }</span>
//                 </h1>
//                 <p className="text-gray-400 text-sm max-w-md mb-6">
//                     Your one-stop shop for phones, laptops and accessories
//                 </p>
//                 <button onClick={() => navigate('/shop')} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-[1.03] shadow-md">
//                     Shop Now
//                 </button>
//             </div>

//             {/* Categories */}
//             <div className="mb-14">
//                 <h2 className="text-xl font-bold text-brand-charcoal mb-6">
//                     Browse Categories
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                     {[
//                         { name: 'Phones', icon: '📱', desc: 'Latest smartphones' },
//                         { name: 'Laptops', icon: '💻', desc: 'Powerful laptops' },
//                         { name: 'Accessories', icon: '🎧', desc: 'Gadgets & accessories' },
//                         { name: 'Others', icon: '🛍️', desc: 'Other Products'}
//                     ].map((cat) => (
//                         <div key={cat.name} onClick={() => navigate('/shop')}
//                             className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
//                             <p className="text-4xl mb-3">{cat.icon}</p>
//                             <p className="font-bold text-brand-charcoal">{cat.name}</p>
//                             <p className="text-neutral-slate text-sm max-w-sm mx-auto">{cat.desc}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Products Placeholder */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-8 px-6">
//                 <div className="flex items-center justify-between mb-6">

//                     <h2 className="text-xl font-bold text-brand-charcoal mb-6">
//                         Featured Products
//                     </h2>
//                     <button
//                         onClick={() => navigate('/shop')}
//                         className="text-primary text-sm font-semibold hover:underline">
//                         View All →
//                     </button>
//                 </div>

//                 {/* Product Grid */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//                         {products.map((product) => (
//                             <ProductCard key={product.id} product={product} />
//                         ))}
//                 </div>

//                 {loading && (
//                     <div className="flex flex-col justify-center items-center text-center py-16">
//                         <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
//                         <p className="text-neutral-slate mt-4 text-sm">Loading products...</p>
//                     </div>
//                 )}

//                 {products.length === 0 && !loading && (

//                     <div className="text-center py-16">
//                         <p className="text-5xl mb-4">📦</p>                        <p className="text-neutral-slate text-sm">
//                             Products will appear here once the admin adds them.
//                         </p>
//                     </div>
//                 )}
//             </div>

//         </div>

//     )
// }

// export default CustomerHome



// @ts-nocheck
import { useNavigate } from 'react-router-dom'
// import { useHomeProducts } from '../../hooks/useHomeProducts'
import useHomeProducts from '../../hooks/useHomeProducts'
// import { useSettings } from '../../hooks/useSettings'
import ProductCard from '../../components/customer/ProductCard'
import useSettings from '../../hooks/useSettings'

// Loading skeleton for product cards
function ProductSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm
                    border border-gray-100 animate-pulse">
            <div className="h-48 bg-gray-100" />
            <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="flex justify-between items-center mt-2">
                    <div className="h-6 bg-gray-100 rounded w-1/3" />
                    <div className="h-8 bg-gray-100 rounded w-1/4" />
                </div>
            </div>
        </div>
    )
}

// Section Header Component
function SectionHeader({ title, subtitle, actionLabel, onAction }) {
    return (
        <div className="flex items-end justify-between mb-6">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-brand-charcoal">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-neutral-slate text-sm mt-1">{subtitle}</p>
                )}

            </div>
            {actionLabel && (
                <button
                    onClick={onAction}
                    className="text-primary text-sm font-semibold hover:underline
                     transition-colors shrink-0 ml-4"
                >
                    {actionLabel} →
                </button>
            )}
        </div>
    )
}

export default function CustomerHome() {
    const navigate = useNavigate()
    const { settings } = useSettings()
    const { featuredProducts, topSellers,
        loading } = useHomeProducts()

    const storeName = settings?.store_name
    const storeDesc = settings?.store_description
    return (
        <div className="min-h-screen bg-neutral-light">

            {/* ── HERO SECTION ─────────────────────────── */}
            <div className="relative overflow-hidden bg-brand-black h-3/4">
                {/* Background gradient orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-screen bg-primary/20
                        rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute bottom-0  right-1/4 w-64 h-64 bg-primary/10
                        rounded-full blur-2xl translate-y-1/2" />

                <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <div className="max-w-2xl">

                        {/* Tag */}
                        <div className="inline-flex items-center gap-2 bg-primary/20
                            border border-primary/30 rounded-full px-4 py-1.5
                            mb-6">
                            <div className="w-2 h-2 bg-primary rounded-full
                              animate-pulse" />
                            <span className="text-primary text-xs font-semibold
                               uppercase tracking-wider">
                                {settings?.hero_badge_text || 'Now Live — Shop Online'}
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold
                           text-white leading-tight mb-4">
                            Welcome to{' '}
                            <span className="text-transparent bg-clip-text
                               bg-linear-to-r from-primary to-green-400">
                                {storeName}
                            </span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg mb-8
                          leading-relaxed max-w-lg">
                            {storeDesc}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 flex-wrap">
                            <button
                                onClick={() => navigate('/shop')}
                                className="bg-primary hover:bg-primary-dark text-white
                           px-8 py-3.5 rounded-xl font-bold text-sm
                           transition-all hover:scale-[1.03]
                           shadow-lg shadow-primary/30"
                            >
                                {settings?.hero_cta_text || 'Shop Now'} →
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="border border-white/20 hover:border-white/40
                           text-white px-8 py-3.5 rounded-xl font-bold
                           text-sm transition-all hover:bg-white/5"
                            >
                                About Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── STATS BAR ────────────────────────────── */}
            <div className="bg-white border-b border-gray-100 mt-8">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        {[
                            { label: 'Products', value: settings?.stat_products || '100+', icon: '📦' },
                            { label: 'Customers', value: settings?.stat_customers || '500+', icon: '👥' },
                            { label: 'Deliveries', value: settings?.stat_deliveries || '1000+', icon: '🚚' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="text-xl font-extrabold text-brand-charcoal">
                                    {stat.icon} {stat.value}
                                </p>
                                <p className="text-neutral-slate text-xs mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

                {/* ── CATEGORIES ───────────────────────────── */}
                <div>
                    <SectionHeader
                        title="Browse Categories"
                        subtitle="Find exactly what you're looking for"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(settings?.store_categories || [
                            { name: 'Phones', icon: '📱', desc: 'Latest smartphones' },
                            { name: 'Laptops', icon: '💻', desc: 'Powerful laptops' },
                            { name: 'Accessories', icon: '🎧', desc: 'Gadgets & accessories' },
                        ]).map((cat) => (
                            <button key={cat.name} onClick={() => navigate('/shop')}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100
               text-left hover:shadow-md hover:scale-[1.02] transition-all
               hover:border-primary/30 group">
                                <div className="text-4xl mb-3 group-hover:scale-110
                    transition-transform inline-block">
                                    {cat.icon}
                                </div>
                                <p className="font-bold text-brand-charcoal text-lg">{cat.name}</p>
                                <p className="text-neutral-slate text-sm mt-1">{cat.desc}</p>
                                <p className="text-primary text-sm font-semibold mt-3">
                                    Browse {cat.name} →
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── FEATURED PRODUCTS ────────────────────── */}
                {(loading || featuredProducts.length > 0) && (
                    <div>
                        <SectionHeader
                            title="⭐ Featured Products"
                            subtitle="Hand-picked by our team just for you"
                            actionLabel="View All"
                            onAction={() => navigate('/shop')}
                        />

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3
                              lg:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : featuredProducts.length === 0 ? null : (
                            <div className="grid grid-cols-2 md:grid-cols-3
                              lg:grid-cols-4 gap-6">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── TOP SELLERS ──────────────────────────── */}
                {(loading || topSellers.length > 0) && (
                    <div>
                        <SectionHeader
                            title="🔥 Top Sellers"
                            subtitle="Most ordered products this week"
                            actionLabel="View All"
                            onAction={() => navigate('/shop')}
                        />

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3
                              lg:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : topSellers.length === 0 ? null : (
                            <div className="grid grid-cols-2 md:grid-cols-3
                              lg:grid-cols-4 gap-6">
                                {topSellers.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── WHY CHOOSE US ─────────────────────────── */}
                <div className="bg-brand-black rounded-3xl p-8 md:p-12">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">
                        Why Shop With Us?
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {(settings?.why_choose_us || [
                            { icon: '✅', title: 'Verified Products', desc: 'All products are quality checked' },
                            { icon: '🚚', title: 'Fast Delivery', desc: 'Lagos same day, nationwide 2-3 days' },
                            { icon: '💳', title: 'Secure Payment', desc: 'Bank transfer with proof verification' },
                            { icon: '🔄', title: '24hr Support', desc: 'WhatsApp support always available' },
                        ]).map((item) => (
                            <div key={item.title} className="text-center">
                                <div className="text-3xl mb-3">{item.icon}</div>
                                <p className="text-white font-bold text-sm">{item.title}</p>
                                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CTA BANNER ───────────────────────────── */}
                <div className="relative overflow-hidden bg-gradient-to-r
                        from-primary to-green-500 rounded-3xl p-8
                        md:p-12 text-center">
                    <div className="absolute top-0 right-0 w-64 h-64
                          bg-white/10 rounded-full -translate-y-1/2
                          translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48
                          bg-white/10 rounded-full translate-y-1/2
                          -translate-x-1/2" />
                    <div className="relative">
                        <h2 className="text-2xl md:text-3xl font-extrabold
                           text-white mb-3">
                            Ready to Shop?
                        </h2>
                        <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
                            Browse our full collection of phones, laptops and accessories.
                            Quality products at the best prices.
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-white text-primary font-bold px-8 py-3.5
                         rounded-xl text-sm hover:bg-gray-50 transition-all
                         hover:scale-[1.03] shadow-lg"
                        >
                            Browse All Products →
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}