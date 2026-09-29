import React from 'react';
import {
  Shield,
  X,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Cpu,
  Layers,
  FileJson,
  FileCode,
  FileSpreadsheet,
  Lock,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';

export const Mobile3DModal = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  isSimulating,
  onStartSimulation,
  onResetSimulation
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center p-2.5 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl sm:rounded-3xl border border-slate-700/80 max-w-xl w-full shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gov-950 via-slate-900 to-indigo-950 p-4 sm:p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gov-600/30 text-gov-300 border border-gov-500/40">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                    3D Interactive Architecture
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-gov-500/20 text-gov-300 font-mono">
                    Module {activeTab} of 3
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
                  SetuLink Interoperability Engine
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
              title="Close Pop-up"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pipeline Visual Flow Line */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
            <button
              onClick={() => setActiveTab(1)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                activeTab === 1 ? 'bg-gov-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">1</span>
              <span>1st: Citizen</span>
            </button>

            <span className="text-slate-600">&rarr;</span>

            <button
              onClick={() => setActiveTab(2)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                activeTab === 2 ? 'bg-indigo-600 text-white font-bold shadow ring-1 ring-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">2</span>
              <span>2nd: Core (Middle)</span>
            </button>

            <span className="text-slate-600">&rarr;</span>

            <button
              onClick={() => setActiveTab(3)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                activeTab === 3 ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">3</span>
              <span>3rd: Silos</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          
          {/* MODULE 1: Sovereign Citizen */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-gov-950/80 border border-gov-500/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gov-600/30 border border-gov-400/50 flex items-center justify-center text-gov-300 shadow-md">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-gov-500/20 text-gov-300 border border-gov-500/40 text-[10px] font-mono font-bold">
                    STEP 1: INGRESS
                  </span>
                </div>
                <h4 className="font-black text-base text-white">Tier 1: Sovereign Citizen Layer</h4>
                <p className="text-xs text-slate-300 mt-1">Single Identity Access & Consent Sovereignty</p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Consent Directives:</span>
                    <span className="text-emerald-400 font-semibold font-mono">100% Granular Toggle</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Authentication:</span>
                    <span className="text-gov-300 font-semibold font-mono">Jan-Aadhaar SSO Token</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Sovereign Protection:</span>
                    <span className="text-amber-400 font-semibold font-mono">Zero Unauthorized Leakage</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <div className="text-gov-400 font-bold mb-1">// Ingress Payload:</div>
                  <code>{`{ "citizen_id": "CIT-10001", "consent": ["health", "transport"] }`}</code>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: SetuLink Core Middleware (Middle) */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-indigo-950/80 border-2 border-indigo-500/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gov-500 text-white flex items-center justify-center shadow-lg shadow-gov-500/40">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500 text-white font-mono text-[10px] font-bold shadow-md">
                    STEP 2: MIDDLE CORE
                  </span>
                </div>
                <h4 className="font-black text-base text-white">Tier 2: SetuLink Core Router</h4>
                <p className="text-xs text-gov-200 mt-1">Deterministic Federation & Normalization Engine</p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Deterministic Matching (No AI):</div>
                    <div className="text-emerald-400 font-mono font-semibold">Levenshtein + DOB + Tokens</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Transformation Latency:</div>
                    <div className="text-sky-400 font-mono font-semibold">14ms Common Schema Normalization</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Security Audit:</div>
                    <div className="text-amber-400 font-mono font-semibold">Immutable Access Log Stream</div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <div className="text-emerald-400 font-bold mb-1">// Deterministic Score:</div>
                  <code>{`{ "score": 0.98, "algorithm": "weighted_levenshtein", "hallucination_risk": 0 }`}</code>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 3: Independent Silos */}
          {activeTab === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="font-black text-base text-white">Tier 3: Independent Silos</h4>
                    <p className="text-xs text-slate-400">Zero Replacement Cost for Legacy Databases</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                    STEP 3: FEDERATION
                  </span>
                </div>

                {/* Health Silo */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-sky-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-sky-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Health Silo</div>
                      <div className="text-[10px] text-slate-500">REST API • JSON</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono font-bold">
                    ONLINE
                  </span>
                </div>

                {/* Transport Silo */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Transport Authority</div>
                      <div className="text-[10px] text-slate-500">Legacy Feed • XML SOAP</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold">
                    ONLINE
                  </span>
                </div>

                {/* Municipal Silo */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Municipal Civic</div>
                      <div className="text-[10px] text-slate-500">Bulk Registry • CSV</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold">
                    ONLINE
                  </span>
                </div>

                <div className="pt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Zero Modification to Existing Legacy Schemas
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex items-center justify-between gap-2">
          {activeTab > 1 ? (
            <button
              onClick={() => setActiveTab((prev) => prev - 1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition"
            >
              Close
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={isSimulating ? onResetSimulation : onStartSimulation}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-gov-400" />
                  <span>Auto-Flow</span>
                </>
              )}
            </button>

            {activeTab < 3 ? (
              <button
                onClick={() => setActiveTab((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md transition"
              >
                <span>Next ({activeTab === 1 ? '2nd Core' : '3rd Silos'})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setActiveTab(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repeat from 1st</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
