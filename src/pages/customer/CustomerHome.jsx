// // // @ts-nocheck
// // import Layout from '../../components/common/Layout'
// // import { Navigate, useNavigate } from 'react-router-dom'
// // import ProductCard from '../../components/customer/ProductCard'
// // import usePublicProducts from '../../hooks/usePublicProducts'
// // import useSettings from '../../hooks/useSettings'

// // const CustomerHome = () => {
// //     const navigate = useNavigate()
// //     // const [loading, setLoading] = useState(true)
// //     const {products, loading} = usePublicProducts()
// //     const {settings} = useSettings()

// //     return (

// //         <div className="max-w-6xl mx-auto px-2 py-12 ">

// //             {/* Hero */}
// //             <div className="bg-linear-to-br from-black via-[#0d0d0d] to-gray-900 rounded-2xl p-12 mb-14 flex flex-col items-center text-center shadow-lg">
// //                 <h1 className="text-4xl font-extrabold text-white mb-3">
// //                     Welcome to <span className="text-primary">{ settings?.store_name }</span>
// //                 </h1>
// //                 <p className="text-gray-400 text-sm max-w-md mb-6">
// //                     Your one-stop shop for phones, laptops and accessories
// //                 </p>
// //                 <button onClick={() => navigate('/shop')} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-[1.03] shadow-md">
// //                     Shop Now
// //                 </button>
// //             </div>

// //             {/* Categories */}
// //             <div className="mb-14">
// //                 <h2 className="text-xl font-bold text-brand-charcoal mb-6">
// //                     Browse Categories
// //                 </h2>
// //                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
// //                     {[
// //                         { name: 'Phones', icon: '📱', desc: 'Latest smartphones' },
// //                         { name: 'Laptops', icon: '💻', desc: 'Powerful laptops' },
// //                         { name: 'Accessories', icon: '🎧', desc: 'Gadgets & accessories' },
// //                         { name: 'Others', icon: '🛍️', desc: 'Other Products'}
// //                     ].map((cat) => (
// //                         <div key={cat.name} onClick={() => navigate('/shop')}
// //                             className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
// //                             <p className="text-4xl mb-3">{cat.icon}</p>
// //                             <p className="font-bold text-brand-charcoal">{cat.name}</p>
// //                             <p className="text-neutral-slate text-sm max-w-sm mx-auto">{cat.desc}</p>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>

// //             {/* Products Placeholder */}
// //             <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-8 px-6">
// //                 <div className="flex items-center justify-between mb-6">

// //                     <h2 className="text-xl font-bold text-brand-charcoal mb-6">
// //                         Featured Products
// //                     </h2>
// //                     <button
// //                         onClick={() => navigate('/shop')}
// //                         className="text-primary text-sm font-semibold hover:underline">
// //                         View All →
// //                     </button>
// //                 </div>

// //                 {/* Product Grid */}
// //                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
// //                         {products.map((product) => (
// //                             <ProductCard key={product.id} product={product} />
// //                         ))}
// //                 </div>

// //                 {loading && (
// //                     <div className="flex flex-col justify-center items-center text-center py-16">
// //                         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
// //                         <p className="text-neutral-slate mt-4 text-sm">Loading products...</p>
// //                     </div>
// //                 )}

// //                 {products.length === 0 && !loading && (

// //                     <div className="text-center py-16">
// //                         <p className="text-5xl mb-4">📦</p>                        <p className="text-neutral-slate text-sm">
// //                             Products will appear here once the admin adds them.
// //                         </p>
// //                     </div>
// //                 )}
// //             </div>

// //         </div>

// //     )
// // }

// // export default CustomerHome



// // @ts-nocheck
// import { useNavigate } from 'react-router-dom'
// // import { useHomeProducts } from '../../hooks/useHomeProducts'
// import useHomeProducts from '../../hooks/useHomeProducts'
// // import { useSettings } from '../../hooks/useSettings'
// import ProductCard from '../../components/customer/ProductCard'
// import useSettings from '../../hooks/useSettings'

// // Loading skeleton for product cards
// function ProductSkeleton() {
//     return (
//         <div className="bg-white rounded-2xl overflow-hidden shadow-sm
//                     border border-gray-100 animate-pulse">
//             <div className="h-48 bg-gray-100" />
//             <div className="p-4 space-y-3">
//                 <div className="h-3 bg-gray-100 rounded w-1/3" />
//                 <div className="h-4 bg-gray-100 rounded" />
//                 <div className="h-4 bg-gray-100 rounded w-3/4" />
//                 <div className="flex justify-between items-center mt-2">
//                     <div className="h-6 bg-gray-100 rounded w-1/3" />
//                     <div className="h-8 bg-gray-100 rounded w-1/4" />
//                 </div>
//             </div>
//         </div>
//     )
// }

// // Section Header Component
// function SectionHeader({ title, subtitle, actionLabel, onAction }) {
//     return (
//         <div className="flex items-end justify-between mb-6">
//             <div>
//                 <h2 className="text-xl md:text-2xl font-bold text-brand-charcoal">
//                     {title}
//                 </h2>
//                 {subtitle && (
//                     <p className="text-neutral-slate text-sm mt-1">{subtitle}</p>
//                 )}

//             </div>
//             {actionLabel && (
//                 <button
//                     onClick={onAction}
//                     className="text-primary text-sm font-semibold hover:underline
//                      transition-colors shrink-0 ml-4"
//                 >
//                     {actionLabel} →
//                 </button>
//             )}
//         </div>
//     )
// }

// export default function CustomerHome() {
//     const navigate = useNavigate()
//     const { settings } = useSettings()
//     const { featuredProducts, topSellers,
//         loading } = useHomeProducts()

//     const storeName = settings?.store_name
//     const storeDesc = settings?.store_description
//     return (
//         <div className="min-h-screen bg-neutral-light">

//             {/* ── HERO SECTION ─────────────────────────── */}
//             <div className="relative overflow-hidden bg-brand-black h-3/4">
//                 {/* Background gradient orbs */}
//                 <div className="absolute top-0 left-1/4 w-96 h-screen bg-primary/20
//                         rounded-full blur-3xl -translate-y-1/2" />
//                 <div className="absolute bottom-0  right-1/4 w-64 h-64 bg-primary/10
//                         rounded-full blur-2xl translate-y-1/2" />

//                 <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
//                     <div className="max-w-2xl">

//                         {/* Tag */}
//                         <div className="inline-flex items-center gap-2 bg-primary/20
//                             border border-primary/30 rounded-full px-4 py-1.5
//                             mb-6">
//                             <div className="w-2 h-2 bg-primary rounded-full
//                               animate-pulse" />
//                             <span className="text-primary text-xs font-semibold
//                                uppercase tracking-wider">
//                                 {settings?.hero_badge_text || 'Now Live — Shop Online'}
//                             </span>
//                         </div>

//                         {/* Headline */}
//                         <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold
//                            text-white leading-tight mb-4">
//                             Welcome to{' '}
//                             <span className="text-transparent bg-clip-text
//                                bg-linear-to-r from-primary to-blue-400">
//                                 {storeName}
//                             </span>
//                         </h1>

//                         <p className="text-gray-400 text-base md:text-lg mb-8
//                           leading-relaxed max-w-lg">
//                             {storeDesc}
//                         </p>

//                         {/* CTA Buttons */}
//                         <div className="flex gap-4 flex-wrap">
//                             <button
//                                 onClick={() => navigate('/shop')}
//                                 className="bg-primary hover:bg-primary-dark text-white
//                            px-8 py-3.5 rounded-xl font-bold text-sm
//                            transition-all hover:scale-[1.03]
//                            shadow-lg shadow-primary/30"
//                             >
//                                 {settings?.hero_cta_text || 'Shop Now'} →
//                             </button>
//                             <button
//                                 onClick={() => navigate('/about')}
//                                 className="border border-white/20 hover:border-white/40
//                            text-white px-8 py-3.5 rounded-xl font-bold
//                            text-sm transition-all hover:bg-white/5"
//                             >
//                                 About Us
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* ── STATS BAR ────────────────────────────── */}
//             <div className="bg-white border-b border-gray-100 mt-8">
//                 <div className="max-w-6xl mx-auto px-6 py-4">
//                     <div className="grid grid-cols-3 gap-4 text-center">
//                         {[
//                             { label: 'Products', value: settings?.stat_products || '100+', icon: '📦' },
//                             { label: 'Customers', value: settings?.stat_customers || '500+', icon: '👥' },
//                             { label: 'Deliveries', value: settings?.stat_deliveries || '1000+', icon: '🚚' },
//                         ].map((stat) => (
//                             <div key={stat.label}>
//                                 <p className="text-xl font-extrabold text-brand-charcoal">
//                                     {stat.icon} {stat.value}
//                                 </p>
//                                 <p className="text-neutral-slate text-xs mt-0.5">{stat.label}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

//                 {/* ── CATEGORIES ───────────────────────────── */}
//                 <div>
//                     <SectionHeader
//                         title="Browse Categories"
//                         subtitle="Find exactly what you're looking for"
//                     />
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                         {(settings?.store_categories || [
//                             { name: 'Phones', icon: '📱', desc: 'Latest smartphones' },
//                             { name: 'Laptops', icon: '💻', desc: 'Powerful laptops' },
//                             { name: 'Accessories', icon: '🎧', desc: 'Gadgets & accessories' },
//                         ]).map((cat) => (
//                             <button key={cat.name} onClick={() => navigate('/shop')}
//                                 className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100
//                text-left hover:shadow-md hover:scale-[1.02] transition-all
//                hover:border-primary/30 group">
//                                 <div className="text-4xl mb-3 group-hover:scale-110
//                     transition-transform inline-block">
//                                     {cat.icon}
//                                 </div>
//                                 <p className="font-bold text-brand-charcoal text-lg">{cat.name}</p>
//                                 <p className="text-neutral-slate text-sm mt-1">{cat.desc}</p>
//                                 <p className="text-primary text-sm font-semibold mt-3">
//                                     Browse {cat.name} →
//                                 </p>
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* ── FEATURED PRODUCTS ────────────────────── */}
//                 {(loading || featuredProducts.length > 0) && (
//                     <div>
//                         <SectionHeader
//                             title="⭐ Featured Products"
//                             subtitle="Hand-picked by our team just for you"
//                             actionLabel="View All"
//                             onAction={() => navigate('/shop')}
//                         />

//                         {loading ? (
//                             <div className="grid grid-cols-2 md:grid-cols-3
//                               lg:grid-cols-4 gap-6">
//                                 {[...Array(4)].map((_, i) => (
//                                     <ProductSkeleton key={i} />
//                                 ))}
//                             </div>
//                         ) : featuredProducts.length === 0 ? null : (
//                             <div className="grid grid-cols-2 md:grid-cols-3
//                               lg:grid-cols-4 gap-6">
//                                 {featuredProducts.map((product) => (
//                                     <ProductCard key={product.id} product={product} />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* ── TOP SELLERS ──────────────────────────── */}
//                 {(loading || topSellers.length > 0) && (
//                     <div>
//                         <SectionHeader
//                             title="🔥 Top Sellers"
//                             subtitle="Most ordered products this week"
//                             actionLabel="View All"
//                             onAction={() => navigate('/shop')}
//                         />

//                         {loading ? (
//                             <div className="grid grid-cols-2 md:grid-cols-3
//                               lg:grid-cols-4 gap-6">
//                                 {[...Array(4)].map((_, i) => (
//                                     <ProductSkeleton key={i} />
//                                 ))}
//                             </div>
//                         ) : topSellers.length === 0 ? null : (
//                             <div className="grid grid-cols-2 md:grid-cols-3
//                               lg:grid-cols-4 gap-6">
//                                 {topSellers.map((product) => (
//                                     <ProductCard key={product.id} product={product} />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* ── WHY CHOOSE US ─────────────────────────── */}
//                 <div className="bg-brand-black rounded-3xl p-8 md:p-12">
//                     <h2 className="text-2xl font-bold text-white text-center mb-8">
//                         Why Shop With Us?
//                     </h2>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                         {(settings?.why_choose_us || [
//                             { icon: '✅', title: 'Verified Products', desc: 'All products are quality checked' },
//                             { icon: '🚚', title: 'Fast Delivery', desc: 'Lagos same day, nationwide 2-3 days' },
//                             { icon: '💳', title: 'Secure Payment', desc: 'Bank transfer with proof verification' },
//                             { icon: '🔄', title: '24hr Support', desc: 'WhatsApp support always available' },
//                         ]).map((item) => (
//                             <div key={item.title} className="text-center">
//                                 <div className="text-3xl mb-3">{item.icon}</div>
//                                 <p className="text-white font-bold text-sm">{item.title}</p>
//                                 <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* ── CTA BANNER ───────────────────────────── */}
//                 <div className="relative overflow-hidden bg-gradient-to-r
//                         from-primary to-blue-500 rounded-3xl p-8
//                         md:p-12 text-center">
//                     <div className="absolute top-0 right-0 w-64 h-64
//                           bg-white/10 rounded-full -translate-y-1/2
//                           translate-x-1/2" />
//                     <div className="absolute bottom-0 left-0 w-48 h-48
//                           bg-white/10 rounded-full translate-y-1/2
//                           -translate-x-1/2" />
//                     <div className="relative">
//                         <h2 className="text-2xl md:text-3xl font-extrabold
//                            text-white mb-3">
//                             Ready to Shop?
//                         </h2>
//                         <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
//                             Browse our full collection of phones, laptops and accessories.
//                             Quality products at the best prices.
//                         </p>
//                         <button
//                             onClick={() => navigate('/shop')}
//                             className="bg-white text-primary font-bold px-8 py-3.5
//                          rounded-xl text-sm hover:bg-gray-50 transition-all
//                          hover:scale-[1.03] shadow-lg"
//                         >
//                             Browse All Products →
//                         </button>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     )
// }



// @ts-nocheck
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Truck, Headset, ArrowRight, Star, Flame } from 'lucide-react';
import useHomeProducts from '../../hooks/useHomeProducts';
import useSettings from '../../hooks/useSettings';
import ProductCard from '../../components/customer/ProductCard';

// Optimized Skeleton Loader
const ProductSkeleton = () => (
    <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 animate-pulse">
        <div className="h-48 bg-slate-100" />
        <div className="p-5 space-y-3">
            <div className="h-3 bg-slate-100 rounded w-1/3" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-slate-100 rounded w-1/4" />
                <div className="h-9 bg-slate-100 rounded w-1/3" />
            </div>
        </div>
    </div>
);

// Reusable Section Header with improved spacing
const SectionHeader = ({ title, subtitle, icon: Icon, actionLabel, onAction }) => (
    <div className="flex items-end justify-between mb-8">
        <div>
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {title}
                </h2>
            </div>
            {subtitle && <p className="text-slate-500 text-sm font-medium">{subtitle}</p>}
        </div>
        {actionLabel && (
            <button
                onClick={onAction}
                className="group flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all"
            >
                {actionLabel} <ArrowRight className="w-4 h-4" />
            </button>
        )}
    </div>
);

export default function CustomerHome() {
    const navigate = useNavigate();
    const { settings } = useSettings();
    const { featuredProducts, topSellers, loading } = useHomeProducts();

    // Memoize settings for stability
    const config = useMemo(() => ({
        name: settings?.store_name || "MarketMate",
        desc: settings?.store_description || "Securely buy, sell, and swap devices.",
        badge: settings?.hero_badge_text || "The Future of Device Commerce",
    }), [settings]);

    return (
        <div className="min-h-screen bg-slate-50/50">

            {/* ── HERO SECTION ─────────────────────────── */}
            <section className="relative bg-slate-900 py-20 lg:py-32 overflow-hidden">
                {/* Visual Blobs */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                                {config.badge}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
                            Upgrade Smarter at <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                                {config.name}
                            </span>
                        </h1>

                        <p className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed max-w-xl font-medium">
                            {config.desc}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/shop')}
                                className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
                            >
                                Start Shopping <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-4 rounded-2xl font-bold transition-all"
                            >
                                How it works
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── STATS / TRUST BAR ────────────────────── */}
            <div className="relative z-10 -mt-10 max-w-5xl mx-auto px-6">
                <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 grid grid-cols-3 gap-4">
                    {[
                        { label: 'Verified Devices', value: settings?.stat_products || '2.4k+', color: 'text-blue-600' },
                        { label: 'Active Swappers', value: settings?.stat_customers || '850+', color: 'text-emerald-600' },
                        { label: 'Safe Deliveries', value: settings?.stat_deliveries || '1.2k+', color: 'text-primary' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center border-r last:border-0 border-slate-100">
                            <p className={`text-xl md:text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                            <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">

                {/* ── CATEGORIES ───────────────────────────── */}
                <section>
                    <SectionHeader title="Explore Categories" subtitle="What are you looking for today?" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(settings?.store_categories || [
                            { name: 'Phones', icon: '📱', desc: 'Flagships & Budget' },
                            { name: 'Laptops', icon: '💻', desc: 'Work & Gaming' },
                            { name: 'Accessories', icon: '🎧', desc: 'Premium Audio' },
                            { name: 'Tablets', icon: '📱', desc: 'IPads & More' }
                        ]).map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => navigate('/shop')}
                                className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-center"
                            >
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
                                <h3 className="font-bold text-slate-900 text-lg">{cat.name}</h3>
                                <p className="text-slate-400 text-xs mt-1">{cat.desc}</p>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── FEATURED ─────────────────────────────── */}
                <section>
                    <SectionHeader
                        title="Featured Deals"
                        icon={Star}
                        subtitle="Top quality devices at unbeatable prices"
                        actionLabel="View all deals"
                        onAction={() => navigate('/shop')}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loading ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
                            : featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </section>

                {/* ── TOP SELLERS ──────────────────────────── */}
                <section>
                    <SectionHeader
                        title="Top Sellers"
                        icon={Flame}
                        subtitle="The most sought-after tech this week"
                        actionLabel="Check availability"
                        onAction={() => navigate('/shop')}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loading ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
                            : topSellers.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </section>

                {/* ── WHY MARKETMATE ───────────────────────── */}
                <section className="bg-slate-900 rounded-[48px] p-10 md:p-20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px]" />
                    <div className="relative z-10 text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why MarketMate?</h2>
                        <p className="text-slate-400 font-medium">We're changing the way Africa trades technology.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {[
                            { icon: ShieldCheck, title: 'Verified Only', desc: 'Every device undergoes a 20-point quality check.' },
                            { icon: Truck, title: 'Priority Shipping', desc: 'Same-day delivery within Lagos & Abuja.' },
                            { icon: Zap, title: 'Instant Swap', desc: 'Exchange your old device for a new one in minutes.' },
                            { icon: Headset, title: 'Expert Support', desc: 'Real humans ready to help you on WhatsApp 24/7.' },
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors">
                                    <item.icon className="w-8 h-8 text-primary group-hover:text-white" />
                                </div>
                                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                                <p className="text-slate-400 text-xs leading-relaxed px-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}