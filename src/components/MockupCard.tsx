import React from "react";
import { Download, CheckCheck } from "lucide-react";

const MockupCard: React.FC = () => {
  return (
    <div className="relative">
      <div className="relative bg-white border border-gray-200 rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-800">Verification Report</div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
            92% confidence
          </span>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Query</p>
          <p>Does the Basic Structure doctrine limit Parliament's amending power?</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Confidence</span>
            <span>0.92</span>
          </div>
          <div className="flex w-full items-center justify-between text-[11px] text-slate-500">
            <span>0</span>
            <span>0.92</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-[92%] bg-emerald-500 rounded-full" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-slate-900">Citations</p>
          <div className="space-y-0 divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between px-3 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Kesavananda Bharati v. State of Kerala (1973)
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Verified
                  </span>
                  <span className="text-[11px]">Exact match</span>
                </div>
              </div>
              <span className="text-emerald-600 text-lg">
                <CheckCheck className="w-5 h-5" />
              </span>
            </div>
            <div className="flex items-start justify-between px-3 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Maneka Gandhi v. Union of India (1978)
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                    Weak Precedent
                  </span>
                  <span className="text-[11px]">Partial match</span>
                </div>
              </div>
              <span className="text-amber-600 text-lg">
                <CheckCheck className="w-5 h-5" />
              </span>
            </div>
            <div className="flex items-start justify-between px-3 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  State of X v. Y (Not found)
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                    Hallucinated
                  </span>
                  <span className="text-[11px]">No record</span>
                </div>
              </div>
              <span className="text-rose-600 text-lg">
                <CheckCheck className="w-5 h-5" />
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 text-sm">
          <button className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-slate-800 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            View Full Judgment
          </button>
          <button className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-slate-800 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            Open SCC-style
          </button>
        </div>
        <button className="w-full inline-flex items-center justify-center gap-2 bg-[#0B1F3A] text-white font-semibold px-4 py-3 rounded-lg hover:bg-[#091931] transition-colors duration-200">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>
    </div>
  );
};

export default MockupCard;
