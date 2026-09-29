import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import {
  Radio,
  Power,
  FileJson,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Code,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const AdminConnectors = () => {
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  // Inspector Modal
  const [inspectingConn, setInspectingConn] = useState(null);
  const [mockPreviewData, setMockPreviewData] = useState(null);
  const [fetchingPreview, setFetchingPreview] = useState(false);

  const fetchConnectors = async () => {
    try {
      const res = await api.getConnectors();
      if (res.success) {
        setConnectors(res.connectors || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectors();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const nextStatus = !currentStatus;
      await api.toggleConnector(id, nextStatus);
      setConnectors((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: nextStatus } : c))
      );
    } catch (err) {
      alert(`Toggle failed: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  const inspectConnectorPayload = async (conn) => {
    setInspectingConn(conn);
    setFetchingPreview(true);
    setMockPreviewData(null);
    try {
      let data = null;
      if (conn.department === 'Health') {
        data = await api.getMockHealth();
      } else if (conn.department === 'Transport') {
        data = await api.getMockTransport();
      } else if (conn.department === 'Municipal') {
        data = await api.getMockMunicipal();
      }
      setMockPreviewData(data);
    } catch (err) {
      setMockPreviewData(`Error reading payload: ${err.message}`);
    } finally {
      setFetchingPreview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Heterogeneous Silo Connector Hub</h1>
            <Badge variant="info">3 Registered Gateways</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic adapter registry. Adding a new ministry requires only one adapter file and one schema registry entry.
          </p>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {connectors.map((conn) => {
          const isActive = conn.active;
          const isToggling = togglingId === conn.id;

          return (
            <div
              key={conn.id}
              className={`p-6 rounded-2xl border bg-white shadow-sm flex flex-col justify-between transition ${
                isActive ? 'border-slate-200 shadow-slate-100' : 'border-rose-200 bg-rose-50/10 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100 text-gov-700">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{conn.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Dept: {conn.department}
                      </span>
                    </div>
                  </div>
                  <Badge variant={isActive ? 'success' : 'danger'}>
                    {isActive ? 'Online' : 'Disabled'}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Data Payload Format</span>
                    <span className="font-bold font-mono text-slate-800 uppercase px-2 py-0.5 rounded bg-slate-100 inline-block mt-0.5">
                      {conn.format}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Integration Endpoint</span>
                    <span className="font-mono text-slate-600 text-[11px] break-all">{conn.endpoint}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Field Transformation Map</span>
                    <pre className="bg-slate-900 text-slate-200 p-2.5 rounded-lg text-[10px] font-mono overflow-x-auto mt-1">
                      {JSON.stringify(conn.field_map, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => inspectConnectorPayload(conn)}
                  className="text-xs font-semibold text-gov-600 hover:text-gov-800 flex items-center gap-1"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Inspect Silo Raw Feed</span>
                </button>

                <button
                  onClick={() => handleToggle(conn.id, isActive)}
                  disabled={isToggling}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    isActive
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                  title={isActive ? 'Disable Connector' : 'Enable Connector'}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isActive ? 'Disable' : 'Enable'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw Feed Inspection Modal */}
      <Modal
        isOpen={!!inspectingConn}
        onClose={() => setInspectingConn(null)}
        title={`Raw Native Payload: ${inspectingConn?.name} (${inspectingConn?.format?.toUpperCase()})`}
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-500">
            Raw departmental feed before SetuLink translation into the Common Schema:
          </p>

          <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] max-h-80 overflow-y-auto">
            {fetchingPreview ? (
              <div className="text-slate-400">Fetching live payload from {inspectingConn?.endpoint}...</div>
            ) : typeof mockPreviewData === 'object' ? (
              JSON.stringify(mockPreviewData, null, 2)
            ) : (
              String(mockPreviewData)
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setInspectingConn(null)}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
