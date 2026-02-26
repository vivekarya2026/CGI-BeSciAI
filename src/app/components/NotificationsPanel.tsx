import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, X, Check, CheckCheck, BookOpen, Award, Users, MessageSquare,
  Zap, Heart, Calendar, ChevronRight, Trash2,
} from 'lucide-react';

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

const defaultNotifications: Notification[] = [
  {
    id: 'n1', type: 'message', title: 'New message from Sarah K.',
    description: 'Hey! I saw your workflow — can we chat about prompt techniques?',
    time: '5 min ago', read: false, avatar: '👩‍💻', actionLabel: 'Reply',
  },
  {
    id: 'n2', type: 'achievement', title: 'Badge Unlocked!',
    description: 'You earned the "Fast Learner" badge for completing 3 modules this week.',
    time: '1 hour ago', read: false, actionLabel: 'View Badge',
  },
  {
    id: 'n3', type: 'learning', title: 'New Module Available',
    description: '"AI-Powered Data Analysis" is now unlocked on your learning path.',
    time: '2 hours ago', read: false, actionLabel: 'Start Learning',
  },
  {
    id: 'n4', type: 'social', title: 'Mike R. liked your workflow',
    description: 'Your "Email Triage Automation" workflow received a new like.',
    time: '3 hours ago', read: true, avatar: '👨‍🔬',
  },
  {
    id: 'n5', type: 'community', title: 'New reply in "Prompt Engineering"',
    description: 'Priya S. replied to your thread: "Best practices for chain-of-thought prompting"',
    time: '4 hours ago', read: true, avatar: '👩‍🎨', actionLabel: 'View Thread',
  },
  {
    id: 'n6', type: 'system', title: 'Weekly Report Ready',
    description: 'Your AI adoption progress report for this week is available.',
    time: '6 hours ago', read: true, actionLabel: 'View Report',
  },
  {
    id: 'n7', type: 'social', title: 'Dr. Emily Chen accepted your connection',
    description: 'You can now message Dr. Emily Chen directly.',
    time: 'Yesterday', read: true, avatar: '👩‍🏫', actionLabel: 'Send Message',
  },
  {
    id: 'n8', type: 'learning', title: 'Daily Challenge Available',
    description: 'Today\'s 5-Minute Prompt Remix challenge is ready. +50 XP bonus!',
    time: 'Yesterday', read: true, actionLabel: 'Start Challenge',
  },
];

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  achievement: { icon: <Award size={16} />, color: '#f59e0b', bg: '#fef3c7' },
  learning: { icon: <BookOpen size={16} />, color: '#5236ab', bg: '#f2f1f9' },
  social: { icon: <Heart size={16} />, color: '#e31937', bg: '#fce8eb' },
  community: { icon: <MessageSquare size={16} />, color: '#14b8a6', bg: '#ccfbf1' },
  system: { icon: <Zap size={16} />, color: '#0ea5e9', bg: '#e0f2fe' },
  message: { icon: <MessageSquare size={16} />, color: '#5236ab', bg: '#f2f1f9' },
};

interface NotificationsPanelProps {
  onNavigate?: (path: string) => void;
}

export function NotificationsPanel({ onNavigate }: NotificationsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
        style={{
          backgroundColor: isOpen ? '#f2f1f9' : '#ffffff',
          border: '1px solid #e5e7eb',
        }}
        aria-label="Notifications"
      >
        <Bell size={18} style={{ color: isOpen ? '#5236ab' : '#5c5c5c' }} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1"
            style={{
              backgroundColor: '#e31937',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 700,
              lineHeight: '18px',
            }}
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 z-[100]"
            style={{
              width: 400,
              maxWidth: 'calc(100vw - 32px)',
              maxHeight: 520,
              borderRadius: 16,
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              fontFamily: 'var(--font-primary)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#151515', margin: 0 }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ fontSize: 12, fontWeight: 700, backgroundColor: '#fce8eb', color: '#e31937' }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors hover:bg-gray-50"
                    style={{ fontSize: 12, fontWeight: 600, color: '#5236ab' }}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 px-5 pt-3 pb-2">
              {(['all', 'unread'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                  style={{
                    fontSize: 13,
                    fontWeight: filter === f ? 600 : 400,
                    backgroundColor: filter === f ? '#5236ab' : 'transparent',
                    color: filter === f ? '#ffffff' : '#5c5c5c',
                  }}
                >
                  {f === 'all' ? 'All' : `Unread (${unreadCount})`}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#f2f1f9' }}>
                    <Bell size={24} style={{ color: '#5236ab' }} />
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#151515' }}>All caught up!</p>
                  <p style={{ fontSize: 14, color: '#767676' }}>No unread notifications</p>
                </div>
              ) : (
                filtered.map((notification, i) => {
                  const config = typeConfig[notification.type];
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex gap-3 px-5 py-3.5 transition-colors cursor-pointer group"
                      style={{
                        backgroundColor: notification.read ? 'transparent' : '#f8f7fc',
                        borderBottom: '1px solid #f3f4f6',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = notification.read ? 'transparent' : '#f8f7fc'; }}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.type === 'message' && onNavigate) {
                          onNavigate('/app/messages');
                          setIsOpen(false);
                        }
                      }}
                    >
                      {/* Icon / Avatar */}
                      <div className="shrink-0 mt-0.5">
                        {notification.avatar ? (
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: config.bg }}>
                            {notification.avatar}
                          </div>
                        ) : (
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: config.bg, color: config.color }}
                          >
                            {config.icon}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p style={{
                            fontSize: 14,
                            fontWeight: notification.read ? 400 : 700,
                            color: '#151515',
                            lineHeight: '18px',
                            margin: 0,
                          }}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: '#5236ab' }} />
                          )}
                        </div>
                        <p style={{ fontSize: 13, color: '#5c5c5c', lineHeight: '18px', margin: '2px 0 0' }} className="truncate">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span style={{ fontSize: 11, color: '#a8a8a8' }}>{notification.time}</span>
                          {notification.actionLabel && (
                            <button
                              className="cursor-pointer hover:underline"
                              style={{ fontSize: 12, fontWeight: 600, color: '#5236ab' }}
                              onClick={e => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                                if (notification.type === 'message' && onNavigate) {
                                  onNavigate('/app/messages');
                                  setIsOpen(false);
                                }
                              }}
                            >
                              {notification.actionLabel}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={e => { e.stopPropagation(); removeNotification(notification.id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded cursor-pointer hover:bg-gray-100 shrink-0 self-center"
                        aria-label="Remove notification"
                      >
                        <X size={14} className="text-gray-400" />
                      </button>
                    </motion.div>
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
