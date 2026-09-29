import React from 'react';
import { Database, ShieldCheck, UserCheck, Activity, Layers, FileJson, FileCode, FileSpreadsheet } from 'lucide-react';

export const LiveDataFlow = ({ isQuerying = false, activeDepartments = ['Health', 'Transport', 'Municipal'] }) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 overflow-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 relative z-10 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gov-400 animate-pulse" />
            <h3 className="text-base font-bold tracking-wide text-slate-100 uppercase">
              Live Interoperability Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fan-out & format normalization across heterogeneous government silos
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isQuerying ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            {isQuerying ? 'Gateway Fan-Out in Progress' : 'Gateway Ready (Idle)'}
          </span>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-gov-950/80 text-gov-300 border border-gov-800/60 font-mono">
            3 Active Silos
          </span>
        </div>
      </div>

      {/* Interactive Visual Node Diagram */}
      <div className="relative py-4 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Node 1: Citizen Portal */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-gov-600/30 border border-gov-500/50 flex items-center justify-center text-gov-400 mb-2">
              <UserCheck className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-sm text-slate-200">Citizen Application</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Single Sign-On (Aadhaar / ID)</p>
            <span className="mt-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Authenticated
            </span>
          </div>

          {/* Node 2: SetuLink Middleware Core */}
          <div className={`flex flex-col items-center text-center p-5 bg-gradient-to-b from-gov-900/60 to-slate-800/90 rounded-2xl border ${isQuerying ? 'border-gov-400 ring-2 ring-gov-500/30' : 'border-gov-700/60'} shadow-2xl relative`}>
            <div className="w-14 h-14 rounded-2xl bg-gov-500 text-white flex items-center justify-center shadow-lg mb-2">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-sm text-white">SetuLink Gateway</h4>
            <p className="text-[11px] text-gov-200 mt-0.5">Deterministic Mapping & Consent Check</p>
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">RBAC Enforced</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Audit Logged</span>
            </div>
          </div>

          {/* Node 3: Department Silos (Right side stack) */}
          <div className="space-y-2.5">
            {/* Health Dept */}
            <div className={`flex items-center justify-between p-3 rounded-xl border transition ${activeDepartments.includes('Health') ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-50'}`}>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-800">
                  <FileJson className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Health Silo</div>
                  <div className="text-[10px] text-slate-400">REST API • JSON</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                {isQuerying ? 'PARSING...' : 'ONLINE'}
              </span>
            </div>

            {/* Transport Dept */}
            <div className={`flex items-center justify-between p-3 rounded-xl border transition ${activeDepartments.includes('Transport') ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-50'}`}>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Transport Authority</div>
                  <div className="text-[10px] text-slate-400">Legacy Feed • XML</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                {isQuerying ? 'TRANSFORMING...' : 'ONLINE'}
              </span>
            </div>

            {/* Municipal Dept */}
            <div className={`flex items-center justify-between p-3 rounded-xl border transition ${activeDepartments.includes('Municipal') ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-50'}`}>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Municipal Civic</div>
                  <div className="text-[10px] text-slate-400">Bulk Registry • CSV</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                {isQuerying ? 'STREAMING...' : 'ONLINE'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
