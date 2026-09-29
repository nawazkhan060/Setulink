import { supabase, isSupabaseConfigured, mockDb } from '../lib/supabase.js';

export const logAudit = async (req, action, resource, meta = {}) => {
  const actorId = req?.user?.email || req?.user?.id || 'anonymous';
  const ip = req?.ip || req?.headers?.['x-forwarded-for'] || '127.0.0.1';

  const auditEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    actor_id: actorId,
    action,
    resource,
    meta,
    ip: String(ip),
    created_at: new Date().toISOString()
  };

  try {
    if (isSupabaseConfigured()) {
      await supabase.from('audit_logs').insert([auditEntry]);
    } else {
      mockDb.audit_logs.unshift(auditEntry);
      if (mockDb.audit_logs.length > 200) mockDb.audit_logs.pop();
    }
  } catch (err) {
    console.warn('Audit log write error:', err.message);
  }
};
