// // @ts-nocheck
// import React from 'react'
// import { useState, useEffect } from 'react'
// import usePublicProducts from '../../hooks/usePublicProducts'
// import ProductCard from '../../components/customer/ProductCard'

// const Shop = () => {
//     const {products, loading, categories, fetchProducts} = usePublicProducts()
//     const [search, setSearch] = useState('')
//     const [categoryId, setCategoryId] = useState('')
//     const [priceRange, setPriceRange] = useState('')

//     // Price range options
//     const priceOptions = [
//         { label: 'All price', min: '', max: '' },
//         { label: 'Under ₦50,000', min: '', max: '50000' },
//         { label: '₦50,000 – ₦100,000', min: '50000', max: '100000' },
//         { label: '₦100,000 – ₦300,000', min: '100000', max: '300000' },
//         { label: 'Above ₦300,000', min: '300000', max: '' },
//     ]

//     // re-fetch whenever filters change
//     useEffect(() => {
//         window.scrollTo(0, 0)
//         const selected = priceOptions.find((_, i) => String(i) === priceRange)
//         fetchProducts({
//             search: search,
//             category_id: categoryId,
//             min_price: selected?.min || '',
//             max_price: selected?.max || '',
//         })
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [search, categoryId, priceRange])

//     const handleClearFilters =() => {
//         setSearch('')
//         setCategoryId('')
//         setPriceRange('')
//     }

//     const hasFilters = search || categoryId || priceRange

//   return (
      
//           <div className="max-w-6xl mx-auto px-2 py-10">

//               {/* Page Header */}
//               <div className="mb-8">
//                   <h1 className="text-2xl font-bold text-brand-charcoal">Shop</h1>
//                   <p className="text-neutral-slate text-sm mt-1">
//                       Browse our collection of phones, laptops and accessories
//                   </p>
//               </div>

//               {/* Search & Filters */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-100
//                       p-4 mb-8">
//                   <div className="flex flex-col md:flex-row gap-4">

//                       {/* Search */}
//                       <div className="flex-1 relative">
//                           <span className="absolute left-3 top-1/2 -translate-y-1/2
//                              text-neutral-slate text-sm">
//                               🔍
//                           </span>
//                           <input
//                               type="text"
//                               value={search}
//                               onChange={(e) => setSearch(e.target.value)}
//                               placeholder="Search products..."
//                               className="w-full pl-9 pr-4 py-2.5 border border-gray-200
//                          rounded-lg text-sm focus:outline-none
//                          focus:ring-2 focus:ring-primary"
//                           />
//                       </div>

//                       {/* Category Filter */}
//                       <select
//                           value={categoryId}
//                           onChange={(e) => setCategoryId(e.target.value)}
//                           className="border border-gray-200 rounded-lg px-4 py-2.5
//                        text-sm focus:outline-none focus:ring-2
//                        focus:ring-primary bg-white text-brand-charcoal
//                        min-w-40"
//                       >
//                           <option value="">All Categories</option>
//                           {categories.map((cat) => (
//                               <option key={cat.id} value={cat.id}>
//                                   {cat.name}
//                               </option>
//                           ))}
//                       </select>

//                       {/* Price Filter */}
//                       <select
//                           value={priceRange}
//                           onChange={(e) => setPriceRange(e.target.value)}
//                           className="border border-gray-200 rounded-lg px-4 py-2.5
//                        text-sm focus:outline-none focus:ring-2
//                        focus:ring-primary bg-white text-brand-charcoal
//                        min-w-45"
//                       >
//                           {priceOptions.map((opt, i) => (
//                               <option key={i} value={i === 0 ? '' : String(i)}>
//                                   {opt.label}
//                               </option>
//                           ))}
//                       </select>

//                       {/* Clear Filters */}
//                       {hasFilters && (
//                           <button
//                               onClick={handleClearFilters}
//                               className="text-sm text-red-500 hover:text-red-700
//                          font-medium whitespace-nowrap transition-colors"
//                           >
//                               ✕ Clear
//                           </button>
//                       )}
//                   </div>

//                   {/* Active filters summary */}
//                   {hasFilters && (
//                       <div className="mt-3 flex items-center gap-2 flex-wrap">
//                           <span className="text-xs text-neutral-slate">Filtering by:</span>
//                           {search && (
//                               <span className="bg-primary-light text-primary-dark text-xs
//                                px-2 py-1 rounded-full font-medium">
//                                   "{search}"
//                               </span>
//                           )}
//                           {categoryId && (
//                               <span className="bg-primary-light text-primary-dark text-xs
//                                px-2 py-1 rounded-full font-medium">
//                                   {categories.find(c => c.id === categoryId)?.name}
//                               </span>
//                           )}
//                           {priceRange && (
//                               <span className="bg-primary-light text-primary-dark text-xs
//                                px-2 py-1 rounded-full font-medium">
//                                   {priceOptions[Number(priceRange)]?.label}
//                               </span>
//                           )}
//                       </div>
//                   )}
//               </div>

//               {/* Results Count */}
//               {/* {!loading && (
//                   <p className="text-sm text-neutral-slate mb-6">
//                       {products.length === 0
//                           ? 'No products found'
//                           : `${products.length} product${products.length > 1 ? 's' : ''} found`
//                       }
//                   </p>
//               )} */}

//               {/* Product Grid */}
//               {loading ? (
//                   // Loading skeleton
//                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
//                       {[...Array(8)].map((_, i) => (
//                           <div key={i} className="bg-white rounded-xl overflow-hidden
//                                     shadow-sm border border-gray-100">
//                               <div className="h-48 bg-gray-100 animate-pulse" />
//                               <div className="p-4 space-y-2">
//                                   <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
//                                   <div className="h-4 bg-gray-100 rounded animate-pulse" />
//                                   <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
//                                   <div className="h-8 bg-gray-100 rounded animate-pulse mt-3" />
//                               </div>
//                           </div>
//                       ))}
//                   </div>

//               ) : products.length === 0 ? (
//                   // Empty state
//                   <div className="text-center py-20">
//                       <p className="text-5xl mb-4">🔍</p>
//                       <p className="text-xl font-bold text-brand-charcoal mb-2">
//                           No products found
//                       </p>
//                       <p className="text-neutral-slate text-sm mb-6">
//                           Try adjusting your search or filters
//                       </p>
//                       {hasFilters && (
//                           <button
//                               onClick={handleClearFilters}
//                               className="bg-primary hover:bg-primary-dark text-white
//                          px-6 py-2.5 rounded-lg font-semibold text-sm
//                          transition-all"
//                           >
//                               Clear Filters
//                           </button>
//                       )}
//                   </div>

//               ) : (
//                   // Product grid
//                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 ">
//                       {products.map((product) => (
//                           <ProductCard key={product.id} product={product} />
//                       ))}
//                   </div>
//               )}

//           </div>
//    )
// }

// export default Shop




/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal, ChevronDown, PackageSearch } from 'lucide-react';
import usePublicProducts from '../../hooks/usePublicProducts';
import ProductCard from '../../components/customer/ProductCard';

const Shop = () => {
    const { products, loading, categories, fetchProducts } = usePublicProducts();
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false); // For mobile filter toggle

    const priceOptions = [
        { label: 'All price', min: '', max: '' },
        { label: 'Under ₦50,000', min: '', max: '50000' },
        { label: '₦50,000 – ₦100,000', min: '50000', max: '100000' },
        { label: '₦100,000 – ₦300,000', min: '100000', max: '300000' },
        { label: 'Above ₦300,000', min: '300000', max: '' },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        const selected = priceOptions.find((_, i) => String(i) === priceRange);
        fetchProducts({
            search: search,
            category_id: categoryId,
            min_price: selected?.min || '',
            max_price: selected?.max || '',
        });
    }, [search, categoryId, priceRange]);

    const handleClearFilters = () => {
        setSearch('');
        setCategoryId('');
        setPriceRange('');
    };

    const hasFilters = search || categoryId || priceRange;

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* STICKY HEADER / SEARCH AREA */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Digital Showroom</h1>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Premium Inventory</p>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Modern Search Bar */}
                            <div className="relative group flex-1 md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Find your next device..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="md:hidden p-2.5 bg-slate-100 rounded-2xl text-slate-600"
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR FILTERS (Desktop) */}
                    <aside className={`lg:w-64 space-y-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        {/* Category Group */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setCategoryId('')}
                                    className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${!categoryId ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    All Products
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategoryId(cat.id)}
                                        className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${categoryId === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Group */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Price Bracket</h3>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                            >
                                {priceOptions.map((opt, i) => (
                                    <option key={i} value={i === 0 ? '' : String(i)}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {hasFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="w-full flex items-center justify-center gap-2 py-3 border border-red-100 text-red-500 rounded-2xl text-xs font-bold hover:bg-red-50 transition-colors"
                            >
                                <X className="w-4 h-4" /> Reset Filters
                            </button>
                        )}
                    </aside>

                    {/* PRODUCT LISTING AREA */}
                    <main className="flex-1">
                        {/* Active Filter Chips */}
                        <AnimatePresence>
                            {hasFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-wrap gap-2 mb-6"
                                >
                                    {search && (
                                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-700 shadow-sm">
                                            Search: {search} <X className="w-3 h-3 cursor-pointer text-slate-400" onClick={() => setSearch('')} />
                                        </div>
                                    )}
                                    {categoryId && (
                                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-700 shadow-sm">
                                            Category: {categories.find(c => c.id === categoryId)?.name} <X className="w-3 h-3 cursor-pointer text-slate-400" onClick={() => setCategoryId('')} />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {loading ? (
                            /* SKELETON GRID - Modernized */
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm">
                                        <div className="h-44 bg-slate-100 animate-pulse rounded-2xl" />
                                        <div className="p-3 space-y-3">
                                            <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                                            <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                                            <div className="h-10 bg-slate-100 rounded-xl w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            /* EMPTY STATE - Modernized */
                            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <PackageSearch className="w-10 h-10 text-slate-300" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Zero Results Found</h2>
                                <p className="text-slate-400 text-sm mt-2 max-w-xs">
                                    Our inventory couldn't match those parameters. Try adjusting your scope.
                                </p>
                                <button onClick={handleClearFilters} className="mt-8 text-primary font-bold text-sm underline underline-offset-4">
                                    Back to all products
                                </button>
                            </div>
                        ) : (
                            /* PRODUCT GRID - Staggered Motion */
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.05 } }
                                }}
                                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                            >
                                {products.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        variants={{
                                            hidden: { opacity: 0, scale: 0.95 },
                                            visible: { opacity: 1, scale: 1 }
                                        }}
                                        className="bg-white p-2 rounded-[32px] border border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;