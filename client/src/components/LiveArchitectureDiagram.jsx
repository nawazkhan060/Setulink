import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Shield,
  Cpu,
  FileJson,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Play,
  Pause,
  Zap,
  Activity,
  ArrowRight,
  Sparkles,
  RefreshCw,
  RotateCcw
} from 'lucide-react';

export const LiveArchitectureDiagram = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1); // 1x or 2x
  const [packetCount, setPacketCount] = useState(1482);
  const [activeStage, setActiveStage] = useState(0); // 0: Citizen, 1: Consent, 2: Middleware, 3: Silos, 4: Golden Record
  const [recentPacket, setRecentPacket] = useState('PKT-9421 (Jan-Aadhaar SSO)');

  // Dynamic continuous stage progression for active glowing nodes
  useEffect(() => {
    let timer;
    if (isPlaying) {
      const interval = Math.floor(1600 / speed);
      timer = setInterval(() => {
        setActiveStage((prev) => {
          const next = (prev + 1) % 5;
          if (next === 0) {
            setPacketCount((c) => c + 1);
          }
          return next;
        });
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const handleInject = () => {
    setPacketCount((c) => c + 1);
    setActiveStage(0);
    setRecentPacket(`PKT-${Math.floor(1000 + Math.random() * 9000)} (Live Sync)`);
  };

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl overflow-hidden mb-12">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gov-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header & Live Stream Status Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE DATA STREAM</span>
          </div>
          <span className="text-xs font-bold text-white font-sans">
            Flat Architecture Flow Diagram
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
            • Autonomous Zero-Copy Data Movement
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleInject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Inject Packet</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-gov-400" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold hover:text-white transition"
            title="Toggle Stream Speed"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLAT ARCHITECTURE SCHEMATIC CANVAS WITH LIVE FLOWING PACKETS               */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full overflow-x-auto pb-4">
        <div className="min-w-[780px] lg:min-w-full relative py-6 px-2 select-none">
          
          {/* SVG Animated Connection Conduits */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 900 320"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="gradIngress" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>

              <linearGradient id="gradHealth" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              <linearGradient id="gradTransport" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              <linearGradient id="gradMunicipal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <linearGradient id="gradReturn" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              {/* Glowing filter for packets */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Path 1: Citizen (x:80, y:120) -> Consent (x:230, y:120) */}
            <path
              id="path-citizen-consent"
              d="M 120 120 L 195 120"
              stroke="#1e293b"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 120 120 L 195 120"
              stroke="url(#gradIngress)"
              strokeWidth="3"
              strokeDasharray="6 6"
              className={isPlaying ? "flow-line" : ""}
              fill="none"
            />

            {/* Path 2: Consent (x:230, y:120) -> Core Middleware (x:430, y:120) */}
            <path
              id="path-consent-core"
              d="M 275 120 L 375 120"
              stroke="#1e293b"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 275 120 L 375 120"
              stroke="url(#gradIngress)"
              strokeWidth="3"
              strokeDasharray="6 6"
              className={isPlaying ? "flow-line" : ""}
              fill="none"
            />

            {/* Path 3: Core (x:490, y:120) -> Health Silo (x:720, y:50) */}
            <path
              id="path-core-health"
              d="M 495 120 C 580 120, 630 50, 715 50"
              stroke="#1e293b"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 495 120 C 580 120, 630 50, 715 50"
              stroke="url(#gradHealth)"
              strokeWidth="3"
              strokeDasharray="6 6"
              className={isPlaying ? "flow-line" : ""}
              fill="none"
            />

            {/* Path 4: Core (x:490, y:120) -> Transport Silo (x:720, y:120) */}
            <path
              id="path-core-transport"
              d="M 495 120 L 715 120"
              stroke="#1e293b"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 495 120 L 715 120"
              stroke="url(#gradTransport)"
              strokeWidth="3"
              strokeDasharray="6 6"
              className={isPlaying ? "flow-line" : ""}
              fill="none"
            />

            {/* Path 5: Core (x:490, y:120) -> Municipal Silo (x:720, y:190) */}
            <path
              id="path-core-municipal"
              d="M 495 120 C 580 120, 630 190, 715 190"
              stroke="#1e293b"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 495 120 C 580 120, 630 190, 715 190"
              stroke="url(#gradMunicipal)"
              strokeWidth="3"
              strokeDasharray="6 6"
              className={isPlaying ? "flow-line" : ""}
              fill="none"
            />

            {/* Path 6: Return Golden Record Conduit (Silos -> Golden Record -> Citizen) */}
            <path
              id="path-golden-return"
              d="M 760 215 C 760 280, 200 280, 80 160"
              stroke="#1e293b"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M 760 215 C 760 280, 200 280, 80 160"
              stroke="url(#gradReturn)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className={isPlaying ? "flow-line-reverse" : ""}
              fill="none"
            />

            {/* Continuous Animated Glowing Packet Circles */}
            {isPlaying && (
              <>
                {/* Packet 1: Moving Citizen -> Consent */}
                <circle r="5" fill="#38bdf8" filter="url(#glow)">
                  <animateMotion
                    path="M 120 120 L 195 120"
                    dur={`${1.4 / speed}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Packet 2: Moving Consent -> Core */}
                <circle r="6" fill="#818cf8" filter="url(#glow)">
                  <animateMotion
                    path="M 275 120 L 375 120"
                    dur={`${1.4 / speed}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Packet 3: Moving Core -> Health (JSON) */}
                <circle r="5" fill="#38bdf8" filter="url(#glow)">
                  <animateMotion
                    path="M 495 120 C 580 120, 630 50, 715 50"
                    dur={`${1.6 / speed}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Packet 4: Moving Core -> Transport (XML) */}
                <circle r="5" fill="#f59e0b" filter="url(#glow)">
                  <animateMotion
                    path="M 495 120 L 715 120"
                    dur={`${1.6 / speed}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Packet 5: Moving Core -> Municipal (CSV) */}
                <circle r="5" fill="#10b981" filter="url(#glow)">
                  <animateMotion
                    path="M 495 120 C 580 120, 630 190, 715 190"
                    dur={`${1.6 / speed}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Packet 6: Return Flow (Golden Record to Citizen) */}
                <circle r="6" fill="#10b981" filter="url(#glow)">
                  <animateMotion
                    path="M 760 215 C 760 280, 200 280, 80 160"
                    dur={`${2.6 / speed}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}
          </svg>

          {/* ===================================================================== */}
          {/* THE FLAT LABELED NODES (NO PARAGRAPHS - ONLY LABELS & CHIPS)           */}
          {/* ===================================================================== */}
          <div className="relative z-10 grid grid-cols-12 gap-3 items-center min-h-[220px]">
            
            {/* NODE 1: CITIZEN (Left) */}
            <div className="col-span-2 flex flex-col items-center text-center">
              <div
                className={`p-3.5 rounded-2xl border-2 transition-all duration-300 shadow-xl bg-slate-900 ${
                  activeStage === 0
                    ? 'border-sky-400 ring-4 ring-sky-500/30 scale-105 shadow-sky-500/20'
                    : 'border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-2">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-white whitespace-nowrap">Citizen Portal</div>
                <div className="text-[10px] font-mono text-sky-300 font-semibold mt-0.5">Jan-Aadhaar SSO</div>
                <div className="mt-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                  TLS 1.3 Ingress
                </div>
              </div>
            </div>

            {/* NODE 2: CONSENT GATE (Left-Center) */}
            <div className="col-span-2 flex flex-col items-center text-center">
              <div
                className={`p-3.5 rounded-2xl border-2 transition-all duration-300 shadow-xl bg-slate-900 ${
                  activeStage === 1
                    ? 'border-indigo-400 ring-4 ring-indigo-500/30 scale-105 shadow-indigo-500/20'
                    : 'border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-white whitespace-nowrap">Consent Guard</div>
                <div className="text-[10px] font-mono text-indigo-300 font-semibold mt-0.5">DPDP Act Directives</div>
                <div className="mt-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-emerald-400 border border-slate-800 font-bold">
                  Zero Leakage
                </div>
              </div>
            </div>

            {/* NODE 3: SETULINK CORE MIDDLEWARE (Center Hub - Prominent) */}
            <div className="col-span-4 flex flex-col items-center text-center">
              <div
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all duration-300 shadow-2xl bg-gradient-to-b from-gov-900/90 via-slate-900 to-indigo-950/90 w-full max-w-[260px] ${
                  activeStage === 2
                    ? 'border-indigo-400 ring-4 ring-indigo-500/40 scale-105 shadow-indigo-500/40'
                    : 'border-gov-500/60'
                }`}
              >
                <div className="relative w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl border border-indigo-400/50 animate-radar" />
                  <div className="w-10 h-10 rounded-xl bg-gov-500 text-white flex items-center justify-center shadow-lg shadow-gov-500/50">
                    <Cpu className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  MIDDLEWARE CORE
                </div>
                <div className="text-sm font-black text-white tracking-tight mt-0.5">
                  SetuLink Router
                </div>
                <div className="text-[10px] font-mono text-gov-300 font-bold mt-0.5">
                  Deterministic Engine
                </div>

                {/* Flat quick badges */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-around text-[9px] font-mono">
                  <span className="text-sky-300 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800 font-bold">14ms Latency</span>
                  <span className="text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 font-bold">No AI Hallucination</span>
                </div>
              </div>
            </div>

            {/* NODE 4: 3x SILOES (Right Stack) */}
            <div className="col-span-4 flex flex-col gap-2.5">
              
              {/* Silo 1: Health (JSON) */}
              <div
                className={`p-2.5 rounded-xl border-2 transition-all duration-300 bg-slate-900 flex items-center justify-between shadow-lg ${
                  activeStage === 3
                    ? 'border-sky-400 ring-2 ring-sky-500/40 scale-102'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                    <FileJson className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white leading-tight">Health Silo</div>
                    <div className="text-[9px] font-mono text-slate-400">Hospital Registry</div>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono font-bold border border-sky-800">
                  REST • JSON
                </span>
              </div>

              {/* Silo 2: Transport (XML) */}
              <div
                className={`p-2.5 rounded-xl border-2 transition-all duration-300 bg-slate-900 flex items-center justify-between shadow-lg ${
                  activeStage === 3
                    ? 'border-amber-400 ring-2 ring-amber-500/40 scale-102'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white leading-tight">Transport Authority</div>
                    <div className="text-[9px] font-mono text-slate-400">Vehicle Registry</div>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-800">
                  SOAP • XML
                </span>
              </div>

              {/* Silo 3: Municipal (CSV) */}
              <div
                className={`p-2.5 rounded-xl border-2 transition-all duration-300 bg-slate-900 flex items-center justify-between shadow-lg ${
                  activeStage === 3
                    ? 'border-emerald-400 ring-2 ring-emerald-500/40 scale-102'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white leading-tight">Municipal Civic</div>
                    <div className="text-[9px] font-mono text-slate-400">Property Registry</div>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-800">
                  BULK • CSV
                </span>
              </div>

            </div>

          </div>

          {/* RETURN PATH BANNER (Stage 4 Golden Record) */}
          <div className="mt-8 pt-3 border-t border-slate-800/80">
            <div
              className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                activeStage === 4
                  ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${
                  activeStage === 4 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white">
                    Return Loop: Unified Golden Record Delivered to Citizen
                  </span>
                  <span className="ml-2 text-[10px] font-mono text-emerald-300 font-bold">
                    [Latency: 14ms • SHA-256 Audit Stamped]
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span>Recent Packet: <strong className="text-amber-300">{recentPacket}</strong></span>
                <span>Count: <strong className="text-gov-300">{packetCount.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Flat Legend & Status */}
      <div className="relative z-10 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span>Ingress Token Stream</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
            <span>Middleware Core Normalizer</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Parallel Silo Handshake</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>Golden Record Return</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <Activity className="w-3.5 h-3.5" />
          <span>Real-time Active Architecture</span>
        </div>
      </div>
    </div>
  );
};
