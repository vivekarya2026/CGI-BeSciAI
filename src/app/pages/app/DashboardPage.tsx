/**
 * ============================================
 * DASHBOARD PAGE — DashboardPage.tsx
 * ============================================
 * Gamified dashboard with CGI Design System 16.0.0
 * Layout: Header with stats, Resume card, Today's Challenge, Learning Journey, Sidebar updates
 */

import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Trophy, Flame, Star, CheckCircle2, Play, Clock, Target,
  Sparkles, Calendar, Bell, Users, FileText, MessageSquare,
  Video, ChevronRight,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { learningModules } from '../../data/archetypes';
import {
  microLearnings,
  challenges,
  officeHourLive,
  officeHourUpcoming,
} from '../../data/learnData';
import { NotificationsPanel } from '../../components/NotificationsPanel';
import {
  cardHoverMotion,
  primaryButtonMotion,
  secondaryButtonMotion,
  chipToggleMotion,
  staggerContainer,
} from '../../components/ui/motionPresets';

const LEARNING_JOURNEY_STAGES = [
  { id: 1, label: 'AI Basics', done: true },
  { id: 2, label: 'Prompt Engineering', done: true },
  { id: 3, label: 'Productivity', done: true },
  { id: 4, label: 'Automation', done: false, current: true },
  { id: 5, label: 'Advanced AI', done: false },
  { id: 6, label: 'AI Mastery', done: false },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, progress } = useUser();

  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Get current training module
  const currentModule = learningModules.find(m => !m.completed && !m.locked);
  const completionPct = currentModule ? ((currentModule as any).progress || 60) : 0;

  // Get today's challenge
  const dayIndex = Math.floor(Date.now() / 86400000);
  const todayChallenge = challenges[dayIndex % challenges.length];

  // Calculate journey progress
  const completedStages = LEARNING_JOURNEY_STAGES.filter(s => s.done).length;
  const journeyProgress = Math.round((completedStages / LEARNING_JOURNEY_STAGES.length) * 100);

  return (
    <div style={{ fontFamily: 'var(--font-primary)', backgroundColor: 'var(--app-bg)', minHeight: '100vh' }}>
      {/* ============================================ */}
      {/* HEADER SECTION */}
      {/* ============================================ */}
      <header className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--app-text-primary)' }}>
              {greeting}, {user?.name || 'Alex'}! 👋
            </h1>
            <p className="text-sm sm:text-base" style={{ color: 'var(--app-text-secondary)' }}>
              Ready to continue your learning journey today?
            </p>
          </div>
          <NotificationsPanel onNavigate={(path) => navigate(path)} />
        </div>

        {/* Stats Row - 4 Cards */}
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {/* Longest Streak */}
          <motion.div
            {...cardHoverMotion()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="rounded-xl p-4 sm:p-5 cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                <Trophy size={20} style={{ color: '#f59e0b' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
                  21
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--app-text-secondary)' }}>
              Longest streak
            </p>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            {...cardHoverMotion()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl p-4 sm:p-5 cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                <Flame size={20} style={{ color: '#ef4444' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
                  {progress.streak || 14}
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--app-text-secondary)' }}>
              Current streak
            </p>
          </motion.div>

          {/* XP */}
          <motion.div
            {...cardHoverMotion()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl p-4 sm:p-5 cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                <Star size={20} style={{ color: '#eab308' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
                  {progress.xp?.toLocaleString() || '1,850'}
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--app-text-secondary)' }}>
              XP
            </p>
          </motion.div>

          {/* Challenges Completed */}
          <motion.div
            {...cardHoverMotion()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl p-4 sm:p-5 cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
                  23
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--app-text-secondary)' }}>
              Challenges Completed
            </p>
          </motion.div>
        </motion.div>
      </header>

      {/* ============================================ */}
      {/* MAIN CONTENT - TWO COLUMN LAYOUT */}
      {/* ============================================ */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] lg:gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-5">
          {/* Resume Where You Left Off */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-5 md:p-6"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--app-text-primary)' }}>
              Resume Where You Left Off
            </h2>

            {currentModule ? (
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Module Image */}
                <div
                  className="w-full sm:w-32 h-32 rounded-lg shrink-0 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    position: 'relative',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={48} style={{ color: 'white', opacity: 0.9 }} />
                  </div>
                </div>

                {/* Module Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: 'var(--app-text-primary)' }}>
                      {currentModule.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--app-text-secondary)' }}>
                      {currentModule.category}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
                        {completionPct}% complete
                      </span>
                      <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
                        8 min remaining
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: '#8b5cf6' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Resume Button */}
                  <motion.button
                    {...primaryButtonMotion()}
                    onClick={() => navigate('/app/learn', { state: { mode: 'training' } })}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer self-start"
                    style={{ backgroundColor: '#8b5cf6', color: 'white' }}
                  >
                    <Play size={16} />
                    Resume Lesson
                  </motion.button>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--app-text-secondary)' }}>
                No active lessons. Start a new module from the Learn page!
              </p>
            )}
          </motion.section>

          {/* Today's Challenge */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl p-5 md:p-6"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: 'var(--app-text-primary)' }}>
              Today&apos;s Challenge
            </h2>

            <p className="text-sm mb-4" style={{ color: 'var(--app-text-secondary)' }}>
              Complete this to keep your streak going
            </p>

            {/* Challenge Card */}
            <motion.div
              {...cardHoverMotion()}
              className="rounded-xl p-5 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                border: '1px solid #d1d5db',
              }}
              onClick={() => navigate('/app/challenges')}
            >
              <div
                className="rounded-lg p-4 mb-4"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Target size={20} style={{ color: '#8b5cf6' }} />
                    <h3 className="text-base font-bold" style={{ color: 'var(--app-text-primary)' }}>
                      {todayChallenge?.title || 'Practice reflection exercise'}
                    </h3>
                  </div>
                </div>

                <p className="text-sm mb-3" style={{ color: 'var(--app-text-secondary)' }}>
                  {todayChallenge?.description || 'Reflect on your AI learning journey and identify key takeaways'}
                </p>

                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--app-text-muted)' }}>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} />
                    5 min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users size={14} />
                    {todayChallenge?.participants || 234} participants
                  </span>
                </div>
              </div>

              {/* Start Challenge Button */}
              <motion.button
                {...primaryButtonMotion()}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/app/challenges');
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm cursor-pointer"
                style={{ backgroundColor: '#8b5cf6', color: 'white' }}
              >
                <Play size={16} />
                Start Challenge
              </motion.button>
            </motion.div>
          </motion.section>

          {/* Your Learning Journey */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-5 md:p-6"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} style={{ color: '#8b5cf6' }} />
              <h2 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--app-text-primary)' }}>
                Your Learning Journey
              </h2>
            </div>

            <p className="text-sm mb-5" style={{ color: 'var(--app-text-secondary)' }}>
              You&apos;ll gain 6 new skills by completing this program
            </p>

            {/* Journey Timeline */}
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute top-5 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: '#f3f4f6', zIndex: 0 }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#8b5cf6' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${journeyProgress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                />
              </div>

              {/* Journey Stages */}
              <div className="relative flex justify-between" style={{ zIndex: 1 }}>
                {LEARNING_JOURNEY_STAGES.map((stage, idx) => (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex flex-col items-center"
                    style={{ flex: '0 0 auto' }}
                  >
                    {/* Stage Circle */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2 relative"
                      style={{
                        backgroundColor: stage.done ? '#8b5cf6' : stage.current ? '#8b5cf6' : '#ffffff',
                        border: `2px solid ${stage.done || stage.current ? '#8b5cf6' : '#e5e7eb'}`,
                        color: stage.done || stage.current ? '#ffffff' : '#9ca3af',
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {stage.done ? (
                        <CheckCircle2 size={20} />
                      ) : stage.current ? (
                        <span>{idx + 1}</span>
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Stage Label */}
                    <span
                      className="text-xs text-center font-medium"
                      style={{
                        color: stage.done || stage.current ? 'var(--app-text-primary)' : 'var(--app-text-muted)',
                        maxWidth: 80,
                      }}
                    >
                      {stage.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Journey Stats */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: '#f3f4f6' }}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                  3 of 6 modules completed
                </span>
                <span className="text-sm font-bold" style={{ color: '#8b5cf6' }}>
                  50% complete
                </span>
              </div>
            </div>
          </motion.section>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <aside className="flex flex-col gap-5">
          {/* Upcoming & Learning Updates */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl p-5 md:p-6 flex flex-col gap-4"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--app-text-primary)' }}>
              Upcoming & Learning Updates
            </h2>

            {/* Live Session */}
            {officeHourLive && (
              <motion.div
                {...cardHoverMotion()}
                className="rounded-lg p-4 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  color: 'white',
                }}
                onClick={() => navigate('/app/office-hours')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live Session
                  </span>
                </div>
                <h3 className="text-sm font-bold mb-2">{officeHourLive.title}</h3>
                <p className="text-xs opacity-90 mb-3">
                  {officeHourLive.instructor} • {officeHourLive.duration}
                </p>
                <motion.button
                  {...secondaryButtonMotion()}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/app/office-hours');
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs bg-white cursor-pointer"
                  style={{ color: '#8b5cf6' }}
                >
                  <Video size={14} />
                  Join
                </motion.button>
              </motion.div>
            )}

            {/* Upcoming Sessions */}
            {officeHourUpcoming.slice(0, 3).map((session, idx) => (
              <motion.div
                key={session.id}
                {...cardHoverMotion()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="rounded-lg p-4 cursor-pointer"
                style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                }}
                onClick={() => navigate('/app/office-hours')}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#ede9fe' }}>
                    {idx === 0 ? <Video size={16} style={{ color: '#8b5cf6' }} /> : <Calendar size={16} style={{ color: '#8b5cf6' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1" style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}>
                      {idx === 0 ? 'New Lesson' : 'Community'}
                    </span>
                    <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--app-text-primary)' }}>
                      {session.title}
                    </h4>
                    <p className="text-xs mb-2" style={{ color: 'var(--app-text-muted)' }}>
                      {session.date} • {session.time}
                    </p>
                    <motion.button
                      {...secondaryButtonMotion()}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/app/office-hours');
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                      style={{ backgroundColor: '#ffffff', color: '#8b5cf6', border: '1px solid #e5e7eb' }}
                    >
                      {idx === 0 ? 'Start' : idx === 1 ? 'Join' : 'View'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* Announcements & Feedback */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl p-5 md:p-6 flex flex-col gap-4"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--app-text-primary)' }}>
              Announcements & Feedback
            </h2>

            {/* Platform Update */}
            <motion.div
              {...cardHoverMotion()}
              className="rounded-lg p-4 cursor-pointer"
              style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#dbeafe' }}>
                  <Bell size={16} style={{ color: '#3b82f6' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                    New
                  </span>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--app-text-primary)' }}>
                    Platform Update
                  </h4>
                  <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                    New learning paths available
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Survey */}
            <motion.div
              {...cardHoverMotion()}
              className="rounded-lg p-4 cursor-pointer"
              style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#fef3c7' }}>
                  <MessageSquare size={16} style={{ color: '#f59e0b' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1" style={{ backgroundColor: '#fde68a', color: '#92400e' }}>
                    Action Needed
                  </span>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--app-text-primary)' }}>
                    Quick Survey
                  </h4>
                  <p className="text-xs mb-2" style={{ color: 'var(--app-text-muted)' }}>
                    Help us improve the course
                  </p>
                  <motion.button
                    {...secondaryButtonMotion()}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                    style={{ backgroundColor: '#ffffff', color: '#f59e0b', border: '1px solid #fde68a' }}
                  >
                    Take Survey
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Instructor Announcement */}
            <motion.div
              {...cardHoverMotion()}
              className="rounded-lg p-4 cursor-pointer"
              style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#e0e7ff' }}>
                  <FileText size={16} style={{ color: '#6366f1' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--app-text-primary)' }}>
                    Instructor Announcement
                  </h4>
                  <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                    New office hours added
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>
        </aside>
      </div>
    </div>
  );
}
