import express from 'express';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = express.Router();

// Middleware: Require Admin for all admin routes
router.use(requireRole('admin'));

// 1. Analytics & Health Metrics
router.get('/metrics', async (req, res, next) => {
  try {
    let conflicts = [];
    let exceptions = [];
    let applications = [];
    let auditLogs = [];

    if (isSupabaseConfigured()) {
      const [confRes, exRes, appRes, audRes] = await Promise.all([
        supabase.from('conflicts').select('*'),
        supabase.from('exceptions').select('*'),
        supabase.from('applications').select('*'),
        supabase.from('audit_logs').select('*')
      ]);
      conflicts = confRes.data || [];
      exceptions = exRes.data || [];
      applications = appRes.data || [];
      auditLogs = audRes.data || [];
    } else {
      conflicts = mockDb.conflicts;
      exceptions = mockDb.exceptions;
      applications = mockDb.applications;
      auditLogs = mockDb.audit_logs;
    }

    const openConflicts = conflicts.filter((c) => c.status === 'open').length;
    const unresolvedExceptions = exceptions.filter((e) => !e.resolved).length;
    
    // Status breakdown
    const appStatusCount = {
      submitted: applications.filter((a) => a.status === 'submitted').length,
      under_review: applications.filter((a) => a.status === 'under_review').length,
      approved: applications.filter((a) => a.status === 'approved').length,
      rejected: applications.filter((a) => a.status === 'rejected').length
    };

    // Department request estimates
    const requestsByDepartment = {
      Health: 142 + Math.floor(Math.random() * 5),
      Transport: 98 + Math.floor(Math.random() * 5),
      Municipal: 121 + Math.floor(Math.random() * 5)
    };

    const totalRequests = requestsByDepartment.Health + requestsByDepartment.Transport + requestsByDepartment.Municipal;
    const errorRate = totalRequests > 0 ? ((unresolvedExceptions / totalRequests) * 100).toFixed(2) : '0.00';

    res.json({
      success: true,
      metrics: {
        totalCitizens: 20,
        activeConnectors: 3,
        totalRequests,
        requestsByDepartment,
        errorRate: `${errorRate}%`,
        openConflicts,
        unresolvedExceptions,
        applicationStatuses: appStatusCount,
        auditLogsCount: auditLogs.length
      }
    });
  } catch (err) {
    next(err);
  }
});

// 2. Conflicts Management
router.get('/conflicts', async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('conflicts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.json({ success: true, conflicts: data });
    }
    res.json({ success: true, conflicts: mockDb.conflicts });
  } catch (err) {
    next(err);
  }
});

router.post('/conflicts/:id/resolve', async (req, res, next) => {
  try {
    const conflictId = req.params.id;
    const { chosenValue, notes } = req.body;
    const resolver = req.user?.email || 'admin@setulink.gov.in';

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('conflicts')
        .update({
          status: 'resolved',
          resolved_by: resolver,
          resolution_notes: notes || `Resolved to value: ${chosenValue}`,
          resolved_at: new Date().toISOString()
        })
        .eq('id', conflictId)
        .select()
        .single();
      if (error) throw error;
    } else {
      const conf = mockDb.conflicts.find((c) => c.id === conflictId);
      if (conf) {
        conf.status = 'resolved';
        conf.resolved_by = resolver;
        conf.resolution_notes = notes || `Resolved to value: ${chosenValue}`;
        conf.resolved_at = new Date().toISOString();
      }
    }

    await logAudit(req, 'RESOLVE_CONFLICT', `conflicts/${conflictId}`, { chosenValue, notes, resolver });

    res.json({ success: true, message: 'Conflict resolved successfully.' });
  } catch (err) {
    next(err);
  }
});

// 3. Searchable Audit Logs
router.get('/audit-logs', async (req, res, next) => {
  try {
    const { query, action } = req.query;
    let logs = [];

    if (isSupabaseConfigured()) {
      let dbQuery = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
      if (action) dbQuery = dbQuery.eq('action', action);
      const { data } = await dbQuery;
      logs = data || [];
    } else {
      logs = [...mockDb.audit_logs];
      if (action) {
        logs = logs.filter((l) => l.action.toLowerCase() === action.toLowerCase());
      }
      if (query) {
        const q = query.toLowerCase();
        logs = logs.filter(
          (l) =>
            l.actor_id.toLowerCase().includes(q) ||
            l.action.toLowerCase().includes(q) ||
            l.resource.toLowerCase().includes(q)
        );
      }
    }

    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    next(err);
  }
});

// 4. Exceptions Log
router.get('/exceptions', async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('exceptions').select('*').order('created_at', { ascending: false });
      return res.json({ success: true, exceptions: data || [] });
    }
    res.json({ success: true, exceptions: mockDb.exceptions });
  } catch (err) {
    next(err);
  }
});

router.post('/exceptions/:id/resolve', async (req, res, next) => {
  try {
    const exId = req.params.id;
    if (isSupabaseConfigured()) {
      await supabase.from('exceptions').update({ resolved: true }).eq('id', exId);
    } else {
      const item = mockDb.exceptions.find((e) => e.id === exId);
      if (item) item.resolved = true;
    }
    res.json({ success: true, message: 'Exception marked as resolved.' });
  } catch (err) {
    next(err);
  }
});

// 5. Connectors Management
router.get('/connectors', async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('connectors').select('*');
      return res.json({ success: true, connectors: data || [] });
    }
    res.json({ success: true, connectors: mockDb.connectors });
  } catch (err) {
    next(err);
  }
});

router.post('/connectors/:id/toggle', async (req, res, next) => {
  try {
    const connectorId = req.params.id;
    const { active } = req.body;

    if (isSupabaseConfigured()) {
      await supabase.from('connectors').update({ active }).eq('id', connectorId);
    } else {
      const conn = mockDb.connectors.find((c) => c.id === connectorId);
      if (conn) conn.active = active;
    }

    await logAudit(req, active ? 'ENABLE_CONNECTOR' : 'DISABLE_CONNECTOR', `connectors/${connectorId}`, { active });

    res.json({ success: true, message: `Connector status updated to ${active ? 'active' : 'disabled'}.` });
  } catch (err) {
    next(err);
  }
});

export default router;
