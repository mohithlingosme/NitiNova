import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  History,
  Info,
  Loader2,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import "./App.css";
import { cn } from "./lib/utils";
import { ApiResponse, submitQuery } from "./services/api";

type VerificationStatus = "verified" | "partial" | "unverified";

type UiResponse = {
  answer: string;
  overallConfidence: number;
  citations: {
    citation: string;
    status: VerificationStatus;
    matchedCase?: string;
    score: number;
  }[];
  raw: ApiResponse;
};

const toUiResponse = (api: ApiResponse): UiResponse => {
  const citations = api.citations.map((c) => {
    const status: VerificationStatus = c.verification.verified
      ? "verified"
      : c.verification.match_type === "partial"
        ? "partial"
        : "unverified";

    return {
      citation: c.canonical || c.raw,
      status,
      matchedCase: c.case_name !== "N/A" ? c.case_name : undefined,
      score: c.verification.score ?? 0,
    };
  });

  return {
    answer: api.answer,
    overallConfidence: api.overall_confidence,
    citations,
    raw: api,
  };
};

function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<UiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ query: string; date: string }[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent, preset?: string) => {
    e?.preventDefault();
    const finalQuery = preset ?? query;
    if (!finalQuery.trim()) return;
    setQuery(finalQuery);

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiResponse = await submitQuery(finalQuery);
      setResponse(toUiResponse(apiResponse));
      setHistory((prev) => [{ query: finalQuery, date: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("We could not reach the verification API. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case "partial":
        return <ShieldQuestion className="w-5 h-5 text-amber-500" />;
      case "unverified":
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return "bg-emerald-50 border-emerald-200 text-emerald-800";
      case "partial":
        return "bg-amber-50 border-amber-200 text-amber-800";
      case "unverified":
        return "bg-rose-50 border-rose-200 text-rose-800";
      default:
        return "bg-slate-50 border-slate-200 text-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Scale className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">NitiNova</span>
            <span className="text-[10px] uppercase tracking-widest font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded ml-2">Beta</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Research</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Drafting</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Verification</a>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs hover:bg-slate-800 transition-all">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            Verified Legal Intelligence <br />
            <span className="text-indigo-600 italic font-serif">for India</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg"
          >
            Eliminating hallucinated citations in legal research.
            Cross-referenced against Supreme Court precedents (1950-2025).
          </motion.p>
        </section>

        {/* Search Section */}
        <section className="mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full group-focus-within:bg-indigo-500/20 transition-all duration-500" />
            <div className="relative flex items-center bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-xl shadow-slate-200/50 focus-within:border-indigo-500 transition-all">
              <div className="pl-4 pr-2">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a legal question (e.g., 'What is the Basic Structure Doctrine?')"
                className="flex-1 bg-transparent border-none focus:ring-0 py-4 text-lg placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trending:</span>
            {["Right to Privacy", "Article 370", "Mandal Commission", "Vishaka Guidelines"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleSearch(undefined, tag)}
                className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-slate-400"
            >
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
              <p className="font-medium animate-pulse">Running RAG Pipeline & Verification Engine...</p>
              <p className="text-sm mt-2">Cross-referencing Supreme Court Database</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-start gap-4 text-rose-800"
            >
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Verification Failed</h3>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </motion.div>
          )}

          {response && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Confidence Score Card */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    Verification Report
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confidence:</span>
                    <span
                      className={cn(
                        "text-sm font-bold px-2 py-0.5 rounded",
                        response.overallConfidence >= 0.8
                          ? "bg-emerald-100 text-emerald-700"
                          : response.overallConfidence >= 0.5
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      )}
                    >
                      {Math.round(response.overallConfidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-indigo-600">
                    <ReactMarkdown>{response.answer}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Citations Panel */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Citation Verification Details
                </h3>

                <div className="grid gap-4">
                  {response.citations.length > 0 ? (
                    response.citations.map((v, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                          "p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md",
                          getStatusColor(v.status)
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getStatusIcon(v.status)}</div>
                          <div>
                            <p className="font-bold text-sm">{v.citation}</p>
                            <p className="text-xs opacity-80 mt-1">
                              {v.status === "verified"
                                ? "Exact match found in Supreme Court database."
                                : v.status === "partial"
                                  ? "Partial match found. Please verify the specific volume/page."
                                  : "No record found in verified database. Potential hallucination."}
                            </p>
                          </div>
                        </div>

                        {v.matchedCase && (
                          <div className="flex items-center gap-2">
                            <div className="text-right hidden md:block">
                              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Matched Case</p>
                              <p className="text-xs font-bold truncate max-w-[200px]">{v.matchedCase}</p>
                            </div>
                            <button className="bg-white/50 p-2 rounded-lg hover:bg-white transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                      <Info className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-medium">No citations were detected in the response.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-200">
                <button className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Download Verified Report
                </button>
                <button className="flex-1 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <History className="w-5 h-5" />
                  Save to Workspace
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid (Empty state or bottom) */}
        {!response && !isLoading && (
          <section className="mt-24 grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Citation Firewall</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Every case reference is cross-checked against our curated database of 75,000+ Supreme Court judgments.
              </p>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Hybrid RAG Pipeline</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Combines semantic vector search with keyword indexing to retrieve the most relevant legal context.
              </p>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-2">Legal Drafting</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                (Phase 2) Generate petitions and notices with auto-injected verified citations.
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 py-12 mt-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Scale className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-lg tracking-tight">NitiNova</span>
          </div>
          <p className="text-sm text-slate-400">
            © 2026 NitiNova. Developed by Mohith M for Team Tattva Taraka.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
