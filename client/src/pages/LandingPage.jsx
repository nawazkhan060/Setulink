import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import {
  Shield,
  Layers,
  ArrowRight,
  ArrowLeft,
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
  ChevronRight,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Maximize2,
  X
} from 'lucide-react';
import { JuryGuideModal } from '../components/JuryGuideModal';
import { Mobile3DModal } from '../components/Mobile3DModal';
import { LiveArchitectureDiagram } from '../components/LiveArchitectureDiagram';
import { DynamicWorkflowArchitecture } from '../components/DynamicWorkflowArchitecture';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { quickLogin } = useAuth();
  const [juryGuideOpen, setJuryGuideOpen] = useState(false);

  // 3D Simulation Interactive State
  const [activeStage, setActiveStage] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tilt, setTilt] = useState({ x: 12, y: -15 });
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  // Mobile Step-by-Step 3D Module States
  const [mobileModuleTab, setMobileModuleTab] = useState(1); // 1 = Citizen, 2 = SetuLink Core (Middle), 3 = Silos
  const [mobile3DModalOpen, setMobile3DModalOpen] = useState(false);

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
            setMobileModuleTab(1);
            return 0;
          }
          const next = prev + 1;
          // Synchronize mobile module (1 = Citizen, 2 = Core Middle, 3 = Silos)
          if (next === 0 || next === 4) setMobileModuleTab(1);
          else if (next === 1 || next === 3) setMobileModuleTab(2);
          else if (next === 2) setMobileModuleTab(3);
          return next;
        });
      }, 1900);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const handleStartSimulation = () => {
    setActiveStage(0);
    setMobileModuleTab(1);
    setIsSimulating(true);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setActiveStage(0);
    setMobileModuleTab(1);
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
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-b border-amber-600/40 px-3 sm:px-4 py-2 text-xs text-amber-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-amber-300 font-bold uppercase tracking-wider font-mono text-[10px] sm:text-[11px]">
              Evaluator Prototype Mode:
            </span>
            <span className="text-slate-300 text-[11px] sm:text-xs">
              Instant 1-Click bypass active for deterministic testing without OTP delays.
            </span>
          </div>
          <span className="text-[10px] text-amber-300/80 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-700/50 font-mono">
            Prod: NIC e-Pramaan SSO • mTLS 1.3 • SMTP 2FA
          </span>
        </div>
      </div>

      {/* Hero Navigation */}
      <header className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-slate-800/80 relative z-20">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex flex-col items-center">
            <div className="h-1 w-5 sm:w-6 bg-amber-500 rounded-t-full" />
            <div className="h-1 w-5 sm:w-6 bg-white" />
            <div className="h-1 w-5 sm:w-6 bg-emerald-500 rounded-b-full" />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-gov-600 text-white font-black shadow-lg shadow-gov-500/30">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-sans">
                Setu<span className="text-gov-400">Link</span>
              </span>
              <span className="ml-1.5 sm:ml-2 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 sm:px-2 py-0.5 rounded bg-gov-900/60 text-gov-300 border border-gov-700/60">
                SIH26129
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setJuryGuideOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Jury Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>

          <button
            onClick={() => handleBypassLaunch('citizen')}
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <span>Citizen Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => handleBypassLaunch('admin')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gov-600 hover:bg-gov-500 text-white text-xs font-bold shadow-lg shadow-gov-600/30 transition shrink-0"
          >
            <span className="hidden sm:inline">Launch Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setMobileModuleTab(1);
                setMobile3DModalOpen(true);
              }}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gov-600 via-indigo-600 to-gov-700 text-white font-bold text-xs shadow-lg shadow-gov-600/40 hover:opacity-95 transition"
            >
              <Maximize2 className="w-4 h-4 text-amber-300" />
              <span>Show 3D (Step-by-Step Pop-up)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setJuryGuideOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-semibold text-xs transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Jury & Evaluator Guide</span>
            </button>
          </div>
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

        {/* Flat Live Architecture Flow Diagram (Non-textual, animated live data movement) */}
        <LiveArchitectureDiagram />

        {/* Continuous Dynamic Architecture Workflow Engine */}
        <DynamicWorkflowArchitecture />

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

      {/* Jury & Evaluator Walkthrough Modal */}
      <JuryGuideModal
        isOpen={juryGuideOpen}
        onClose={() => setJuryGuideOpen(false)}
      />

      {/* Mobile Step-by-Step 3D Module Pop-up */}
      <Mobile3DModal
        isOpen={mobile3DModalOpen}
        onClose={() => setMobile3DModalOpen(false)}
        activeTab={mobileModuleTab}
        setActiveTab={setMobileModuleTab}
        isSimulating={isSimulating}
        onStartSimulation={handleStartSimulation}
        onResetSimulation={handleResetSimulation}
      />
    </div>
  );
};
