import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Badge } from '../components/Badge';
import { History, Search, Filter, RefreshCw, User, Terminal } from 'lucide-react';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('query', searchTerm);
      if (actionFilter) params.append('action', actionFilter);

      const res = await api.getAuditLogs(params.toString());
      if (res.success) {
        setLogs(res.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Immutable Security & Access Audit Log</h1>
            <Badge variant="purple">Forensic Record</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every gateway traversal, consent revocation, and workflow transition produces an unalterable audit row.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by actor, action, or target resource..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-gov-500 focus:border-gov-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl bg-white text-slate-700"
          >
            <option value="">All Actions</option>
            <option value="GATEWAY_FANOUT_QUERY">GATEWAY_FANOUT_QUERY</option>
            <option value="SUBMIT_APPLICATION">SUBMIT_APPLICATION</option>
            <option value="WORKFLOW_APPROVED">WORKFLOW_APPROVED</option>
            <option value="WORKFLOW_REJECTED">WORKFLOW_REJECTED</option>
            <option value="CONSENT_GRANTED">CONSENT_GRANTED</option>
            <option value="CONSENT_REVOKED">CONSENT_REVOKED</option>
            <option value="RESOLVE_CONFLICT">RESOLVE_CONFLICT</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-500">Loading audit trail...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">No matching audit events found.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource Target</th>
                  <th className="py-3 px-4">Metadata Context</th>
                  <th className="py-3 px-4">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.actor_id}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-gov-50 text-gov-700 border border-gov-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                      {log.resource}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500 max-w-xs truncate">
                      {JSON.stringify(log.meta || {})}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {log.ip || '127.0.0.1'}
                    </td>
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
