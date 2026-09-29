import { supabase, isSupabaseConfigured, mockDb } from '../lib/supabase.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // Default to guest or unauthenticated
      req.user = null;
      return next();
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    // Check demo quick-login tokens
    if (token.startsWith('demo-token-')) {
      const role = token.replace('demo-token-', '');
      const profile = mockDb.profiles.find((p) => p.role === role);
      if (profile) {
        req.user = { ...profile };
        return next();
      }
    }

    // If Supabase is configured with real keys, verify JWT with Supabase
    if (isSupabaseConfigured() && token && !token.startsWith('mock-')) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: 'Invalid or expired authentication session' });
      }

      // Query profile for role
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || user.email,
        role: profile?.role || 'citizen',
        department: profile?.department || null,
        citizen_id: profile?.citizen_id || null,
      };
      return next();
    }

    // Fallback: match by email or role from mock database
    const matchedProfile = mockDb.profiles.find(
      (p) => token.includes(p.role) || token.includes(p.email) || token === p.id
    );

    if (matchedProfile) {
      req.user = { ...matchedProfile };
      return next();
    }

    // Default authenticated citizen if token present
    req.user = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'citizen@setulink.gov.in',
      full_name: 'Rahul Sharma (Citizen)',
      role: 'citizen',
      department: null,
      citizen_id: 'CIT-100000000001',
    };

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    next(err);
  }
};
