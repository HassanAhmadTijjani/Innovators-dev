// @ts-nocheck
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useProducts } from '../../hooks/useProducts'
import { uploadImage, uploadMultipleImages } from '../../utils/uploadImage'
import { supabase } from '../../lib/supabase'

export default function EditProduct() {
    const { id } = useParams()
    const { updateProduct, fetchCategories } = useProducts()
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [error, setError] = useState('')
    const [extraImages, setExtraImages] = useState([])
    const [extraImagePreviews, setExtraPreviews] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [colorInput, setColorInput] = useState('')
    const [colors, setColors] = useState([])

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        brand: '',
        stock: '',
        low_stock_threshold: '3',
        is_active: true,
        cover_image: null,
    })

    useEffect(() => {
        async function loadData() {
            try {
                const [cats, productRes] = await Promise.all([
                    fetchCategories(),
                    supabase.from('products').select('*').eq('id', id).single()
                ])

                setCategories(cats)
                if (productRes.error) throw productRes.error

                const p = productRes.data

                // ✅ use p (productRes.data) not product (undefined)
                if (p.images && p.images.length > 0) {
                    setExistingImages(p.images)
                }

                setForm({
                    name: p.name,
                    description: p.description || '',
                    price: p.price,
                    category_id: p.category_id || '',
                    brand: p.brand || '',
                    stock: p.stock,
                    low_stock_threshold: p.low_stock_threshold,
                    is_active: p.is_active,
                    cover_image: p.cover_image,
                })

                if (p.colors && p.colors.length > 0) {
                    setColors(p.colors)
                  }

                if (p.cover_image) setImagePreview(p.cover_image)

            } catch (err) {
                setError(err.message)
            } finally {
                setFetching(false)
            }
        }
        loadData()
    }, [fetchCategories, id])

    function handleChange(e) {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    }

    function handleImageChange(e) {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    // ✅ was missing in your file
    function handleExtraImages(e) {
        const files = Array.from(e.target.files).slice(
            0, 4 - existingImages.length
        )
        setExtraImages(files)
        setExtraPreviews(files.map(f => URL.createObjectURL(f)))
    }

    function removeExtraImage(index) {
        setExtraImages(extraImages.filter((_, i) => i !== index))
        setExtraPreviews(extraImagePreviews.filter((_, i) => i !== index))
    }

    function removeExistingImage(index) {
        setExistingImages(existingImages.filter((_, i) => i !== index))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // upload new cover if selected
            let cover_image = form.cover_image
            if (imageFile) {
                cover_image = await uploadImage(imageFile)
            }

            // upload new extra images
            let newImageUrls = []
            if (extraImages.length > 0) {
                newImageUrls = await uploadMultipleImages(extraImages)
            }

            // merge kept existing + new uploads
            const allImages = [...existingImages, ...newImageUrls]

            // ✅ single updateProduct call with images included
            await updateProduct(id, {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                category_id: form.category_id,
                brand: form.brand,
                stock: parseInt(form.stock),
                low_stock_threshold: parseInt(form.low_stock_threshold),
                is_active: form.is_active,
                cover_image,
                images: allImages,
                colors: colors,
            })

            navigate('/admin/products')

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    function handleAddColor(e) {
        e.preventDefault()
        const trimmed = colorInput.trim()
        if (!trimmed || colors.includes(trimmed)) return
        setColors([...colors, trimmed])
        setColorInput('')
    }

    function removeColor(color) {
        setColors(colors.filter(c => c !== color))
      }

    if (fetching) return (
        <AdminLayout>
            <div className="flex items-center justify-center h-64">
                <p className="text-neutral-slate">Loading product...</p>
            </div>
        </AdminLayout>
    )

    return (
        <AdminLayout>
            <div className="max-w-2xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/admin/products')}
                        className="text-neutral-slate hover:text-brand-charcoal transition-colors">
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-charcoal">Edit Product</h1>
                        <p className="text-neutral-slate text-sm mt-1">Update product details</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                          rounded-lg px-4 py-3 mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Cover Image */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <label className="block text-sm font-semibold text-brand-charcoal mb-4">
                            Cover Image
                        </label>
                        {imagePreview && (
                            <div className="relative w-40 h-40 rounded-xl overflow-hidden mb-4">
                                <img src={imagePreview} alt="Preview"
                                    className="w-full h-full object-cover" />
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange}
                            className="block w-full text-sm text-neutral-slate
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg
                         file:border-0 file:bg-primary-light file:text-primary-dark
                         file:font-semibold file:text-sm hover:file:bg-primary
                         hover:file:text-white file:transition-all cursor-pointer" />
                        <p className="text-xs text-neutral-slate mt-2">
                            Leave empty to keep the current image
                        </p>
                    </div>

                    {/* Existing Extra Images */}
                    {existingImages.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <label className="block text-sm font-medium text-brand-charcoal mb-3">
                                Current Extra Images
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {existingImages.map((url, i) => (
                                    <div key={i}
                                        className="relative w-20 h-20 rounded-lg overflow-hidden
                                  border border-gray-200 shrink-0">
                                        <img src={url} alt={`Image ${i + 1}`}
                                            className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeExistingImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white
                                 rounded-full w-5 h-5 flex items-center
                                 justify-center text-xs font-bold">
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add New Extra Images */}
                    {(existingImages.length + extraImages.length) < 4 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                Add More Images
                                <span className="text-neutral-slate font-normal ml-1">
                                    ({4 - existingImages.length - extraImages.length} slots remaining)
                                </span>
                            </label>
                            <input type="file" accept="image/*" multiple
                                onChange={handleExtraImages}
                                className="block w-full text-sm text-neutral-slate
                           file:mr-4 file:py-2 file:px-4 file:rounded-lg
                           file:border-0 file:bg-primary-light file:text-primary-dark
                           file:font-semibold file:text-sm hover:file:bg-primary
                           hover:file:text-white file:transition-all cursor-pointer" />

                            {extraImagePreviews.length > 0 && (
                                <div className="flex gap-3 mt-3 flex-wrap">
                                    {extraImagePreviews.map((preview, i) => (
                                        <div key={i}
                                            className="relative w-20 h-20 rounded-lg overflow-hidden
                                    border border-gray-200 shrink-0">
                                            <img src={preview} alt={`New ${i + 1}`}
                                                className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeExtraImage(i)}
                                                className="absolute top-1 right-1 bg-red-500 text-white
                                   rounded-full w-5 h-5 flex items-center
                                   justify-center text-xs font-bold">
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
                        <h2 className="font-semibold text-brand-charcoal">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                Product Name *
                            </label>
                            <input type="text" name="name" value={form.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                Description
                            </label>
                            <textarea name="description" value={form.description}
                                onChange={handleChange} rows={4}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                    Brand
                                </label>
                                <input type="text" name="brand" value={form.brand}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                    Category *
                                </label>
                                <select name="category_id" value={form.category_id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                Available Colors
                                <span className="text-neutral-slate font-normal ml-1">
                                    (optional — press Enter to add each color)
                                </span>
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddColor(e)}
                                    placeholder="e.g. Midnight Black"
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5
                 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddColor}
                                    className="bg-primary-light text-primary-dark px-4 py-2.5
                 rounded-lg font-semibold text-sm hover:bg-primary
                 hover:text-white transition-all"
                                >
                                    + Add
                                </button>
                            </div>

                            {/* Color chips */}
                            {colors.length > 0 && (
                                <div className="flex gap-2 flex-wrap mt-3">
                                    {colors.map((color) => (
                                        <span key={color}
                                            className="flex items-center gap-1.5 bg-primary-light
                         text-primary-dark text-sm px-3 py-1.5
                         rounded-full font-medium">
                                            {color}
                                            <button
                                                type="button"
                                                onClick={() => removeColor(color)}
                                                className="text-primary hover:text-red-500
                       transition-colors font-bold text-xs"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
                        <h2 className="font-semibold text-brand-charcoal">Pricing & Stock</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                    Price (₦) *
                                </label>
                                <input type="number" name="price" value={form.price}
                                    onChange={handleChange} min="0" step="0.01"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                    Stock Quantity *
                                </label>
                                <input type="number" name="stock" value={form.stock}
                                    onChange={handleChange} min="0"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                Low Stock Alert Threshold
                            </label>
                            <input type="number" name="low_stock_threshold"
                                value={form.low_stock_threshold}
                                onChange={handleChange} min="1"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>

                        {/* Out of Stock Warning */}
                        {Number(form.stock) === 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl
                              px-4 py-3 flex items-center gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <p className="text-red-700 font-semibold text-sm">
                                        This product is out of stock
                                    </p>
                                    <p className="text-red-600 text-xs mt-0.5">
                                        It is currently hidden from customers.
                                        Update the stock quantity to make it visible again.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="font-semibold text-brand-charcoal mb-4">Settings</h2>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="is_active" checked={form.is_active}
                                onChange={handleChange} className="w-4 h-4 accent-primary" />
                            <div>
                                <p className="text-sm font-medium text-brand-charcoal">
                                    Active — visible in store
                                </p>
                                <p className="text-xs text-neutral-slate">
                                    Uncheck to hide this product from customers
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button type="button" onClick={() => navigate('/admin/products')}
                            className="flex-1 border border-gray-300 text-neutral-slate
                         hover:text-brand-charcoal py-3 rounded-lg font-semibold
                         text-sm transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white py-3
                         rounded-lg font-semibold text-sm transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    )
}