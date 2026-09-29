import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Shield,
  UserCheck,
  FileJson,
  FileCode,
  FileSpreadsheet,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Activity,
  Terminal,
  Maximize2
} from 'lucide-react';

export const Pipeline3DVisualizer = () => {
  const [activeStage, setActiveStage] = useState(1); // 1 = Ingress, 2 = Middleware Core, 3 = Silo Fan-out, 4 = Golden Record
  const [isAutoStreaming, setIsAutoStreaming] = useState(true);
  const [tilt, setTilt] = useState({ x: 14, y: -12 });
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);
  const [injectedCount, setInjectedCount] = useState(482);
  const [lastPacket, setLastPacket] = useState({
    id: 'PKT-9482',
    name: 'Rahul Sharma (CIT-10001)',
    flow: 'Jan-Aadhaar SSO -> SetuLink Deterministic -> Silos',
    timestamp: 'Just now',
    score: 0.984
  });

  // Auto stream cycle
  useEffect(() => {
    let timer;
    if (isAutoStreaming) {
      timer = setInterval(() => {
        setActiveStage((prev) => {
          const next = prev >= 4 ? 1 : prev + 1;
          if (next === 1) {
            setInjectedCount((c) => c + 1);
          }
          return next;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isAutoStreaming]);

  const handleInjectPacket = () => {
    setInjectedCount((c) => c + 1);
    setActiveStage(1);
    setLastPacket({
      id: `PKT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: 'Rahul Sharma (CIT-10001)',
      flow: 'Ingress Auth -> Levenshtein Match -> Multi-Silo Fanout',
      timestamp: new Date().toLocaleTimeString(),
      score: +(0.95 + Math.random() * 0.04).toFixed(3)
    });
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl mb-12">
      {/* Background cyber grid & neon lighting */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-gov-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Header & Telemetry Status Bar */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Live Pipeline Stream
            </span>
            <span className="text-[11px] font-mono text-gov-300 bg-gov-950/80 px-2 py-0.5 rounded border border-gov-800">
              SIH26129 Zero-Copy Middleware
            </span>
            <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
              Deterministic 14ms
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            3D Interoperability Data Pipeline & Workflow Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Watch live synthetic packets traverse from <strong>Citizen Sovereign Ingress</strong> through the <strong>SetuLink Middleware Core</strong>, fan out to <strong>3 heterogeneous silo formats</strong>, and re-emerge as a <strong>Unified Golden Record</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleInjectPacket}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Inject Test Packet</span>
          </button>

          <button
            onClick={() => setIsAutoStreaming(!isAutoStreaming)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              isAutoStreaming
                ? 'bg-gov-600/30 border-gov-500/50 text-gov-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isAutoStreaming ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Streaming Auto</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-gov-400" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowPayloadInspector(!showPayloadInspector)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Payload Inspector</span>
            <span className="sm:hidden">Payloads</span>
            {showPayloadInspector ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Active Pipeline Stage Navigator Pills */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => setActiveStage(1)}
          className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
            activeStage === 1
              ? 'bg-gov-950/90 border-gov-400 ring-2 ring-gov-500/30'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
            activeStage === 1 ? 'bg-gov-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>1</span>
          <div className="truncate">
            <div className="text-[11px] font-bold text-white truncate">1. Citizen Ingress</div>
            <div className="text-[9px] text-slate-400 font-mono">Consent Check</div>
          </div>
        </button>

        <button
          onClick={() => setActiveStage(2)}
          className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
            activeStage === 2
              ? 'bg-indigo-950/90 border-indigo-400 ring-2 ring-indigo-500/30'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
            activeStage === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>2</span>
          <div className="truncate">
            <div className="text-[11px] font-bold text-white truncate">2. Middleware Core</div>
            <div className="text-[9px] text-slate-400 font-mono">14ms Levenshtein</div>
          </div>
        </button>

        <button
          onClick={() => setActiveStage(3)}
          className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
            activeStage === 3
              ? 'bg-amber-950/90 border-amber-400 ring-2 ring-amber-500/30'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
            activeStage === 3 ? 'bg-amber-600 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}>3</span>
          <div className="truncate">
            <div className="text-[11px] font-bold text-white truncate">3. Silo Fan-Out</div>
            <div className="text-[9px] text-slate-400 font-mono">JSON • XML • CSV</div>
          </div>
        </button>

        <button
          onClick={() => setActiveStage(4)}
          className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
            activeStage === 4
              ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500/30'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
            activeStage === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>4</span>
          <div className="truncate">
            <div className="text-[11px] font-bold text-white truncate">4. Golden Record</div>
            <div className="text-[9px] text-slate-400 font-mono">Immutable Audit</div>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3D PIPELINE CANVAS                                                        */}
      {/* ========================================================================= */}
      <div
        className="relative py-6 sm:py-10 transition-transform duration-500 ease-out"
        style={{ perspective: '1400px' }}
      >
        <div
          className="relative transition-all duration-700"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          
          {/* DESKTOP 3D PIPELINE GRID (3-Stage Flow) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* STAGE 1: Sovereign Citizen Ingress (Left - 3 Cols) */}
            <div
              className={`lg:col-span-3 p-5 rounded-2xl border transition-all duration-500 shadow-2xl relative ${
                activeStage === 1
                  ? 'bg-gov-950/95 border-gov-400 ring-2 ring-gov-500/50 translate-y-[-10px]'
                  : 'bg-slate-900/90 border-slate-800 opacity-80'
              }`}
              style={{ transform: 'translateZ(25px)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gov-600/30 border border-gov-500/40 text-gov-300 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-gov-500/20 text-gov-300 border border-gov-500/40 font-mono text-[9px] font-bold">
                  STAGE 1: INGRESS
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-white">Sovereign Citizen</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Jan-Aadhaar SSO Ingress Node</p>

              {/* Data Ingress Directives */}
              <div className="mt-3.5 space-y-1.5 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Auth Token:</span>
                  <span className="text-gov-300 font-bold">mTLS 1.3 Valid</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Consent Guard:</span>
                  <span className="text-emerald-400 font-bold">Active Directive</span>
                </div>
              </div>

              {/* Ingress packet simulation badge */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-gov-400 font-mono">
                  <Lock className="w-3 h-3" /> Zero Leakage
                </span>
                <span className="text-slate-500 font-mono">Req: #8841</span>
              </div>
            </div>

            {/* PIPELINE CONDUIT 1: Ingress -> Middleware (1 Col) */}
            <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center relative">
              {/* Cable Line */}
              <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gov-500 to-indigo-500 flow-line" />
              </div>

              {/* Animated Floating Packet */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all duration-300 shadow-lg ${
                  activeStage === 1 || activeStage === 2
                    ? 'bg-gov-500 border-white text-white scale-125 shadow-gov-500/80 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                style={{ transform: 'translateY(-12px)' }}
              >
                &rarr;
              </div>
              <span className="text-[9px] font-mono text-gov-400 mt-1">mTLS Pipeline</span>
            </div>

            {/* STAGE 2: SetuLink Core Middleware Processor (Center - 4 Cols) */}
            <div
              className={`lg:col-span-4 p-6 rounded-2xl border-2 transition-all duration-500 shadow-2xl relative ${
                activeStage === 2
                  ? 'bg-gradient-to-b from-gov-900/90 via-slate-900 to-indigo-950/90 border-indigo-400 ring-4 ring-indigo-500/40 translate-y-[-18px]'
                  : 'bg-slate-900/90 border-slate-700 opacity-90'
              }`}
              style={{ transform: 'translateZ(60px)' }}
            >
              {/* Core Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-500 text-white font-mono text-[10px] font-bold shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>CORE MIDDLEWARE ENGINE</span>
              </div>

              {/* Processor Icon with Radar Ring */}
              <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl border border-indigo-500/40 animate-radar" />
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gov-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-gov-500/50">
                  <Cpu className="w-6 h-6" />
                </div>
              </div>

              <h4 className="font-black text-base text-white text-center">SetuLink Router Core</h4>
              <p className="text-xs text-gov-200 text-center mt-0.5">Deterministic Resolution Engine</p>

              {/* 3 Core Processing Engines */}
              <div className="mt-4 space-y-1.5 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Normalizer:</span>
                  <span className="text-sky-300 font-bold text-[11px]">JSON/XML/CSV &rarr; Canonical</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Matching Rule:</span>
                  <span className="text-emerald-400 font-bold text-[11px]">Levenshtein &ge; 0.90</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Hallucination:</span>
                  <span className="text-emerald-400 font-bold text-[11px]">0% Strict Rules</span>
                </div>
              </div>

              {/* Real-time telemetry ticker */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-indigo-300">
                <span>Latency: 14ms</span>
                <span>Throughput: 1,840 tx/s</span>
              </div>
            </div>

            {/* PIPELINE CONDUIT 2: Middleware -> Silos (1 Col) */}
            <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center relative">
              {/* Cable Line */}
              <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-amber-500 flow-line" />
              </div>

              {/* Animated Floating Packet */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all duration-300 shadow-lg ${
                  activeStage === 2 || activeStage === 3
                    ? 'bg-amber-500 border-white text-slate-950 scale-125 shadow-amber-500/80 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                style={{ transform: 'translateY(-12px)' }}
              >
                &rarr;
              </div>
              <span className="text-[9px] font-mono text-amber-400 mt-1">Fan-Out 3x</span>
            </div>

            {/* STAGE 3: Siloed Department Stack (Right - 3 Cols) */}
            <div
              className={`lg:col-span-3 p-5 rounded-2xl border transition-all duration-500 shadow-2xl relative space-y-2.5 ${
                activeStage === 3
                  ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-500/40 translate-y-[-10px]'
                  : 'bg-slate-900/90 border-slate-800 opacity-80'
              }`}
              style={{ transform: 'translateZ(25px)' }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-extrabold text-sm text-white">Siloed Stack</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[9px] font-bold">
                  STAGE 3: PARALLEL
                </span>
              </div>

              {/* Health JSON Pipe */}
              <div className="p-2 rounded-xl bg-slate-950 border border-sky-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-semibold text-slate-200">Health Silo</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono">
                  JSON REST
                </span>
              </div>

              {/* Transport XML Pipe */}
              <div className="p-2 rounded-xl bg-slate-950 border border-amber-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">Transport Silo</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                  XML SOAP
                </span>
              </div>

              {/* Municipal CSV Pipe */}
              <div className="p-2 rounded-xl bg-slate-950 border border-emerald-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">Municipal Silo</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                  CSV Registry
                </span>
              </div>

              <div className="pt-2 text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Zero DB Alterations
              </div>
            </div>

          </div>

          {/* STAGE 4: Return Pipeline Loop to Unified Golden Record */}
          <div className="mt-8 pt-4 border-t border-slate-800/80">
            <div className={`p-4 rounded-2xl border transition-all duration-500 ${
              activeStage === 4
                ? 'bg-gradient-to-r from-gov-950/90 via-emerald-950/80 to-gov-950/90 border-emerald-400 ring-2 ring-emerald-500/40 shadow-xl'
                : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeStage === 4 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Stage 4: Unified Golden Record Delivered to Citizen</span>
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                        SUCCESS 14ms
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Cross-silo discrepancy resolved deterministically and logged to immutable audit stream with SHA-256 stamp.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                  <span className="text-slate-400">Score: <strong className="text-emerald-400">{lastPacket.score}</strong></span>
                  <span className="text-slate-400">Packets Processed: <strong className="text-gov-300">{injectedCount.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3D Angle Preset Controls */}
      <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="hidden sm:flex items-center gap-2">
          <span>3D Angle:</span>
          <button
            onClick={() => setTilt({ x: 18, y: -20 })}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
          >
            Isometric Left
          </button>
          <button
            onClick={() => setTilt({ x: 0, y: 0 })}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
          >
            Flat Diagram
          </button>
          <button
            onClick={() => setTilt({ x: 18, y: 20 })}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
          >
            Isometric Right
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-slate-500">Live Packet ID: <strong className="text-gov-300">{lastPacket.id}</strong></span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <Activity className="w-3.5 h-3.5" /> Pipeline Online
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLLAPSIBLE LIVE PAYLOAD INSPECTOR                                        */}
      {/* ========================================================================= */}
      {showPayloadInspector && (
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Live Data Payload Telemetry Stream
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Deterministic Schema Transformation View
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-mono">
            {/* Silo 1 JSON */}
            <div className="p-3 rounded-xl bg-slate-950 border border-sky-900/60">
              <div className="text-sky-400 font-bold mb-1 flex items-center justify-between">
                <span>Health Silo (REST API)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300">JSON</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto text-[10px] leading-snug">
{`{
  "patient_id": "H-9018",
  "full_name": "Rahul Sharma",
  "dob": "1990-05-15",
  "blood_group": "B+",
  "status": "HEALTH_OK"
}`}
              </pre>
            </div>

            {/* Silo 2 XML */}
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-900/60">
              <div className="text-amber-400 font-bold mb-1 flex items-center justify-between">
                <span>Transport Silo (SOAP)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">XML</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto text-[10px] leading-snug">
{`<vehicle_record>
  <owner_id>TR-4402</owner_id>
  <name>Rahul Sharma</name>
  <vehicle_no>DL01AB1234</vehicle_no>
  <puc_valid>2027-01-10</puc_valid>
</vehicle_record>`}
              </pre>
            </div>

            {/* SetuLink Normalized Golden Record */}
            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-900/60">
              <div className="text-emerald-400 font-bold mb-1 flex items-center justify-between">
                <span>SetuLink Golden Record</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">UNIFIED</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto text-[10px] leading-snug">
{`{
  "citizen_id": "CIT-10001",
  "canonical_name": "Rahul Sharma",
  "match_score": ${lastPacket.score},
  "latency_ms": 14,
  "sources_federated": 3,
  "audit_stamped": true
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
