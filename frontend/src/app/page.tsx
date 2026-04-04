'use client';

import Link from 'next/link';
import Button from './components/Button';
import Loader from './components/Loader';
import PricingSection from './components/PricingSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent mb-8 leading-tight">
            NitiNova
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-indigo-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform Legal Research with AI-Powered Semantic Search & Case Intelligence
          </h2>
          <p className="text-xl md:text-2xl text-indigo-200 mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
            Upload judgments, search 75K+ cases instantly, get structured facts/issues/ratio with verified citations.
            Built for lawyers who need precision at scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/register">
              <Button size="lg" className="text-2xl px-12 py-8 shadow-2xl hover:shadow-3xl">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary" size="lg" className="text-2xl px-12 py-8 border-2 border-white/30 backdrop-blur-sm">
                Live Demo
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-indigo-200">
            <span>✅ 75K+ Indian judgments</span>
            <span>✅ 99% citation accuracy</span>
            <span>✅ Instant structuring</span>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              The Legal Research Problem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hours wasted scanning PDFs. Citations that don't match. Structured insights buried in 100-page judgments.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xl">⏳</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Manual Extraction Hell</h4>
                    <p className="text-gray-700">Finding facts, issues, ratios across 100+ pages takes hours.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xl">❌</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Citation Nightmares</h4>
                    <p className="text-gray-700">Wrong citations waste court time and credibility.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-3xl p-12 border border-indigo-200/50 backdrop-blur-sm shadow-2xl">
                <img src="/judgment-mockup.png" alt="Case Structure" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">
              One Upload. Instant Intelligence.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              NitiNova structures judgments automatically. No more manual reading.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group hover:scale-[1.02] transition-transform">
              <div className="text-center p-12 border-2 border-indigo-100 rounded-3xl bg-gradient-to-b from-white to-indigo-50/30 hover:shadow-2xl hover:border-indigo-300">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl text-white text-2xl">
                  📁
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload PDF</h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">Any judgment. Any court. Instant processing.</p>
                <div className="w-full h-1 bg-indigo-200 rounded-full">
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="group hover:scale-[1.02] transition-transform">
              <div className="text-center p-12 border-2 border-emerald-100 rounded-3xl bg-gradient-to-b from-white to-emerald-50/30 hover:shadow-2xl hover:border-emerald-300">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl text-white text-2xl">
                  🧠
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Structuring</h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">Facts, Issues, Ratio extracted with 99% accuracy.</p>
                <div className="w-full h-1 bg-emerald-200 rounded-full">
                  <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full w-full"></div>
                </div>
              </div>
            </div>
            <div className="group hover:scale-[1.02] transition-transform">
              <div className="text-center p-12 border-2 border-blue-100 rounded-3xl bg-gradient-to-b from-white to-blue-50/30 hover:shadow-2xl hover:border-blue-300">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl text-white text-2xl">
                  🔍
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Semantic Search</h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">Find relevant precedents across 75K+ cases instantly.</p>
                <div className="w-full h-1 bg-blue-200 rounded-full">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete legal intelligence platform for modern practice.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-200">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Semantic Case Search</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Find relevant precedents instantly across 75K+ judgments.</p>
            </div>
            <div className="group p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfect Structure</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Facts, Issues, Ratio, Citations extracted with 99% accuracy.</p>
            </div>
            <div className="group p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100 md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Verified Citations</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Cross-verified against authoritative sources. Never miss a citation again.</p>
            </div>
            <div className="group p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Process 100-page judgments in seconds. Instant semantic search.</p>
            </div>
            <div className="group p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-200">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile Ready</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Fully responsive. Research on-the-go from phone or tablet.</p>
            </div>
            <div className="group p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-200">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Your documents encrypted. GDPR/SOC2 compliant. Lawyer-trusted security.</p>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />

      {/* Demo Preview */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">
            See It In Action
          </h2>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="relative lg:w-1/2">
              <video 
                autoPlay 
                muted 
                loop 
                className="w-full rounded-3xl shadow-2xl border-8 border-white/20"
                poster="/demo-preview.jpg"
              >
                <source src="/demo.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="lg:w-1/2 text-left lg:text-lg">
              <h3 className="text-3xl font-bold mb-8">Live Demo Preview</h3>
              <ul className="space-y-4 mb-12">
                <li className="flex items-start gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <span className="w-8 h-8 bg-green-400/20 rounded-xl flex items-center justify-center font-bold text-green-400 text-lg mt-0.5 flex-shrink-0">1</span>
                  <span>Upload judgment PDF</span>
                </li>
                <li className="flex items-start gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <span className="w-8 h-8 bg-green-400/20 rounded-xl flex items-center justify-center font-bold text-green-400 text-lg mt-0.5 flex-shrink-0">2</span>
                  <span>AI extracts Facts • Issues • Ratio in seconds</span>
                </li>
                <li className="flex items-start gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <span className="w-8 h-8 bg-green-400/20 rounded-xl flex items-center justify-center font-bold text-green-400 text-lg mt-0.5 flex-shrink-0">3</span>
                  <span>Semantic search finds perfect precedents</span>
                </li>
              </ul>
              <Link href="/demo" className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all">
                Watch Full Demo (2 min)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-white/20 bg-clip-text backdrop-blur-sm">
            Ready to Transform Your Research?
          </h2>
          <p className="text-2xl opacity-95 mb-12 leading-relaxed">
            Join 500+ lawyers saving 20+ hours weekly
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/register" className="px-12 py-8 bg-white text-indigo-600 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all">
              Start Free Trial
            </Link>
            <Link href="/contact" className="px-12 py-8 border-2 border-white/40 backdrop-blur-sm rounded-3xl font-bold text-xl hover:bg-white/20 transition-all">
              Contact Sales
            </Link>
          </div>
          <p className="text-lg opacity-80 mt-12">14-day money back guarantee • Cancel anytime</p>
        </div>
      </section>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}


