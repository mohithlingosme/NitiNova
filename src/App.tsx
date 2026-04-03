import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  Loader2,
  ShieldCheck,
  FileSearch,
  FileCheck,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import "./App.css";
import EnhancedResults from "./components/EnhancedResults";
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import FeatureCard from "./components/FeatureCard";
import Footer from "./components/Footer";
import MockupCard from "./components/MockupCard";
import HowItWorks from "./components/HowItWorks";
import TrustSection from "./components/TrustSection";
import { ApiResponse, submitQuery } from "./services/api";
import { useAuth } from "./hooks/useAuth";

function App() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ query: string; date: string }[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const { isAuthenticated, login, logout } = useAuth();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [placeholder, setPlaceholder] = useState(
    "Is the right to privacy part of Article 21?"
  );

  React.useEffect(() => {
    const examples = [
      "Is the right to privacy part of Article 21?",
      "Can Parliament amend the Basic Structure?",
      "Admissibility of electronic evidence under Section 65B",
      "Reservation in promotions after M. Nagaraj",
    ];
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % examples.length;
      setPlaceholder(examples[idx]);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const executeQuery = async (finalQuery: string) => {
    setQuery(finalQuery);
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiResponse = await submitQuery(finalQuery);
      setResponse(apiResponse);
      setHistory((prev) =>
        [{ query: finalQuery, date: new Date().toLocaleTimeString() }, ...prev].slice(0, 5)
      );

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "We could not reach the verification API. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent, preset?: string) => {
    e?.preventDefault();
    const finalQuery = preset ?? query;
    if (!finalQuery.trim()) return;

    if (!isAuthenticated) {
      setPendingQuery(finalQuery);
      setShowAuthModal(true);
      return;
    }

    executeQuery(finalQuery);
  };

  const handleAuthenticated = () => {
    setShowAuthModal(false);
    if (pendingQuery) {
      const q = pendingQuery;
      setPendingQuery(null);
      executeQuery(q);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900/10 flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        onSignIn={() => setShowAuthModal(true)}
        onSignUp={() => (window.location.href = "/register")}
        onSignOut={logout}
      />

      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 space-y-12">
          <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-16">
            <div className="space-y-8 max-w-xl">
              <Hero />

              <div className="space-y-6">
                <SearchBar
                  value={query}
                  onChange={(val) => setQuery(val)}
                  onSubmit={handleSearch}
                  isLoading={isLoading}
                  placeholder={placeholder}
                />
              </div>

              {/* Single CTA in SearchBar only - no extras */}
            </div>

            <div className="self-center w-full">
              <MockupCard />
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
              <p className="font-medium animate-pulse">
                Running RAG Pipeline & Verification Engine...
              </p>
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
            <EnhancedResults
              ref={resultsRef}
              response={response}
              onDownload={async () => {
                if (!response || !resultsRef.current) return;
                const element = resultsRef.current;
                const canvas = await html2canvas(element, { scale: 2 });
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                  position = heightLeft - imgHeight;
                  pdf.addPage();
                  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                  heightLeft -= pageHeight;
                }

                pdf.save(`nitinova-verification-${response.request_id}.pdf`);
              }}
              onSave={() => {
                // placeholder: wire up workspace persistence
              }}
            />
          )}
        </AnimatePresence>

        {!response && !isLoading && (
          <>
          <section className="py-16 space-y-8 w-full px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">Why Advocates Choose NitiNova</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <FeatureCard
                  icon={<ShieldCheck className="w-6 h-6 text-indigo-700" />}
                  title="Prevents Fake Citations"
                  description="Every reference is validated against authentic Supreme Court records before filing."
                  takeaway="Never cite a non-existent case again."
                />
                <FeatureCard
                  icon={<FileSearch className="w-6 h-6 text-indigo-700" />}
                  title="Accurate Case Law Retrieval"
                  description="Semantic + keyword search tuned for Indian jurisprudence to surface exact precedents."
                  takeaway="Reduce drafting time by 70%."
                />
                <FeatureCard
                  icon={<FileCheck className="w-6 h-6 text-indigo-700" />}
                  title="Court-Ready Outputs"
                  description="Precedents confirmed, weak citations flagged, formatted like SCC/Manupatra for instant use."
                  takeaway="Court-ready outputs instantly."
                />
              </div>
            </section>

            <HowItWorks />

            <TrustSection />

            {/* CTA removed - single CTA only in SearchBar */}
          </>
        )}
        </div>
      </main>

      <Footer />

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleAuthenticated}
        login={login}
      />
    </div>
  );
}

export default App;
