'use client';

import Link from 'next/link';
import Button from './Button';

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: [
        "50 judgments/month",
        "Basic structuring",
        "Semantic search",
        "Email support"
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$99",
      period: "/month",
      features: [
        "500 judgments/month",
        "Advanced structuring",
        "Unlimited search",
        "Priority support",
        "API access"
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Unlimited judgments",
        "Custom workflows",
        "On-premise option",
        "24/7 support",
        "White-label"
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your practice. Cancel anytime.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={plan.name} className={`group relative rounded-3xl p-8 border-2 transition-all ${plan.popular ? 'border-indigo-300 bg-indigo-50 shadow-2xl scale-105' : 'border-gray-200 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-2'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-black text-gray-900 mb-4">{plan.name}</h3>
              <div className="text-4xl md:text-5xl font-black text-indigo-600 mb-2">{plan.price}</div>
              <div className="text-lg text-gray-600 mb-8">{plan.period}</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className={`w-full py-6 text-lg font-bold shadow-xl ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-white border-2 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 text-gray-900'}`}>
                  {plan.popular ? 'Get Pro Plan' : 'Get Started'}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
