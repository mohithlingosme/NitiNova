import React from "react";
import { Scale } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="text-slate-900 w-5 h-5" />
            <span className="font-semibold text-lg tracking-tight">NitiNova</span>
          </div>
          <p className="text-sm text-slate-600">
            Built in India for the Indian Legal System. Data is confidential, encrypted, and not stored after verification.
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">About</p>
          <a className="hover:text-slate-900" href="#">Company</a>
          <a className="hover:text-slate-900" href="#">Pricing</a>
          <a className="hover:text-slate-900" href="#">Security</a>
        </div>
        <div className="space-y-2 text-sm text-slate-600 flex flex-col gap-1">
          <p className="font-semibold text-slate-900">Legal</p>
          <a className="hover:text-slate-900" href="#">Privacy Policy</a>
          <a className="hover:text-slate-900" href="#">Terms of Use</a>
          <a className="hover:text-slate-900" href="#">Legal Disclaimer</a>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Contact</p>
          <a className="hover:text-slate-900 block" href="#">support@nitinova.com</a>
          <a className="hover:text-slate-900 block" href="#">+91-00000-00000</a>
          <a className="hover:text-slate-900 block" href="#">Book a demo</a>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © 2026 NitiNova. Built in India for Indian Legal System.
      </div>
    </footer>
  );
};

export default Footer;
