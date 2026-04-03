import React from "react";
import { ClipboardList, ShieldCheck, FileOutput } from "lucide-react";

const steps = [
  {
    label: "Paste Argument",
    title: "Input",
    desc: "Drop your draft, citations, or questions into NitiNova.",
    icon: <ClipboardList className="w-6 h-6 text-indigo-700" />,
  },
  {
    label: "AI Cross-checks",
    title: "Verification",
    desc: "Matched against 75,000+ Supreme Court judgments and flagged for risk.",
    icon: <ShieldCheck className="w-6 h-6 text-indigo-700" />,
  },
  {
    label: "Verified Report",
    title: "Output",
    desc: "Court-ready report with confidence, tags, and source links.",
    icon: <FileOutput className="w-6 h-6 text-indigo-700" />,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 space-y-8 px-4 sm:px-6">
      <h2 className="text-center text-slate-900 text-3xl font-bold">
        Court-Ready Verification Flow
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        {steps.map((step, idx) => (
          <React.Fragment key={step.label}>
            <div className="w-full max-w-xs rounded-xl border border-gray-200 bg-white p-5 text-center h-full">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3 mx-auto">
                {step.icon}
              </div>
              <div className="text-xs font-semibold text-slate-700 inline-flex px-3 py-1 rounded-full mb-3 border border-gray-200">
                {step.label}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="text-slate-400 text-2xl md:text-3xl">-&gt;</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;


