import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck, CheckCircle2, Zap, Sparkles, Layers, Info } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('citizen@setulink.gov.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { loginWithCredentials, quickLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loggedUser = await loginWithCredentials(email, password);
      redirectByRole(loggedUser.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickRole = (role) => {
    const user = quickLogin(role);
    redirectByRole(user.role);
  };

  const redirectByRole = (role) => {
    if (role === 'citizen') navigate('/citizen');
    else if (role === 'clerk' || role === 'officer') navigate('/staff/queue');
    else if (role === 'admin') navigate('/admin');
    else navigate('/citizen');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gov-50 to-blue-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans">
      
      {/* Evaluator Disclaimer Banner */}
      <div className="max-w-2xl mx-auto w-full px-4 mb-4">
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm text-xs text-amber-900 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">⚡ EVALUATOR NOTICE — DEMO BYPASS ACTIVE:</span>
            <p className="mt-0.5 text-amber-800 leading-relaxed text-[11px]">
              For rapid evaluator demonstration, authentication is configured with <strong>Instant Prototype Persona Bypass</strong> so judges can test all four personas without SMTP email OTP bottlenecks. In production, this layer is protected by <strong>NIC e-Pramaan SSO</strong>, <strong>SMTP 2FA</strong>, and <strong>TLS 1.3 mTLS</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Emblem colors */}
        <div className="flex justify-center mb-2">
          <div className="flex flex-col items-center">
            <div className="h-1.5 w-12 bg-amber-500 rounded-t-full" />
            <div className="h-1.5 w-12 bg-white" />
            <div className="h-1.5 w-12 bg-emerald-600 rounded-b-full" />
          </div>
        </div>

        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gov-700 text-white shadow-lg mb-2">
          <Shield className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-gov-900 tracking-tight">
          Setu<span className="text-gov-500">Link</span> Authentication Gate
        </h2>
        <p className="mt-0.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Interoperability Middleware Platform • SIH26129
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-6 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-8">
          
          {/* Quick Demo Switcher Panel */}
          <div className="mb-5 pb-5 border-b border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-gov-600" />
                <span>1-Click Evaluator Bypass Personas</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Direct Launch
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRole('citizen')}
                className="p-3 rounded-xl border border-gov-200 bg-gov-50/60 hover:bg-gov-100 text-gov-900 font-semibold text-left transition flex flex-col justify-between shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Citizen Portal</span>
                  <span className="text-[10px] text-gov-600 group-hover:translate-x-0.5 transition font-mono">&rarr;</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Rahul Sharma (Single View)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('clerk')}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 font-semibold text-left transition flex flex-col justify-between shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Clerk Queue</span>
                  <span className="text-[10px] text-amber-700 group-hover:translate-x-0.5 transition font-mono">&rarr;</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Sunita Rao (Stage 2)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('officer')}
                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-900 font-semibold text-left transition flex flex-col justify-between shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">Officer Sign-off</span>
                  <span className="text-[10px] text-emerald-700 group-hover:translate-x-0.5 transition font-mono">&rarr;</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Rajesh Varma (Stage 3)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('admin')}
                className="p-3 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-900 font-semibold text-left transition flex flex-col justify-between shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">System Admin</span>
                  <span className="text-[10px] text-purple-700 group-hover:translate-x-0.5 transition font-mono">&rarr;</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Telemetry & Conflicts</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-3.5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-gov-500 focus:border-gov-500"
                  placeholder="user@setulink.gov.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password / Passkey
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-gov-500 focus:border-gov-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-gov-600 hover:bg-gov-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-500 transition"
            >
              {loading ? 'Authenticating...' : 'Sign In with Supabase Auth'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Link back to 3D Tour */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              to="/"
              className="text-gov-600 hover:text-gov-800 font-semibold flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>&larr; Return to 3D Architecture Tour</span>
            </Link>
            <span className="text-[10px] text-slate-400">SIH 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
