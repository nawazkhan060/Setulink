import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseClientConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

const DEMO_USERS = {
  citizen: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'citizen@setulink.gov.in',
    full_name: 'Rahul Sharma (Citizen)',
    role: 'citizen',
    department: null,
    citizen_id: 'CIT-100000000001'
  },
  clerk: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'clerk@setulink.gov.in',
    full_name: 'Sunita Rao (Verification Clerk)',
    role: 'clerk',
    department: 'Inter-Departmental',
    citizen_id: null
  },
  officer: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'officer@setulink.gov.in',
    full_name: 'Rajesh K. Varma (Approving Officer)',
    role: 'officer',
    department: 'Inter-Departmental',
    citizen_id: null
  },
  admin: {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'admin@setulink.gov.in',
    full_name: 'System Administrator',
    role: 'admin',
    department: 'NIC / SetuLink Central',
    citizen_id: null
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('setulink_current_user');
    return cached ? JSON.parse(cached) : DEMO_USERS.citizen;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no token exists, set demo citizen token
    if (!localStorage.getItem('setulink_auth_token')) {
      localStorage.setItem('setulink_auth_token', 'demo-token-citizen');
      localStorage.setItem('setulink_current_user', JSON.stringify(DEMO_USERS.citizen));
    }
  }, []);

  const quickLogin = (role) => {
    const targetUser = DEMO_USERS[role] || DEMO_USERS.citizen;
    localStorage.setItem('setulink_auth_token', `demo-token-${role}`);
    localStorage.setItem('setulink_current_user', JSON.stringify(targetUser));
    setUser(targetUser);
    return targetUser;
  };

  const loginWithCredentials = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseClientConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        localStorage.setItem('setulink_auth_token', data.session.access_token);
        
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const loggedInUser = {
          id: data.user.id,
          email: data.user.email,
          full_name: profile?.full_name || data.user.email,
          role: profile?.role || 'citizen',
          department: profile?.department,
          citizen_id: profile?.citizen_id
        };

        localStorage.setItem('setulink_current_user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return loggedInUser;
      } else {
        // Fallback demo matching
        const found = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
        const target = found || DEMO_USERS.citizen;
        return quickLogin(target.role);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseClientConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('setulink_auth_token');
    localStorage.removeItem('setulink_current_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, quickLogin, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
