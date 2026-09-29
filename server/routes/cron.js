import express from 'express';
import { mockDb, isSupabaseConfigured, supabase } from '../lib/supabase.js';

const router = express.Router();

// Dispatch cron handler for event processing
router.get('/dispatch', async (req, res, next) => {
  const authSecret = req.headers['authorization']?.replace(/^Bearer\s+/i, '') || req.query.secret;
  const expectedSecret = process.env.CRON_SECRET || 'setulink-cron-secret-2026';

  if (authSecret !== expectedSecret && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized cron dispatch trigger' });
  }

  try {
    let unprocessedCount = 0;

    if (isSupabaseConfigured()) {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('processed', false)
        .limit(50);

      if (!error && events?.length) {
        unprocessedCount = events.length;
        const ids = events.map((e) => e.id);
        await supabase.from('events').update({ processed: true }).in('id', ids);
      }
    } else {
      const unproc = mockDb.events.filter((e) => !e.processed);
      unprocessedCount = unproc.length;
      unproc.forEach((e) => {
        e.processed = true;
      });
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      processedEventsCount: unprocessedCount,
      message: `Cron job executed successfully. Dispatched ${unprocessedCount} pending system events.`
    });
  } catch (err) {
    next(err);
  }
});

// Notifications Route (used by in-app notification bell)
router.get('/notifications', async (req, res, next) => {
  try {
    const userId = req.user?.citizen_id || req.user?.id || req.query.userId || 'CIT-100000000001';
    let notifs = [];

    if (isSupabaseConfigured()) {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      notifs = data || [];
    } else {
      notifs = mockDb.notifications.filter((n) => n.user_id === userId || n.user_id === 'CIT-100000000001');
    }

    res.json({
      success: true,
      notifications: notifs,
      unreadCount: notifs.filter((n) => !n.read).length
    });
  } catch (err) {
    next(err);
  }
});

router.post('/notifications/:id/read', async (req, res, next) => {
  try {
    const notifId = req.params.id;
    if (isSupabaseConfigured()) {
      await supabase.from('notifications').update({ read: true }).eq('id', notifId);
    } else {
      const item = mockDb.notifications.find((n) => n.id === notifId);
      if (item) item.read = true;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
