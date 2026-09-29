import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import {
  AlertTriangle,
  CheckCircle2,
  GitCompare,
  ArrowRight,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';

export const AdminConflicts = () => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected conflict for resolution
  const [activeConflict, setActiveConflict] = useState(null);
  const [chosenValue, setChosenValue] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchConflicts = async () => {
    try {
      const res = await api.getConflicts();
      if (res.success) {
        setConflicts(res.conflicts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConflicts();
  }, []);

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!activeConflict || !chosenValue) return;
    setResolving(true);

    try {
      await api.resolveConflict(activeConflict.id, {
        chosenValue,
        notes: resolutionNotes || `Manually verified against civil credentials. Selected canonical value: "${chosenValue}"`
      });

      setActiveConflict(null);
      setChosenValue('');
      setResolutionNotes('');
      fetchConflicts();
    } catch (err) {
      alert(`Resolution failed: ${err.message}`);
    } finally {
      setResolving(false);
    }
  };

  const openCount = conflicts.filter((c) => c.status === 'open').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Deterministic Conflict Resolution Queue</h1>
            <Badge variant="warning">{openCount} Unresolved</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            SetuLink never silently overwrites discrepancies. Flagged variances between silo records must be confirmed or audited.
          </p>
        </div>
      </div>

      {/* Conflict Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-500">Scanning for data discrepancies...</div>
        ) : conflicts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-slate-700">All Records 100% In Sync</h3>
            <p className="text-slate-400 mt-1">No cross-departmental mismatches detected.</p>
          </div>
        ) : (
          conflicts.map((conf) => {
            const isOpen = conf.status === 'open';

            return (
              <div
                key={conf.id}
                className={`bg-white p-6 rounded-2xl border shadow-sm transition space-y-4 ${
                  isOpen ? 'border-amber-300 ring-1 ring-amber-400/20' : 'border-slate-200 opacity-75'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${isOpen ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span className="font-bold text-sm text-slate-900 uppercase">
                      Field Mismatch: <span className="text-gov-700">{conf.field}</span>
                    </span>
                    <Badge variant={isOpen ? 'warning' : 'success'}>
                      {isOpen ? 'Review Required' : 'Resolved'}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-500">
                    Citizen: <span className="font-mono font-semibold text-slate-800">{conf.citizen_id}</span>
                  </div>
                </div>

                {/* Side-by-side values comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(conf.values || {}).map(([dept, val]) => (
                    <div
                      key={dept}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {dept} Department Value
                      </div>
                      <div className="text-xs font-semibold text-slate-800 break-words">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500">
                    {conf.resolution_notes ? (
                      <span className="italic">{conf.resolution_notes}</span>
                    ) : (
                      <span>Deterministic matching threshold 0.60–0.89 triggered this review queue.</span>
                    )}
                  </div>

                  {isOpen && (
                    <button
                      onClick={() => {
                        setActiveConflict(conf);
                        // Pick first value as default
                        const firstVal = Object.values(conf.values || {})[0] || '';
                        setChosenValue(firstVal);
                      }}
                      className="px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>Review & Resolve</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolution Modal */}
      <Modal
        isOpen={!!activeConflict}
        onClose={() => setActiveConflict(null)}
        title="Resolve Discrepancy & Commit Canonical Value"
      >
        <form onSubmit={handleResolve} className="space-y-4 text-xs">
          <p className="text-slate-500">
            Select which departmental value represents the official truth for field{' '}
            <strong className="text-slate-800 uppercase">{activeConflict?.field}</strong>:
          </p>

          <div className="space-y-2">
            {Object.entries(activeConflict?.values || {}).map(([dept, val]) => (
              <label
                key={dept}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  chosenValue === val
                    ? 'border-gov-500 bg-gov-50/60 ring-1 ring-gov-500 text-gov-900 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="canonicalValue"
                    checked={chosenValue === val}
                    onChange={() => setChosenValue(val)}
                    className="text-gov-600"
                  />
                  <span>
                    <strong>[{dept}]:</strong> {val}
                  </span>
                </div>
                {chosenValue === val && <Check className="w-4 h-4 text-gov-600" />}
              </label>
            ))}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Administrative Note</label>
            <input
              type="text"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Cross-referenced with physical Aadhaar card"
              className="w-full p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveConflict(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resolving}
              className="px-4 py-2 rounded-lg bg-gov-600 hover:bg-gov-700 text-white font-bold shadow-sm"
            >
              {resolving ? 'Committing...' : 'Confirm Resolution'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
