/**
 * ============================================
 * DASHBOARD PAGE — DashboardPage.tsx
 * ============================================
 * Gamified dashboard with CGI Design System 16.0.0
 * Layout: Header with stats, Resume card, Today's Challenge, Learning Journey, Sidebar updates
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Trophy, Flame, Star, CheckCircle2, Play, Clock, Target,
  Sparkles, Calendar, Bell, Users, FileText, MessageSquare,
  Video, ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { useUser } from '../../context/UserContext';
import { learningModules } from '../../data/archetypes';
import {
  microLearnings,
  challenges,
  officeHourLive,
  officeHourUpcoming,
} from '../../data/learnData';
import { STATS_TILES_CONFIG, type StatIconKey } from '../../data/statsConfig';
import { PageHeader } from '../../components/PageHeader';
import { DashboardMiniMessages } from '../../components/DashboardMiniMessages';
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

// 52 weeks x 7 days of realistic activity data (0=none, 1-4=intensity)
const HEATMAP_DATA: number[][] = [
  [0,1,2,0,1,0,0],[1,0,3,2,1,0,0],[0,2,1,3,2,1,0],[2,3,4,2,3,1,0],
  [1,0,2,0,1,0,0],[3,4,3,2,4,2,0],[0,1,2,1,0,0,0],[2,2,3,1,2,0,0],
  [4,3,2,4,3,2,0],[0,0,1,0,0,0,0],[1,2,1,0,1,0,0],[0,0,0,1,0,0,0],
  [3,4,3,4,3,2,1],[4,3,4,4,3,2,0],[2,3,2,3,2,1,0],[4,4,3,4,3,2,1],
  [0,0,1,0,0,0,0],[2,3,2,3,2,1,0],[1,2,1,2,1,0,0],[3,4,3,4,3,2,1],
  [0,0,0,1,0,0,0],[1,2,1,2,1,0,0],[3,4,3,4,3,2,0],[2,3,2,3,2,1,0],
  [3,4,4,3,4,2,1],[1,2,1,2,1,0,0],[2,2,1,2,2,0,0],[0,1,1,0,1,0,0],
  [1,1,0,1,0,0,0],[2,3,2,3,2,1,0],[0,1,1,0,1,0,0],[0,0,0,0,0,0,0],
  [1,1,0,1,1,0,0],[0,0,0,0,0,0,0],[1,1,1,0,1,0,0],[0,0,0,0,0,0,0],
  [3,4,4,3,4,2,1],[0,0,0,0,0,0,0],[1,2,2,1,2,0,0],[0,1,1,0,1,0,0],
  [1,1,0,1,0,0,0],[2,2,1,2,1,0,0],[1,2,2,1,2,1,0],[2,3,3,2,3,1,0],
  [0,1,1,0,1,0,0],[2,2,1,2,1,1,0],[1,2,2,1,2,0,0],[0,0,1,0,0,0,0],
  [2,2,1,2,1,1,0],[0,0,0,0,1,0,0],[1,1,1,0,1,0,0],[1,1,0,1,1,0,0],
];

const STAT_ICONS: Record<StatIconKey, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  flame: Flame,
  trophy: Trophy,
  target: Target,
  clock: Clock,
  star: Star,
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, progress } = useUser();
  const [miniMessagesOpen, setMiniMessagesOpen] = useState(false);

  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Get current training module
  const currentModule = learningModules.find(m => !m.completed && !m.locked);
  const completionPct = currentModule?.progress ?? 60;

  // Get today's challenge
  const dayIndex = Math.floor(Date.now() / 86400000);
  const todayChallenge = challenges[dayIndex % challenges.length];

  // Calculate journey progress
  const completedStages = LEARNING_JOURNEY_STAGES.filter(s => s.done).length;
  const journeyProgress = Math.round((completedStages / LEARNING_JOURNEY_STAGES.length) * 100);

  return (
    <div className="font-primary bg-app-bg min-h-screen">
      {/* ============================================ */}
      {/* HEADER SECTION */}
      {/* ============================================ */}
      <PageHeader
        title={<>{greeting}, {user?.name || 'Alex'}! 👋</>}
        subtitle="Ready to continue your learning journey today?"
        onMessagesClick={() => setMiniMessagesOpen((o) => !o)}
        onNavigate={navigate}
      />

      {/* ============================================ */}
      {/* MAIN CONTENT - TWO COLUMN LAYOUT */}
      {/* ============================================ */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] lg:gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-5">
          {/* Stats section - 5 tiles (no hover animation), from statsConfig */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-base rounded-xl p-5 md:p-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {STATS_TILES_CONFIG.map((stat) => {
                const Icon = STAT_ICONS[stat.iconKey];
                const value = stat.id === 'streak' ? (progress.streak ?? 5)
                  : stat.id === 'trainings' ? (progress.modulesCompleted ?? 3)
                  : stat.id === 'challenges' ? 23
                  : stat.id === 'hours' ? 42
                  : (progress.xp ?? 1250);
                const display = stat.id === 'xp' ? (value as number).toLocaleString() : String(value);
                return (
                  <motion.div
                    key={stat.id}
                    {...cardHoverMotion()}
                    className="badge-base rounded-lg p-4 cursor-pointer border"
                    style={{ borderColor: stat.borderColor, backgroundColor: stat.tileBg }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={20} style={{ color: stat.iconColor }} />
                      <span className="text-2xl font-bold" style={{ color: stat.textColor }}>{display}</span>
                    </div>
                    <p className="text-xs font-medium" style={{ color: stat.textColor }}>{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Resume Where You Left Off */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-base rounded-xl p-5 md:p-7"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-5 text-app-primary">
              Resume Where You Left Off
            </h2>

            {currentModule ? (
              <div className="flex flex-col gap-5">
                {/* Top row: Thumbnail + Title/Subtitle */}
                <div className="items-center gap-5">
                  <div className="h-28 sm:h-32 rounded-xl shrink-0 overflow-hidden bg-gradient-to-br from-purple-900 to-purple-800 relative">
                    <img
                      src="/assets/Frame_30-b2059e27-34a7-430f-aed1-416718844c14.png"
                      alt={currentModule.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 mt-4">
                    <h3 className="text-base sm:text-lg font-bold mb-1.5 text-app-primary">
                      {currentModule.title}
                    </h3>
                    <p className="text-sm text-app-secondary">
                      {currentModule.category}
                    </p>
                  </div>
                </div>

                {/* Bottom row: Progress bar + Resume button */}
                <div className="items-end gap-5">
                  <div className="flex-1 min-w-0 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-app-muted">
                        {completionPct}% complete
                      </span>
                      <span className="text-xs font-medium text-app-muted">
                        8 min remaining
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <motion.button
                    {...primaryButtonMotion()}
                    onClick={() => navigate('/app/learn', { state: { mode: 'training' } })}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm cursor-pointer"
                  >
                    <Play size={16} />
                    Resume Lesson
                  </motion.button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-app-secondary">
                No active lessons. Start a new module from the Learn page!
              </p>
            )}
          </motion.section>

          {/* Today's Challenge */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card-base rounded-xl p-5 md:p-6"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-2 text-app-primary">
              Today&apos;s Challenge
            </h2>

            <p className="text-sm mb-4 text-app-secondary">
              Complete this to keep your streak going
            </p>

            {/* Challenge Card */}
            <div
              className="card-gradient-gray rounded-xl p-5 cursor-pointer border border-app-strong"
              onClick={() => navigate('/app/challenges')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate('/app/challenges');
              }}
            >
              <div className="card-base rounded-lg p-4 mb-4 flex flex-col gap-4">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="items-center">
                      <Target size={20} className="text-purple-400" />
                      <h3 className="text-base font-bold text-app-primary mt-4">
                        {todayChallenge?.title || 'Practice reflection exercise'}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm mb-0 text-app-secondary">
                    {todayChallenge?.description || 'Reflect on your AI learning journey and identify key takeaways'}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-app-muted">
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
                className="btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm cursor-pointer"
              >
                <Play size={16} />
                Start Challenge
              </motion.button>
            </div>
          </motion.section>
          </div>

          {/* Your Learning Journey */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-base rounded-xl p-5 md:p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-purple-400" />
              <h2 className="text-lg sm:text-xl font-semibold text-app-primary">
                Your Learning Journey
              </h2>
            </div>

            <p className="text-sm mb-5 text-app-secondary">
              You&apos;ll gain 6 new skills by completing this program
            </p>

            {/* Journey Timeline */}
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute top-5 left-0 right-0 h-1 rounded-full bg-white-500 z-0">
                <motion.div
                  className="h-full rounded-full bg-purple-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${journeyProgress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                />
              </div>

              {/* Journey Stages */}
              <div className="relative flex justify-between z-[1]">
                {LEARNING_JOURNEY_STAGES.map((stage, idx) => (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex flex-col items-center flex-[0_0_auto]"
                  >
                    {/* Stage Circle */}
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center mb-2 relative font-semibold text-sm",
                        stage.done && "timeline-node-completed",
                        stage.current && "timeline-node-current",
                        !stage.done && !stage.current && "timeline-node-future"
                      )}
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
                      className={clsx(
                        "text-xs text-center font-medium max-w-[80px]",
                        stage.done || stage.current ? "text-app-primary" : "text-app-muted"
                      )}
                    >
                      {stage.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Journey Stats */}
            <div className="mt-6 pt-4 border-t border-white-500">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-app-secondary">
                  3 of 6 modules completed
                </span>
                <span className="text-sm font-bold text-purple-400">
                  50% complete
                </span>
              </div>
            </div>
          </motion.section>

          {/* Activity & Usage Stats */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card-base rounded-xl p-5 md:p-6"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-5 text-app-primary">
              Your Activity
            </h2>

            {/* Activity Stats Grid */}


            {/* Activity Heatmap - Last Year (GitHub-style) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-app-secondary">
                  Activity in the last year
                </h3>
                <span className="text-xs font-medium text-purple-400">
                  {HEATMAP_DATA.flat().reduce((sum, v) => sum + v, 0)} total activities
                </span>
              </div>

              {/* Month labels */}
              <div className="flex mb-1" style={{ paddingLeft: '2rem' }}>
                {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-app-muted"
                    style={{ width: `${100 / 13}%`, textAlign: 'center' }}
                  >
                    {month}
                  </span>
                ))}
              </div>

              {/* Heatmap grid: 7 rows (days) x 52 cols (weeks) */}
              <div className="flex gap-[3px]">
                {/* Day labels */}
                <div className="flex flex-col justify-between py-[2px] shrink-0 w-7">
                  <span className="text-[10px] text-app-muted leading-[11px]">Mon</span>
                  <span className="text-[10px] text-app-muted leading-[11px]">&nbsp;</span>
                  <span className="text-[10px] text-app-muted leading-[11px]">Wed</span>
                  <span className="text-[10px] text-app-muted leading-[11px]">&nbsp;</span>
                  <span className="text-[10px] text-app-muted leading-[11px]">Fri</span>
                  <span className="text-[10px] text-app-muted leading-[11px]">&nbsp;</span>
                  <span className="text-[10px] text-app-muted leading-[11px]">&nbsp;</span>
                </div>

                {/* Grid cells */}
                <div className="flex-1 grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
                  {HEATMAP_DATA.map((week, weekIdx) =>
                    week.map((level, dayIdx) => (
                      <motion.div
                        key={`${weekIdx}-${dayIdx}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + (weekIdx * 7 + dayIdx) * 0.002 }}
                        className="heatmap-cell rounded-sm aspect-square cursor-pointer"
                        data-level={level}
                        title={`${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][dayIdx]}, Week ${weekIdx + 1}: ${level} ${level === 1 ? 'activity' : 'activities'}`}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-1.5 mt-3">
                <span className="text-[10px] text-app-muted mr-1">Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="heatmap-cell w-[11px] h-[11px] rounded-sm"
                    data-level={level}
                  />
                ))}
                <span className="text-[10px] text-app-muted ml-1">More</span>
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
            className="card-base rounded-xl p-5 md:p-6 flex flex-col gap-4"
          >
            <h2 className="text-base sm:text-lg font-semibold text-app-primary">
              Upcoming & Learning Updates
            </h2>

            {/* Live Session */}
            {officeHourLive && (
              <motion.div
                {...cardHoverMotion()}
                className="card-gradient-red rounded-lg p-4 cursor-pointer"
                onClick={() => navigate('/app/office-hours')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge-base badge-white-transparent inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live Session
                  </span>
                </div>
                <h3 className="text-sm font-bold mb-2 text-white">{officeHourLive.title}</h3>
                <p className="text-xs opacity-90 mb-3">
                  {officeHourLive.instructor} • {officeHourLive.duration}
                </p>
                <motion.button
                  {...secondaryButtonMotion()}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/app/office-hours');
                  }}
                  className="btn-white-on-red inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs cursor-pointer"
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
                className="rounded-lg p-4 cursor-pointer bg-white-200 border border-app"
                onClick={() => navigate('/app/office-hours')}
              >
                <div className="flex items-start gap-3">
                  <div className="icon-container icon-container-sm icon-container-purple">
                    {idx === 0 ? <Video size={16} /> : <Calendar size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="badge-base badge-purple inline-block mb-1">
                      {idx === 0 ? 'New Lesson' : 'Community'}
                    </span>
                    <h4 className="text-sm font-semibold mb-1 text-app-primary">
                      {session.title}
                    </h4>
                    <p className="text-xs mb-2 text-app-muted">
                      {session.date} • {session.time}
                    </p>
                    <motion.button
                      {...secondaryButtonMotion()}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/app/office-hours');
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-white text-purple-400 border border-app"
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
            className="card-base rounded-xl p-5 md:p-6 flex flex-col gap-4"
          >
            <h2 className="text-base sm:text-lg font-semibold text-app-primary">
              Announcements & Feedback
            </h2>

            {/* Platform Update */}
            <motion.div
              {...cardHoverMotion()}
              className="rounded-lg p-4 cursor-pointer bg-white-200 border border-app"
            >
              <div className="flex items-start gap-3">
                <div className="icon-container icon-container-sm icon-container-blue">
                  <Bell size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="badge-base badge-blue inline-block mb-1">
                    New
                  </span>
                  <h4 className="text-sm font-semibold mb-1 text-app-primary">
                    Platform Update
                  </h4>
                  <p className="text-xs text-app-muted">
                    New learning paths available
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Survey */}
            <motion.div
              {...cardHoverMotion()}
              className="rounded-lg p-4 cursor-pointer bg-warning-100 border border-warning-100"
            >
              <div className="flex items-start gap-3">
                <div className="icon-container icon-container-sm icon-container-yellow">
                  <MessageSquare size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="badge-base inline-block mb-1 bg-warning-100 text-warning-900">
                    Action Needed
                  </span>
                  <h4 className="text-sm font-semibold mb-1 text-app-primary">
                    Quick Survey
                  </h4>
                  <p className="text-xs mb-2 text-app-muted">
                    Help us improve the course
                  </p>
                  <motion.button
                    {...secondaryButtonMotion()}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer bg-white text-archetype-trailblazer border border-warning-100"
                  >
                    Take Survey
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Instructor Announcement */}
            <motion.div
              {...cardHoverMotion()}
              className="rounded-lg p-4 cursor-pointer bg-white-200 border border-app"
            >
              <div className="flex items-start gap-3">
                <div className="icon-container icon-container-sm bg-[#e0e7ff] text-[#6366f1]">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold mb-1 text-app-primary">
                    Instructor Announcement
                  </h4>
                  <p className="text-xs text-app-muted">
                    New office hours added
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>
        </aside>
      </div>

      <DashboardMiniMessages
        isOpen={miniMessagesOpen}
        onClose={() => setMiniMessagesOpen(false)}
        onOpenFullMessages={() => {
          setMiniMessagesOpen(false);
          navigate('/app/messages');
        }}
      />
    </div>
  );
}
