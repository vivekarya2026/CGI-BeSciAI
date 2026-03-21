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
import clsx from 'clsx';

// Define the valid tab IDs for our sub-menu
type SubTab = 'info' | 'archetype' | 'goals' | 'progress' | 'workflows' | 'settings';

// Icon mapping to help us find the right icon for the current Archetype
const ICON_MAP: Record<string, any> = {
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
  const ArchIcon = arch ? ICON_MAP[arch.icon] : Mountain;

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
    <div className="font-primary">
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
            className="profile-avatar-container"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-[var(--app-brand)]" />
            )}
          </motion.div>
          <button className="profile-camera-btn">
            <Camera size={12} className="text-app-muted" />
          </button>
        </div>

        <div>
          <h1 className="profile-name">{user?.name || 'Alex Chen'}</h1>
          <p className="profile-email">{user?.email || 'alex@example.com'}</p>
          <div className="flex items-center gap-3 mt-2">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="archetype-badge"
              style={{ backgroundColor: `${arch?.color}15`, border: `1px solid ${arch?.color}30` }}
            >
              {ArchIcon && <ArchIcon size={14} style={{ color: arch?.color }} />}
              <span style={{ fontSize: 12, fontWeight: 600, color: arch?.color }}>{arch?.name}</span>
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="streak-badge"
            >
              <Flame size={12} className="text-orange-500" />
              <span className="streak-badge-text">{progress.streak} day streak</span>
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* SUB-TAB NAVIGATION BAR                      */}
      {/* ============================================ */}
      <div className="tab-nav-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx('tab-nav-item', {
              'tab-nav-active': activeTab === tab.id,
              'tab-nav-inactive': activeTab !== tab.id,
            })}
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
            <div className="card-surface-shadow rounded-xl p-6 mb-6 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary-border"
                >
                  <Edit3 size={14} /> Edit
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || 'Alex Chen'}
                    className="input-editable"
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    defaultValue={user?.email || 'alex@example.com'}
                    readOnly
                    className="input-readonly"
                  />
                </div>
                <div>
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    defaultValue="Product Manager"
                    className="input-editable"
                  />
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    defaultValue="Product & Innovation"
                    className="input-editable"
                  />
                </div>
              </div>

              {/* Company field */}
              <div className="mt-6">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  defaultValue="Acme Corp"
                  className="input-editable w-full sm:w-1/2"
                />
              </div>

              {/* Bio textarea */}
              <div className="mt-6">
                <label className="form-label">Bio</label>
                <textarea
                  placeholder="Tell us about yourself..."
                  className="textarea-editable"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-save-primary"
                >
                  Save Changes
                </motion.button>
                <button className="btn-cancel-secondary">
                  Cancel
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="card-surface-shadow rounded-xl p-6 transition-colors">
              <h2 className="section-title mb-6">Notification Preferences</h2>
              <div className="space-y-1">
                {([
                  { key: 'learningReminders' as const, label: 'Learning reminders', desc: 'Daily prompts to continue learning' },
                  { key: 'communityUpdates' as const, label: 'Community updates', desc: 'New discussions, replies, and mentions' },
                  { key: 'achievementAlerts' as const, label: 'Achievement alerts', desc: 'Badge unlocks and milestone completions' },
                  { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of your weekly progress' },
                ]).map((item) => (
                  <div key={item.key} className="notification-item">
                    <div>
                      <span className="notification-label">{item.label}</span>
                      <p className="notification-desc">{item.desc}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleNotification(item.key)}
                      className={clsx('toggle-switch', {
                        'toggle-switch-on': notifications[item.key],
                        'toggle-switch-off': !notifications[item.key],
                      })}
                    >
                      <motion.div
                        className="toggle-switch-knob"
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
            <div className="card-surface-shadow rounded-xl overflow-hidden mb-6 transition-colors">
              {/* Color Banner */}
              <motion.div
                className="archetype-color-bar"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ backgroundColor: arch.color }}
              />

              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="archetype-icon-container"
                    style={{ backgroundColor: arch.color }}
                  >
                    {ArchIcon && <ArchIcon size={28} />}
                  </motion.div>
                  <div>
                    <h2 className="archetype-name">{arch.name}</h2>
                    <p className="archetype-tagline" style={{ color: arch.color }}>"{arch.tagline}"</p>
                    <span
                      className="archetype-badge-small"
                      style={{ backgroundColor: `${arch.color}15`, color: arch.color }}
                    >
                      Self-Directed Learner
                    </span>
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="archetype-description mb-6"
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
                      className="trait-badge"
                    >
                      {trait}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="learning-style-box"
                >
                  <h4 className="learning-style-title">Learning Style</h4>
                  <p className="learning-style-desc">Structured, self-paced learning with clear metrics</p>
                </motion.div>
              </div>
            </div>

            {/* Retake Assessment */}
            <div className="card-surface-shadow rounded-xl p-6 transition-colors">
              <h3 className="section-title mb-2">Retake Assessment</h3>
              <p className="section-subtitle mb-4">
                Your archetype may change over time as you grow. Retaking the assessment will update your profile and learning path.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/survey')}
                className="retake-button"
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
            <div className="card-surface-shadow rounded-xl p-6 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">Current Goals</h2>
                <button className="btn-secondary-border">
                  Edit Goals
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="goal-primary-box"
                style={{ borderColor: 'var(--app-brand)40' }}
              >
                <span className="goal-label">PRIMARY GOAL</span>
                <h3 className="goal-title">Increase Productivity</h3>
                <p className="goal-description">
                  Automate tasks and save hours every week with AI tools.
                </p>

                <div className="progress-bar-container">
                  <motion.div
                    className="progress-bar-fill-brand"
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
                <span className="progress-text">45% toward goal</span>
              </motion.div>

              <div className="mb-6">
                <h4 className="focus-area-heading">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {['Writing & Communication', 'Data Analysis', 'Project Management'].map((area, i) => (
                    <motion.span
                      key={area}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="focus-area-tag"
                      style={{ border: '1px solid var(--app-brand)30' }}
                    >
                      {area}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="flex gap-8">
                <div>
                  <span className="timeline-label">Timeline</span>
                  <p className="timeline-value">8 weeks (4 remaining)</p>
                </div>
                <div>
                  <span className="timeline-label">Commitment</span>
                  <p className="timeline-value">Moderate (20 min/day)</p>
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
                { label: 'Current Streak', value: `${progress.streak} days`, icon: <Flame size={22} />, color: 'var(--warning-900)', bg: '#fff7ed' },
                { label: 'Total XP', value: progress.xp.toLocaleString(), icon: <Star size={22} />, color: 'var(--magenta-base)', bg: '#fce7f3' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  whileHover={{ y: -3 }}
                  className="stat-card-progress"
                >
                  <div className="stat-icon-container" style={{ backgroundColor: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className="stat-value"
                  >
                    {stat.value}
                  </motion.div>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Badges & Achievements */}
            <div className="card-surface-shadow rounded-xl p-6 transition-colors">
              <h2 className="section-title mb-6">Badges & Achievements</h2>
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
                    className={clsx({
                      'badge-earned': badge.earned,
                      'badge-locked': !badge.earned,
                    })}
                    style={{ border: `1px solid ${badge.earned ? 'var(--app-brand)20' : 'var(--app-border)'}` }}
                  >
                    <span className="badge-emoji">{badge.emoji}</span>
                    <span className={clsx('block leading-tight', {
                      'badge-name-earned': badge.earned,
                      'badge-name-locked': !badge.earned,
                    })}>
                      {badge.name}
                    </span>
                    <span className="badge-desc">
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
            <div className="card-surface-shadow rounded-xl p-6 mb-6 transition-colors">
              <h2 className="section-title mb-6">Bookmarked Resources</h2>
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
                    className="flex items-center gap-4 py-4 px-3 rounded-lg cursor-pointer border-bottom-app"
                  >
                    <div className="resource-icon-container">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="resource-title">{resource.title}</h4>
                      <span className="resource-meta">{resource.type}  ·  {resource.date}</span>
                    </div>
                    <ChevronRight size={18} className="text-app-hint" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Custom Prompts Empty State */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="empty-state-container"
            >
              <div className="empty-state-icon-container">
                <Zap size={28} className="text-[var(--app-brand)]" />
              </div>
              <h3 className="empty-state-title">No Custom Prompts Yet</h3>
              <p className="empty-state-desc">
                Start creating custom prompts from the Quick Wins section and they'll appear here.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/app/learn')}
                className="btn-save-primary"
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
              <div className="card-surface-shadow rounded-xl p-6 transition-colors">
                <div className="support-icon-container">
                  <Eye size={20} className="text-app-secondary" />
                  <h3 className="support-title">Privacy Controls</h3>
                </div>

                {/* Profile Visibility */}
                <div className="privacy-item">
                  <div>
                    <span className="privacy-label">Profile Visibility</span>
                    <p className="privacy-desc">Who can see your profile</p>
                  </div>
                  <span className="privacy-value">
                    {privacy.profileVisibility}
                  </span>
                </div>

                {/* Show Activity */}
                <div className="privacy-item">
                  <div>
                    <span className="privacy-label">Show Activity</span>
                    <p className="privacy-desc">Display your learning activity to peers</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePrivacy('showActivity')}
                    className={clsx('toggle-switch', {
                      'toggle-switch-on': privacy.showActivity,
                      'toggle-switch-off': !privacy.showActivity,
                    })}
                  >
                    <motion.div
                      className="toggle-switch-knob"
                      animate={{ left: privacy.showActivity ? 24 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>

                {/* Show on Leaderboard */}
                <div className="privacy-item" style={{ borderBottom: 'none' }}>
                  <div>
                    <span className="privacy-label">Show on Leaderboard</span>
                    <p className="privacy-desc">Include your rank in community leaderboards</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePrivacy('showLeaderboard')}
                    className={clsx('toggle-switch', {
                      'toggle-switch-on': privacy.showLeaderboard,
                      'toggle-switch-off': !privacy.showLeaderboard,
                    })}
                  >
                    <motion.div
                      className="toggle-switch-knob"
                      animate={{ left: privacy.showLeaderboard ? 24 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              </div>

              {/* Appearance */}
              <div className="card-surface-shadow rounded-xl p-6 transition-colors">
                <h3 className="appearance-title">Appearance</h3>
                <p className="appearance-desc">Customize the look and feel of the application.</p>
                <div className="flex gap-3">
                  {themeOptions.map(opt => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setTheme(opt.value)}
                      className={clsx('theme-button', {
                        'theme-button-active': theme === opt.value,
                        'theme-button-inactive': theme !== opt.value,
                      })}
                    >
                      {opt.icon}
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Feedback & Support */}
              <div className="card-surface-shadow rounded-xl p-6 transition-colors">
                <div className="support-icon-container">
                  <HelpCircle size={20} className="text-app-secondary" />
                  <h3 className="support-title">Feedback & Support</h3>
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
                      className="support-button"
                    >
                      <span className="text-[var(--app-brand)]">{item.icon}</span>
                      <span className="support-button-label">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="danger-zone-container">
                <h3 className="danger-zone-title">Danger Zone</h3>

                {/* Export Data */}
                <div className="danger-item">
                  <div>
                    <span className="danger-label">Export Data</span>
                    <p className="danger-desc">Download all your data</p>
                  </div>
                  <button className="danger-button-export">
                    <Download size={14} /> Export
                  </button>
                </div>

                {/* Delete Account */}
                <div className="danger-item">
                  <div>
                    <span className="danger-label">Delete Account</span>
                    <p className="danger-desc">Permanently remove your account and all data</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="danger-button-delete"
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