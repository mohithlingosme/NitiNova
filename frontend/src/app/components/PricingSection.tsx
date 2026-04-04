'use client';

import Link from 'next/link';
import Button from './Button';

export default function PricingSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-6">
            Simple Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free. Scale as your practice grows. No hidden fees.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="group bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 hover:border-indigo-300 hover:shadow-2xl transition-all duration-500 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
              <span className="text-2xl">🆓</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
            <p className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-2xl font-normal text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-8 text-left mx-auto max-w-md">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                5 searches per month
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Basic case analysis
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                PDF uploads
              </li>
            </ul>
            <Link href="/register">
              <Button className="w-full px-8 py-4 text-lg">Get Started Free</Button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="group relative bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center lg:col-span-1 md:col-span-2 ring-4 ring-indigo-200 ring-opacity-50">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-xl text-indigo-600 font-bold text-lg shadow-lg">
              Most Popular
            </div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-4xl font-bold mb-6">$29<span className="text-2xl font-normal">/month</span></p>
            <ul className="space-y-3 mb-8 text-left mx-auto max-w-md">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white/70 rounded-full mr-3"></span>
                Unlimited searches
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white/70 rounded-full mr-3"></span>
                Advanced AI insights
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white/70 rounded-full mr-3"></span>
                Priority processing
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white/70 rounded-full mr-3"></span>
                Export reports
              </li>
            </ul>
            <Link href="/register">
              <Button variant="secondary" className="w-full px-8 py-4 text-lg border-white/80 hover:bg-white/10">
                Start Pro Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

