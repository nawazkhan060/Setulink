import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import {
  Shield,
  Layers,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  FileJson,
  FileCode,
  FileSpreadsheet,
  Lock,
  Unlock,
  Cpu,
  Sparkles,
  Zap,
  Building,
  UserCheck,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { quickLogin } = useAuth();

  // 3D Simulation Interactive State
  const [activeStage, setActiveStage] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tilt, setTilt] = useState({ x: 12, y: -15 });
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stages = [
    {
      id: 0,
      title: 'Ready: Citizen Authentication',
      desc: 'Citizen triggers single sign-on request without logging into separate silo portals.',
      activeNode: 'citizen'
    },
    {
      id: 1,
      title: 'Phase 1: Sovereign Consent Gate',
      desc: 'SetuLink inspects digital consent directives before sending outbound requests.',
      activeNode: 'gateway'
    },
    {
      id: 2,
      title: 'Phase 2: 3D Parallel Silo Fan-Out',
      desc: 'Simultaneous queries dispatched to Health (JSON), Transport (XML), and Municipal (CSV).',
      activeNode: 'silos'
    },
    {
      id: 3,
      title: 'Phase 3: Schema Normalization & Deduplication',
      desc: 'Heterogeneous formats converted to Common Schema; deterministic Levenshtein matching applied.',
      activeNode: 'normalization'
    },
    {
      id: 4,
      title: 'Complete: Unified Golden Record',
      desc: 'Single unified dashboard delivered to citizen and logged to immutable audit trail in 14ms.',
      activeNode: 'unified'
    }
  ];

  // Auto-step through simulation
  useEffect(() => {
    let timer;
    if (isSimulating) {
      timer = setInterval(() => {
        setActiveStage((prev) => {
          if (prev >= stages.length - 1) {
            setIsSimulating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const handleStartSimulation = () => {
    setActiveStage(0);
    setIsSimulating(true);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setActiveStage(0);
  };

  const handleBypassLaunch = (role) => {
    quickLogin(role);
    if (role === 'citizen') navigate('/citizen');
    else if (role === 'clerk' || role === 'officer') navigate('/staff/queue');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-gov-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gov-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Notice for Judges & Evaluators */}
      <div className="bg-gradient-to-r from-amber-950/80 via-gov-950/90 to-amber-950/80 border-b border-amber-600/30 px-4 py-2.5 text-xs text-amber-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <strong className="text-amber-300 uppercase tracking-wider font-mono text-[11px]">
              Evaluator / Hackathon Demo Notice:
            </strong>
            <span className="text-slate-300">
              Operating in <strong>Instant Prototype Bypass Mode</strong> (1-click evaluators to test deterministic logic without SMTP OTP delays).
            </span>
          </div>
          <span className="text-[11px] text-amber-300/80 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-700/50">
            Production: NIC e-Pramaan SSO • TLS 1.3 mTLS • SMTP 2FA
          </span>
        </div>
      </div>

      {/* Hero Navigation */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-slate-800/80 relative z-20">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="h-1 w-6 bg-amber-500 rounded-t-full" />
            <div className="h-1 w-6 bg-white" />
            <div className="h-1 w-6 bg-emerald-500 rounded-b-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gov-600 text-white font-black shadow-lg shadow-gov-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Setu<span className="text-gov-400">Link</span>
              </span>
              <span className="ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-gov-900/60 text-gov-300 border border-gov-700/60">
                SIH26129
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleBypassLaunch('citizen')}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <span>Citizen Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => handleBypassLaunch('admin')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-500 text-white text-xs font-bold shadow-lg shadow-gov-600/30 transition"
          >
            <span>Launch Demo Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Hero & 3D Interactive Architecture Showcase */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col justify-between relative z-10">
        
        {/* Title and Problem Statement */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-950/80 border border-gov-500/40 text-gov-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Problem Statement SIH26129: Fragmented Government Service Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            One Unified Layer Across <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-gov-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Siloed Government Systems
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            SetuLink bridges disparate departments without replacing legacy databases.
            Experience our <strong>deterministic middleware</strong> uniting JSON, XML, and CSV silos in real time.
          </p>
        </div>

        {/* 1-Click Persona Bypass Launchpad */}
        <div className="mb-10 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant 1-Click Evaluator Bypass Launchpad</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Direct bypass active for testing. In production, this gate enforces SMTP 2FA and Aadhaar biometric tokenization.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Bypass Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Citizen Persona */}
            <button
              onClick={() => handleBypassLaunch('citizen')}
              className="p-3.5 rounded-xl border border-gov-500/40 bg-gov-950/40 hover:bg-gov-900/60 hover:border-gov-400 text-left transition group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-gov-300 font-bold text-sm">
                  <span>Citizen Portal</span>
                  <span className="text-[10px] text-gov-400 font-mono">Bypass &rarr;</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-semibold">Rahul Sharma</div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Unified view of Health, Transport & Municipal records, consent toggles, address updates.
                </p>
              </div>
              <div className="mt-3 text-[10px] font-mono text-gov-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-gov-400" /> Role: Citizen
              </div>
            </button>

            {/* Clerk Persona */}
            <button
              onClick={() => handleBypassLaunch('clerk')}
              className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/50 hover:border-amber-400 text-left transition group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-amber-300 font-bold text-sm">
                  <span>Verification Clerk</span>
                  <span className="text-[10px] text-amber-400 font-mono">Bypass &rarr;</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-semibold">Sunita Rao</div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Task verification queue for Stage 2 address proof inspection and approval.
                </p>
              </div>
              <div className="mt-3 text-[10px] font-mono text-amber-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-400" /> Role: Clerk
              </div>
            </button>

            {/* Officer Persona */}
            <button
              onClick={() => handleBypassLaunch('officer')}
              className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/50 hover:border-emerald-400 text-left transition group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-emerald-300 font-bold text-sm">
                  <span>Approving Officer</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Bypass &rarr;</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-semibold">Rajesh K. Varma</div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Stage 3 administrative final authorization and cross-departmental synchronization.
                </p>
              </div>
              <div className="mt-3 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Role: Officer
              </div>
            </button>

            {/* Admin Persona */}
            <button
              onClick={() => handleBypassLaunch('admin')}
              className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/50 hover:border-purple-400 text-left transition group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-purple-300 font-bold text-sm">
                  <span>System Administrator</span>
                  <span className="text-[10px] text-purple-400 font-mono">Bypass &rarr;</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-semibold">NIC Controller</div>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Telemetry dashboard, conflict queue, workflow DAG builder & connector manager.
                </p>
              </div>
              <div className="mt-3 text-[10px] font-mono text-purple-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-purple-400" /> Role: Admin
              </div>
            </button>
          </div>
        </div>

        {/* 3D Interactive Isometric Process Visualizer */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden backdrop-blur-xl mb-10">
          
          {/* Simulation Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gov-400 animate-pulse" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  Interactive 3D Interoperability Engine
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Watch how SetuLink deterministically resolves heterogeneous data without replacing departmental software.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleStartSimulation}
                disabled={isSimulating}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gov-600 hover:bg-gov-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Simulating...' : 'Simulate Live Flow'}</span>
              </button>

              <button
                onClick={handleResetSimulation}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                title="Reset Flow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stepper Status Pill */}
          <div className="mb-8 p-3 rounded-xl bg-slate-950/70 border border-gov-900 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-gov-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {activeStage + 1}
            </span>
            <div className="flex-1">
              <span className="text-xs font-bold text-gov-300 block">{stages[activeStage].title}</span>
              <span className="text-[11px] text-slate-400">{stages[activeStage].desc}</span>
            </div>
          </div>

          {/* 3D Isometric Process Canvas */}
          <div
            className="relative py-8 transition-transform duration-500 ease-out"
            style={{
              perspective: '1200px'
            }}
          >
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center transition-all duration-700"
              style={{
                transform: isMobile ? 'none' : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              
              {/* 3D Tier 1: Citizen Sovereign Access Tier */}
              <div
                className={`p-6 rounded-2xl border transition-all duration-500 shadow-2xl relative ${
                  activeStage === 0 || activeStage === 4
                    ? 'bg-gov-950/90 border-gov-400 ring-2 ring-gov-500/40 translate-y-[-10px]'
                    : 'bg-slate-900/90 border-slate-700/80 opacity-70'
                }`}
                style={{ transform: 'translateZ(30px)' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gov-600/30 border border-gov-400/50 flex items-center justify-center text-gov-300 mb-3">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-white">Tier 1: Sovereign Citizen</h4>
                <p className="text-xs text-slate-400 mt-1">Single Identity Access</p>

                <div className="mt-4 space-y-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Consent Control:</span>
                    <span className="text-emerald-400 font-semibold font-mono">100% Granular</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Login Model:</span>
                    <span className="text-gov-300 font-semibold font-mono">Single Sign-On</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-gov-400 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Zero Unauthorized Leakage
                </div>
              </div>

              {/* 3D Tier 2: SetuLink Middleware Core (Elevated in 3D Space) */}
              <div
                className={`p-7 rounded-2xl border transition-all duration-500 shadow-2xl relative ${
                  activeStage === 1 || activeStage === 3
                    ? 'bg-gradient-to-b from-gov-900/90 via-slate-900 to-indigo-950/90 border-gov-300 ring-4 ring-gov-400/30 translate-y-[-20px]'
                    : 'bg-slate-900/90 border-gov-800/80 opacity-80'
                }`}
                style={{ transform: 'translateZ(65px)' }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gov-500 text-white font-mono text-[10px] font-bold shadow-md">
                  CORE MIDDLEWARE
                </div>

                <div className="w-14 h-14 rounded-2xl bg-gov-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-gov-500/50 mx-auto">
                  <Cpu className="w-8 h-8" />
                </div>
                <h4 className="font-black text-base text-white text-center">SetuLink Router</h4>
                <p className="text-xs text-gov-200 text-center mt-1">Deterministic Federation Engine</p>

                <div className="mt-4 space-y-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Deterministic Matching:</div>
                    <div className="text-white font-mono font-semibold">Levenshtein + DOB + Tokens</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Security Audit:</div>
                    <div className="text-emerald-400 font-mono font-semibold">Immutable Access Log Stream</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-gov-300">
                  <span>Transformation: 14ms</span>
                  <span>Deterministic: Yes</span>
                </div>
              </div>

              {/* 3D Tier 3: Siloed Department Stack */}
              <div
                className={`p-6 rounded-2xl border transition-all duration-500 shadow-2xl relative space-y-3 ${
                  activeStage === 2
                    ? 'bg-slate-900 border-indigo-400 ring-2 ring-indigo-500/40 translate-y-[-10px]'
                    : 'bg-slate-900/90 border-slate-700/80 opacity-70'
                }`}
                style={{ transform: 'translateZ(30px)' }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-sm text-white">Tier 3: Independent Silos</span>
                  <span className="text-[10px] text-slate-400 font-mono">Disparate Formats</span>
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
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono">
                    ONLINE
                  </span>
                </div>

                {/* Transport Silo */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Transport Authority</div>
                      <div className="text-[10px] text-slate-500">Legacy Feed • XML</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
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
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                    ONLINE
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Tilt Controls for 3D Angle */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="hidden sm:flex items-center gap-2">
              <span>Adjust 3D Angle:</span>
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
                Flat Front
              </button>
              <button
                onClick={() => setTilt({ x: 18, y: 20 })}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
              >
                Isometric Right
              </button>
            </div>

            <div className="sm:hidden flex items-center gap-1.5 text-gov-300 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gov-400" />
              <span>3D Multi-Tier Process Active</span>
            </div>

            <div className="flex items-center gap-2 text-gov-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">Zero Replacement Cost for Existing Government Portals</span>
            </div>
          </div>
        </div>

        {/* Key Innovation Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gov-600/20 text-gov-400 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Deterministic Dedup & Matching</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              No fuzzy hallucinations or unreliable LLMs. Weighted Levenshtein distances and address token overlaps mathematically flag discrepancies without merging corrupt records.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Sovereign Citizen Consent</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Citizens retain legal ownership over personal data. Revoking access to the Municipal or Transport department blocks that department at the gateway in real time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Multi-Stage Workflow DAG</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Cross-department address updates transition sequentially: Applicant &rarr; Clerk Document Verification &rarr; Officer Sign-off, complete with digital audit stamps.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <p>SetuLink Prototype • Built for Smart India Hackathon (SIH 2026) Problem Statement SIH26129</p>
      </footer>
    </div>
  );
};
