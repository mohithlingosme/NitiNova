import React from "react";
import { motion } from "motion/react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  takeaway?: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  takeaway,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <div className="h-full rounded-xl border border-gray-200 bg-white p-5 hover:border-slate-300 transition-all duration-200">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2 font-serif">{title}</h3>
        <p className="text-sm text-slate-700 leading-relaxed">{description}</p>
        {takeaway && (
          <p className="mt-3 text-sm font-semibold text-slate-900">
            Why it matters:{" "}
            <span className="text-slate-700 font-normal">{takeaway}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard;
