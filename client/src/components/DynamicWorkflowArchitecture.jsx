import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  GitBranch,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  Pause,
  Sparkles,
  RefreshCw,
  FileText,
  Lock,
  AlertCircle,
  CheckSquare,
  Terminal,
  Radio,
  Share2,
  Database,
  Sliders,
  ChevronRight
} from 'lucide-react';

export const DynamicWorkflowArchitecture = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1); // 1x, 2x
  const [activeWorkflowMode, setActiveWorkflowMode] = useState('full_federation'); // 'full_federation' | 'consent_block' | 'conflict_dag'
  const [cycleStep, setCycleStep] = useState(0); // 0 to 4 continuous loop
  const [selectedNode, setSelectedNode] = useState(null);
  const [metrics, setMetrics] = useState({
    activeStreams: 12,
    cyclesProcessed: 3840,
    currentLatency: 14,
    auditBlockHeight: 184920,
    complianceRate: 100
  });

  // Continuous Dynamic Workflow Event Stream Logs
  const [eventLogs, setEventLogs] = useState([
    { id: 1, time: '00:20:15', tag: 'SOVEREIGN_INGRESS', text: 'SSO token verified for CIT-10001 (Jan-Aadhaar). Consent bitmask verified.', status: 'success' },
    { id: 2, time: '00:20:16', tag: 'DETERMINISTIC_ROUTER', text: 'Strips PII. Generates Levenshtein token. Parallel dispatch to 3 silos.', status: 'info' },
    { id: 3, time: '00:20:17', tag: 'SILO_TRANSFORMATION', text: 'Health JSON + Transport XML + Municipal CSV normalized to common schema.', status: 'success' },
    { id: 4, time: '00:20:18', tag: 'DAG_VERIFICATION', text: 'Clerk Stage 2 doc validation & Officer Stage 3 digital sign-off completed.', status: 'success' },
    { id: 5, time: '00:20:19', tag: 'GOLDEN_LEDGER', text: 'Golden Record delivered in 14.2ms. Event hash 0x7f8a9e logged to audit stream.', status: 'success' }
  ]);

  // Continuous architecture loop
  useEffect(() => {
    let timer;
    if (isRunning) {
      const interval = Math.floor(1800 / speed);
      timer = setInterval(() => {
        setCycleStep((prev) => {
          const next = (prev + 1) % 5;
          // Dynamically update metrics
          setMetrics((m) => ({
            ...m,
            cyclesProcessed: m.cyclesProcessed + 1,
            currentLatency: +(12 + Math.random() * 4).toFixed(1),
            auditBlockHeight: m.auditBlockHeight + 1
          }));

          // Add continuous live event stream log
          const now = new Date().toTimeString().split(' ')[0];
          const mockEvents = [
            { tag: 'INGRESS_TOKEN', text: `Session #88${Math.floor(Math.random() * 90 + 10)}: Citizen consent directives loaded (mTLS 1.3).`, status: 'info' },
            { tag: 'SCHEMA_NORMALIZER', text: `Converted disparate XML SOAP & CSV feeds to SetuLink Common Schema in 3.4ms.`, status: 'success' },
            { tag: 'DETERMINISTIC_MATCH', text: `Levenshtein score: 0.988 >= 0.90 threshold. Mathematical link confirmed (no AI hallucination).`, status: 'success' },
            { tag: 'DAG_STAGE_TRANSITION', text: `Multi-stage approval workflow advanced: Applicant -> Clerk -> Officer authorized.`, status: 'info' },
            { tag: 'IMMUTABLE_HASH_AUDIT', text: `Audit block #${Math.floor(Math.random() * 1000 + 184900)} sealed with SHA-256 fingerprint.`, status: 'success' }
          ];

          setEventLogs((prevLogs) => [
            { id: Date.now(), time: now, ...mockEvents[next] },
            ...prevLogs.slice(0, 4)
          ]);

          return next;
        });
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isRunning, speed]);

  const architectureNodes = [
    {
      id: 0,
      title: '1. Ingress & Consent Guard',
      subtitle: 'Citizen Gateway',
      icon: ShieldCheck,
      color: 'gov',
      desc: 'Validates Jan-Aadhaar SSO and inspects digital consent directives. Rejects unconsented silo queries at the perimeter.',
      specs: 'Protocol: mTLS 1.3 | Token: JWT Ed25519 | Latency: 1.8ms',
      activeStep: 0
    },
    {
      id: 1,
      title: '2. Normalization Engine',
      subtitle: 'Common Schema Transformer',
      icon: RefreshCw,
      color: 'sky',
      desc: 'Translates asynchronous JSON, legacy XML SOAP, and CSV feeds into the canonical SetuLink schema on-the-fly.',
      specs: 'Parsers: xml2js + Papaparse | Zero-Copy Memory | Latency: 3.2ms',
      activeStep: 1
    },
    {
      id: 2,
      title: '3. Deterministic Matcher',
      subtitle: 'Rule-Based Linker (No AI)',
      icon: Cpu,
      color: 'indigo',
      desc: 'Executes weighted Levenshtein name distance, DOB tokenization, and address overlap matching. Strictly zero hallucination.',
      specs: 'Alg: Levenshtein + Jaccard | Score Threshold: >=0.90 | Latency: 4.1ms',
      activeStep: 2
    },
    {
      id: 3,
      title: '4. Workflow DAG Engine',
      subtitle: 'Sequential Verification',
      icon: GitBranch,
      color: 'amber',
      desc: 'Coordinates multi-tier administrative governance: Citizen submission -> Clerk document inspection -> Officer sign-off.',
      specs: 'Workflow: Directed Acyclic Graph | Digital Stamps | Latency: 2.9ms',
      activeStep: 3
    },
    {
      id: 4,
      title: '5. Immutable Audit Ledger',
      subtitle: 'Cryptographic Ledger',
      icon: Lock,
      color: 'emerald',
      desc: 'Append-only tamper-evident stream recording every cross-department transaction with timestamp, actor, and payload hashes.',
      specs: 'Hashing: SHA-256 | Storage: Supabase Postgres RLS | Latency: 2.2ms',
      activeStep: 4
    }
  ];

  return (
    <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl mb-12">
      {/* Background glowing conduits */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header & Continuous Controller HUD */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Continuous Dynamic Architecture DAG</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
              Autonomous Cycle #{metrics.cyclesProcessed.toLocaleString()}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Continuous Dynamic Workflow & Architecture Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Watch the live architectural state machine run continually in real time. Each cycle illustrates how SetuLink deterministically coordinates citizen requests, schema normalization, multi-stage DAG validation, and immutable audit stamping.
          </p>
        </div>

        {/* Live Controller Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pause / Play */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500 shadow-md'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Dynamic Loop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run Continuously</span>
              </>
            )}
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold border border-slate-700 transition"
            title="Toggle Engine Speed"
          >
            <Clock className="w-3.5 h-3.5 text-gov-400" />
            <span>{speed}x Speed</span>
          </button>

          {/* Workflow Mode Selector */}
          <div className="hidden sm:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setActiveWorkflowMode('full_federation')}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeWorkflowMode === 'full_federation'
                  ? 'bg-gov-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Federation
            </button>
            <button
              onClick={() => setActiveWorkflowMode('conflict_dag')}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeWorkflowMode === 'conflict_dag'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clerk/Officer DAG
            </button>
            <button
              onClick={() => setActiveWorkflowMode('consent_block')}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeWorkflowMode === 'consent_block'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Consent Shield
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5-STAGE CONTINUOUS ARCHITECTURAL WORKFLOW PIPELINE                         */}
      {/* ========================================================================= */}
      <div className="relative z-10 mb-8">
        
        {/* Connecting Glowing Pipeline Cable (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-slate-800 rounded-full z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gov-500 via-indigo-500 to-emerald-500 flow-line" />
        </div>

        {/* Dynamic Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
          {architectureNodes.map((node) => {
            const Icon = node.icon;
            const isActive = cycleStep === node.activeStep;
            const isSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-lg relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-gov-400 ring-2 ring-gov-500/50 translate-y-[-6px]'
                    : isSelected
                    ? 'bg-slate-900 border-indigo-400 ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 opacity-90'
                }`}
              >
                {/* Active Glowing Pulse Pin */}
                {isActive && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[9px] font-black uppercase tracking-wider shadow-md animate-bounce">
                    ACTIVE STEP
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                      isActive
                        ? 'bg-gov-500 text-white shadow-lg shadow-gov-500/50 scale-110'
                        : 'bg-slate-800/80 text-slate-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      0{node.id + 1}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-white tracking-tight leading-snug">
                    {node.title}
                  </h3>
                  <div className="text-[10px] font-mono text-gov-400 mt-0.5 font-semibold">
                    {node.subtitle}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {node.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className={`${isActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                    {isActive ? '● Processing...' : 'Standby'}
                  </span>
                  <span className="text-gov-400 hover:underline flex items-center gap-0.5">
                    Inspect &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Mobile Step Stepper Indicator */}
        <div className="lg:hidden mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Dynamic Step:</span>
          <span className="text-gov-300 font-bold">
            {architectureNodes[cycleStep].title}
          </span>
          <span className="text-emerald-400 font-bold animate-pulse">Running</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LOWER PANEL: LIVE CONTINUOUS EVENT STREAM & REAL-TIME SPECS               */}
      {/* ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Continuous Live Transaction Event Stream (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Continuous Architectural Event Stream
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-mono">
              Live Feed • 1,840 tx/s
            </span>
          </div>

          <div className="space-y-2 font-mono text-[11px] overflow-hidden">
            {eventLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-2.5 hover:bg-slate-900 transition"
              >
                <span className="text-slate-500 shrink-0 text-[10px] mt-0.5">{log.time}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase shrink-0 ${
                  log.status === 'success'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-sky-950 text-sky-300 border border-sky-800'
                }`}>
                  {log.tag}
                </span>
                <span className="text-slate-300 text-[11px] leading-snug break-words">
                  {log.text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Deterministic State Engine • 100% Auditability</span>
            <span className="text-gov-400">Zero Silent Merges</span>
          </div>
        </div>

        {/* Right: Real-time Telemetry & Node Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  {selectedNode ? selectedNode.title : 'Live Telemetry & Architectural Specs'}
                </h3>
              </div>
              <span className="text-[10px] text-gov-300 font-mono">
                {selectedNode ? 'Selected Node' : 'System Overview'}
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">Architecture Function:</div>
                  <div className="text-xs text-white leading-relaxed">{selectedNode.desc}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">Operational Specifications:</div>
                  <div className="text-xs text-emerald-400 font-mono leading-relaxed">{selectedNode.specs}</div>
                </div>

                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Return to System Telemetry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total Latency:</div>
                  <div className="text-base font-extrabold text-sky-400 mt-1">{metrics.currentLatency}ms</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Budget: &lt;50ms</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Silo Connectors:</div>
                  <div className="text-base font-extrabold text-emerald-400 mt-1">3 / 3 Active</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">JSON • XML • CSV</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Audit Ledger:</div>
                  <div className="text-base font-extrabold text-indigo-300 mt-1">#{metrics.auditBlockHeight}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">SHA-256 Chained</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Compliance Rate:</div>
                  <div className="text-base font-extrabold text-amber-400 mt-1">100%</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">DPDP Act 2023</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Hardware Replacements
            </span>
            <span>Deterministic v2.4</span>
          </div>
        </div>

      </div>
    </div>
  );
};
