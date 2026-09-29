import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  FileCheck,
  AlertCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const StaffTaskQueue = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Active Action Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewAction, setReviewAction] = useState('approved');
  const [reviewNote, setReviewNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQueue = async () => {
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
    fetchQueue();
  }, []);

  const handleAdvance = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setActionLoading(true);

    try {
      await api.advanceApplication(selectedApp.id, {
        action: reviewAction,
        note: reviewNote
      });

      setSelectedApp(null);
      setReviewNote('');
      fetchQueue();
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Filter tasks awaiting this staff member's role
  // Clerk handles step 2; Officer handles step 3
  const isEligibleToReview = (app) => {
    if (app.status === 'approved' || app.status === 'rejected') return false;
    if (user?.role === 'admin') return true;
    if (user?.role === 'clerk' && app.current_step === 2) return true;
    if (user?.role === 'officer' && app.current_step === 3) return true;
    return false;
  };

  const pendingCount = applications.filter(isEligibleToReview).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Official Task & Verification Queue</h1>
            <Badge variant="warning">{pendingCount} Action Required</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <span className="font-bold text-slate-800 capitalize">{user?.full_name} ({user?.role})</span>.
            {user?.role === 'clerk' && ' Authorized for Stage 2 Document Verification.'}
            {user?.role === 'officer' && ' Authorized for Stage 3 Final Administrative Approval.'}
          </p>
        </div>
      </div>

      {/* Task Queue List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-500">Loading task queue...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
            No applications found in the queue.
          </div>
        ) : (
          applications.map((app) => {
            const canReview = isEligibleToReview(app);

            return (
              <div
                key={app.id}
                className={`p-6 rounded-2xl border shadow-sm transition bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                  canReview ? 'border-gov-300 ring-1 ring-gov-500/20 shadow-gov-50' : 'border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gov-700">#{app.id.slice(0, 10)}</span>
                    <h3 className="font-bold text-sm text-slate-900">{app.workflows?.name || 'Address Update'}</h3>
                    <Badge variant={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'info'}>
                      Step {app.current_step}: {app.current_step === 2 ? 'Clerk Verification' : app.current_step === 3 ? 'Officer Approval' : 'Intake'}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-4">
                    <span>Citizen ID: <strong>{app.citizen_id}</strong></span>
                    <span>Received: {new Date(app.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Summary of update */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs mt-2">
                    <div className="font-semibold text-slate-700">Declared New Address:</div>
                    <p className="text-slate-800">{app.data?.new_address || 'Address Update Request'}</p>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Proof Document: <strong>{app.data?.proof_type || 'Attached'}</strong>
                    </div>
                  </div>
                </div>

                {/* Review Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                  {canReview ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewAction('approved');
                          setReviewNote('Document verified and matches civic criteria.');
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve / Advance</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewAction('rejected');
                          setReviewNote('Document proof is unclear or incomplete.');
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-[11px] text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg text-center">
                      {app.status === 'approved'
                        ? 'Completed'
                        : app.status === 'rejected'
                        ? 'Closed'
                        : `Awaiting ${app.current_step === 2 ? 'Clerk' : 'Officer'} Action`}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Official Sign-off Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Review Application #${selectedApp?.id.slice(0, 8)}`}
      >
        <form onSubmit={handleAdvance} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-700 block mb-1">Target Action:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setReviewAction('approved')}
                className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  reviewAction === 'approved'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Step</span>
              </button>

              <button
                type="button"
                onClick={() => setReviewAction('rejected')}
                className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  reviewAction === 'rejected'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Official Note / Justification (Logged to Audit Trail)
            </label>
            <textarea
              required
              rows={3}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg"
              placeholder="Provide verification remarks..."
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setSelectedApp(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className={`px-4 py-2 rounded-lg text-white font-bold shadow-sm ${
                reviewAction === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {actionLoading ? 'Processing...' : 'Confirm Action'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
