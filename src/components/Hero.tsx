import React from "react";
import { motion } from "motion/react";

const Hero: React.FC = () => {
  return (
    <section className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-serif text-4xl md:text-5xl font-bold text-slate-900 leading-tight max-w-xl"
      >
        Court-Ready Legal Verification for Indian Advocates
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed"
      >
        Built on 75,000+ Supreme Court Judgments (1950-2025). Used by advocates, law firms, and legal researchers.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-100 bg-green-50 text-sm font-medium text-green-700"
      >
        No Hallucinations Guaranteed
      </motion.div>
    </section>
  );
};

export default Hero;
