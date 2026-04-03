import React from "react";
import { Search, Loader2 } from "lucide-react";
import { motion } from "motion/react";

type SearchBarProps = {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading?: boolean;
  placeholder?: string;
  onExampleSelect?: (val: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder,
  onExampleSelect,
}) => {
  return (
    <motion.form
      onSubmit={onSubmit}
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative flex flex-col gap-4 bg-white border border-gray-300 rounded-md px-4 py-5">
        <label className="text-sm font-semibold text-slate-800">
          Paste your legal argument or citations
        </label>
        <textarea
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Enter argument, issue, or citation list..."}
          className="w-full min-h-[120px] bg-white border border-gray-300 rounded-md px-3 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
        />
        <div className="space-y-3">
          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1F3A] text-white font-semibold px-5 py-3 rounded-md border border-[#0B1F3A] hover:bg-[#091931] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Verify Legal Argument
              </>
            )}
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Search className="w-4 h-4 text-slate-500" />
            <span>Free. No credit card required. Takes &lt;10 seconds.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-3">
        <div className="relative">
          <select
            onChange={(e) => onExampleSelect?.(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          >
            <option value="">Try an example</option>
            <option>Basic Structure Doctrine</option>
            <option>Article 21 privacy precedent</option>
            <option>Section 65B electronic evidence</option>
            <option>Reservation in promotions (M. Nagaraj)</option>
          </select>
        </div>
      </div>
    </motion.form>
  );
};

export default SearchBar;
