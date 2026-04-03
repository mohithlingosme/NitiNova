import React from "react";

const logos = ["Lex & Co.", "Veritas Law", "Advocate Guild"];

const testimonials = [
  {
    quote:
      "Saved hours of citation verification. NitiNova flagged two hallucinated references before filing.",
    author: "Senior Advocate, Delhi High Court",
  },
  {
    quote: "We trust it for quick cross-checks in urgent mentions. Output reads like SCC.",
    author: "Partner, Litigation Firm, Mumbai",
  },
  {
    quote:
      "Turnaround is incredibly fast and the confidence scoring helps us prioritize what to review.",
    author: "Advocate Guild, Bengaluru",
  },
];

const TrustSection: React.FC = () => {
  return (
    <section className="py-14 space-y-12">
      <div className="text-center space-y-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Trusted by 500+ advocates
        </p>
        <h2 className="text-3xl font-bold text-slate-900">Authority & Trust</h2>
        <p className="text-slate-700">
          Used in High Court & Supreme Court matters. Data encrypted and confidential.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-700">
        {logos.map((logo) => (
          <span
            key={logo}
            className="px-4 py-2 border border-gray-200 rounded-full bg-white"
          >
            {logo}
          </span>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials
          .filter((card) => Boolean(card.quote))
          .map((card) => (
            <div
              key={card.author}
              className="rounded-lg border border-gray-200 bg-white p-5 h-full space-y-3 shadow-sm"
            >
              <p className="text-sm text-slate-700">"{card.quote}"</p>
              <p className="mt-3 text-xs font-semibold text-slate-800">{card.author}</p>
            </div>
          ))}
      </div>
    </section>
  );
};

export default TrustSection;
