import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { LiveDataFlow } from '../components/LiveDataFlow';
import { ImpactPanel } from '../components/ImpactPanel';
import { Badge } from '../components/Badge';
import {
  User,
  Calendar,
  MapPin,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileJson,
  FileCode,
  FileSpreadsheet,
  Shield,
  Layers,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const citizenId = user?.citizen_id || 'CIT-100000000001';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  const fetchUnifiedData = async () => {
    setIsQuerying(true);
    setError('');
    try {
      const res = await api.getUnifiedCitizen(citizenId);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to query gateway.');
    } finally {
      setIsQuerying(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnifiedData();
  }, [citizenId]);

  const getFormatIcon = (format) => {
    switch (format?.toUpperCase()) {
      case 'JSON':
        return <FileJson className="w-4 h-4 text-sky-500" />;
      case 'XML':
        return <FileCode className="w-4 h-4 text-amber-500" />;
      case 'CSV':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const getMatchBadge = (status, score) => {
    if (status === 'matched') {
      return <Badge variant="success">Auto-Linked ({score * 100}%)</Badge>;
    }
    if (status === 'needs_review') {
      return <Badge variant="warning">Conflict Flagged ({score * 100}%)</Badge>;
    }
    if (status === 'consent_revoked') {
      return <Badge variant="danger">Consent Blocked</Badge>;
    }
    return <Badge variant="default">Isolated</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Unified Citizen Identity Portal</h1>
            <Badge variant="info">Master Record: {citizenId}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time zero-copy cross-department federation across Health, Transport, and Municipal silos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUnifiedData}
            disabled={isQuerying}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gov-50 hover:bg-gov-100 text-gov-700 text-xs font-semibold border border-gov-200 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isQuerying ? 'animate-spin text-gov-600' : ''}`} />
            <span>{isQuerying ? 'Federating Silos...' : 'Re-query Gateway'}</span>
          </button>

          <Link
            to="/citizen/applications"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gov-600 hover:bg-gov-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <span>Update Address</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Live Data Flow Visualizer */}
      <LiveDataFlow isQuerying={isQuerying} />

      {/* Master Citizen Registry Record Card */}
      {data?.citizen && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gov-100 text-gov-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{data.citizen.name}</h2>
                <div className="text-xs text-slate-400 font-mono">Master ID: {data.citizen.citizen_id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="purple">Master Citizen Registry (SSO)</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date of Birth
              </div>
              <div className="font-semibold text-slate-800">{data.citizen.dob}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> Verified Mobile
              </div>
              <div className="font-semibold text-slate-800">+91 {data.citizen.phone || '9811002233'}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> Digital Notification Email
              </div>
              <div className="font-semibold text-slate-800">{data.citizen.email || user?.email}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 md:col-span-3">
              <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Master Residential Address
              </div>
              <div className="font-semibold text-slate-800">{data.citizen.address}</div>
            </div>
          </div>
        </div>
      )}

      {/* Siloed Department Federation Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-gov-600" />
            <span>Federated Department Silos ({data?.departments?.length || 3})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Source formats normalized on-the-fly to Common Schema
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {data?.departments?.map((dept) => {
            const hasConsent = dept.status !== 'consent_revoked';
            const isSuccess = dept.status === 'success';

            return (
              <div
                key={dept.department}
                className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition ${
                  hasConsent ? 'border-slate-200' : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-100">
                        {getFormatIcon(dept.format)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{dept.department}</h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          Format: {dept.format || 'REST'}
                        </span>
                      </div>
                    </div>
                    {getMatchBadge(dept.status === 'success' ? dept.matchStatus : dept.status, dept.matchScore)}
                  </div>

                  {/* Body Content */}
                  <div className="mt-4 text-xs space-y-2">
                    {dept.status === 'consent_revoked' ? (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700">
                        <div className="font-semibold flex items-center gap-1.5 mb-1">
                          <AlertCircle className="w-4 h-4" /> Consent Revoked
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          You have paused data sharing for this department. No queries are forwarded.
                        </p>
                      </div>
                    ) : dept.status === 'error' ? (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                        <div className="font-semibold flex items-center gap-1.5 mb-1">
                          <AlertCircle className="w-4 h-4" /> Gateway Exception
                        </div>
                        <p className="text-[11px]">{dept.message}</p>
                      </div>
                    ) : isSuccess && dept.record ? (
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Recorded Full Name</span>
                          <span className="font-medium text-slate-800">{dept.record.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Recorded DOB</span>
                          <span className="font-medium text-slate-800">{dept.record.dob}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Recorded Address</span>
                          <span className="font-medium text-slate-800 line-clamp-2">{dept.record.address}</span>
                        </div>
                        
                        {/* Department specific metadata */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[10px]">
                          {dept.record.metadata?.blood_group && (
                            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                              Blood: {dept.record.metadata.blood_group}
                            </span>
                          )}
                          {dept.record.metadata?.vehicle_reg && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                              Reg: {dept.record.metadata.vehicle_reg}
                            </span>
                          )}
                          {dept.record.metadata?.tax_status && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                              Tax: {dept.record.metadata.tax_status}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-center py-4">No records found</div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono text-[10px]">
                    ID: {dept.record?.department_record_id || 'N/A'}
                  </span>
                  <Link
                    to="/citizen/consent"
                    className="text-gov-600 hover:text-gov-800 font-semibold"
                  >
                    Manage Consent &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Benchmark Panel */}
      <ImpactPanel />
    </div>
  );
};
