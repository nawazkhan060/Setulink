import express from 'express';
import { connectorRegistry } from '../connectors/index.js';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';
import { logAudit } from '../middleware/audit.js';
import { evaluateMatch, registerConflictIfMismatch } from '../services/matching.js';

const router = express.Router();

router.get('/citizen/:id', async (req, res, next) => {
  const citizenId = req.params.id;
  const caller = req.user?.email || 'citizen@setulink.gov.in';

  try {
    // 1. Fetch Citizen Master Record
    let masterCitizen = null;
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('citizens_master')
        .select('*')
        .eq('citizen_id', citizenId)
        .maybeSingle();
      if (!error) masterCitizen = data;
    } else {
      masterCitizen = mockDb.citizens_master.find((c) => c.citizen_id === citizenId);
    }

    if (!masterCitizen) {
      return res.status(404).json({ error: `Citizen with ID ${citizenId} not found in Master Registry.` });
    }

    // 2. Fetch Citizen Consent Settings
    let consents = [];
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('consents')
        .select('*')
        .eq('citizen_id', citizenId);
      if (!error && data) consents = data;
    } else {
      consents = mockDb.consents.filter((c) => c.citizen_id === citizenId);
    }

    const consentMap = {};
    consents.forEach((c) => {
      consentMap[c.department.toLowerCase()] = c.granted;
    });

    // 3. Get Active Connectors
    const activeConnectors = await connectorRegistry.getActiveConnectors();

    // 4. Parallel Fan-out with Graceful Exception Catching
    const departmentalResults = [];
    const exceptionsEncountered = [];

    const fetchPromises = activeConnectors.map(async (connector) => {
      const deptKey = connector.department.toLowerCase();
      const hasConsent = consentMap[deptKey] !== false; // Default true unless explicitly revoked

      if (!hasConsent) {
        return {
          department: connector.department,
          status: 'consent_revoked',
          message: `Access to ${connector.department} records is blocked by citizen consent directive.`,
          record: null
        };
      }

      try {
        const commonRecord = await connector.fetchCitizenRecord(citizenId, masterCitizen);
        if (!commonRecord) {
          return {
            department: connector.department,
            status: 'not_found',
            message: `No record found in ${connector.department} silo.`,
            record: null
          };
        }

        // Run Match evaluation against Master
        const matchResult = evaluateMatch(masterCitizen, commonRecord);

        // Check and register conflict if discrepancies exist
        if (matchResult.status === 'needs_review') {
          await registerConflictIfMismatch(citizenId, connector.department, commonRecord, masterCitizen);
        }

        // Log to Access Logs
        const accessLogEntry = {
          id: `al-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          citizen_id: citizenId,
          accessed_by: caller,
          department: connector.department,
          purpose: 'Unified Citizen Profile Gateway Query',
          created_at: new Date().toISOString()
        };

        if (isSupabaseConfigured()) {
          await supabase.from('access_logs').insert([accessLogEntry]);
        } else {
          mockDb.access_logs.unshift(accessLogEntry);
        }

        return {
          department: connector.department,
          status: 'success',
          matchStatus: matchResult.status,
          matchScore: matchResult.score,
          format: connector.format.toUpperCase(),
          record: commonRecord
        };
      } catch (deptErr) {
        // Log to exceptions table and continue partial data return
        const exceptionRecord = {
          id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          source: connector.id,
          message: `Department Gateway Error (${connector.department}): ${deptErr.message}`,
          context: { citizenId, connector: connector.name, format: connector.format },
          resolved: false,
          created_at: new Date().toISOString()
        };

        if (isSupabaseConfigured()) {
          await supabase.from('exceptions').insert([exceptionRecord]);
        } else {
          mockDb.exceptions.unshift(exceptionRecord);
        }

        exceptionsEncountered.push({
          department: connector.department,
          error: deptErr.message
        });

        return {
          department: connector.department,
          status: 'error',
          message: `Failed to query ${connector.department}: ${deptErr.message}`,
          record: null
        };
      }
    });

    const results = await Promise.all(fetchPromises);

    // 5. Write to System Audit Log
    await logAudit(req, 'GATEWAY_FANOUT_QUERY', `citizen/${citizenId}`, {
      queriedDepartments: activeConnectors.map((c) => c.department),
      successfulDepartments: results.filter((r) => r.status === 'success').map((r) => r.department),
      exceptionsCount: exceptionsEncountered.length
    });

    // 6. Return Aggregated Unified View
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      citizen: masterCitizen,
      departments: results,
      meta: {
        activeConnectorsCount: activeConnectors.length,
        exceptionsEncountered,
        hasPartialFailure: exceptionsEncountered.length > 0
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
