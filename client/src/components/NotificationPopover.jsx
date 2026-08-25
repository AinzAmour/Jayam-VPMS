import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  UserPlus,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut as LogOutIcon,
  Ban,
  ShieldCheck,
  Clock,
  CheckCheck,
} from 'lucide-react';
import activityService from '../services/activityService';
import StatefulButton from './StatefulButton';

const ACTION_CONFIG = {
  CREATED: { icon: UserPlus, label: 'Created', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  APPROVED: { icon: CheckCircle2, label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  REJECTED: { icon: XCircle, label: 'Rejected', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  CHECKED_IN: { icon: LogIn, label: 'Checked In', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  CHECKED_OUT: { icon: LogOutIcon, label: 'Checked Out', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  CANCELLED: { icon: Ban, label: 'Cancelled', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
};

const formatRelativeTime = (dateStr) => {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);
    const handler = (e) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
};

export const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState(() => {
    const saved = localStorage.getItem('jayam_vpms_notif_last_seen');
    return saved ? Number(saved) : 0;
  });

  const popoverRef = useRef(null);
  const buttonRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const unreadCount = activities.filter(
    (a) => new Date(a.timestamp).getTime() > lastSeenTimestamp
  ).length;

  // Fetch activities when popover opens
  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await activityService.getAll({ limit: 8 });
      setActivities(res.data?.records || []);
    } catch {
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchActivities();
    }
  }, [isOpen, fetchActivities]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    // Small artificial delay to demonstrate the StatefulButton flow
    await new Promise((r) => setTimeout(r, 300));
    const now = Date.now();
    setLastSeenTimestamp(now);
    localStorage.setItem('jayam_vpms_notif_last_seen', String(now));
  };

  const popoverMotion = prefersReduced
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, scale: 0.95, y: -4 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -4 },
        transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <div className="relative">
      {/* Bell trigger */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-[18px] h-[18px]" />
        {/* Unread dot */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        )}
      </button>

      {/* Popover panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            {...popoverMotion}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200/80 z-50 overflow-hidden"
            style={{ transformOrigin: 'top right' }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Activity Feed</h3>
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </div>

            {/* Activity list */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center py-10">
                  <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              )}

              {!isLoading && activities.length === 0 && (
                <div className="py-10 text-center">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No recent activity</p>
                </div>
              )}

              {!isLoading &&
                activities.map((activity) => {
                  const config = ACTION_CONFIG[activity.action] || ACTION_CONFIG.CREATED;
                  const ActionIcon = config.icon;
                  const isUnread = new Date(activity.timestamp).getTime() > lastSeenTimestamp;

                  return (
                    <div
                      key={activity._id}
                      className={`px-4 py-3 border-b border-slate-50 last:border-b-0 flex items-start gap-3 transition-colors duration-150 hover:bg-slate-50/60 ${
                        isUnread ? 'border-l-2 border-l-indigo-400 bg-indigo-50/30' : 'border-l-2 border-l-transparent'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <ActionIcon className={`w-3.5 h-3.5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{activity.passId}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 truncate">
                          {activity.performedByName}
                          {activity.remarks && (
                            <span className="text-slate-400"> — {activity.remarks.substring(0, 60)}</span>
                          )}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] text-slate-400 font-medium">
                            {formatRelativeTime(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Footer with mark-all-read */}
            {!isLoading && activities.length > 0 && (
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                <StatefulButton
                  onClick={handleMarkAllRead}
                  idleIcon={CheckCheck}
                  idleText="Mark all as read"
                  loadingText="Marking…"
                  successText="All caught up"
                  variant="ghost"
                  size="xs"
                  successDuration={400}
                  className="w-full text-slate-500 hover:text-indigo-600"
                  disabled={unreadCount === 0}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPopover;
