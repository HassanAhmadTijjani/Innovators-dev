// @ts-nocheck
import { Link } from 'react-router-dom'
import useSettings from '../../hooks/useSettings'

const About = () => {
  const { settings } = useSettings()
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-green-400 mb-4">
              {settings?.store_name} Global Service Limited
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Powering Smarter Device Sales & Global Services
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-8 mb-10">
              {settings?.store_name} Global Service Limited is transforming how devices are bought, sold, and managed — moving from manual operations to a powerful digital platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition"
              >
                Create Free Account
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Explore Platform
              </Link>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Creating a free account gives you instant access to browse devices, place orders, and manage your purchases securely. No hidden fees, no credit card required.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-green-600">Who we are</p>
            <h2 className="text-3xl font-bold text-slate-900">A growing company with deep experience in devices and services.</h2>
            <p className="text-slate-600 leading-7">
              {settings?.store_name} has built strong momentum in iPhone and gadget sales across Nigeria, serving customers with quality products and reliable support.
            </p>
            <p className="text-slate-600 leading-7">
              Today, the business is moving beyond social media and manual sales toward a centralized digital platform that supports growth and operational clarity.
            </p>
          </div>
          <div className="grid gap-5">
            {[
              { label: 'iPhones & gadgets', value: 'Market-leading product focus' },
              { label: 'Manual processes', value: 'Sales and coordination done offline' },
              { label: 'Team growth', value: 'More staff need better tools' },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-3">{item.label}</p>
                <p className="text-slate-700 font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-b border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm uppercase tracking-[0.35em] text-green-600 mb-3">The problem</p>
            <h2 className="text-3xl font-bold text-slate-900">Challenges that slow growth and create risk</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Manual sales processes', description: 'Orders recorded by hand across chat apps and spreadsheets.' },
              { title: 'Dependence on social media', description: 'Customer interactions happen on multiple unsecured channels.' },
              { title: 'Poor order tracking', description: 'It is hard to know order status, stock, and delivery progress.' },
              { title: 'Limited scalability', description: 'Current workflows cannot support larger volume or more staff.' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-green-600 mb-3">Our solution</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">A centralized platform built for operational control.</h2>
            <p className="text-slate-600 leading-7 mb-8">
              {settings?.store_name} brings order management, staff coordination, customer data, and scalability into one business-ready system.            </p>
          </div>
          <div className="grid gap-5">
            {[
              { title: 'Centralized order management', detail: 'Track every sale, invoice, and delivery step from one dashboard.' },
              { title: 'Staff coordination tools', detail: 'Assign tasks, monitor performance, and keep teams aligned.' },
              { title: 'Customer management', detail: 'Capture contact, order history, and service notes in one place.' },
              { title: 'Scalable digital platform', detail: 'Built to support growth across markets and service lines.' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-7">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Buy Devices', description: 'Access verified phones, laptops, and accessories through a trusted platform.' },
              { title: 'Sell Devices', description: 'List inventory clearly and manage buyer communication professionally.' },
              { title: 'Swap Devices', description: 'Offer and accept trade deals with transparency and control.' },
              { title: 'Refer & Earn', description: 'Reward customers and partners for bringing new business.' },
              { title: 'Business & Tech Services', description: 'Support services for logistics, repairs, and digital operations.' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10">
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-slate-300 leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-green-600 mb-3">Mission</p>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">To deliver reliable, innovative and affordable global services that empower individuals and businesses to thrive in a digital world.</h3>
            <p className="text-slate-600 leading-7">{settings?.store_name} drives growth through clarity, technology, and dependable service.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-green-600 mb-3">Vision</p>
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">To become Africa’s most trusted hub for seamless technology, logistics, and business solutions with global impact.</h3>
            <p className="text-slate-600 leading-7">We aim for a service platform recognized for trust, speed, and commercial reliability.</p>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-b border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {[
              'Trusted business',
              'Growing brand',
              'Customer-focused',
              'Reliable services',
              '24/7 support',
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-green-600 mb-2">{item}</p>
                <p className="text-slate-600 text-sm leading-6">{item === 'Trusted business' ? 'Built for high-value sales and service delivery.' : item === 'Growing brand' ? 'Scaling with disciplined operations and technology.' : item === 'Customer-focused' ? 'Designed around customer convenience and transparency.' : item === 'Reliable services' ? 'Consistent execution across every transaction.' : 'Support ready when your business needs it most.'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="rounded-4xl border border-slate-800 bg-slate-900 p-10 shadow-2xl shadow-black/20">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-green-400 mb-3">Join the future</p>
                <h2 className="text-3xl font-bold">Join the Future of Smart Device Trading</h2>
                <p className="text-slate-300 leading-7 mt-4">Start with tools that bring order, speed and credibility to every sale.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-transparent px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
                >
                  Browse Devices
                </Link>
              </div>
              <p className="text-slate-300 text-sm mt-4">
                Sign up for free to access personalized recommendations, order tracking, and secure payment options. Join thousands of satisfied customers today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-green-600 mb-3">Contact</p>
            <p className="text-slate-700 font-semibold mb-2">Talk directly with our team</p>
            {settings?.super_admin_phone && (
              <>
                <a
                  href={`https://wa.me/${settings.store_phone.replace(/\D/g, '').replace(/^0/, '234')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 block mb-2"
                >
                  WhatsApp: {settings.store_phone}
                </a>
                <a href={`tel:${settings.store_phone}`} className="text-slate-600 hover:text-slate-900 block">Phone: {settings.super_admin_phone}</a>
              </>
            )}
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-green-600 mb-3">Visit us</p>
            <p className="text-slate-600 leading-7">{settings?.store_name} Global Service Limited</p>
            <p className="text-slate-600 leading-7 mt-3">Trusted device sales and services across Nigeria.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-green-600 mb-3">Follow</p>
            <p className="text-slate-600 leading-7">Stay updated on product releases and business services.</p>
            <div className="mt-6 space-y-3 text-green-600 text-sm">
              <a target='_blank' rel='noopener noreferrer' href="https://www.instagram.com/mayorbusinesshub.ng?igsh=NHhyMDYydHN1OGdh" className="hover:text-slate-900 block border-b-2">Join us on Instagram</a>
              <a target='_blank' rel='noopener noreferrer' href="#" className="hover:text-slate-900 block border-b-2">Join us on Facebook</a>
              <a target='_blank' rel='noopener noreferrer' href="https://www.tiktok.com/@mayorbusinesshub.ng?_r=1&_t=ZS-96PxLxvkBcd" className="hover:text-slate-900 block border-b-2">Join us on Tiktok</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
