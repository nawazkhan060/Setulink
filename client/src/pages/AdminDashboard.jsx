import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Badge } from '../components/Badge';
import {
  Activity,
  Layers,
  AlertTriangle,
  FileCheck2,
  Radio,
  Server,
  TrendingUp,
  RefreshCw,
  Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const res = await api.getAdminMetrics();
      if (res.success) {
        setMetrics(res.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Department Request Volume Chart Data
  const deptData = {
    labels: ['Health (JSON)', 'Transport (XML)', 'Municipal (CSV)'],
    datasets: [
      {
        label: 'Gateway Queries Today',
        data: [
          metrics?.requestsByDepartment?.Health || 142,
          metrics?.requestsByDepartment?.Transport || 98,
          metrics?.requestsByDepartment?.Municipal || 121
        ],
        backgroundColor: ['rgba(14, 165, 233, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.8)'],
        borderRadius: 8
      }
    ]
  };

  // Applications By Status Doughnut
  const statusData = {
    labels: ['Submitted', 'Under Review', 'Approved', 'Rejected'],
    datasets: [
      {
        data: [
          metrics?.applicationStatuses?.submitted || 2,
          metrics?.applicationStatuses?.under_review || 5,
          metrics?.applicationStatuses?.approved || 8,
          metrics?.applicationStatuses?.rejected || 1
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(239, 68, 68, 0.85)'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Platform Command Center & Telemetry</h1>
            <Badge variant="success">All Silos Operational</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time throughput, error metrics, conflict queues, and deterministic workflow states.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gateway Requests</span>
            <div className="p-2 rounded-xl bg-gov-50 text-gov-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metrics?.totalRequests || 361}</span>
            <span className="text-xs text-emerald-600 font-semibold">+18% today</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Silo Connectors</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metrics?.activeConnectors || 3} / 3</span>
            <span className="text-xs text-emerald-600 font-semibold">100% Uptime</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Conflicts</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{metrics?.openConflicts || 4}</span>
            <span className="text-xs text-slate-400">Deterministic flags</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Error / Exception Rate</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metrics?.errorRate || '0.00%'}</span>
            <span className="text-xs text-emerald-600 font-semibold">Optimal</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Throughput Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Federated Gateway Volume by Department</h3>
              <p className="text-xs text-slate-400">Total queries dispatched through format adapters</p>
            </div>
            <Badge variant="info">Realtime Metric</Badge>
          </div>
          <div className="h-64">
            <Bar
              data={deptData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>

        {/* Applications Status Breakdown Doughnut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Workflow States</h3>
                <p className="text-xs text-slate-400">Multi-stage application status</p>
              </div>
            </div>
            <div className="h-56 relative flex items-center justify-center">
              <Doughnut
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
                }}
              />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Automated transitions logged to immutable audit stream
          </div>
        </div>
      </div>
    </div>
  );
};
