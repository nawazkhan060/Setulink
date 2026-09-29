import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  CheckSquare,
  Users,
  GitBranch,
  Radio,
  History,
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'citizen';

  const citizenNav = [
    { to: '/citizen', label: 'Unified Profile', icon: LayoutDashboard },
    { to: '/citizen/applications', label: 'My Applications', icon: FileText },
    { to: '/citizen/consent', label: 'Consent & Logs', icon: ShieldCheck },
  ];

  const staffNav = [
    { to: '/staff/queue', label: 'Task Verification Queue', icon: CheckSquare },
    { to: '/citizen', label: 'Citizen Profile Viewer', icon: LayoutDashboard },
    { to: '/citizen/applications', label: 'All Applications', icon: FileText },
  ];

  const adminNav = [
    { to: '/admin', label: 'Metrics & Health', icon: LayoutDashboard },
    { to: '/admin/conflicts', label: 'Conflict Resolution', icon: AlertTriangle, badge: 'Active' },
    { to: '/admin/workflows', label: 'Workflow Builder', icon: GitBranch },
    { to: '/admin/connectors', label: 'Connector Manager', icon: Radio },
    { to: '/admin/audit-logs', label: 'Audit Trail', icon: History },
    { to: '/admin/exceptions', label: 'Exception Logs', icon: Layers },
  ];

  let currentNav = citizenNav;
  if (role === 'clerk' || role === 'officer') currentNav = staffNav;
  if (role === 'admin') currentNav = adminNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            {role.toUpperCase()} PORTAL
          </div>
          <nav className="space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/citizen' || item.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-gov-600 text-white shadow-sm shadow-gov-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Portal Switch Shortcut for convenience */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            PORTAL SHORTCUTS
          </div>
          <div className="space-y-1">
            {role !== 'citizen' && (
              <NavLink
                to="/citizen"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-gov-700 hover:bg-slate-50 rounded-lg transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Citizen View</span>
              </NavLink>
            )}
            {role !== 'clerk' && role !== 'officer' && (
              <NavLink
                to="/staff/queue"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-gov-700 hover:bg-slate-50 rounded-lg transition"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Staff Queue</span>
              </NavLink>
            )}
            {role !== 'admin' && (
              <NavLink
                to="/admin"
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-gov-700 hover:bg-slate-50 rounded-lg transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Admin View</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* GovTech Info Footer */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 text-gov-700 font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SIH26129 Prototype</span>
        </div>
        <p className="leading-snug text-[10px]">
          Deterministic cross-departmental integration without replacing legacy databases.
        </p>
      </div>
    </aside>
  );
};
