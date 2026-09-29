import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Badge } from '../components/Badge';
import {
  GitBranch,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckCircle2,
  Layers,
  ShieldAlert
} from 'lucide-react';

export const AdminWorkflows = () => {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWf, setSelectedWf] = useState(null);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchWorkflows = async () => {
    try {
      const res = await api.getWorkflows();
      if (res.success) {
        setWorkflows(res.workflows || []);
        if (res.workflows?.length > 0 && !selectedWf) {
          const first = res.workflows[0];
          setSelectedWf(first);
          setSteps(first.steps || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleSelectWf = (wf) => {
    setSelectedWf(wf);
    setSteps(wf.steps || []);
    setStatusMsg('');
  };

  const handleAddStep = () => {
    const newStep = {
      id: `step-temp-${Date.now()}`,
      step_order: steps.length + 1,
      name: 'New Departmental Verification',
      role_required: 'clerk'
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (index) => {
    if (steps.length <= 1) {
      alert('A workflow must possess at least one step.');
      return;
    }
    const filtered = steps.filter((_, i) => i !== index);
    const reindexed = filtered.map((s, idx) => ({ ...s, step_order: idx + 1 }));
    setSteps(reindexed);
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;
    const reindexed = newSteps.map((s, idx) => ({ ...s, step_order: idx + 1 }));
    setSteps(reindexed);
  };

  const handleSaveSteps = async () => {
    if (!selectedWf) return;
    setSaving(true);
    setStatusMsg('');
    try {
      await api.updateWorkflowSteps(selectedWf.id, steps);
      setStatusMsg('Workflow steps successfully saved and live across all future applications.');
      fetchWorkflows();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Inter-Departmental Workflow Builder</h1>
            <Badge variant="purple">Deterministic DAG</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure stage orders, governance gates, and RBAC role authorization per application pipeline.
          </p>
        </div>

        <button
          onClick={handleSaveSteps}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gov-600 hover:bg-gov-700 text-white text-xs font-bold shadow-sm transition"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing...' : 'Save & Publish Pipeline'}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Main Layout: Workflow Selector & Step Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Workflows list */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
            Select Workflow
          </span>
          {workflows.map((wf) => (
            <button
              key={wf.id}
              onClick={() => handleSelectWf(wf)}
              className={`w-full text-left p-3 rounded-xl text-xs transition ${
                selectedWf?.id === wf.id
                  ? 'bg-gov-50 border border-gov-300 text-gov-900 font-bold shadow-sm'
                  : 'hover:bg-slate-50 text-slate-700 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{wf.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {wf.steps?.length || 3} steps
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-normal mt-0.5">{wf.department}</div>
            </button>
          ))}
        </div>

        {/* Right: Step Editor */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Pipeline Stages: {selectedWf?.name}
              </h3>
              <p className="text-xs text-slate-400">
                Sequential execution requires verified digital signature at each milestone.
              </p>
            </div>

            <button
              onClick={handleAddStep}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stage</span>
            </button>
          </div>

          {/* Stepper items */}
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div
                key={step.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Step index & name input */}
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gov-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Stage Title</label>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[idx].name = e.target.value;
                        setSteps(newSteps);
                      }}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>

                {/* Role dropdown & reorder controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                      Authorized Role
                    </label>
                    <select
                      value={step.role_required}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[idx].role_required = e.target.value;
                        setSteps(newSteps);
                      }}
                      className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700"
                    >
                      <option value="citizen">Citizen</option>
                      <option value="clerk">Clerk</option>
                      <option value="officer">Officer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 mt-3">
                    <button
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === steps.length - 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Remove Step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
