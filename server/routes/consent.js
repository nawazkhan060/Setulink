import express from 'express';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';
import { logAudit } from '../middleware/audit.js';

const router = express.Router();

// Get Consents & Access Logs for a Citizen
router.get('/:citizenId', async (req, res, next) => {
  try {
    const citizenId = req.params.citizenId;

    let consents = [];
    let accessLogs = [];

    if (isSupabaseConfigured()) {
      const { data: cData } = await supabase
        .from('consents')
        .select('*')
        .eq('citizen_id', citizenId);
      consents = cData || [];

      const { data: alData } = await supabase
        .from('access_logs')
        .select('*')
        .eq('citizen_id', citizenId)
        .order('created_at', { ascending: false });
      accessLogs = alData || [];
    } else {
      consents = mockDb.consents.filter((c) => c.citizen_id === citizenId);
      accessLogs = mockDb.access_logs.filter((al) => al.citizen_id === citizenId);
    }

    // Default 3 standard departments if none found
    const defaultDepts = ['Health', 'Transport', 'Municipal'];
    const completeConsents = defaultDepts.map((dept) => {
      const existing = consents.find((c) => c.department.toLowerCase() === dept.toLowerCase());
      if (existing) return existing;
      return {
        citizen_id: citizenId,
        department: dept,
        purpose: `${dept} service integration and cross-verification`,
        granted: true
      };
    });

    res.json({
      success: true,
      citizen_id: citizenId,
      consents: completeConsents,
      accessLogs
    });
  } catch (err) {
    next(err);
  }
});

// Toggle Consent for a Department
router.post('/toggle', async (req, res, next) => {
  try {
    const { citizen_id, department, granted, purpose } = req.body;
    const citizenId = citizen_id || req.user?.citizen_id || 'CIT-100000000001';

    let updatedConsent = null;

    if (isSupabaseConfigured()) {
      const { data: existing } = await supabase
        .from('consents')
        .select('*')
        .eq('citizen_id', citizenId)
        .eq('department', department)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('consents')
          .update({ granted, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        updatedConsent = data;
      } else {
        const { data, error } = await supabase
          .from('consents')
          .insert([{
            citizen_id: citizenId,
            department,
            purpose: purpose || `${department} data sharing`,
            granted,
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
        if (error) throw error;
        updatedConsent = data;
      }
    } else {
      let existing = mockDb.consents.find(
        (c) => c.citizen_id === citizenId && c.department.toLowerCase() === department.toLowerCase()
      );
      if (existing) {
        existing.granted = granted;
        existing.updated_at = new Date().toISOString();
        updatedConsent = existing;
      } else {
        updatedConsent = {
          id: `c-${Date.now()}`,
          citizen_id: citizenId,
          department,
          purpose: purpose || `${department} data sharing`,
          granted,
          updated_at: new Date().toISOString()
        };
        mockDb.consents.push(updatedConsent);
      }
    }

    await logAudit(req, granted ? 'CONSENT_GRANTED' : 'CONSENT_REVOKED', `consents/${citizenId}/${department}`, {
      department,
      granted
    });

    res.json({
      success: true,
      message: `Consent for ${department} successfully ${granted ? 'granted' : 'revoked'}.`,
      consent: updatedConsent
    });
  } catch (err) {
    next(err);
  }
});

export default router;
