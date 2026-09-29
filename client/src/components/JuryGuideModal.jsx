import React, { useState } from 'react';
import {
  Shield,
  HelpCircle,
  X,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  FileCode,
  FileSpreadsheet,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Lock,
  ListChecks
} from 'lucide-react';

export const JuryGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header with GovTech SIH Tricolor Accents */}
        <div className="bg-gradient-to-r from-gov-900 via-gov-800 to-slate-900 text-white p-5 sm:p-6 shrink-0 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gov-700/80 text-white border border-gov-500/40 shadow-md">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                    SIH 2026 • SIH26129
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Interactive Jury Explainer
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">
                  SetuLink Prototype: Official Jury & Evaluator Guide
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition"
              title="Close Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-gov-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              1. The Problem & Solution
            </button>

            <button
              onClick={() => setActiveTab('formats')}
              className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                activeTab === 'formats'
                  ? 'bg-gov-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              2. 3 Silo Formats (JSON/XML/CSV)
            </button>

            <button
              onClick={() => setActiveTab('matching')}
              className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                activeTab === 'matching'
                  ? 'bg-gov-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              3. Deterministic Matching (No AI)
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                activeTab === 'checklist'
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'bg-slate-800/80 text-amber-300 hover:bg-slate-700'
              }`}
            >
              4. 3-Minute Live Demo Checklist
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1 leading-relaxed">
          
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-gov-50 border border-gov-200">
                <h4 className="font-bold text-sm text-gov-900 mb-1">
                  What Problem Are We Solving? (SIH26129)
                </h4>
                <p className="text-slate-700">
                  Government digital platforms across states and ministries operate in separate, isolated silos. Citizens are forced to maintain 5 different logins, fill duplicate forms, submit paper proofs repeatedly, and wait weeks for simple address changes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <h4 className="font-bold text-sm text-emerald-900 mb-1">
                  What SetuLink Does (Zero-Copy Interoperability)
                </h4>
                <p className="text-slate-800">
                  <strong>SetuLink does NOT replace existing department software.</strong> It is a sovereign middleware layer that bridges citizens and independent ministries. It provides <strong>one login</strong>, <strong>one unified dashboard</strong>, <strong>one common data schema</strong>, <strong>consent-based sharing</strong>, <strong>deterministic verification</strong>, and <strong>full audit trails</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Before SetuLink:</span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    <li>❌ 5 Logins & Separate Credentials</li>
                    <li>❌ Multiple inconsistent address records</li>
                    <li>❌ 7 to 14 days processing latency</li>
                    <li>❌ Zero citizen control over data sharing</li>
                  </ul>
                </div>

                <div className="p-3 bg-gov-50/50 rounded-xl border border-gov-200">
                  <span className="font-bold text-gov-900 block mb-1">With SetuLink:</span>
                  <ul className="space-y-1 text-gov-800 text-[11px]">
                    <li>✅ 1 Single Window (Jan-Aadhaar SSO)</li>
                    <li>✅ On-the-fly cross-department federation</li>
                    <li>✅ Real-time multi-stage approval workflow</li>
                    <li>✅ 100% Granular citizen consent sovereignty</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Formats */}
          {activeTab === 'formats' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-slate-600">
                In real-world e-governance, departments built their systems over different decades using incompatible formats. SetuLink actively integrates 3 deliberately heterogeneous formats:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl border border-sky-200 bg-sky-50/40">
                  <div className="flex items-center gap-2 mb-2">
                    <FileJson className="w-5 h-5 text-sky-600" />
                    <span className="font-bold text-slate-900 text-xs">Health Silo</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[10px] font-bold">
                    JSON API
                  </span>
                  <p className="text-[11px] text-slate-600 mt-2">
                    Fields: <code>patient_id</code>, <code>full_name</code>, <code>dob</code>, <code>blood_group</code>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCode className="w-5 h-5 text-amber-600" />
                    <span className="font-bold text-slate-900 text-xs">Transport Silo</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                    XML SOAP
                  </span>
                  <p className="text-[11px] text-slate-600 mt-2">
                    Parsed with <code>xml2js</code>. Fields: <code>vehicle_owner_id</code>, <code>owner_name</code>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40">
                  <div className="flex items-center gap-2 mb-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-xs">Municipal Silo</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                    CSV Feed
                  </span>
                  <p className="text-[11px] text-slate-600 mt-2">
                    Parsed with <code>papaparse</code>. Fields: <code>citizen_ref</code>, <code>addr_line</code>
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px]">
                <div className="text-gov-300 font-bold mb-1">// Normalized SetuLink Common Schema:</div>
                <pre className="text-slate-300 leading-snug">
{`{
  "citizen_id": "CIT-100000000001",
  "name": "Rahul Sharma",
  "dob": "1990-05-15",
  "address": "Flat 402, Lotus Tower, Civil Lines, New Delhi",
  "source": "Health | Transport | Municipal",
  "metadata": { ...department_specific_fields }
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Matching Engine */}
          {activeTab === 'matching' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Why Deterministic Rules? (Strictly No AI Hallucinations)</span>
                </h4>
                <p className="text-xs text-amber-800">
                  Government citizen records require 100% legal auditability. LLMs can hallucinate or silently merge conflicting identities. SetuLink uses deterministic mathematical algorithms.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                    <span>1. Match Score $\ge 0.90$ (Auto-Link)</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      Safe Auto-Federate
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Exact ID match or identical normalized name + verified DOB + address token overlap.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                  <div className="flex items-center justify-between font-bold text-amber-900 text-xs">
                    <span>2. Match Score $0.60 - 0.89$ (Needs Review Queue)</span>
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                      Isolated into Admin Queue
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] mt-1">
                    Catches subtle mismatches (e.g. "Rahul Sharma" vs "R. Sharma", DOB typos, address variations). <strong>Never silently merged.</strong>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                    <span>3. Match Score $&lt; 0.60$ (Isolated Records)</span>
                    <span className="text-slate-600 bg-slate-200 px-2 py-0.5 rounded text-[10px]">
                      Treated as Distinct
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Different persons entirely. Kept completely separate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Evaluation Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 rounded-xl bg-gov-50 border border-gov-200 text-gov-900 font-semibold text-xs">
                💡 Follow this 3-minute sequence to test the entire prototype live:
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gov-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Explore Unified Citizen View</span>
                    <p className="text-slate-500 text-[11px]">
                      Click <strong>Citizen</strong> persona. See how Health (*JSON*), Transport (*XML*), and Municipal (*CSV*) records appear side-by-side in one window.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gov-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Test Sovereign Citizen Consent</span>
                    <p className="text-slate-500 text-[11px]">
                      Go to <strong>Consent & Logs</strong> &rarr; Click <em>Revoke Access</em> for Municipal &rarr; Return to Profile. The gateway immediately blocks that silo in real time!
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gov-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Execute Sequential Address Update</span>
                    <p className="text-slate-500 text-[11px]">
                      As Citizen, initiate an Address Update. Switch to <strong>Clerk</strong> to inspect and advance Stage 2. Switch to <strong>Officer</strong> for Stage 3 sign-off.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gov-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Resolve Silo Discrepancies</span>
                    <p className="text-slate-500 text-[11px]">
                      Switch to <strong>Admin</strong> &rarr; Open <strong>Conflict Resolution</strong>. Compare conflicting values side-by-side, pick the canonical value, and resolve.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gov-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Inspect Immutable Security Audit Trail</span>
                    <p className="text-slate-500 text-[11px]">
                      View <strong>Audit Trail</strong> and <strong>Exception Logs</strong> to see timestamps, actors, IPs, and partial failure isolation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            SetuLink • Smart India Hackathon Prototype
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gov-600 hover:bg-gov-700 text-white font-bold text-xs shadow-sm transition"
          >
            Start Testing
          </button>
        </div>

      </div>
    </div>
  );
};
