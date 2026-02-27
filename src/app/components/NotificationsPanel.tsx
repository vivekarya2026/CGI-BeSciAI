/**
 * ============================================
 * 🔔 NOTIFICATIONS PANEL — NotificationsPanel.tsx
 * ============================================
 * 
 * This component manages the dropdown list of alerts that appears 
 * when the user clicks the bell icon in the sidebar or header.
 * 
 * CORE FEATURES:
 * 1. Unread Badge: Shows a red dot with the count of new notifications.
 * 2. Categories: Distinguishes between Achievements, Social, and Learning updates.
 * 3. Actions: Each notification can have a "Quick Action" (like 'Reply' or 'Start Learning').
 * 4. Filtering: Users can toggle between seeing "All" or just "Unread" alerts.
 * 
 * HINT FOR BEGINNERS:
 * We use `useEffect` to detect "clicks outside" of the panel. 
 * If you click anywhere else on the screen while the panel is open, 
 * it will automatically close!
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, X, Check, CheckCheck, BookOpen, Award, Users, MessageSquare,
  Zap, Heart, Calendar, ChevronRight, Trash2,
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
const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  achievement: { icon: <Award size={16} />, color: '#f59e0b', bg: '#fef3c7' },
  learning: { icon: <BookOpen size={16} />, color: '#5236ab', bg: '#f2f1f9' },
  social: { icon: <Heart size={16} />, color: '#e31937', bg: '#fce8eb' },
  community: { icon: <MessageSquare size={16} />, color: '#14b8a6', bg: '#ccfbf1' },
  message: { icon: <MessageSquare size={16} />, color: '#5236ab', bg: '#f2f1f9' },
};

export function NotificationsPanel({ onNavigate }: { onNavigate?: (path: string) => void }) {
  // --- Local State ---
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  // Mock initial notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', type: 'message', title: 'New message from Sarah K.', description: 'Hey! I saw your workflow — can we chat?', time: '5 min ago', read: false, avatar: '👩‍💻', actionLabel: 'Reply' },
    { id: 'n2', type: 'achievement', title: 'Badge Unlocked!', description: 'You earned "Fast Learner" for your module progress.', time: '1 hour ago', read: false, actionLabel: 'View' },
  ]);

  // Calculations for UI badges
  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredList = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  // -- Click Outside Logic --
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ============================================
  // SECTION: RENDER UI
  // ============================================

  return (
    <div className="relative" ref={panelRef}>

      {/* 🔔 THE TRIGGER (Bell Button) */}
      <motion.button
        whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border border-gray-100 bg-white"
      >
        <Bell size={18} className={isOpen ? 'text-[#5236ab]' : 'text-gray-500'} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* 📥 THE DROPDOWN PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl z-[100] border border-gray-100 overflow-hidden"
          >
            {/* Header Area */}
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
              <span className="font-bold text-[#151515]">Notifications</span>
              <button
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className="text-xs font-semibold text-[#5236ab] cursor-pointer"
              >
                Mark all as read
              </button>
            </div>

            {/* List Body */}
            <div className="max-height-[400px] overflow-y-auto">
              {filteredList.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm">No new notifications</div>
              ) : (
                filteredList.map((item) => {
                  const config = typeConfig[item.type];
                  return (
                    <div
                      key={item.id}
                      className={`flex gap-3 p-4 border-b border-gray-50 transition-colors ${item.read ? 'opacity-60' : 'bg-purple-50/30'}`}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.bg, color: config.color }}>
                        {item.avatar || config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-[#151515] mb-0.5">{item.title}</div>
                        <p className="text-xs text-gray-500 truncate mb-1">{item.description}</p>
                        <span className="text-[10px] text-gray-400">{item.time}</span>
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
