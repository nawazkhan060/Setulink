import express from 'express';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';
import { requireRole } from '../middleware/rbac.js';
import { logAudit } from '../middleware/audit.js';

const router = express.Router();

// List workflows with steps
router.get('/', async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('workflows')
        .select('*, steps:workflow_steps(*)')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return res.json({ success: true, workflows: data });
    }

    res.json({ success: true, workflows: mockDb.workflows });
  } catch (err) {
    next(err);
  }
});

// Admin Create Workflow
router.post('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { name, department, description, steps } = req.body;
    const workflowId = `wf-${Date.now()}`;

    const newWorkflow = {
      id: workflowId,
      name,
      department: department || 'Inter-Departmental',
      description: description || '',
      active: true,
      steps: (steps || []).map((s, index) => ({
        id: `step-${Date.now()}-${index}`,
        step_order: index + 1,
        name: s.name,
        role_required: s.role_required || 'clerk'
      }))
    };

    if (isSupabaseConfigured()) {
      await supabase.from('workflows').insert([{
        id: workflowId,
        name,
        department: newWorkflow.department,
        description: newWorkflow.description,
        active: true
      }]);

      if (newWorkflow.steps.length > 0) {
        await supabase.from('workflow_steps').insert(
          newWorkflow.steps.map((st) => ({
            id: st.id,
            workflow_id: workflowId,
            step_order: st.step_order,
            name: st.name,
            role_required: st.role_required
          }))
        );
      }
    } else {
      mockDb.workflows.push(newWorkflow);
    }

    await logAudit(req, 'CREATE_WORKFLOW', `workflows/${workflowId}`, { name, stepsCount: newWorkflow.steps.length });

    res.status(201).json({ success: true, workflow: newWorkflow });
  } catch (err) {
    next(err);
  }
});

// Admin Update Steps (add, reorder, remove)
router.put('/:id/steps', requireRole('admin'), async (req, res, next) => {
  try {
    const workflowId = req.params.id;
    const { steps } = req.body; // array of { id, name, role_required, step_order }

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ error: 'Steps array is required and must have at least 1 step.' });
    }

    const reorderedSteps = steps.map((s, i) => ({
      id: s.id || `step-${Date.now()}-${i}`,
      workflow_id: workflowId,
      step_order: i + 1,
      name: s.name,
      role_required: s.role_required || 'clerk'
    }));

    if (isSupabaseConfigured()) {
      await supabase.from('workflow_steps').delete().eq('workflow_id', workflowId);
      await supabase.from('workflow_steps').insert(reorderedSteps);
    } else {
      const wf = mockDb.workflows.find((w) => w.id === workflowId);
      if (wf) {
        wf.steps = reorderedSteps;
      }
    }

    await logAudit(req, 'UPDATE_WORKFLOW_STEPS', `workflows/${workflowId}`, {
      stepsCount: reorderedSteps.length
    });

    res.json({ success: true, message: 'Workflow steps updated successfully', steps: reorderedSteps });
  } catch (err) {
    next(err);
  }
});

export default router;
