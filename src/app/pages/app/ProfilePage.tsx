/**
 * ============================================
 * 👤 PROFILE PAGE — ProfilePage.tsx
 * ============================================
 * 
 * This page acts as the user's "Home Base" for their personal identity within the app.
 * It's divided into several sub-pages to manage different aspects of their profile.
 * 
 * 🗺️ SUB-TABS:
 * 1. Personal Info: Edit name, bio, job details and set notification preferences.
 * 2. My Archetype: A deep dive into their quiz results (The Trailblazer, etc).
 * 3. My Goals: View the goals set during the onboarding wizard.
 * 4. My Progress: Visual summary of badges earned and XP milestones.
 * 5. My Workflows: Collection of saved prompts and resources.
 * 6. Settings: Privacy controls, appearance, support, and danger zone.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Shield, Target, TrendingUp, FolderOpen, Settings,
  Mountain, Lamp, Network, Compass, Trophy, Lightbulb,
  Star, Zap, Award, Clock, Flame, BookOpen, Calendar,
  Edit3, Camera, Save, X, ChevronRight, Download, Share2,
  Bell, Eye, HelpCircle, ExternalLink, MessageSquare,
  Monitor, Sun, Moon,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useTheme, ThemeOption } from '../../context/ThemeContext';
import { archetypes } from '../../data/archetypes';

// Define the valid tab IDs for our sub-menu
type SubTab = 'info' | 'archetype' | 'goals' | 'progress' | 'workflows' | 'settings';

// Icon mapping to help us find the right icon for the current Archetype
const iconMap: Record<string, any> = {
  Mountain, Lamp, Network, Compass, Trophy, Lightbulb,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, archetype, progress } = useUser();
  const { theme, setTheme } = useTheme();

  // -- Local Page State --
  const [activeTab, setActiveTab] = useState<SubTab>('info');
  const [isEditing, setIsEditing] = useState(false);

  // Notification preferences with individual toggles
  const [notifications, setNotifications] = useState({
    learningReminders: true,
    communityUpdates: true,
    achievementAlerts: true,
    weeklyDigest: false,
  });

  // Privacy toggles
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'Public',
    showActivity: true,
    showLeaderboard: true,
  });

  // Look up full data for the current user's archetype
  const arch = archetype ? archetypes[archetype.toLowerCase()] : archetypes.trailblazer;
  const ArchIcon = arch ? iconMap[arch.icon] : Mountain;

  // Configuration for the tab navigation bar
  const tabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'archetype', label: 'My Archetype', icon: <Shield size={16} /> },
    { id: 'goals', label: 'My Goals', icon: <Target size={16} /> },
    { id: 'progress', label: 'My Progress', icon: <TrendingUp size={16} /> },
    { id: 'workflows', label: 'My Workflows', icon: <FolderOpen size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  // Toggle notification handler
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev: typeof notifications) => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle privacy handler
  const togglePrivacy = (key: 'showActivity' | 'showLeaderboard') => {
    setPrivacy((prev: typeof privacy) => ({ ...prev, [key]: !prev[key] }));
  };

  // Theme options
  const themeOptions: { value: ThemeOption; label: string; icon: React.ReactNode }[] = [
    { value: 'system', label: 'System', icon: <Monitor size={16} /> },
    { value: 'light', label: 'Light', icon: <Sun size={16} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
  ];

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* Top Banner Area with Avatar and Name */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
      >
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: 'var(--app-brand-light)' }}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={32} style={{ color: 'var(--app-brand)' }} />
            )}
          </motion.div>
          <button
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border-strong)' }}
          >
            <Camera size={12} style={{ color: 'var(--app-text-muted)' }} />
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--app-text-primary)' }}>{user?.name || 'Alex Chen'}</h1>
          <p style={{ fontSize: 14, color: 'var(--app-text-muted)' }}>{user?.email || 'alex@example.com'}</p>
          <div className="flex items-center gap-3 mt-2">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full cursor-default"
              style={{ backgroundColor: `${arch?.color}15`, border: `1px solid ${arch?.color}30` }}
            >
              {ArchIcon && <ArchIcon size={14} style={{ color: arch?.color }} />}
              <span style={{ fontSize: 12, fontWeight: 600, color: arch?.color }}>{arch?.name}</span>
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 cursor-default"
            >
              <Flame size={12} className="text-orange-500" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#ea580c' }}>{progress.streak} day streak</span>
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* SUB-TAB NAVIGATION BAR                      */}
      {/* ============================================ */}
      <div className="flex gap-1 rounded-xl p-1 mb-8 overflow-x-auto" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer"
            style={{
              fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 400,
              backgroundColor: activeTab === tab.id ? 'var(--app-tab-active-bg)' : 'transparent',
              color: activeTab === tab.id ? 'var(--app-brand)' : 'var(--app-text-secondary)',
              boxShadow: activeTab === tab.id ? 'var(--app-shadow)' : 'none',
            }}
          >
            {tab.icon}
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ============================================ */}
      {/* DYNAMIC SUB-PAGES CONTENT                   */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">

        {/* ========================================== */}
        {/* TAB 1: PERSONAL INFO                      */}
        {/* ========================================== */}
        {activeTab === 'info' && (
          <motion.div key="info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {/* Edit Profile Form */}
            <div className="rounded-xl p-6 mb-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }}>Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  style={{ fontSize: 14, color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-strong)' }}
                >
                  <Edit3 size={14} /> Edit
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>Full Name</label>
                  <input
                    type="text" defaultValue={user?.name || 'Alex Chen'}
                    className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
                    style={{ fontSize: 16, backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>Email</label>
                  <input
                    type="text" defaultValue={user?.email || 'alex@example.com'} readOnly
                    className="w-full px-4 py-3 rounded-lg outline-none"
                    style={{ fontSize: 16, backgroundColor: 'var(--app-input-readonly-bg)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-muted)' }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>Job Title</label>
                  <input
                    type="text" defaultValue="Product Manager"
                    className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
                    style={{ fontSize: 16, backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>Department</label>
                  <input
                    type="text" defaultValue="Product & Innovation"
                    className="w-full px-4 py-3 rounded-lg outline-none transition-colors"
                    style={{ fontSize: 16, backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }}
                  />
                </div>
              </div>

              {/* Company field */}
              <div className="mt-6">
                <label className="block mb-1.5" style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>Company</label>
                <input
                  type="text" defaultValue="Acme Corp"
                  className="w-full sm:w-1/2 px-4 py-3 rounded-lg outline-none transition-colors"
                  style={{ fontSize: 16, backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }}
                />
              </div>

              {/* Bio textarea */}
              <div className="mt-6">
                <label className="block mb-1.5" style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>Bio</label>
                <textarea
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-lg outline-none transition-colors resize-none"
                  style={{ fontSize: 16, minHeight: 100, backgroundColor: 'var(--app-input-bg)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-lg text-white font-semibold cursor-pointer"
                  style={{ backgroundColor: 'var(--app-brand)', fontSize: 14 }}
                >
                  Save Changes
                </motion.button>
                <button
                  className="px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors"
                  style={{ fontSize: 14, color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-strong)' }}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="rounded-xl p-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-6">Notification Preferences</h2>
              <div className="space-y-1">
                {([
                  { key: 'learningReminders' as const, label: 'Learning reminders', desc: 'Daily prompts to continue learning' },
                  { key: 'communityUpdates' as const, label: 'Community updates', desc: 'New discussions, replies, and mentions' },
                  { key: 'achievementAlerts' as const, label: 'Achievement alerts', desc: 'Badge unlocks and milestone completions' },
                  { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of your weekly progress' },
                ]).map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--app-border)' }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>{item.label}</span>
                      <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 2 }}>{item.desc}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleNotification(item.key)}
                      className="relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300"
                      style={{ backgroundColor: notifications[item.key] ? 'var(--app-brand)' : '#d1d5db' }}
                    >
                      <motion.div
                        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                        animate={{ left: notifications[item.key] ? 24 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 2: MY ARCHETYPE                       */}
        {/* ========================================== */}
        {activeTab === 'archetype' && arch && (
          <motion.div key="archetype" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="rounded-xl overflow-hidden mb-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
              {/* Color Banner */}
              <motion.div
                className="h-3"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ backgroundColor: arch.color, transformOrigin: 'left' }}
              />

              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: arch.color, color: 'white' }}
                  >
                    {ArchIcon && <ArchIcon size={28} />}
                  </motion.div>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-text-primary)' }}>{arch.name}</h2>
                    <p style={{ color: arch.color, fontWeight: 600, fontSize: 16, fontStyle: 'italic' }}>"{arch.tagline}"</p>
                    <span
                      className="inline-block mt-1 px-3 py-0.5 rounded-full"
                      style={{ backgroundColor: `${arch.color}15`, color: arch.color, fontSize: 12, fontWeight: 600 }}
                    >
                      Self-Directed Learner
                    </span>
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{ fontSize: 16, lineHeight: '28px', color: 'var(--app-text-secondary)' }}
                  className="mb-6"
                >
                  {arch.description}
                </motion.p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {arch.traits.map((trait, i) => (
                    <motion.div
                      key={trait}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-3 rounded-xl text-center font-semibold"
                      style={{ fontSize: 14, color: 'var(--app-text-primary)', backgroundColor: 'var(--app-surface-hover)', border: '1px solid var(--app-border)' }}
                    >
                      {trait}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: '#fef6e9', border: '1px solid #fde68a' }}
                >
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--app-text-primary)' }} className="mb-1">Learning Style</h4>
                  <p style={{ fontSize: 14, color: 'var(--app-text-secondary)' }}>Structured, self-paced learning with clear metrics</p>
                </motion.div>
              </div>
            </div>

            {/* Retake Assessment */}
            <div className="rounded-xl p-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">Retake Assessment</h3>
              <p style={{ fontSize: 14, color: 'var(--app-text-muted)', lineHeight: '22px' }} className="mb-4">
                Your archetype may change over time as you grow. Retaking the assessment will update your profile and learning path.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/survey')}
                className="px-5 py-2.5 rounded-lg border-2 font-semibold cursor-pointer"
                style={{ borderColor: 'var(--app-brand)', color: 'var(--app-brand)', fontSize: 14 }}
              >
                Retake Assessment
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 3: MY GOALS                           */}
        {/* ========================================== */}
        {activeTab === 'goals' && (
          <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="rounded-xl p-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }}>Current Goals</h2>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  style={{ fontSize: 14, color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-strong)' }}
                >
                  Edit Goals
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl p-5 mb-6"
                style={{ backgroundColor: 'var(--app-brand-light)', border: '2px dashed var(--app-brand)40' }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--app-brand)', letterSpacing: '0.5px' }}>PRIMARY GOAL</span>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--app-text-primary)' }} className="mt-2 mb-1">Increase Productivity</h3>
                <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', lineHeight: '22px' }} className="mb-4">
                  Automate tasks and save hours every week with AI tools.
                </p>

                <div className="h-3 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--app-surface)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'var(--app-brand)' }}
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
                <span style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>45% toward goal</span>
              </motion.div>

              <div className="mb-6">
                <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-3">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {['Writing & Communication', 'Data Analysis', 'Project Management'].map((area, i) => (
                    <motion.span
                      key={area}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="px-4 py-2 rounded-full"
                      style={{ fontSize: 13, fontWeight: 500, color: 'var(--app-brand)', backgroundColor: 'var(--app-brand-light)', border: '1px solid var(--app-brand)30' }}
                    >
                      {area}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="flex gap-8">
                <div>
                  <span style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>Timeline</span>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>8 weeks (4 remaining)</p>
                </div>
                <div>
                  <span style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>Commitment</span>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>Moderate (20 min/day)</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 4: MY PROGRESS                        */}
        {/* ========================================== */}
        {activeTab === 'progress' && (
          <motion.div key="progress" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Learning Hours', value: '24.5', icon: <Clock size={22} />, color: 'var(--app-brand)', bg: 'var(--app-brand-light)' },
                { label: 'Modules Completed', value: '3', icon: <BookOpen size={22} />, color: 'var(--app-brand)', bg: 'var(--app-brand-light)' },
                { label: 'Current Streak', value: `${progress.streak} days`, icon: <Flame size={22} />, color: '#ea580c', bg: '#fff7ed' },
                { label: 'Total XP', value: progress.xp.toLocaleString(), icon: <Zap size={22} />, color: '#eab308', bg: '#fefce8' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  whileHover={{ y: -3 }}
                  className="rounded-xl p-5 cursor-default transition-colors"
                  style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    style={{ fontSize: 28, fontWeight: 700, color: 'var(--app-text-primary)' }}
                  >
                    {stat.value}
                  </motion.div>
                  <span style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>{stat.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Badges & Achievements */}
            <div className="rounded-xl p-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-6">Badges & Achievements</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {[
                  { name: 'Early Adopter', desc: 'Joined the platform in the first month', emoji: '🎯', earned: true },
                  { name: 'Fast Learner', desc: 'Completed 3 modules in one week', emoji: '⚡', earned: true },
                  { name: 'Prompt Pro', desc: 'Master prompt engineering basics', emoji: '🎯', earned: false },
                  { name: 'Team Player', desc: 'Help 5 peers with their learning', emoji: '🤝', earned: false },
                  { name: 'Streak Master', desc: 'Maintain a 30-day streak', emoji: '🔥', earned: false },
                  { name: 'Innovator', desc: 'Share 3 original workflows', emoji: '💡', earned: false },
                ].map((badge, i) => (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                    whileHover={{ y: -4 }}
                    className="p-4 rounded-xl text-center cursor-default"
                    style={{
                      opacity: badge.earned ? 1 : 0.5,
                      backgroundColor: badge.earned ? 'var(--app-brand-light)' : 'var(--app-surface-hover)',
                      border: `1px solid ${badge.earned ? 'var(--app-brand)20' : 'var(--app-border)'}`,
                    }}
                  >
                    <span className="text-3xl block mb-2">{badge.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: badge.earned ? 'var(--app-brand)' : 'var(--app-text-hint)' }} className="block leading-tight">
                      {badge.name}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--app-text-hint)', lineHeight: '14px' }} className="block mt-1">
                      {badge.desc}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 5: MY WORKFLOWS                       */}
        {/* ========================================== */}
        {activeTab === 'workflows' && (
          <motion.div key="workflows" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="rounded-xl p-6 mb-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-6">Bookmarked Resources</h2>
              <div className="space-y-1">
                {[
                  { title: 'Email Writing Prompt Template', type: 'Template', date: 'Saved Feb 20', icon: <FolderOpen size={18} /> },
                  { title: 'AI Data Analysis Tutorial', type: 'Video', date: 'Saved Feb 18', icon: <BookOpen size={18} /> },
                  { title: 'Best Practices Checklist', type: 'Guide', date: 'Saved Feb 15', icon: <BookOpen size={18} /> },
                ].map((resource, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 py-4 px-3 rounded-lg cursor-pointer"
                    style={{ borderBottom: '1px solid var(--app-border)' }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--app-brand-light)', color: 'var(--app-brand)' }}>
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>{resource.title}</h4>
                      <span style={{ fontSize: 13, color: 'var(--app-text-hint)' }}>{resource.type}  ·  {resource.date}</span>
                    </div>
                    <ChevronRight size={18} style={{ color: 'var(--app-text-hint)' }} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Custom Prompts Empty State */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl p-8 text-center transition-colors"
              style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--app-brand-light)' }}>
                <Zap size={28} style={{ color: 'var(--app-brand)' }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--app-text-primary)' }} className="mb-2">No Custom Prompts Yet</h3>
              <p style={{ fontSize: 14, color: 'var(--app-text-muted)', lineHeight: '22px', maxWidth: 360 }} className="mx-auto mb-5">
                Start creating custom prompts from the Quick Wins section and they'll appear here.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/app/learn')}
                className="px-6 py-3 rounded-lg text-white font-semibold cursor-pointer"
                style={{ backgroundColor: 'var(--app-brand)', fontSize: 14 }}
              >
                Explore Quick Wins
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* TAB 6: SETTINGS                           */}
        {/* ========================================== */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="space-y-6">

              {/* Privacy Controls */}
              <div className="rounded-xl p-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <Eye size={20} style={{ color: 'var(--app-text-secondary)' }} />
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--app-text-primary)' }}>Privacy Controls</h3>
                </div>

                {/* Profile Visibility */}
                <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--app-border)' }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>Profile Visibility</span>
                    <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 2 }}>Who can see your profile</p>
                  </div>
                  <span
                    className="px-4 py-1.5 rounded-lg"
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--app-text-secondary)', backgroundColor: 'var(--app-surface-hover)', border: '1px solid var(--app-border-strong)' }}
                  >
                    {privacy.profileVisibility}
                  </span>
                </div>

                {/* Show Activity */}
                <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--app-border)' }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>Show Activity</span>
                    <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 2 }}>Display your learning activity to peers</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePrivacy('showActivity')}
                    className="relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300"
                    style={{ backgroundColor: privacy.showActivity ? 'var(--app-brand)' : '#d1d5db' }}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                      animate={{ left: privacy.showActivity ? 24 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>

                {/* Show on Leaderboard */}
                <div className="flex items-center justify-between py-4">
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>Show on Leaderboard</span>
                    <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 2 }}>Include your rank in community leaderboards</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePrivacy('showLeaderboard')}
                    className="relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300"
                    style={{ backgroundColor: privacy.showLeaderboard ? 'var(--app-brand)' : '#d1d5db' }}
                  >
                    <motion.div
                      className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                      animate={{ left: privacy.showLeaderboard ? 24 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              </div>

              {/* Appearance */}
              <div className="rounded-xl p-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--app-text-primary)' }} className="mb-2">Appearance</h3>
                <p style={{ fontSize: 14, color: 'var(--app-text-muted)' }} className="mb-5">Customize the look and feel of the application.</p>
                <div className="flex gap-3">
                  {themeOptions.map(opt => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setTheme(opt.value)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200"
                      style={{
                        fontSize: 14,
                        backgroundColor: theme === opt.value ? 'var(--app-brand)' : 'transparent',
                        color: theme === opt.value ? '#ffffff' : 'var(--app-text-secondary)',
                        border: theme === opt.value ? '2px solid var(--app-brand)' : '2px solid var(--app-border-strong)',
                      }}
                    >
                      {opt.icon}
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Feedback & Support */}
              <div className="rounded-xl p-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <HelpCircle size={20} style={{ color: 'var(--app-text-secondary)' }} />
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--app-text-primary)' }}>Feedback & Support</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Submit Feedback', icon: <MessageSquare size={18} /> },
                    { label: 'Contact Support', icon: <HelpCircle size={18} /> },
                    { label: 'FAQ', icon: <ExternalLink size={18} /> },
                    { label: 'Feature Requests', icon: <Lightbulb size={18} /> },
                  ].map((item, i) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors text-left"
                      style={{ border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }}
                    >
                      <span style={{ color: 'var(--app-brand)' }}>{item.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-xl p-6 transition-colors" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid #fecaca', boxShadow: 'var(--app-shadow)' }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#dc2626' }} className="mb-5">Danger Zone</h3>

                {/* Export Data */}
                <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--app-border)' }}>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>Export Data</span>
                    <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 2 }}>Download all your data</p>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--app-text-secondary)', border: '1px solid var(--app-border-strong)' }}
                  >
                    <Download size={14} /> Export
                  </button>
                </div>

                {/* Delete Account */}
                <div className="flex items-center justify-between py-4">
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>Delete Account</span>
                    <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 2 }}>Permanently remove your account and all data</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-lg cursor-pointer font-semibold"
                    style={{ fontSize: 13, backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                  >
                    Delete Account
                  </motion.button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}