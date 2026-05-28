// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useProducts } from '../../hooks/useProducts'
import toast from 'react-hot-toast'

export default function Products() {
    const { products, loading, deleteProduct, fetchProducts, toggleFeatured } = useProducts()
    const [search, setSearch] = useState('')
    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(null)
    const [stockFilter, setStockFilter] = useState('all')


    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?')
        if (!confirmed) return

        setDeleting(id)
        try {
            await deleteProduct(id)
            toast.success('Product deleted successfully')
        } catch (err) {
            alert('Failed to delete product: ' + err.message)
        } finally {
            setDeleting(null)
        }
    }

    const filteredProducts = products.filter((p) => {
        // 1. Check if it matches search (Name or Brand)
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.brand?.toLowerCase().includes(search.toLowerCase());

        // 2. Check if it matches the selected stock filter
        const matchesStock = stockFilter === 'out_of_stock'
            ? p.stock === 0
            : stockFilter === 'low_stock'
                ? p.stock > 0 && p.stock <= p.low_stock_threshold
                : true;

        // Only return true if it passes BOTH filters
        return matchesSearch && matchesStock;
    });

    return (
        <AdminLayout>
            <div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-brand-charcoal">Products</h1>
                        <p className="text-neutral-slate text-sm mt-1">
                            Manage your store products
                        </p>
                    </div>

                    {/* Search + Button */}
                    <div className="flex items-center gap-3">

                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-64 px-4 py-2.5 rounded-lg border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-primary/30
                   text-sm"
                        />

                        {/* Add Button */}
                        <button
                            onClick={() => navigate('/admin/products/add')}
                            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5
                   rounded-lg font-semibold text-sm transition-all hover:scale-[1.02]"
                        >
                            + Add Product
                        </button>
                    </div>
                </div>
                {/* Stock Filter Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {[
                        { label: 'All Products', value: 'all' },
                        { label: '⚠️ Low Stock', value: 'low_stock' },
                        { label: '❌ Out of Stock', value: 'out_of_stock' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setStockFilter(tab.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium
                  transition-all
        ${stockFilter === tab.value
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-neutral-slate border border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {tab.label}
                            {tab.value === 'out_of_stock' && (
                                <span className="ml-2 bg-red-100 text-red-600 text-xs
                         px-1.5 py-0.5 rounded-full font-bold">
                                    {products.filter(p => p.stock === 0).length}
                                </span>
                            )}
                            {tab.value === 'low_stock' && (
                                <span className="ml-2 bg-amber-100 text-amber-700 text-xs
                         px-1.5 py-0.5 rounded-full font-bold">
                                    {products.filter(p =>
                                        p.stock > 0 && p.stock <= p.low_stock_threshold
                                    ).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">

                    {loading ? (
                        <div className="flex flex-col justify-center items-center text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                            <p className="text-neutral-slate">Loading products...</p>
                        </div>

                    ) : products.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-3">📦</p>
                            <p className="text-brand-charcoal font-semibold mb-1">No products yet</p>
                            <p className="text-neutral-slate text-sm mb-6">
                                Add your first product to get started
                            </p>
                            <button
                                onClick={() => navigate('/admin/products/add')}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5
                           rounded-lg font-semibold text-sm transition-all"
                            >
                                + Add  Products
                            </button>
                        </div>

                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-xs font-bold text-neutral-slate
                                   uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-neutral-slate
                                   uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-neutral-slate
                                   uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-neutral-slate
                                   uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-neutral-slate
                                   uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-neutral-slate
                                   uppercase tracking-wider">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">

                                            {/* Product Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-neutral-light
                                          overflow-hidden shrink-0">
                                                        {product.cover_image ? (
                                                            <img
                                                                src={product.cover_image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center
                                              justify-center text-xl">
                                                                📦
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-brand-charcoal text-sm">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-neutral-slate text-xs">{product.brand}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-neutral-slate">
                                                    {product.categories?.name || '—'}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-primary">
                                                    ₦{Number(product.price).toLocaleString()}
                                                </span>
                                            </td>

                                            {/* Stock */}
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-semibold
                          ${product.stock <= product.low_stock_threshold
                                                        ? 'text-red-500'
                                                        : 'text-brand-charcoal'
                                                    }`}>
                                                    {product.stock} units
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs
                      font-semibold w-fit
      ${product.is_active
                                                            ? 'bg-primary-light text-primary-dark'
                                                            : 'bg-gray-100 text-neutral-slate'
                                                        }`}>
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                    {product.is_featured && (
                                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs
                        font-semibold bg-amber-100 text-amber-700 w-fit">
                                                            ⭐ Featured
                                                        </span>
                                                    )}
                                                    {product.stock === 0 && (
                                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs
                        font-semibold bg-red-100 text-red-600 w-fit">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm
                                       font-medium transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <span className="text-gray-300">|</span>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        disabled={deleting === product.id}
                                                        className="text-red-500 hover:text-red-700 text-sm
                                       font-medium transition-colors
                                       disabled:opacity-50"
                                                    >
                                                        {deleting === product.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                    {/* Featured Toggle */}
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await toggleFeatured(product.id, product.is_featured)
                                                                toast.success(
                                                                    product.is_featured
                                                                        ? 'Removed from featured'
                                                                        : 'Added to featured!'
                                                                )
                                                            } catch (err) {
                                                                toast.error(err.message)
                                                            }
                                                        }}
                                                        title={product.is_featured ? 'Remove from featured' : 'Mark as featured'}
                                                        className={`text-lg transition-all hover:scale-110
    ${product.is_featured
                                                                ? 'text-amber-400 hover:text-amber-600'
                                                                : 'text-gray-300 hover:text-amber-400'
                                                            }`}
                                                    >
                                                        ★
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    )
}