import React, { forwardRef, useMemo, useState } from "react";
import { ShieldCheck, ShieldQuestion, ShieldAlert, Info, Copy, CheckCircle2, History } from "lucide-react";
import ReactMarkdown from "react-markdown";

type VerificationStatus = "verified" | "partial" | "unverified";

type EnhancedResultsProps = {
  response: any;
  onDownload?: () => void;
  onSave?: () => void;
};

const EnhancedResults = forwardRef<HTMLDivElement, EnhancedResultsProps>(
  ({ response, onDownload, onSave }, ref) => {
    const uiCitations = useMemo(() => {
      if (!response?.citations) return [];
      return response.citations.map((c: any) => {
        const status: VerificationStatus = c.verification?.verified
          ? "verified"
          : c.verification?.match_type === "partial"
          ? "partial"
          : "unverified";

        return {
          citation: c.canonical || c.raw,
          status,
          matchedCase: c.case_name || undefined,
          score: c.verification?.score ?? 0,
        };
      });
    }, [response?.citations]);

    const [expanded, setExpanded] = useState<string | null>(null);

    const statusTag = (status: VerificationStatus) => {
      const base = "text-xs px-2 py-1 rounded-full border";
      switch (status) {
        case "verified":
          return <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>Verified</span>;
        case "partial":
          return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>Weak Precedent</span>;
        default:
          return <span className={`${base} bg-rose-50 text-rose-700 border-rose-200`}>Not Found</span>;
      }
    };

    const statusIcon = (status: VerificationStatus) => {
      switch (status) {
        case "verified":
          return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
        case "partial":
          return <ShieldQuestion className="w-5 h-5 text-amber-600" />;
        default:
          return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      }
    };

    return (
      <div ref={ref} className="space-y-8">
        <div className="border border-gray-200 rounded-xl bg-white">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-900 uppercase tracking-wide">
              <ShieldCheck className="w-5 h-5" />
              Verification Report
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-slate-700">Confidence</div>
              <div className="w-28 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((response?.overall_confidence ?? 0) * 100)}%`,
                    backgroundColor:
                      (response?.overall_confidence ?? 0) >= 0.8
                        ? "#0F766E"
                        : (response?.overall_confidence ?? 0) >= 0.5
                        ? "#CA8A04"
                        : "#B91C1C",
                  }}
                />
              </div>
              <span className="font-bold text-lg text-slate-900">
                {Math.round((response?.overall_confidence ?? 0) * 100)}%
              </span>
            </div>
          </div>
          <div className="p-8 prose prose-slate max-w-none">
            <ReactMarkdown>{response?.answer || ""}</ReactMarkdown>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Citation Verification Details
          </h3>
          <div className="grid gap-4">
            {uiCitations.length ? (
              uiCitations.map((v, idx) => (
                <div
                  key={`${v.citation}-${idx}`}
                  className={`border border-gray-200 rounded-xl p-6 bg-white ${expanded === v.citation ? "ring-1 ring-slate-900/15" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {statusIcon(v.status)}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {statusTag(v.status)}
                        </div>
                        <p className="font-mono text-sm md:text-base font-semibold text-slate-900">
                          {v.citation}
                        </p>
                        {v.matchedCase && (
                          <p className="text-sm text-slate-600">Matched: {v.matchedCase}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => navigator.clipboard.writeText(v.citation)}
                        className="p-2 rounded border border-gray-200 hover:bg-gray-50"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpanded(expanded === v.citation ? null : v.citation)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        {expanded === v.citation ? "Hide" : "View Full Judgment"}
                      </button>
                    </div>
                  </div>

                  {expanded === v.citation && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm">
                      <div className="text-slate-700">
                        {v.status === "verified"
                          ? "Exact match confirmed in Supreme Court records."
                          : v.status === "partial"
                          ? "Partial volume/page match. Manual verification recommended."
                          : "No matching precedent found. Potential hallucination."}
                      </div>
                      <div className="text-xs text-slate-600 space-y-1 font-mono">
                        <p><strong>Score:</strong> {(v.score * 100).toFixed(0)}%</p>
                        {v.matchedCase && <p><strong>Case:</strong> {v.matchedCase}</p>}
                      </div>
                      <div className="flex gap-2 text-xs">
                        <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                          View Full Judgment
                        </button>
                        <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                          Open SCC-style View
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-gray-300 rounded-xl text-slate-500">
                No citations were detected.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={onDownload}
            className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Download PDF Report
            </div>
          </button>
          <button
            onClick={onSave}
            className="flex-1 bg-white border border-gray-200 text-slate-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-center gap-2">
              <History className="w-5 h-5" />
              Save to Workspace
            </div>
          </button>
        </div>
      </div>
    );
  }
);

EnhancedResults.displayName = "EnhancedResults";

export default EnhancedResults;
