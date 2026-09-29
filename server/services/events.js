import { supabase, isSupabaseConfigured, mockDb } from '../lib/supabase.js';

/**
 * Emit a business event, store in events log, and deliver citizen notifications
 */
export const emitEvent = async (type, payload) => {
  const eventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const eventRecord = {
    id: eventId,
    type,
    payload,
    processed: false,
    created_at: new Date().toISOString()
  };

  try {
    if (isSupabaseConfigured()) {
      await supabase.from('events').insert([eventRecord]);
    } else {
      mockDb.events.unshift(eventRecord);
    }
  } catch (err) {
    console.warn('Failed to insert event record:', err.message);
  }

  // Generate in-app notification if target user is known
  const targetUserId = payload.citizen_id || payload.userId || payload.actorId;
  const message = payload.message || `SetuLink notification: ${type.replace(/_/g, ' ')}`;

  if (targetUserId) {
    await createNotification(targetUserId, message);
  }

  // Mark processed
  eventRecord.processed = true;
  return eventRecord;
};

/**
 * Creates in-app notification for citizen / user
 */
export const createNotification = async (userId, message) => {
  const notificationEntry = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    user_id: userId,
    message,
    read: false,
    created_at: new Date().toISOString()
  };

  try {
    if (isSupabaseConfigured()) {
      await supabase.from('notifications').insert([notificationEntry]);
    } else {
      mockDb.notifications.unshift(notificationEntry);
    }
  } catch (err) {
    console.warn('Failed to insert notification:', err.message);
  }

  return notificationEntry;
};
