/**
 * ============================================
 * DASHBOARD PAGE — DashboardPage.tsx
 * ============================================
 * Two-column layout: Your Journey + Recommended Next Steps (left),
 * Upcoming Sessions scrollable (right). Header with XP, Modules, Streak badges.
 */

import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  BookOpen, Calendar, Clock, Zap, Play, Sparkles, Star,
  Video, Eye, RotateCcw,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { learningModules } from '../../data/archetypes';
import {
  microLearnings,
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

const JOURNEY_STAGES = [
  { id: 1, label: 'AI Basics', done: true },
  { id: 2, label: 'Prompt Craft', done: true },
  { id: 3, label: 'Productivity', done: true },
  { id: 4, label: 'Advanced', done: false, current: true },
  { id: 5, label: 'Automation', done: false },
  { id: 6, label: 'Mastery', done: false },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, progress } = useUser();

  const completionPct = progress.totalModules
    ? Math.round((progress.modulesCompleted / progress.totalModules) * 100)
    : 0;
  const current = learningModules.find(m => !m.completed && !m.locked);
  const dayIndex = Math.floor(Date.now() / 86400000);
  const todayMicro = microLearnings[dayIndex % microLearnings.length];

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* ---------- Header: greeting + status; badges (XP, Modules, Streak) + bell ---------- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl" style={{ fontWeight: 600, color: 'var(--app-text-primary)', lineHeight: 1.3 }}>
            Welcome back, {user?.name || 'Alex'} 👋
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--app-text-secondary)', lineHeight: '24px' }}>
            Your AI adoption journey is {completionPct}% complete. Keep it up!
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <motion.div
            {...chipToggleMotion()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer"
            style={{ backgroundColor: '#f2f1f9', color: '#5236ab' }}
          >
            <Sparkles size={16} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{progress.xp} XP</span>
          </motion.div>
          <motion.div
            {...chipToggleMotion()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer"
            style={{ backgroundColor: '#e8f8f1', color: '#0b4e32' }}
          >
            <BookOpen size={16} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{progress.modulesCompleted}/{progress.totalModules} Modules</span>
          </motion.div>
          <motion.div
            {...chipToggleMotion()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer"
            style={{ backgroundColor: '#fef6e9', color: '#654510' }}
          >
            <Zap size={16} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{progress.streak} Streak</span>
          </motion.div>
          <NotificationsPanel onNavigate={(path) => navigate(path)} />
        </div>
      </div>

      {/* ---------- Two-column: Left (Journey + Recommended) | Right (Upcoming Sessions scrollable) ---------- */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left column */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Your Journey */}
          <section className="rounded-xl p-6" style={{ backgroundColor: '#ffffff', border: '1px solid var(--app-border)', boxShadow: '0px 1px 4px rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#5236ab', letterSpacing: '0.05em', marginBottom: 4 }}>YOUR JOURNEY</p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 8 }}>AI Adoption Learning Path</h2>
            <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', lineHeight: '20px', marginBottom: 16 }}>
              A personalized journey from AI basics to mastery. Complete modules to unlock new skills and earn certifications.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--app-border)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="#5236ab"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - completionPct / 100) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-text-primary)' }}>{completionPct}%</span>
                  <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>Complete</span>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-1 flex-wrap">
                {JOURNEY_STAGES.map((stage, i) => (
                  <React.Fragment key={stage.id}>
                    {i > 0 && <div className="w-4 h-0.5 shrink-0" style={{ backgroundColor: 'var(--app-border)' }} />}
                    <div
                      className="flex flex-col items-center gap-0.5 shrink-0"
                      style={{ minWidth: 56 }}
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: stage.done ? '#1ab977' : stage.current ? '#5236ab' : '#efefef',
                          color: stage.done || stage.current ? '#fff' : '#767676',
                        }}
                      >
                        {stage.done ? '✓' : i + 1}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--app-text-secondary)', textAlign: 'center' }}>{stage.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* Recommended Next Steps */}
          <section>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 16 }}>Recommended Next Steps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Today's Micro Learning Challenge */}
              <motion.div
                {...cardHoverMotion()}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e6e3f3', boxShadow: '0 1px 3px rgba(82,54,171,0.08)' }}
                onClick={() => navigate('/app/learn', { state: { tab: 'micro' } })}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>Today</span>
                    <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{todayMicro.topic}</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(82,54,171,0.12)' }}>
                    <Zap size={24} style={{ color: '#5236ab' }} />
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 4 }}>Today&apos;s Micro Learning Challenge</h3>
                  <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', marginBottom: 0 }}>{todayMicro.title}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="flex items-center gap-3 text-sm" style={{ color: 'var(--app-text-muted)' }}>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} /> {todayMicro.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: '#b45309' }}>
                      <Star size={14} /> {todayMicro.points} pts
                    </span>
                  </p>
                  <motion.button
                    {...primaryButtonMotion()}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate('/app/learn', { state: { tab: 'micro' } }); }}
                    className="px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer shrink-0"
                    style={{ backgroundColor: '#5236ab', color: 'white', boxShadow: '0 1px 2px rgba(82,54,171,0.2)' }}
                  >
                    Do this micro
                  </motion.button>
                </div>
              </motion.div>

              {/* Continue Learning */}
              <motion.div
                {...cardHoverMotion()}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-xl p-5 flex flex-col gap-4 cursor-pointer"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e6e3f3', boxShadow: '0 1px 3px rgba(82,54,171,0.08)' }}
                onClick={() => navigate('/app/learn', { state: { tab: current ? 'path' : 'challenges' } })}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-2">
                    {current && (
                      <>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#fef3c7', color: '#1c1917' }}>{current.difficulty}</span>
                        <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{current.category}</span>
                      </>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(82,54,171,0.12)' }}>
                    <Play size={24} style={{ color: '#5236ab' }} />
                  </div>
                </div>
                <div>
                  {current ? (
                    <>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 4 }}>Continue Learning</h3>
                      <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', marginBottom: 0 }}>{current.title}</p>
                    </>
                  ) : (
                    <>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 4 }}>Start a challenge</h3>
                      <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', marginBottom: 0 }}>Pick a challenge and earn XP.</p>
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  {current ? (
                    <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--app-text-muted)' }}>
                      <Clock size={14} /> {current.duration}
                    </p>
                  ) : (
                    <span />
                  )}
                  <motion.button
                    {...primaryButtonMotion()}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate('/app/learn', { state: { tab: current ? 'path' : 'challenges' } }); }}
                    className="px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer shrink-0"
                    style={{ backgroundColor: '#5236ab', color: 'white', boxShadow: '0 1px 2px rgba(82,54,171,0.2)' }}
                  >
                    {current ? 'Continue' : 'View challenges'}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Three small action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Continue Training', sub: 'Pick up where you left off', icon: <Play size={18} style={{ color: '#5236ab' }} />, tab: 'trainings' as const },
                { label: 'Preview Next', sub: 'See what\'s coming up', icon: <Eye size={18} style={{ color: '#5236ab' }} />, tab: 'path' as const },
                { label: 'Review Completed', sub: 'Revisit past modules', icon: <RotateCcw size={18} style={{ color: '#5236ab' }} />, tab: 'path' as const },
              ].map((item) => (
                <motion.button
                  {...cardHoverMotion()}
                  key={item.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate('/app/learn', { state: { tab: item.tab } })}
                  className="rounded-xl p-4 flex items-center gap-3 text-left cursor-pointer"
                  style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#f2f1f9' }}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{item.sub}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        </div>

        {/* Right column: Upcoming Sessions (scrollable) */}
        <div className="lg:w-[360px] xl:w-[380px] shrink-0 flex flex-col">
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 16 }}>Upcoming Sessions</h2>
          <div
            className="flex-1 space-y-4 overflow-y-auto rounded-xl pr-1"
            style={{ maxHeight: '70vh', WebkitOverflowScrolling: 'touch' }}
          >
            {officeHourLive && (
              <motion.div
                {...cardHoverMotion()}
                className="rounded-xl p-5 flex flex-col gap-3 shrink-0 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #e31937 0%, #a82465 100%)', color: 'white' }}
                onClick={() => navigate('/app/office-hours')}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE NOW
                  </span>
                  <motion.button
                    {...primaryButtonMotion()}
                    onClick={(e) => { e.stopPropagation(); navigate('/app/office-hours'); }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-white cursor-pointer shrink-0"
                    style={{ color: '#e31937' }}
                  >
                    <Video size={18} /> Join Session
                  </motion.button>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: 0 }}>{officeHourLive.title}</h3>
                <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>{officeHourLive.instructor} · {officeHourLive.attending} attending · {officeHourLive.duration}</p>
              </motion.div>
            )}
            {officeHourUpcoming.map((s) => (
              <motion.div
                {...cardHoverMotion()}
                key={s.id}
                className="rounded-xl p-5 flex flex-col gap-3 shrink-0 cursor-pointer"
                style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                onClick={() => navigate('/app/office-hours')}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#f2f1f9' }}>
                    <Calendar size={20} style={{ color: '#5236ab' }} />
                  </div>
                  <motion.button
                    {...secondaryButtonMotion()}
                    onClick={(e) => { e.stopPropagation(); navigate('/app/office-hours'); }}
                    className="px-4 py-2 rounded-lg font-semibold cursor-pointer shrink-0 text-sm"
                    style={{ backgroundColor: '#f2f1f9', color: '#5236ab' }}
                  >
                    Register
                  </motion.button>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)', margin: 0 }}>{s.title}</h4>
                {s.description && (
                  <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', lineHeight: '20px', margin: 0 }}>
                    {s.description.length > 60 ? `${s.description.slice(0, 60)}...` : s.description}
                  </p>
                )}
                <p style={{ fontSize: 13, color: 'var(--app-text-muted)', margin: 0 }} className="flex flex-wrap items-center gap-1">
                  <span>{s.instructor}{s.role ? ` · ${s.role}` : ''}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={14} style={{ color: 'var(--app-text-hint)' }} />
                    {s.date} {s.time}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} style={{ color: 'var(--app-text-hint)' }} />
                    {s.duration}
                  </span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
