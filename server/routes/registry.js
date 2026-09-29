import express from 'express';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';

const router = express.Router();

// List Citizens in Master Registry
router.get('/citizens', async (req, res, next) => {
  try {
    const { query } = req.query;
    let list = [];

    if (isSupabaseConfigured()) {
      let q = supabase.from('citizens_master').select('*').order('created_at', { ascending: false });
      if (query) {
        q = q.or(`name.ilike.%${query}%,citizen_id.ilike.%${query}%`);
      }
      const { data, error } = await q;
      if (error) throw error;
      list = data || [];
    } else {
      list = [...mockDb.citizens_master];
      if (query) {
        const lower = query.toLowerCase();
        list = list.filter(
          (c) => c.name.toLowerCase().includes(lower) || c.citizen_id.toLowerCase().includes(lower)
        );
      }
    }

    res.json({ success: true, count: list.length, citizens: list });
  } catch (err) {
    next(err);
  }
});

// Single Citizen details
router.get('/citizens/:id', async (req, res, next) => {
  try {
    const citizenId = req.params.id;
    let citizen = null;

    if (isSupabaseConfigured()) {
      const { data } = await supabase.from('citizens_master').select('*').eq('citizen_id', citizenId).maybeSingle();
      citizen = data;
    } else {
      citizen = mockDb.citizens_master.find((c) => c.citizen_id === citizenId);
    }

    if (!citizen) {
      return res.status(404).json({ error: 'Citizen not found in Master Registry' });
    }

    res.json({ success: true, citizen });
  } catch (err) {
    next(err);
  }
});

export default router;
