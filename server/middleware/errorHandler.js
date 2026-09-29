import { supabase, isSupabaseConfigured, mockDb } from '../lib/supabase.js';

export const errorHandler = async (err, req, res, next) => {
  const source = req.originalUrl || 'server';
  const message = err.message || 'Internal Server Error';
  const context = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    body: req.body,
    user: req.user ? { id: req.user.id, role: req.user.role } : null
  };

  const exceptionEntry = {
    id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    source,
    message,
    context,
    resolved: false,
    created_at: new Date().toISOString()
  };

  try {
    if (isSupabaseConfigured()) {
      await supabase.from('exceptions').insert([exceptionEntry]);
    } else {
      mockDb.exceptions.unshift(exceptionEntry);
    }
  } catch (logErr) {
    console.warn('Failed to persist exception log:', logErr.message);
  }

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: message,
    code: err.code || 'SERVER_ERROR',
    timestamp: new Date().toISOString()
  });
};
