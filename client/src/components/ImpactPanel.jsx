import React from 'react';
import { ArrowRight, CheckCircle2, XCircle, Clock, Zap, ShieldCheck } from 'lucide-react';

export const ImpactPanel = () => {
  return (
    <div className="bg-gradient-to-r from-gov-900 via-gov-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-gov-700/50">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Summary */}
        <div className="max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gov-700/60 border border-gov-500/40 text-gov-200 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            SIH 2026 Innovation Benchmark
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            From Fragmented Portals to Unified Digital Governance
          </h3>
          <p className="text-xs text-gov-200 mt-2 leading-relaxed">
            Eliminates redundant citizen visits, inconsistent KYC records, and manual multi-department reconciliation through a zero-copy middleware layer.
          </p>
        </div>

        {/* Right: Before vs After Comparison Cards */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Before */}
          <div className="flex-1 bg-slate-950/60 border border-rose-900/40 p-4 rounded-xl min-w-[220px]">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
              <XCircle className="w-4 h-4" /> Traditional Silos
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span><strong>5 Logins & Passwords</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span><strong>5 Duplicate Forms</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span><strong>7–14 Days</strong> turnaround</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Zero Citizen Consent Control</span>
              </li>
            </ul>
          </div>

          <div className="text-gov-400 hidden sm:block">
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </div>

          {/* After: SetuLink */}
          <div className="flex-1 bg-gov-950/80 border border-emerald-500/50 p-4 rounded-xl shadow-lg ring-1 ring-emerald-500/20 min-w-[220px]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" /> With SetuLink
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>1 Single Sign-On</strong> (Jan-Aadhaar)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>1 Unified Master Form</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>&lt; 3 Minutes</strong> processing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>100% Consent & Audit Trails</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
