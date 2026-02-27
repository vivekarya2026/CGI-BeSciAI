/**
 * ============================================
 * 🔔 NOTIFICATIONS PANEL — NotificationsPanel.tsx
 * ============================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, X, CheckCheck, BookOpen, Award, Users, MessageSquare,
  Zap, Heart, Calendar, ChevronRight, ThumbsUp, Play,
} from 'lucide-react';

// --- Notification Interface ---
export interface Notification {
  id: string;
  type: 'achievement' | 'learning' | 'social' | 'community' | 'system' | 'message';
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
  actionLabel?: string;
  actionPath?: string;
}

// --- Icons & Colors for each Notification Type ---
const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; darkBg: string }> = {
  achievement: { icon: <Award size={18} />, color: '#f59e0b', bg: '#fef3c7', darkBg: '#3d2e0a' },
  learning: { icon: <BookOpen size={18} />, color: '#5236ab', bg: '#f2f1f9', darkBg: '#251f3a' },
  social: { icon: <ThumbsUp size={18} />, color: '#e31937', bg: '#fce8eb', darkBg: '#3a0d15' },
  community: { icon: <MessageSquare size={18} />, color: '#14b8a6', bg: '#ccfbf1', darkBg: '#0a2e29' },
  message: { icon: <MessageSquare size={18} />, color: '#5236ab', bg: '#f2f1f9', darkBg: '#251f3a' },
  system: { icon: <Zap size={18} />, color: '#0ea5e9', bg: '#e0f2fe', darkBg: '#0a2540' },
};

export function NotificationsPanel({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', type: 'message', title: 'New message from Sarah K.', description: 'Hey! I saw your workflow — can we chat about pr', time: '5 min ago', read: false, avatar: '👩‍💻', actionLabel: 'Reply', actionPath: '/app/messages' },
    { id: 'n2', type: 'achievement', title: 'Badge Unlocked!', description: 'You earned the "Fast Learner" badge for complet', time: '1 hour ago', read: false, avatar: '🏅', actionLabel: 'View Badge', actionPath: '/app/profile' },
    { id: 'n3', type: 'learning', title: 'New Module Available', description: '"AI-Powered Data Analysis" is now unlocked on y', time: '2 hours ago', read: false, actionLabel: 'Start Learning', actionPath: '/app/learn' },
    { id: 'n4', type: 'social', title: 'Mike R. liked your workflow', description: 'Your "Email Triage Automation" workflow receiv', time: '3 hours ago', read: true, avatar: '👨‍🔬' },
    { id: 'n5', type: 'community', title: 'New reply in "Prompt Engineering"', description: 'Priya S. replied to your thread: "Best practices for', time: '4 hours ago', read: true, avatar: '👩‍🎨', actionLabel: 'View Thread', actionPath: '/app/community' },
    { id: 'n6', type: 'system', title: 'Weekly Report Ready', description: 'Your AI adoption progress report for this week is a', time: '6 hours ago', read: true, actionLabel: 'View Report' },
    { id: 'n7', type: 'social', title: 'Dr. Emily Chen accepted your connection', description: 'You can now message Dr. Emily Chen directly.', time: 'Yesterday', read: true, avatar: '👩‍🏫', actionLabel: 'Send Message', actionPath: '/app/messages' },
    { id: 'n8', type: 'learning', title: 'Daily Challenge Available', description: "Today's 5-Minute Prompt Remix challenge is reac", time: 'Yesterday', read: true, actionLabel: 'Start Challenge', actionPath: '/app/learn' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredList = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleAction = (n: Notification) => {
    // Mark as read when action is clicked
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
    if (n.actionPath && onNavigate) {
      onNavigate(n.actionPath);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>

      {/* 🔔 Bell Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all"
        style={{ border: '1px solid var(--app-border)', backgroundColor: 'var(--app-surface)' }}
      >
        <Bell size={18} style={{ color: isOpen ? '#5236ab' : 'var(--app-text-muted)' }} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* 📥 Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute right-0 top-full mt-2 rounded-2xl shadow-2xl z-[100] overflow-hidden"
            style={{
              backgroundColor: 'var(--app-surface)',
              border: '1px solid var(--app-border)',
              width: 400,
              maxWidth: 'calc(100vw - 32px)',
            }}
          >
            {/* ---- Header ---- */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--app-text-primary)', margin: 0 }}>
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-full text-white font-bold"
                      style={{ fontSize: 11, backgroundColor: '#5236ab' }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-80"
                  style={{ fontSize: 13, fontWeight: 600, color: 'var(--app-brand)' }}
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              </div>

              {/* ---- Filter Tabs ---- */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className="px-4 py-1.5 rounded-full cursor-pointer transition-all"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    backgroundColor: filter === 'all' ? '#5236ab' : 'var(--app-tab-bg)',
                    color: filter === 'all' ? 'white' : 'var(--app-text-muted)',
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className="px-4 py-1.5 rounded-full cursor-pointer transition-all"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    backgroundColor: filter === 'unread' ? '#5236ab' : 'var(--app-tab-bg)',
                    color: filter === 'unread' ? 'white' : 'var(--app-text-muted)',
                  }}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {/* ---- Scrollable Notification List ---- */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: 420, borderTop: '1px solid var(--app-border)' }}
            >
              {filteredList.length === 0 ? (
                <div className="p-10 text-center" style={{ color: 'var(--app-text-hint)' }}>
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  <p style={{ fontSize: 14 }}>No notifications</p>
                </div>
              ) : (
                filteredList.map((item) => {
                  const config = typeConfig[item.type] || typeConfig.system;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3.5 px-5 py-4 transition-colors cursor-pointer"
                      style={{
                        borderBottom: '1px solid var(--app-border)',
                        backgroundColor: !item.read ? 'var(--app-brand-light)' : 'transparent',
                      }}
                      onClick={() => {
                        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
                      }}
                    >
                      {/* Icon / Avatar */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: config.bg, color: config.color }}
                      >
                        {item.avatar ? (
                          <span style={{ fontSize: 18 }}>{item.avatar}</span>
                        ) : (
                          config.icon
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className="truncate"
                            style={{
                              fontSize: 14,
                              fontWeight: !item.read ? 700 : 600,
                              color: 'var(--app-text-primary)',
                              margin: 0,
                              lineHeight: '20px',
                            }}
                          >
                            {item.title}
                          </h4>
                          {/* Unread dot */}
                          {!item.read && (
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                              style={{ backgroundColor: '#5236ab' }}
                            />
                          )}
                        </div>

                        <p
                          className="truncate"
                          style={{
                            fontSize: 13,
                            color: 'var(--app-text-muted)',
                            margin: '2px 0 0',
                            lineHeight: '18px',
                          }}
                        >
                          {item.description}
                        </p>

                        {/* Time + Action */}
                        <div className="flex items-center gap-3 mt-1.5">
                          <span style={{ fontSize: 12, color: 'var(--app-text-hint)' }}>
                            {item.time}
                          </span>
                          {item.actionLabel && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(item);
                              }}
                              className="cursor-pointer hover:underline"
                              style={{ fontSize: 12, fontWeight: 700, color: 'var(--app-brand)' }}
                            >
                              {item.actionLabel}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
