/* eslint-disable no-unused-vars */
// @ts-nocheck
'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, DollarSign, RefreshCw, Gift, ArrowRight, Check, Star, Shield, Zap, ChevronRight, Menu, X, Smartphone, } from 'lucide-react';
import usePublicProducts from '../../hooks/usePublicProducts';
import ProductCard from '../../components/customer/ProductCard';
import useSettings from '../../hooks/useSettings';

const navLinks = [
  { label: 'Buy', href: '/shop' },
  { label: 'Sell', href: '#sell' },
  { label: 'Swap', href: '#swap' },
  { label: 'Referral', href: '#referral' },
];



const coreActions = [
  {
    icon: ShoppingCart,
    title: 'Buy Device',
    description: 'Browse verified devices at fair market prices. Every listing is inspected and quality-checked.',
    href: '#',
    primary: true,
  },
  {
    icon: DollarSign,
    title: 'Sell Device',
    description: 'List your device in minutes. Get paid fast with our secure escrow payment system.',
    href: '#',
    primary: false,
  },
  {
    icon: RefreshCw,
    title: 'Swap Device',
    description: 'Trade your device directly with other users. Upgrade without spending extra cash.',
    href: '#',
    primary: false,
  },
  {
    icon: Gift,
    title: 'Refer & Earn',
    description: 'Invite friends and earn cash rewards for every successful transaction they complete.',
    href: '#',
    primary: false,
  },
];

const steps = [
  {
    number: '01',
    title: 'Create Account',
    description: 'Sign up in under 60 seconds. Verify your identity to unlock buying and selling.',
  },
  {
    number: '02',
    title: 'Choose Action',
    description: 'Browse listings to buy, post your device to sell, or find a swap match.',
  },
  {
    number: '03',
    title: 'Complete Transaction',
    description: 'Pay or get paid securely. Device ships with tracking and buyer protection.',
  },
];

const conditionColor = {
  'Like New': 'bg-emerald-50 text-emerald-700',
  'Excellent': 'bg-green-50 text-green-700',
  'Good': 'bg-amber-50 text-amber-700',
};



export default function LandingPage() {
  const { products, loading } = usePublicProducts();
  const { settings } = useSettings()

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Trusted by 50,000+ buyers and sellers
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                Buy, Sell, Swap Devices &mdash;{' '}
                <span className="text-green-400">Smarter &amp; Faster</span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                {settings?.store_description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Device
                </Link>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-200 hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
                >
                  <DollarSign className="w-4 h-4" />
                  Sell Device
                </a>
              </div>

              <div className="flex flex-wrap gap-5 text-sm text-slate-400">
                {['Verified Sellers', '30-Day Warranty', 'Secure Payments'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative lg:flex lg:justify-end">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl max-w-md mx-auto lg:mx-0 w-full">
                <img
                  src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=700"
                  alt="Device marketplace"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 mb-0.5">Latest Listing</p>
                        <p className="text-sm font-semibold text-white">iPhone 14 Pro Max &mdash; 256GB</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">₦649</p>
                        <p className="text-xs text-emerald-400 font-medium">Like New</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE ACTIONS */}
      <section className="py-16 lg:py-20 bg-gray-50" id="actions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
              Find the right device solution for you
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
              Browse, sell, or swap with confidence — fast, secure, and customer-focused.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {coreActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.a
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  key={action.title}
                  href={action.href}
                  className={`group flex flex-col p-6 rounded-xl border transition-all duration-200 ${action.primary
                    ? 'bg-green-600 border-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20'
                    : 'bg-white border-gray-200 hover:border-green-200 hover:shadow-md'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${action.primary ? 'bg-green-500' : 'bg-gray-100 group-hover:bg-green-50'
                    }`}>
                    <Icon className={`w-5 h-5 ${action.primary ? 'text-white' : 'text-green-600'}`} />
                  </div>
                  <h3 className={`text-base font-semibold mb-2 ${action.primary ? 'text-white' : 'text-slate-900'}`}>
                    {action.title}
                  </h3>
                  <p className={`text-sm leading-relaxed flex-1 ${action.primary ? 'text-green-100' : 'text-slate-500'}`}>
                    {action.description}
                  </p>
                  <div className={`flex items-center gap-1 mt-4 text-xs font-semibold ${action.primary ? 'text-white' : 'text-green-600'
                    }`}>
                    Get started <ChevronRight className="w-3 h-3" />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-charcoal mb-1">Featured Listings</h2>
              <p className="text-neutral-slate text-sm">Verified devices ready to buy now</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Dynamic Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {loading && (
            <div className="flex flex-col justify-center items-center text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="text-neutral-slate mt-4 text-sm">Loading products...</p>
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📦</p>
              <p className="text-neutral-slate text-sm">
                Products will appear here once the admin adds them.
              </p>
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
              View all listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">How It Works</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Three simple steps to buy, sell, or swap any device
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-10 mb-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="flex sm:block items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{step.number}</span>
                  </div>
                  <div className="sm:mt-4">
                    <h3 className="text-base font-semibold text-slate-900 mb-1.5">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, label: 'Buyer Protection', desc: 'Money-back guarantee on every purchase' },
              { icon: Zap, label: 'Fast Payments', desc: 'Sellers receive funds within 24 hours' },
              { icon: Star, label: 'Verified Quality', desc: 'All devices graded by trained inspectors' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-slate-950 py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Start Buying or Selling Today
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of users trading devices safely every day. No hidden fees, no hassle.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 text-xs text-slate-600">Free to join. No credit card required.</p>
        </div>
      </section>
    </div>
  );
}
