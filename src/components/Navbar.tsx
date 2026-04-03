import React from "react";
import { Scale } from "lucide-react";
import { motion } from "motion/react";

type NavbarProps = {
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
};

const links = ["Research", "Drafting", "Verification", "Pricing"];

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  onSignIn,
  onSignUp,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-9 h-9 bg-[#0B1F3A] rounded-lg flex items-center justify-center"
          >
            <Scale className="text-white w-5 h-5" />
          </motion.div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg tracking-tight text-[#0B1F3A]">
              NitiNova
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold bg-slate-100 text-[#0B1F3A] px-1.5 py-0.5 rounded">
              Beta
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          {links.map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-slate-900 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={onSignOut}
              className="text-sm font-semibold text-slate-800 px-4 py-2 rounded-md hover:bg-gray-100 transition"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button
                onClick={onSignIn}
                className="text-sm font-semibold text-slate-800 px-4 py-2 rounded-md hover:bg-gray-100 hover:text-indigo-600 cursor-pointer transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onSignUp}
                className="text-sm font-semibold px-4 py-2 rounded-md border border-[#0B1F3A] text-white bg-[#0B1F3A] hover:bg-[#0a1a30] transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
