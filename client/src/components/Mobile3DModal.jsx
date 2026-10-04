import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Zap,
  Activity,
  Terminal,
  Minimize2,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export const Mobile3DModal = ({
  isOpen,
  onClose,
  initialStage = 1
}) => {
  const navigate = useNavigate();
  const { quickLogin } = useAuth();
  const [activeStage, setActiveStage] = useState(initialStage || 1); // 1 = Ingress, 2 = Core Router, 3 = Silos, 4 = Golden Record
  const [activeViewTab, setActiveViewTab] = useState('pipeline'); // 'pipeline' | 'payloads' | 'sandbox'
  const [isAutoStreaming, setIsAutoStreaming] = useState(true);
  const [tilt, setTilt] = useState({ x: 14, y: -12 });
  const [injectedCount, setInjectedCount] = useState(542);
  const [lastPacket, setLastPacket] = useState({
    id: 'PKT-9482',
    citizen: 'Rahul Sharma (CIT-10001)',
    flow: 'Jan-Aadhaar SSO -> SetuLink Middleware -> Parallel Silos',
    timestamp: 'Just now',
    score: 0.984
  });

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto stream cycle
  useEffect(() => {
    let timer;
    if (isOpen && isAutoStreaming) {
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
  }, [isOpen, isAutoStreaming]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleInjectPacket = () => {
    setInjectedCount((c) => c + 1);
    setActiveStage(1);
    setLastPacket({
      id: `PKT-${Math.floor(1000 + Math.random() * 9000)}`,
      citizen: 'Rahul Sharma (CIT-10001)',
      flow: 'Ingress Auth -> Levenshtein Match -> Multi-Silo Fanout',
      timestamp: new Date().toLocaleTimeString(),
      score: +(0.95 + Math.random() * 0.04).toFixed(3)
    });
  };

  const handleBypassLaunch = (role) => {
    quickLogin(role);
    onClose();
    if (role === 'citizen') navigate('/citizen');
    else if (role === 'clerk' || role === 'officer') navigate('/staff/queue');
    else if (role === 'admin') navigate('/admin');
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-950/98 backdrop-blur-2xl flex flex-col w-screen h-screen overflow-hidden text-slate-100 select-none animate-in fade-in duration-200">
      
      {/* Tricolor National Accent Header Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-500 shrink-0" />

      {/* Main Fullscreen Navigation Bar */}
      <div className="px-3 sm:px-6 py-3 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-gov-600 text-white shadow-lg shadow-gov-500/30 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-black tracking-tight text-white truncate">
                SetuLink 3D Pipeline
              </span>
              <span className="hidden xs:inline-flex text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                Fullscreen Interactive
              </span>
              <span className="hidden md:inline-flex text-[9px] font-mono text-gov-300 bg-gov-950/80 px-2 py-0.5 rounded border border-gov-800">
                14ms Median Latency
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate hidden sm:block">
              Zero-Copy Federation • Jan-Aadhaar SSO • 3 Siloed Protocols Harmonized
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleInjectPacket}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] sm:text-xs shadow-md transition active:scale-95"
            title="Inject simulated citizen packet"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span className="hidden xs:inline">Inject Packet</span>
            <span className="xs:hidden">Inject</span>
          </button>

          <button
            onClick={() => setIsAutoStreaming(!isAutoStreaming)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border transition ${
              isAutoStreaming
                ? 'bg-gov-600/30 border-gov-500/50 text-gov-200'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {isAutoStreaming ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Auto Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-gov-400" />
                <span className="hidden sm:inline">Resume</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 text-xs font-bold transition shadow-sm ml-1"
            title="Exit Fullscreen Mode (or press ESC)"
          >
            <Minimize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Fullscreen</span>
            <span className="sm:hidden">Close</span>
          </button>
        </div>
      </div>

      {/* Sub-header: Stage Navigator Pills */}
      <div className="px-3 sm:px-6 py-2.5 bg-slate-950/90 border-b border-slate-800/80 shrink-0 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          <button
            onClick={() => setActiveStage(1)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStage === 1
                ? 'bg-gov-600 text-white shadow-lg shadow-gov-600/40 ring-2 ring-gov-400'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-md bg-black/30 flex items-center justify-center text-[10px]">1</span>
            <span>Citizen Ingress</span>
          </button>

          <span className="text-slate-600 font-mono text-xs">&rarr;</span>

          <button
            onClick={() => setActiveStage(2)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStage === 2
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-md bg-black/30 flex items-center justify-center text-[10px]">2</span>
            <span>SetuLink Core</span>
          </button>

          <span className="text-slate-600 font-mono text-xs">&rarr;</span>

          <button
            onClick={() => setActiveStage(3)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStage === 3
                ? 'bg-amber-600 text-slate-950 shadow-lg shadow-amber-600/40 ring-2 ring-amber-400'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-md bg-black/30 flex items-center justify-center text-[10px]">3</span>
            <span>Parallel Silos</span>
          </button>

          <span className="text-slate-600 font-mono text-xs">&rarr;</span>

          <button
            onClick={() => setActiveStage(4)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStage === 4
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-md bg-black/30 flex items-center justify-center text-[10px]">4</span>
            <span>Golden Record</span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveViewTab('pipeline')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
              activeViewTab === 'pipeline' ? 'bg-gov-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Pipeline
          </button>
          <button
            onClick={() => setActiveViewTab('payloads')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              activeViewTab === 'payloads' ? 'bg-gov-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3 text-sky-400" />
            <span>Payloads</span>
          </button>
          <button
            onClick={() => setActiveViewTab('sandbox')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 ${
              activeViewTab === 'sandbox' ? 'bg-gov-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Personas</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area (Scrollable with overscroll-contain) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 overscroll-contain relative">
        {/* Cyber grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gov-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-6">

          {/* VIEW TAB 1: 3D PIPELINE CANVAS */}
          {activeViewTab === 'pipeline' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Active Packet Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-slate-300">
                    Flat Multi-Silo Synchronizer Architecture (Zero Perspective Distortion)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">
                    Packet: <strong className="text-gov-300 font-bold">{lastPacket.id}</strong>
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <Activity className="w-3.5 h-3.5" /> Deterministic Link
                  </span>
                </div>
              </div>

              {/* Flat Canvas Container */}
              <div className="py-2 sm:py-4">
                <div className="relative">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                    
                    {/* STAGE 1: Citizen Ingress (3 Cols) */}
                    <div
                      onClick={() => setActiveStage(1)}
                      className={`lg:col-span-3 p-5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-xl relative ${
                        activeStage === 1
                          ? 'bg-gov-950/95 border-gov-400 ring-2 ring-gov-500/50'
                          : 'bg-slate-900/90 border-slate-800 opacity-90 hover:opacity-100'
                      }`}
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

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 text-gov-400 font-mono">
                          <Lock className="w-3 h-3" /> Zero Leakage
                        </span>
                        <span className="text-slate-500 font-mono">Req: #8841</span>
                      </div>
                    </div>

                    {/* PIPELINE CONDUIT 1 (1 Col) */}
                    <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center relative">
                      <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-gov-500 to-indigo-500 flow-line" />
                      </div>
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
                      <span className="text-[9px] font-mono text-gov-400 mt-1">mTLS Pipe</span>
                    </div>

                    {/* STAGE 2: SetuLink Core Middleware Processor (4 Cols) */}
                    <div
                      onClick={() => setActiveStage(2)}
                      className={`lg:col-span-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer shadow-2xl relative ${
                        activeStage === 2
                          ? 'bg-gradient-to-b from-gov-900/90 via-slate-900 to-indigo-950/90 border-indigo-400 ring-4 ring-indigo-500/40'
                          : 'bg-slate-900/90 border-slate-700 opacity-90 hover:opacity-100'
                      }`}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-500 text-white font-mono text-[10px] font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>CORE MIDDLEWARE ENGINE</span>
                      </div>

                      <div className="relative w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-2xl border border-indigo-500/40 animate-radar" />
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-gov-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-gov-500/50">
                          <Cpu className="w-6 h-6" />
                        </div>
                      </div>

                      <h4 className="font-black text-base text-white text-center">SetuLink Router Core</h4>
                      <p className="text-xs text-gov-200 text-center mt-0.5">Deterministic Resolution Engine</p>

                      <div className="mt-4 space-y-1.5 text-xs font-mono">
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Normalizer:</span>
                          <span className="text-sky-300 font-bold text-[11px]">Canonical Schema</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Matching Rule:</span>
                          <span className="text-emerald-400 font-bold text-[11px]">Levenshtein &ge; 0.90</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Hallucination:</span>
                          <span className="text-emerald-400 font-bold text-[11px]">0% Math Rules</span>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-indigo-300">
                        <span>Latency: 14.2ms</span>
                        <span>Throughput: 1,840 tx/s</span>
                      </div>
                    </div>

                    {/* PIPELINE CONDUIT 2 (1 Col) */}
                    <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center relative">
                      <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-amber-500 flow-line" />
                      </div>
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

                    {/* STAGE 3: Siloed Department Stack (3 Cols) */}
                    <div
                      onClick={() => setActiveStage(3)}
                      className={`lg:col-span-3 p-5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-xl relative space-y-2 ${
                        activeStage === 3
                          ? 'bg-slate-900 border-amber-400 ring-4 ring-amber-500/40'
                          : 'bg-slate-900/90 border-slate-800 opacity-90 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="font-extrabold text-sm text-white">Siloed Stack</span>
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono text-[9px] font-bold">
                          STAGE 3: PARALLEL
                        </span>
                      </div>

                      {/* Health JSON */}
                      <div className="p-2 rounded-xl bg-slate-950 border border-sky-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileJson className="w-4 h-4 text-sky-400" />
                          <span className="text-xs font-semibold text-slate-200">Health Silo</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono">
                          JSON REST
                        </span>
                      </div>

                      {/* Transport XML */}
                      <div className="p-2 rounded-xl bg-slate-950 border border-amber-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-semibold text-slate-200">Transport Silo</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                          XML SOAP
                        </span>
                      </div>

                      {/* Municipal CSV */}
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
                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <div
                      onClick={() => setActiveStage(4)}
                      className={`p-4 rounded-2xl border transition-all duration-500 cursor-pointer ${
                        activeStage === 4
                          ? 'bg-gradient-to-r from-gov-950/90 via-emerald-950/80 to-gov-950/90 border-emerald-400 ring-4 ring-emerald-500/40 shadow-xl'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            activeStage === 4 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                              <span>Stage 4: Unified Golden Record Delivered to Citizen</span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                                14.2ms LATENCY
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Disparate schemas unified deterministically; tamper-proof event sealed in immutable audit log.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                          <span className="text-slate-400">Match: <strong className="text-emerald-400">{lastPacket.score}</strong></span>
                          <span className="text-slate-400">Packets: <strong className="text-gov-300">{injectedCount.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* VIEW TAB 2: LIVE PAYLOAD INSPECTOR */}
          {activeViewTab === 'payloads' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-400" />
                    <span>Live Heterogeneous Protocol Inspection</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Observe how disparate formats are converted into a Common Canonical Schema in real-time.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Zero Data Corruption
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                {/* Health Silo */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-sky-900/60 shadow-lg">
                  <div className="flex items-center justify-between text-sky-400 font-bold mb-2 pb-1.5 border-b border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <FileJson className="w-4 h-4" /> Health Silo
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300">REST JSON</span>
                  </div>
                  <pre className="text-slate-300 overflow-x-auto text-[10px] leading-relaxed p-2 rounded-xl bg-slate-950 border border-slate-850">
{`{
  "abha_id": "91-4402-9901",
  "patient_name": "Rahul Sharma",
  "dob": "1990-05-15",
  "blood_group": "B+",
  "active_prescriptions": 2,
  "last_visit": "2026-08-12"
}`}
                  </pre>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Protocol: HTTP/2</span>
                    <span className="text-sky-300">Latency: 9.4ms</span>
                  </div>
                </div>

                {/* Transport Silo */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-900/60 shadow-lg">
                  <div className="flex items-center justify-between text-amber-400 font-bold mb-2 pb-1.5 border-b border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <FileCode className="w-4 h-4" /> Transport Silo
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">SOAP XML</span>
                  </div>
                  <pre className="text-slate-300 overflow-x-auto text-[10px] leading-relaxed p-2 rounded-xl bg-slate-950 border border-slate-850">
{`<vahan_response>
  <dl_number>DL-042011009</dl_number>
  <holder>Rahul Sharma</holder>
  <vehicle_reg>DL01AB1234</vehicle_reg>
  <puc_expiry>2027-01-10</puc_expiry>
  <challan_status>CLEAR</challan_status>
</vahan_response>`}
                  </pre>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Protocol: XML-RPC</span>
                    <span className="text-amber-300">Latency: 12.1ms</span>
                  </div>
                </div>

                {/* Unified Record */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-900/60 shadow-lg">
                  <div className="flex items-center justify-between text-emerald-400 font-bold mb-2 pb-1.5 border-b border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Golden Record
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">CANONICAL</span>
                  </div>
                  <pre className="text-slate-300 overflow-x-auto text-[10px] leading-relaxed p-2 rounded-xl bg-slate-950 border border-slate-850">
{`{
  "citizen_id": "CIT-10001",
  "name": "Rahul Sharma",
  "match_confidence": 0.984,
  "sources_federated": 3,
  "records_harmonized": true,
  "audit_hash": "0x7f8a9e14bc21",
  "resolution_latency": "14.2ms"
}`}
                  </pre>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Deterministic</span>
                    <span className="text-emerald-300">SHA-256 Stamped</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW TAB 3: EVALUATOR PERSONA SANDBOX */}
          {activeViewTab === 'sandbox' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Instant Evaluator Persona Bypass</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Jump directly into any system persona without OTP delays for deterministic testing.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                  Prototype Sandbox Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Citizen */}
                <button
                  onClick={() => handleBypassLaunch('citizen')}
                  className="p-4 rounded-2xl border border-gov-500/40 bg-gov-950/40 hover:bg-gov-900/60 hover:border-gov-400 text-left transition group shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-gov-300 font-bold text-sm">
                      <span>Citizen Portal</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="text-xs text-slate-200 mt-1 font-semibold">Rahul Sharma</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Consent directives, multi-department records, address update requests.
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-gov-400">
                    Role: CITIZEN
                  </div>
                </button>

                {/* Clerk */}
                <button
                  onClick={() => handleBypassLaunch('clerk')}
                  className="p-4 rounded-2xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/50 hover:border-amber-400 text-left transition group shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-amber-300 font-bold text-sm">
                      <span>Verification Clerk</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="text-xs text-slate-200 mt-1 font-semibold">Sunita Rao</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Stage 2 document verification queue, physical address proof inspection.
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-amber-400">
                    Role: CLERK
                  </div>
                </button>

                {/* Officer */}
                <button
                  onClick={() => handleBypassLaunch('officer')}
                  className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/50 hover:border-emerald-400 text-left transition group shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-emerald-300 font-bold text-sm">
                      <span>Approving Officer</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="text-xs text-slate-200 mt-1 font-semibold">Rajesh K. Varma</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Stage 3 administrative authorization and cross-departmental record synchronization.
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-400">
                    Role: OFFICER
                  </div>
                </button>

                {/* Admin */}
                <button
                  onClick={() => handleBypassLaunch('admin')}
                  className="p-4 rounded-2xl border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/50 hover:border-purple-400 text-left transition group shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-purple-300 font-bold text-sm">
                      <span>System Administrator</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                    <div className="text-xs text-slate-200 mt-1 font-semibold">NIC Controller</div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Platform telemetry, connector manager, DAG conflict resolution & audit logs.
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-purple-400">
                    Role: ADMIN
                  </div>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Fullscreen Footer Status Bar */}
      <div className="px-3 sm:px-6 py-2.5 bg-slate-900/95 border-t border-slate-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px] text-slate-300">
            SetuLink Deterministic Middleware • Zero Database Migration Required
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStage((prev) => (prev > 1 ? prev - 1 : 4))}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev Stage</span>
          </button>
          <button
            onClick={() => setActiveStage((prev) => (prev < 4 ? prev + 1 : 1))}
            className="px-3 py-1 rounded-lg bg-gov-600 hover:bg-gov-500 text-white text-xs font-bold transition flex items-center gap-1 shadow"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>,
    document.body
  );
};
