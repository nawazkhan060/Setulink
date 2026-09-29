import React, { useState } from 'react';
import { Bell, Check, Info } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-gov-700 hover:bg-slate-100 rounded-lg transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-800 text-sm">Notifications & Events</span>
            <span className="text-xs bg-gov-100 text-gov-800 font-medium px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-xs transition flex gap-3 items-start ${
                    n.read ? 'bg-white opacity-70' : 'bg-gov-50/60 font-medium'
                  }`}
                >
                  <Info className="w-4 h-4 text-gov-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-800 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-slate-400 hover:text-gov-600 p-1"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
