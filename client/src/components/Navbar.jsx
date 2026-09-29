import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './NotificationBell';
import {
  Shield,
  User,
  LogOut,
  ChevronDown,
  Check,
  Sparkles,
  Layers,
  Zap,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  GitBranch,
  Radio,
  History,
  HelpCircle
} from 'lucide-react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { JuryGuideModal } from './JuryGuideModal';

export const Navbar = () => {
  const { user, quickLogin, logout } = useAuth();
  const navigate = useNavigate();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [juryGuideOpen, setJuryGuideOpen] = useState(false);

  const roles = [
    { key: 'citizen', label: 'Citizen', desc: 'Rahul Sharma (Unified Single View)' },
    { key: 'clerk', label: 'Verification Clerk', desc: 'Sunita Rao (Document Inspection)' },
    { key: 'officer', label: 'Approving Officer', desc: 'Rajesh K. Varma (Final Sign-off)' },
    { key: 'admin', label: 'System Admin', desc: 'NIC Controller (Platform Oversight)' }
  ];

  const handleRoleSwitch = (roleKey) => {
    quickLogin(roleKey);
    setShowRoleSwitcher(false);
    setMobileMenuOpen(false);
    if (roleKey === 'citizen') navigate('/citizen');
    else if (roleKey === 'clerk' || roleKey === 'officer') navigate('/staff/queue');
    else if (roleKey === 'admin') navigate('/admin');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'citizen';

  const citizenLinks = [
    { to: '/citizen', label: 'Unified Profile', icon: LayoutDashboard },
    { to: '/citizen/applications', label: 'My Applications', icon: FileText },
    { to: '/citizen/consent', label: 'Consent & Logs', icon: ShieldCheck },
  ];

  const staffLinks = [
    { to: '/staff/queue', label: 'Task Verification Queue', icon: CheckSquare },
    { to: '/citizen', label: 'Citizen Profile Viewer', icon: LayoutDashboard },
    { to: '/citizen/applications', label: 'All Applications', icon: FileText },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Metrics & Health', icon: LayoutDashboard },
    { to: '/admin/conflicts', label: 'Conflict Resolution', icon: AlertTriangle },
    { to: '/admin/workflows', label: 'Workflow Builder', icon: GitBranch },
    { to: '/admin/connectors', label: 'Connector Manager', icon: Radio },
    { to: '/admin/audit-logs', label: 'Audit Trail', icon: History },
  ];

  let currentLinks = citizenLinks;
  if (role === 'clerk' || role === 'officer') currentLinks = staffLinks;
  if (role === 'admin') currentLinks = adminLinks;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Evaluator Banner Mini Pill */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-3 sm:px-4 py-1.5 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-amber-300 font-bold shrink-0">BYPASS ACTIVE:</span>
          <span className="truncate text-slate-400 text-[10px] sm:text-[11px]">
            1-Click role switching enabled for SIH 2026. Production uses SMTP 2FA & e-Pramaan SSO.
          </span>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              onClick={() => setJuryGuideOpen(true)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] sm:text-[11px] shadow-sm transition"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Jury Guide</span>
            </button>
            <Link
              to="/"
              className="text-gov-400 hover:text-gov-300 font-bold flex items-center gap-1 underline text-[10px] sm:text-xs"
            >
              <span>3D Engine</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Gov Emblem */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <div className="h-1 w-5 sm:w-7 bg-amber-500 rounded-t-full" />
              <div className="h-1 w-5 sm:w-7 bg-white border-y border-slate-200" />
              <div className="h-1 w-5 sm:w-7 bg-emerald-600 rounded-b-full" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={() => navigate('/citizen')}>
              <div className="p-1 sm:p-1.5 rounded-lg bg-gov-700 text-white font-black text-base sm:text-lg shadow-sm">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-gov-900 tracking-tight font-sans">
                  Setu<span className="text-gov-500">Link</span>
                </span>
                <span className="hidden md:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-gov-50 text-gov-700 border border-gov-200">
                  SIH26129 Interop
                </span>
              </div>
            </div>
          </div>

          {/* Right Actions: Notifications, Role Switcher, Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Desktop 1-Click Role Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="capitalize">{user?.role || 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 flex items-center justify-between">
                    <span>Quick Bypass Personas</span>
                    <span className="text-emerald-600 font-mono text-[9px]">Active</span>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => handleRoleSwitch(r.key)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                        user?.role === r.key ? 'bg-gov-50 text-gov-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{r.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{r.desc}</div>
                      </div>
                      {user?.role === r.key && <Check className="w-4 h-4 text-gov-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Desktop User Info & Logout */}
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">{user?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          
          {/* Mobile Current User Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">{user?.full_name || user?.email}</div>
              <div className="text-[11px] text-gov-700 font-semibold capitalize flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{user?.role} Mode</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200"
            >
              Logout
            </button>
          </div>

          {/* Quick Role Switcher Grid on Mobile */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              1-Click Persona Switcher
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => handleRoleSwitch(r.key)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    user?.role === r.key
                      ? 'bg-gov-600 text-white font-bold border-gov-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs">{r.label}</div>
                  <div className={`text-[10px] ${user?.role === r.key ? 'text-gov-200' : 'text-slate-400'}`}>
                    {r.key}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Nav Links */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Navigation Menu
            </div>
            <nav className="space-y-1">
              {currentLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-gov-50 text-gov-800 border border-gov-200'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-gov-600" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-dashed border-slate-300 mt-2"
              >
                <Layers className="w-4 h-4 text-amber-500" />
                <span>3D Interactive Architecture Tour</span>
              </Link>
            </nav>
          </div>

        </div>
      )}

      {/* Jury & Evaluator Guide Modal */}
      <JuryGuideModal
        isOpen={juryGuideOpen}
        onClose={() => setJuryGuideOpen(false)}
      />
    </header>
  );
};
