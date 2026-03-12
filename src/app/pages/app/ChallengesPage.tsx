/**
 * ============================================
 * DAILY CHALLENGES PAGE — ChallengesPage.tsx
 * ============================================
 * Redesigned with Daily Progress calendar, Leaderboard sidebar, and gamified challenge cards
 * CGI Design System 16.0.0 with full microinteractions
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Target, Flame, Star, Clock, Users, Search,
  ChevronRight, ChevronDown, CheckCircle2, Play, TrendingUp, MessageSquare,
} from 'lucide-react';
import {
  challenges,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import clsx from 'clsx';
import {
  cardHoverMotion,
  primaryButtonMotion,
  secondaryButtonMotion,
  staggerContainer,
} from '../../components/ui/motionPresets';
import { NotificationsPanel } from '../../components/NotificationsPanel';
import { HeaderStatsChips } from '../../components/HeaderStatsChips';
import { DashboardMiniMessages } from '../../components/DashboardMiniMessages';

export default function ChallengesPage() {
  const navigate = useNavigate();
  const { progress } = useUser();
  const [miniMessagesOpen, setMiniMessagesOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Daily progress: Sun, Mon completed; Tue missed streak; Wed = today; rest upcoming
  const dailyProgress = [
    { day: 'Sun', points: 50, completed: true, isActive: false },
    { day: 'Mon', points: 75, completed: true, isActive: false },
    { day: 'Tue', points: 0, completed: false, isActive: false, missedStreak: true },
    { day: 'Wed', points: 10, completed: false, isActive: true },
    { day: 'Thu', points: 0, completed: false, isActive: false },
    { day: 'Fri', points: 0, completed: false, isActive: false },
    { day: 'Sat', points: 0, completed: false, isActive: false },
  ];

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', xp: 2450, isYou: false, medal: '🥇' },
    { rank: 2, name: 'Alex Kumar', xp: 2280, isYou: false, medal: '🥈' },
    { rank: 3, name: 'Jamie Lee', xp: 2150, isYou: false, medal: '🥉' },
    { rank: 4, name: 'You', xp: 1890, isYou: true, medal: '' },
  ];

  // Filter challenges
  const filteredChallenges = challenges.filter(c => {
    const typeMatch = typeFilter === 'all' || c.type === typeFilter;
    const searchMatch = !searchQuery.trim() || 
      (c.title + c.description).toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  const getDifficultyClass = (difficulty: string) => {
    const lower = difficulty.toLowerCase();
    if (lower === 'easy' || lower === 'beginner') return 'difficulty-beginner';
    if (lower === 'medium' || lower === 'intermediate') return 'difficulty-intermediate';
    if (lower === 'hard' || lower === 'advanced') return 'difficulty-advanced';
    return 'badge-gray';
  };

  const getTypeBadgeClass = (type: string) => {
    if (type === 'weekly') return 'frequency-weekly';
    if (type === 'track') return 'frequency-track';
    if (type === 'assigned') return 'frequency-daily';
    return 'badge-gray';
  };

  return (
    <div className="font-primary bg-app-bg min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-app-primary">
            Daily Challenges
          </h1>
          <p className="text-sm sm:text-base text-app-secondary">
            Level up your skills with hands-on challenges
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <HeaderStatsChips progress={{ xp: progress.xp ?? 0, modulesCompleted: progress.modulesCompleted ?? 0, totalModules: progress.totalModules ?? 12, streak: progress.streak ?? 0 }} />
          </div>
          <button
            type="button"
            className="notifications-bell"
            onClick={() => setMiniMessagesOpen(prev => !prev)}
            aria-label="Open messages"
          >
            <MessageSquare size={18} className="text-app-muted" />
            <span className="notifications-badge">3</span>
          </button>
          <div className="relative">
            <NotificationsPanel onNavigate={(path) => navigate(path)} />
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: Daily Progress + Leaderboard - COMPACT FIGMA DESIGN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Daily Progress Widget - Compact */}
        <motion.div
          {...cardHoverMotion()}
          className="compact-daily-progress-card"
        >
          {/* Header — title left, subtitle right */}
          <div className="compact-daily-progress-header">
            <h3 className="compact-daily-progress-title">Daily Progress</h3>
            <span className="compact-daily-progress-subtitle">Keep your streak!</span>
          </div>

          {/* Compact Calendar Grid — Sun, Mon; Tue missed streak; Wed = today */}
          <div className="compact-daily-progress-grid">
            {dailyProgress.map((day, idx) => (
              <div key={idx} className="calendar-day-compact">
                {/* Day Label: show "Today" for active day */}
                <span className="calendar-day-label">
                  {day.isActive ? 'Today' : day.day}
                </span>
                
                {/* Day Cell */}
                <div className={clsx(
                  "calendar-day-cell",
                  day.isActive && "calendar-day-cell-active",
                  !day.isActive && day.completed && "calendar-day-cell-completed",
                  (day as { missedStreak?: boolean }).missedStreak && "calendar-day-cell-missed",
                  !day.isActive && !day.completed && !(day as { missedStreak?: boolean }).missedStreak && "calendar-day-cell-empty"
                )}>
                  {/* Star (XP) icon for completed days and today */}
                  {(day.completed || day.isActive) && day.points > 0 && (
                    <Star className={clsx("calendar-day-icon shrink-0", day.isActive ? "text-white" : "text-[#db2777]")} size={14} />
                  )}
                  
                  {/* Points with XP label */}
                  <span className={clsx(
                    "calendar-day-points",
                    day.isActive && "calendar-day-points-active",
                    !day.isActive && day.completed && "calendar-day-points-completed",
                    !day.isActive && !day.completed && "calendar-day-points-empty"
                  )}>
                    {(day.completed || day.isActive) && day.points > 0 ? `${day.points} XP` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard Widget - Compact Horizontal */}
        <motion.div
          {...cardHoverMotion()}
          className="leaderboard-compact-wrapper"
        >
          {/* Header */}
          <div className="leaderboard-compact-header">
            <div className="leaderboard-compact-header-left">
              <h3 className="leaderboard-compact-header-title">Leaderboard</h3>
            </div>
            <span className="leaderboard-compact-header-subtitle">This Week</span>
          </div>

          {/* Horizontal Leaderboard Cards */}
          <div className="leaderboard-compact-container">
            {leaderboard.map((user, idx) => {
              const getMedalClass = () => {
                if (idx === 0) return 'leaderboard-compact-medal-gold';
                if (idx === 1) return 'leaderboard-compact-medal-silver';
                if (idx === 2) return 'leaderboard-compact-medal-bronze';
                return 'leaderboard-compact-medal-other';
              };

              return (
                <div
                  key={idx}
                  className={clsx(
                    "leaderboard-compact-card",
                    user.isYou && "leaderboard-compact-card-you"
                  )}
                >
                  {/* Medal/Rank */}
                  <div className={clsx("leaderboard-compact-medal", getMedalClass())}>
                    {user.medal || user.rank}
                  </div>

                  {/* User Info */}
                  <div className="leaderboard-compact-info">
                    <p className={clsx(
                      "leaderboard-compact-name",
                      user.isYou && "leaderboard-compact-name-you"
                    )}>
                      {user.name}
                    </p>
                    <div className="leaderboard-compact-xp">
                      <TrendingUp size={10} />
                      <span>{user.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View Full Leaderboard Link */}
          <button className="leaderboard-compact-link">
            View Full Leaderboard
          </button>
        </motion.div>
      </div>

      {/* SEARCH & FILTER: Search on one end, filter on the other (same width as Learn/Micro-learning) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 w-full">
        <div className="relative search-filter-width">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base input-with-icon w-full pl-9 text-app-primary placeholder:text-app-muted"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="dropdown-base"
          >
            <option value="all">Filter by type - All</option>
            <option value="weekly">Weekly</option>
            <option value="track">Track</option>
            <option value="assigned">Assigned</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
        </div>
      </div>

      {/* CHALLENGES GRID — 3 scenarios: Completed, In progress (progress + Continue), New (Start) — same structure as Micro-learning cards */}
      <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChallenges.slice(0, 9).map((challenge, idx) => {
          const isCompleted = challenge.completed === true;
          const isInProgress = !isCompleted && typeof challenge.progress === 'number' && challenge.progress > 0 && challenge.progress < 100;
          const progressPct = challenge.progress ?? 0;

          return (
            <motion.div
              key={challenge.id}
              {...cardHoverMotion()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/app/learn/challenges/${challenge.id}/workspace`)}
              className="card-base p-5 cursor-pointer flex flex-col h-full"
            >
              {/* Top: badges, title, meta (time, participants, +XX XP) — no description */}
              <div className="flex-1 min-h-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {isCompleted && (
                    <span className="badge-base badge-green inline-flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Completed
                    </span>
                  )}
                  <span className={clsx("badge-base", getTypeBadgeClass(challenge.type))}>
                    {challenge.type}
                  </span>
                  <span className={clsx("badge-base", getDifficultyClass(challenge.difficulty))}>
                    {challenge.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold mb-2 text-app-primary">
                  {challenge.title}
                </h3>

                <p className="text-sm mb-3 text-app-secondary leading-relaxed line-clamp-3">
                  {challenge.description.length > 120
                    ? `${challenge.description.substring(0, 120)}...`
                    : challenge.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-app-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} />
                    {challenge.time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users size={14} />
                    {challenge.participants}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#db2777] font-semibold">
                    <Star size={14} />
                    +{challenge.points} XP
                  </span>
                </div>
              </div>

              {/* Bottom: progress bar + CTA (Review / Continue / Start) */}
              <div className="mt-auto pt-4 flex flex-col gap-4">
                {isCompleted && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-app-muted">Complete</span>
                      <span className="text-xs font-semibold text-[#22c55e]">100%</span>
                    </div>
                    <div className="progress-bar-bg progress-bar-bg-thick overflow-hidden">
                      <div className="progress-bar-fill progress-bar-fill-green" style={{ width: '100%' }} />
                    </div>
                  </div>
                )}
                {isInProgress && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-app-muted">Progress</span>
                      <span className="text-xs font-semibold text-[#5236ab]">{progressPct}%</span>
                    </div>
                    <div className="progress-bar-bg progress-bar-bg-thick overflow-hidden">
                      <motion.div
                        className="progress-bar-fill h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}
                <motion.button
                  {...(isInProgress ? primaryButtonMotion() : isCompleted ? primaryButtonMotion() : secondaryButtonMotion())}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/learn/challenges/${challenge.id}/workspace`);
                  }}
                  className={clsx(
                    "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer",
                    isCompleted && "btn-success-stroked",
                    isInProgress && "btn-primary text-white",
                    !isCompleted && !isInProgress && "btn-primary-stroked"
                  )}
                >
                  {isCompleted ? (
                    <>
                      Review
                      <ChevronRight size={16} />
                    </>
                  ) : isInProgress ? (
                    <>
                      <Play size={16} />
                      Continue
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Start
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredChallenges.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Target size={48} className="mx-auto mb-4 text-app-hint" />
          <p className="text-lg font-medium mb-2 text-app-secondary">
            No challenges found
          </p>
          <p className="text-sm text-app-muted">
            Try adjusting your filters or search query
          </p>
        </motion.div>
      )}

      <DashboardMiniMessages
        isOpen={miniMessagesOpen}
        onClose={() => setMiniMessagesOpen(false)}
        onOpenFullMessages={() => navigate('/app/messages')}
      />
    </div>
  );
}
