import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Badge } from '../components/Badge';
import { AlertCircle, CheckCircle2, RefreshCw, Terminal, Layers } from 'lucide-react';

export const AdminExceptions = () => {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExceptions = async () => {
    try {
      const res = await api.getExceptions();
      if (res.success) {
        setExceptions(res.exceptions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExceptions();
  }, []);

  const handleResolve = async (id) => {
    try {
      await api.resolveException(id);
      setExceptions((prev) =>
        prev.map((e) => (e.id === id ? { ...e, resolved: true } : e))
      );
    } catch (err) {
      alert(`Failed to resolve: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Gateway Exception & Fault Tracker</h1>
            <Badge variant="warning">Partial Failure Resilient</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            When a silo times out or returns malformed data, SetuLink isolates the fault here while continuing to serve unaffected departments.
          </p>
        </div>

        <button
          onClick={fetchExceptions}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Exceptions</span>
        </button>
      </div>

      {/* Exceptions Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-500">Scanning exception register...</div>
        ) : exceptions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-slate-700">Zero System Exceptions</h3>
            <p className="text-slate-400 mt-1">All gateway fan-outs completed without error.</p>
          </div>
        ) : (
          exceptions.map((ex) => (
            <div
              key={ex.id}
              className={`p-5 rounded-2xl border shadow-sm transition bg-white flex flex-col sm:flex-row items-start justify-between gap-4 ${
                ex.resolved ? 'border-slate-200 opacity-60' : 'border-rose-300 ring-1 ring-rose-400/20'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${ex.resolved ? 'text-slate-400' : 'text-rose-600'}`} />
                  <span className="font-mono font-bold text-xs text-slate-900">{ex.source}</span>
                  <Badge variant={ex.resolved ? 'success' : 'danger'}>
                    {ex.resolved ? 'Resolved' : 'Active Exception'}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(ex.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs font-semibold text-rose-900">{ex.message}</p>

                {ex.context && (
                  <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono overflow-x-auto max-w-2xl">
                    {JSON.stringify(ex.context, null, 2)}
                  </pre>
                )}
              </div>

              {!ex.resolved && (
                <button
                  onClick={() => handleResolve(ex.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
