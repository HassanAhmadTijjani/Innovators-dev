// @ts-nocheck
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useProducts } from '../../hooks/useProducts'
import { uploadImage, uploadMultipleImages } from '../../utils/uploadImage'
import toast from 'react-hot-toast'

export default function AddProduct() {
    const { addProduct, fetchCategories } = useProducts()
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [error, setError] = useState('')
    const [extraImages, setExtraImages] = useState([])
    const [extraImagePreviews, setExtraPreviews] = useState([])
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
    })

    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch(err => setError('Failed to load categories: ' + err.message))
    }, [fetchCategories])

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

    function handleExtraImages(e) {
        const files = Array.from(e.target.files).slice(0, 4)
        setExtraImages(files)
        setExtraPreviews(files.map(f => URL.createObjectURL(f)))
    }

    function removeExtraImage(index) {
        setExtraImages(extraImages.filter((_, i) => i !== index))
        setExtraPreviews(extraImagePreviews.filter((_, i) => i !== index))
    }

    function generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!form.name) return setError('Product name is required')
        if (!form.price) return setError('Price is required')
        if (!form.stock) return setError('Stock quantity is required')
        if (!form.category_id) return setError('Please select a category')

        setLoading(true)
        try {
            // upload cover image
            let cover_image = null
            if (imageFile) {
                cover_image = await uploadImage(imageFile)
            }

            // upload extra images
            let extraImageUrls = []
            if (extraImages.length > 0) {
                extraImageUrls = await uploadMultipleImages(extraImages)
            }

            // ✅ pass images to addProduct — single call, no duplicate
            await addProduct({
                name: form.name,
                slug: generateSlug(form.name),
                description: form.description,
                price: parseFloat(form.price),
                category_id: form.category_id,
                brand: form.brand,
                stock: parseInt(form.stock),
                low_stock_threshold: parseInt(form.low_stock_threshold),
                is_active: form.is_active,
                cover_image,
                images: extraImageUrls,
                colors: colors,
            })

            toast.success('Product added successfully')
            navigate('/admin/products')

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Adding of color
    function handleAddColor(e) {
        e.preventDefault()
        const trimmed = colorInput.trim()
        if (!trimmed) return
        if (colors.includes(trimmed)) return // no duplicates
        setColors([...colors, trimmed])
        setColorInput('')
    }

    function removeColor(color) {
        setColors(colors.filter(c => c !== color))
      }

    return (
        <AdminLayout>
            <div className="max-w-2xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="text-neutral-slate hover:text-brand-charcoal transition-colors"
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-charcoal">Add Product</h1>
                        <p className="text-neutral-slate text-sm mt-1">Fill in the product details</p>
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

                        {imagePreview ? (
                            <div className="relative w-40 h-40 rounded-xl overflow-hidden mb-4">
                                <img src={imagePreview} alt="Preview"
                                    className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                                    className="absolute top-2 right-2 bg-red-500 text-white
                             rounded-full w-6 h-6 flex items-center
                             justify-center text-xs font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl
                              p-8 text-center mb-4">
                                <p className="text-3xl mb-2">📷</p>
                                <p className="text-neutral-slate text-sm">
                                    Click to upload cover image
                                </p>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-neutral-slate
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg
                         file:border-0 file:bg-primary-light file:text-primary-dark
                         file:font-semibold file:text-sm hover:file:bg-primary
                         hover:file:text-white file:transition-all cursor-pointer"
                        />
                    </div>

                    {/* Extra Images */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <label className="block text-sm font-semibold text-brand-charcoal mb-1">
                            Additional Images
                            <span className="text-neutral-slate font-normal ml-1">
                                (up to 4 extra photos)
                            </span>
                        </label>
                        <p className="text-xs text-neutral-slate mb-4">
                            These show as thumbnails on the product detail page
                        </p>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleExtraImages}
                            className="block w-full text-sm text-neutral-slate
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg
                         file:border-0 file:bg-primary-light file:text-primary-dark
                         file:font-semibold file:text-sm hover:file:bg-primary
                         hover:file:text-white file:transition-all cursor-pointer"
                        />

                        {extraImagePreviews.length > 0 && (
                            <div className="flex gap-3 mt-4 flex-wrap">
                                {extraImagePreviews.map((preview, i) => (
                                    <div key={i}
                                        className="relative w-20 h-20 rounded-lg overflow-hidden
                                  border border-gray-200 shrink-0">
                                        <img src={preview} alt={`Extra ${i + 1}`}
                                            className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExtraImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white
                                 rounded-full w-5 h-5 flex items-center
                                 justify-center text-xs font-bold
                                 hover:bg-red-700 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <p className="text-xs text-neutral-slate self-end mb-1">
                                    {extraImagePreviews.length}/4 images
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
                        <h2 className="font-semibold text-brand-charcoal">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                Product Name *
                            </label>
                            <input type="text" name="name" value={form.name}
                                onChange={handleChange} placeholder="e.g. Samsung Galaxy A55"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                Description
                            </label>
                            <textarea name="description" value={form.description}
                                onChange={handleChange} rows={4}
                                placeholder="Describe the product features and specifications..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                    Brand
                                </label>
                                <input type="text" name="brand" value={form.brand}
                                    onChange={handleChange} placeholder="e.g. Samsung"
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
                                    onChange={handleChange} placeholder="0.00" min="0" step="0.01"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-charcoal mb-1">
                                    Stock Quantity *
                                </label>
                                <input type="number" name="stock" value={form.stock}
                                    onChange={handleChange} placeholder="0" min="0"
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
                            <p className="text-xs text-neutral-slate mt-1">
                                You will be alerted when stock drops below this number
                            </p>
                        </div>
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
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    )
}