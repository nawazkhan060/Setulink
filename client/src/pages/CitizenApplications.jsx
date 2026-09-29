import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  UserCheck,
  Building2,
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';

export const CitizenApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Application Form State
  const [newAddress, setNewAddress] = useState('');
  const [proofType, setProofType] = useState('Electricity Bill');
  const [proofDocNumber, setProofDocNumber] = useState('');
  const [reason, setReason] = useState('Relocation due to employment');
  const [submitting, setSubmitting] = useState(false);

  const fetchApps = async () => {
    try {
      const res = await api.getApplications();
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleStartApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createApplication({
        citizen_id: user?.citizen_id || 'CIT-100000000001',
        workflow_id: 'a0000000-0000-0000-0000-000000000001',
        data: {
          new_address: newAddress,
          proof_type: `${proofType} #${proofDocNumber || 'DEL-2026-AUTO'}`,
          reason
        }
      });
      setIsModalOpen(false);
      setNewAddress('');
      setProofDocNumber('');
      fetchApps();
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Completed & Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'under_review':
        return <Badge variant="warning">Under Review</Badge>;
      default:
        return <Badge variant="info">Submitted</Badge>;
    }
  };

  const stepsList = [
    { order: 1, name: 'Citizen Application', role: 'citizen' },
    { order: 2, name: 'Clerk Verification', role: 'clerk' },
    { order: 3, name: 'Officer Sign-off', role: 'officer' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Inter-Departmental Applications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time multi-stage approval workflows synchronized across all civic bodies.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gov-600 hover:bg-gov-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Address Update Request</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-500">Loading active workflows...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No applications initiated</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Start an Address Update application to witness real-time progression through Clerk and Officer review stages.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-gov-600 text-white text-xs font-semibold shadow-sm"
            >
              Start Application
            </button>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">
                      {app.workflows?.name || 'Address Synchronization'}
                    </h3>
                    <span className="font-mono text-xs text-slate-400">#{app.id.slice(0, 10)}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Department: {app.workflows?.department || 'Inter-Departmental'} • Citizen ID: {app.citizen_id}
                  </div>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>

              {/* Progress Stepper */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Workflow Progression (Deterministic State Machine)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stepsList.map((step) => {
                    const isDone = app.status === 'approved' || app.current_step > step.order;
                    const isCurrent = app.current_step === step.order && app.status !== 'approved' && app.status !== 'rejected';
                    const isFailed = app.status === 'rejected' && app.current_step === step.order;

                    return (
                      <div
                        key={step.order}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 transition ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : isCurrent
                            ? 'bg-gov-50 border-gov-300 ring-2 ring-gov-500/20 text-gov-900 font-semibold'
                            : isFailed
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-gov-600 text-white animate-pulse'
                              : isFailed
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.order}
                        </div>
                        <div className="leading-tight text-xs">
                          <div className="font-semibold">{step.name}</div>
                          <div className="text-[10px] opacity-75 capitalize">Role: {step.role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submitted Data Payload */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
                <div className="font-bold text-slate-700 mb-2">Application Request Details:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800">New Residential Address:</span>
                    <p className="mt-0.5 text-slate-700">{app.data?.new_address || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Verification Document:</span>
                    <p className="mt-0.5 text-slate-700">{app.data?.proof_type || 'Self Declaration'}</p>
                  </div>
                </div>
              </div>

              {/* Audit / Review History Trail */}
              {app.history && app.history.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 mb-2">Official Review Trail:</div>
                  <div className="space-y-2">
                    {app.history.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-start gap-2.5 text-xs bg-white p-2.5 rounded-lg border border-slate-100"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gov-600 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{h.step_name}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">
                            Action by <span className="font-mono text-slate-700 font-semibold">{h.actor_id}</span>: {h.note}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Start New Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initiate Inter-Departmental Address Update"
      >
        <form onSubmit={handleStartApplication} className="space-y-4 text-xs">
          <p className="text-slate-500 leading-relaxed">
            Submitting this request will automatically cascade address verification through Clerk Verification and Officer Approval workflows.
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Address to Synchronize</label>
            <textarea
              required
              rows={3}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="e.g. Penthouse 1201, Imperial Heights, Vasant Kunj, New Delhi 110070"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-gov-500 focus:border-gov-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Proof Document Type</label>
              <select
                value={proofType}
                onChange={(e) => setProofType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Electricity Bill">Electricity Bill</option>
                <option value="Registered Rent Agreement">Rent Agreement</option>
                <option value="Property Tax Receipt">Property Tax Receipt</option>
                <option value="Passport Copy">Passport Copy</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document / Bill Ref #</label>
              <input
                type="text"
                required
                value={proofDocNumber}
                onChange={(e) => setProofDocNumber(e.target.value)}
                placeholder="e.g. DEL-2026-901"
                className="w-full p-2.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Address Change</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-gov-600 text-white font-semibold hover:bg-gov-700 shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Initiating...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
