import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './NotificationBell';
import { Shield, User, LogOut, ChevronDown, Check, Sparkles, Layers, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, quickLogin, logout } = useAuth();
  const navigate = useNavigate();
  const [showRoleSwitcher, setShowRoleSwitcher] = React.useState(false);

  const roles = [
    { key: 'citizen', label: 'Citizen', desc: 'Rahul Sharma (Unified Single View)' },
    { key: 'clerk', label: 'Verification Clerk', desc: 'Sunita Rao (Document Inspection)' },
    { key: 'officer', label: 'Approving Officer', desc: 'Rajesh K. Varma (Final Sign-off)' },
    { key: 'admin', label: 'System Admin', desc: 'NIC Controller (Platform Oversight)' }
  ];

  const handleRoleSwitch = (roleKey) => {
    quickLogin(roleKey);
    setShowRoleSwitcher(false);
    if (roleKey === 'citizen') navigate('/citizen');
    else if (roleKey === 'clerk' || roleKey === 'officer') navigate('/staff/queue');
    else if (roleKey === 'admin') navigate('/admin');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Evaluator Banner Mini Pill */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-amber-300 font-bold">EVALUATOR BYPASS ACTIVE:</span>
          <span className="hidden sm:inline text-slate-400">
            Instant role switching enabled for SIH 2026 jury assessment. Production incorporates SMTP 2FA & e-Pramaan SSO.
          </span>
          <Link
            to="/"
            className="ml-auto text-gov-400 hover:text-gov-300 font-bold flex items-center gap-1 underline"
          >
            <span>3D Interactive Architecture</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Gov Emblem */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="h-1 w-7 bg-amber-500 rounded-t-full" />
              <div className="h-1 w-7 bg-white border-y border-slate-200" />
              <div className="h-1 w-7 bg-emerald-600 rounded-b-full" />
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/citizen')}>
              <div className="p-1.5 rounded-lg bg-gov-700 text-white font-black text-lg tracking-wider shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-gov-900 tracking-tight font-sans">
                  Setu<span className="text-gov-500">Link</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-gov-50 text-gov-700 border border-gov-200">
                  SIH26129 Interop
                </span>
              </div>
            </div>
          </div>

          {/* Quick Demo Persona Switcher & Actions */}
          <div className="flex items-center gap-3">
            {/* 1-Click Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="capitalize">{user?.role || 'Guest'} Mode</span>
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

            {/* User Details & Logout */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="hidden md:block text-right">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.full_name || user?.email}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">{user?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
