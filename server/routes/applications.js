import express from 'express';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';
import { logAudit } from '../middleware/audit.js';
import { emitEvent } from '../services/events.js';

const router = express.Router();

// 1. List Applications
router.get('/', async (req, res, next) => {
  try {
    const user = req.user;
    let applications = [];

    if (isSupabaseConfigured()) {
      let query = supabase.from('applications').select('*, workflows(name, department, steps:workflow_steps(*))');
      if (user?.role === 'citizen' && user.citizen_id) {
        query = query.eq('citizen_id', user.citizen_id);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      applications = data || [];
    } else {
      applications = [...mockDb.applications];
      if (user?.role === 'citizen' && user.citizen_id) {
        applications = applications.filter((a) => a.citizen_id === user.citizen_id);
      }

      // Enrich with workflow steps
      applications = applications.map((app) => {
        const wf = mockDb.workflows.find((w) => w.id === app.workflow_id);
        const history = mockDb.application_history.filter((h) => h.application_id === app.id);
        return {
          ...app,
          workflows: wf || { name: 'Address Update', department: 'Inter-Departmental', steps: [] },
          history
        };
      });
    }

    res.json({ success: true, count: applications.length, applications });
  } catch (err) {
    next(err);
  }
});

// 2. Start New Application (Citizen)
router.post('/', async (req, res, next) => {
  try {
    const { workflow_id, citizen_id, data } = req.body;
    const effectiveCitizenId = citizen_id || req.user?.citizen_id || 'CIT-100000000001';
    const effectiveWorkflowId = workflow_id || 'a0000000-0000-0000-0000-000000000001';

    const appId = `b${Date.now().toString(16)}-${Math.random().toString(36).substr(2, 4)}`;

    const newApp = {
      id: appId,
      citizen_id: effectiveCitizenId,
      workflow_id: effectiveWorkflowId,
      current_step: 2, // moves to clerk verification after submission
      status: 'under_review',
      data: data || {
        new_address: 'Sample New Address, SetuLink Prototype',
        proof_type: 'Government ID Slip',
        reason: 'Relocation'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const historyEntry = {
      id: `h-${Date.now()}`,
      application_id: appId,
      step_name: 'Citizen Application',
      action: 'submitted',
      actor_id: req.user?.email || effectiveCitizenId,
      note: 'Application initiated and submitted for departmental verification.',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      await supabase.from('applications').insert([newApp]);
      await supabase.from('application_history').insert([historyEntry]);
    } else {
      mockDb.applications.unshift(newApp);
      mockDb.application_history.unshift(historyEntry);
    }

    // Emit event & notify
    await emitEvent('APPLICATION_SUBMITTED', {
      citizen_id: effectiveCitizenId,
      applicationId: appId,
      message: `Your application #${appId.slice(0, 8)} has been submitted and queued for Clerk Verification.`
    });

    await logAudit(req, 'SUBMIT_APPLICATION', `applications/${appId}`, {
      citizenId: effectiveCitizenId,
      workflowId: effectiveWorkflowId
    });

    res.status(201).json({ success: true, application: newApp, history: historyEntry });
  } catch (err) {
    next(err);
  }
});

// 3. Advance / Review Application (Clerk or Officer)
router.post('/:id/advance', async (req, res, next) => {
  try {
    const appId = req.params.id;
    const { action, note } = req.body; // action: 'approved' | 'rejected'
    const currentUser = req.user || { role: 'clerk', email: 'clerk@setulink.gov.in' };

    let app = null;
    let workflow = null;

    if (isSupabaseConfigured()) {
      const { data: appData } = await supabase.from('applications').select('*').eq('id', appId).single();
      app = appData;
      if (app) {
        const { data: wfData } = await supabase.from('workflows').select('*, steps:workflow_steps(*)').eq('id', app.workflow_id).single();
        workflow = wfData;
      }
    } else {
      app = mockDb.applications.find((a) => a.id === appId);
      if (app) {
        workflow = mockDb.workflows.find((w) => w.id === app.workflow_id);
      }
    }

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const steps = workflow?.steps || [
      { step_order: 1, name: 'Citizen Application', role_required: 'citizen' },
      { step_order: 2, name: 'Clerk Document Verification', role_required: 'clerk' },
      { step_order: 3, name: 'Officer Final Approval', role_required: 'officer' }
    ];

    const currentStepConfig = steps.find((s) => s.step_order === app.current_step);

    // Validate RBAC for current step
    if (currentStepConfig && currentUser.role !== 'admin' && currentUser.role !== currentStepConfig.role_required) {
      return res.status(403).json({
        error: `Unauthorized for current step "${currentStepConfig.name}". Required role: ${currentStepConfig.role_required}. Current user role: ${currentUser.role}.`
      });
    }

    let nextStep = app.current_step;
    let nextStatus = app.status;

    if (action === 'rejected') {
      nextStatus = 'rejected';
    } else if (action === 'approved') {
      if (app.current_step >= steps.length) {
        nextStatus = 'approved';
      } else {
        nextStep = app.current_step + 1;
        nextStatus = nextStep > steps.length ? 'approved' : 'under_review';
      }
    }

    const historyEntry = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      application_id: appId,
      step_name: currentStepConfig?.name || `Step ${app.current_step}`,
      action: action === 'rejected' ? 'rejected' : 'approved',
      actor_id: currentUser.email || currentUser.id,
      note: note || (action === 'rejected' ? 'Verification rejected by official.' : 'Verification passed and advanced.'),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      await supabase
        .from('applications')
        .update({
          current_step: nextStep,
          status: nextStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', appId);

      await supabase.from('application_history').insert([historyEntry]);
    } else {
      app.current_step = nextStep;
      app.status = nextStatus;
      app.updated_at = new Date().toISOString();
      mockDb.application_history.unshift(historyEntry);
    }

    // Citizen notification & event
    const statusMsg = nextStatus === 'approved' 
      ? `🎉 Congratulations! Your application #${appId.slice(0, 8)} has received Final Approval.`
      : nextStatus === 'rejected'
      ? `⚠️ Application #${appId.slice(0, 8)} was rejected. Note: ${note || 'Document criteria not met.'}`
      : `Application #${appId.slice(0, 8)} passed ${currentStepConfig?.name} and advanced to next verification stage.`;

    await emitEvent('WORKFLOW_STEP_TRANSITION', {
      citizen_id: app.citizen_id,
      applicationId: appId,
      action,
      nextStep,
      nextStatus,
      message: statusMsg
    });

    await logAudit(req, `WORKFLOW_${action.toUpperCase()}`, `applications/${appId}`, {
      step: currentStepConfig?.name,
      actor: currentUser.email,
      note
    });

    res.json({
      success: true,
      message: `Application updated successfully. Status: ${nextStatus}`,
      application: app,
      history: historyEntry
    });
  } catch (err) {
    next(err);
  }
});

export default router;
