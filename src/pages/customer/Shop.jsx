// @ts-nocheck
import React from 'react'
import { useState, useEffect } from 'react'
import usePublicProducts from '../../hooks/usePublicProducts'
import ProductCard from '../../components/customer/ProductCard'

const Shop = () => {
    const {products, loading, categories, fetchProducts} = usePublicProducts()
    const [search, setSearch] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [priceRange, setPriceRange] = useState('')

    // Price range options
    const priceOptions = [
        { label: 'All price', min: '', max: '' },
        { label: 'Under ₦50,000', min: '', max: '50000' },
        { label: '₦50,000 – ₦100,000', min: '50000', max: '100000' },
        { label: '₦100,000 – ₦300,000', min: '100000', max: '300000' },
        { label: 'Above ₦300,000', min: '300000', max: '' },
    ]

    // re-fetch whenever filters change
    useEffect(() => {
        window.scrollTo(0, 0)
        const selected = priceOptions.find((_, i) => String(i) === priceRange)
        fetchProducts({
            search: search,
            category_id: categoryId,
            min_price: selected?.min || '',
            max_price: selected?.max || '',
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, categoryId, priceRange])

    const handleClearFilters =() => {
        setSearch('')
        setCategoryId('')
        setPriceRange('')
    }

    const hasFilters = search || categoryId || priceRange

  return (
      
          <div className="max-w-6xl mx-auto px-2 py-10">

              {/* Page Header */}
              <div className="mb-8">
                  <h1 className="text-2xl font-bold text-brand-charcoal">Shop</h1>
                  <p className="text-neutral-slate text-sm mt-1">
                      Browse our collection of phones, laptops and accessories
                  </p>
              </div>

              {/* Search & Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100
                      p-4 mb-8">
                  <div className="flex flex-col md:flex-row gap-4">

                      {/* Search */}
                      <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2
                             text-neutral-slate text-sm">
                              🔍
                          </span>
                          <input
                              type="text"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder="Search products..."
                              className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                         rounded-lg text-sm focus:outline-none
                         focus:ring-2 focus:ring-primary"
                          />
                      </div>

                      {/* Category Filter */}
                      <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="border border-gray-200 rounded-lg px-4 py-2.5
                       text-sm focus:outline-none focus:ring-2
                       focus:ring-primary bg-white text-brand-charcoal
                       min-w-40"
                      >
                          <option value="">All Categories</option>
                          {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                  {cat.name}
                              </option>
                          ))}
                      </select>

                      {/* Price Filter */}
                      <select
                          value={priceRange}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="border border-gray-200 rounded-lg px-4 py-2.5
                       text-sm focus:outline-none focus:ring-2
                       focus:ring-primary bg-white text-brand-charcoal
                       min-w-45"
                      >
                          {priceOptions.map((opt, i) => (
                              <option key={i} value={i === 0 ? '' : String(i)}>
                                  {opt.label}
                              </option>
                          ))}
                      </select>

                      {/* Clear Filters */}
                      {hasFilters && (
                          <button
                              onClick={handleClearFilters}
                              className="text-sm text-red-500 hover:text-red-700
                         font-medium whitespace-nowrap transition-colors"
                          >
                              ✕ Clear
                          </button>
                      )}
                  </div>

                  {/* Active filters summary */}
                  {hasFilters && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-neutral-slate">Filtering by:</span>
                          {search && (
                              <span className="bg-primary-light text-primary-dark text-xs
                               px-2 py-1 rounded-full font-medium">
                                  "{search}"
                              </span>
                          )}
                          {categoryId && (
                              <span className="bg-primary-light text-primary-dark text-xs
                               px-2 py-1 rounded-full font-medium">
                                  {categories.find(c => c.id === categoryId)?.name}
                              </span>
                          )}
                          {priceRange && (
                              <span className="bg-primary-light text-primary-dark text-xs
                               px-2 py-1 rounded-full font-medium">
                                  {priceOptions[Number(priceRange)]?.label}
                              </span>
                          )}
                      </div>
                  )}
              </div>

              {/* Results Count */}
              {/* {!loading && (
                  <p className="text-sm text-neutral-slate mb-6">
                      {products.length === 0
                          ? 'No products found'
                          : `${products.length} product${products.length > 1 ? 's' : ''} found`
                      }
                  </p>
              )} */}

              {/* Product Grid */}
              {loading ? (
                  // Loading skeleton
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {[...Array(8)].map((_, i) => (
                          <div key={i} className="bg-white rounded-xl overflow-hidden
                                    shadow-sm border border-gray-100">
                              <div className="h-48 bg-gray-100 animate-pulse" />
                              <div className="p-4 space-y-2">
                                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                                  <div className="h-8 bg-gray-100 rounded animate-pulse mt-3" />
                              </div>
                          </div>
                      ))}
                  </div>

              ) : products.length === 0 ? (
                  // Empty state
                  <div className="text-center py-20">
                      <p className="text-5xl mb-4">🔍</p>
                      <p className="text-xl font-bold text-brand-charcoal mb-2">
                          No products found
                      </p>
                      <p className="text-neutral-slate text-sm mb-6">
                          Try adjusting your search or filters
                      </p>
                      {hasFilters && (
                          <button
                              onClick={handleClearFilters}
                              className="bg-primary hover:bg-primary-dark text-white
                         px-6 py-2.5 rounded-lg font-semibold text-sm
                         transition-all"
                          >
                              Clear Filters
                          </button>
                      )}
                  </div>

              ) : (
                  // Product grid
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 ">
                      {products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                      ))}
                  </div>
              )}

          </div>
   )
}

export default Shop