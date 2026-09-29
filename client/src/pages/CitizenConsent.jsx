import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Badge } from '../components/Badge';
import {
  ShieldCheck,
  ShieldAlert,
  History,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Info
} from 'lucide-react';

export const CitizenConsent = () => {
  const { user } = useAuth();
  const citizenId = user?.citizen_id || 'CIT-100000000001';

  const [consents, setConsents] = useState([]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingDept, setTogglingDept] = useState(null);

  const fetchConsentData = async () => {
    try {
      const res = await api.getConsents(citizenId);
      if (res.success) {
        setConsents(res.consents || []);
        setAccessLogs(res.accessLogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsentData();
  }, [citizenId]);

  const handleToggle = async (department, currentStatus) => {
    setTogglingDept(department);
    try {
      const nextStatus = !currentStatus;
      await api.toggleConsent({
        citizen_id: citizenId,
        department,
        granted: nextStatus,
        purpose: `${department} service federation and document verification`
      });

      setConsents((prev) =>
        prev.map((c) => (c.department.toLowerCase() === department.toLowerCase() ? { ...c, granted: nextStatus } : c))
      );
    } catch (err) {
      alert(`Consent update failed: ${err.message}`);
    } finally {
      setTogglingDept(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gov-100 text-gov-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Citizen Consent & Sovereign Data Control</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              You maintain granular legal authority over which department silos can federate or cross-verify your identity data.
            </p>
          </div>
        </div>
      </div>

      {/* Consent Toggles Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-gov-600" />
            <span>Active Departmental Consent Directives</span>
          </h2>
          <span className="text-xs text-slate-400">Updates take effect immediately on Gateway</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {consents.map((c) => {
            const isGranted = c.granted;
            const isUpdating = togglingDept === c.department;

            return (
              <div
                key={c.department}
                className={`p-5 rounded-2xl border transition shadow-sm bg-white flex flex-col justify-between ${
                  isGranted ? 'border-emerald-200 shadow-emerald-50/50' : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900">{c.department} Department</span>
                    {isGranted ? (
                      <Badge variant="success">Access Granted</Badge>
                    ) : (
                      <Badge variant="danger">Access Revoked</Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    {c.purpose || `${c.department} record federation and verification.`}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-600">
                    {isGranted ? 'Gateway Active' : 'Gateway Blocked'}
                  </span>

                  <button
                    onClick={() => handleToggle(c.department, isGranted)}
                    disabled={isUpdating}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isGranted
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isGranted ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Revoke Access</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Grant Access</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Access Logs Audit Trail */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gov-600" />
            <h3 className="font-bold text-sm text-slate-900">Immutable Access Audit Trail</h3>
          </div>
          <span className="text-xs text-slate-400">Total Queries: {accessLogs.length}</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          {accessLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No external access logged yet.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Accessed By</th>
                  <th className="py-2.5 px-3">Target Department</th>
                  <th className="py-2.5 px-3">Declared Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.accessed_by}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold font-mono text-[10px]">
                        {log.department}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{log.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
