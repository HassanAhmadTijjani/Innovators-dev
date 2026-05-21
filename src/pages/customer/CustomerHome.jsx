// @ts-nocheck
import Layout from '../../components/common/Layout'
import { Navigate, useNavigate } from 'react-router-dom'
import ProductCard from '../../components/customer/ProductCard'
import usePublicProducts from '../../hooks/usePublicProducts'
import useSettings from '../../hooks/useSettings'

const CustomerHome = () => {
    const navigate = useNavigate()
    // const [loading, setLoading] = useState(true)
    const {products, loading} = usePublicProducts()
    const {settings} = useSettings()
    
    return (

        <div className="max-w-6xl mx-auto px-2 py-12 ">

            {/* Hero */}
            <div className="bg-linear-to-br from-black via-[#0d0d0d] to-gray-900 rounded-2xl p-12 mb-14 flex flex-col items-center text-center shadow-lg">
                <h1 className="text-4xl font-extrabold text-white mb-3">
                    Welcome to <span className="text-primary">{ settings?.store_name }</span>
                </h1>
                <p className="text-gray-400 text-sm max-w-md mb-6">
                    Your one-stop shop for phones, laptops and accessories
                </p>
                <button onClick={() => navigate('/shop')} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-[1.03] shadow-md">
                    Shop Now
                </button>
            </div>

            {/* Categories */}
            <div className="mb-14">
                <h2 className="text-xl font-bold text-brand-charcoal mb-6">
                    Browse Categories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { name: 'Phones', icon: '📱', desc: 'Latest smartphones' },
                        { name: 'Laptops', icon: '💻', desc: 'Powerful laptops' },
                        { name: 'Accessories', icon: '🎧', desc: 'Gadgets & accessories' },
                        { name: 'Others', icon: '🎧/📱', desc: 'Other Products'}
                    ].map((cat) => (
                        <div key={cat.name} onClick={() => navigate('/shop')}
                            className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                            <p className="text-4xl mb-3">{cat.icon}</p>
                            <p className="font-bold text-brand-charcoal">{cat.name}</p>
                            <p className="text-neutral-slate text-sm max-w-sm mx-auto">{cat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Products Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-8 px-6">
                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-xl font-bold text-brand-charcoal mb-6">
                        Featured Products
                    </h2>
                    <button
                        onClick={() => navigate('/shop')}
                        className="text-primary text-sm font-semibold hover:underline">
                        View All →
                    </button>
                </div>
              
                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                </div>
                
                {loading && (
                    <div className="flex flex-col justify-center items-center text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
                        <p className="text-neutral-slate mt-4 text-sm">Loading products...</p>
                    </div>
                )}

                {products.length === 0 && !loading && (

                    <div className="text-center py-16">
                        <p className="text-5xl mb-4">📦</p>                        <p className="text-neutral-slate text-sm">
                            Products will appear here once the admin adds them.
                        </p>
                    </div>
                )}
            </div>

        </div>

    )
}

export default CustomerHome