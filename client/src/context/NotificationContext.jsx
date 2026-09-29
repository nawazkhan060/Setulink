import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { supabase, isSupabaseClientConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications(user?.citizen_id || user?.id);
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Supabase Realtime Listener on 'notifications' table
    if (isSupabaseClientConfigured() && user) {
      const channel = supabase
        .channel('realtime-notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          (payload) => {
            const newNotif = payload.new;
            if (newNotif.user_id === user.citizen_id || newNotif.user_id === user.id) {
              setNotifications((prev) => [newNotif, ...prev]);
              setUnreadCount((prev) => prev + 1);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Periodic fallback polling for demo
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
