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
  Target, Trophy, Flame, Star, Clock, Users, Search,
  ChevronRight, ChevronDown, CheckCircle2, Play, Sparkles, TrendingUp, MessageSquare,
} from 'lucide-react';
import {
  challenges,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import clsx from 'clsx';
import {
  cardHoverMotion,
  primaryButtonMotion,
  chipToggleMotion,
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
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');

  // Mock daily progress data (points earned each day)
  const dailyProgress = [
    { day: 'Sun', points: 50, completed: true, isActive: false },
    { day: 'Mon', points: 75, completed: true, isActive: false },
    { day: 'Tue', points: 10, completed: true, isActive: true },
    { day: 'Wed', points: 11, completed: false, isActive: false },
    { day: 'Thu', points: 12, completed: false, isActive: false },
    { day: 'Fri', points: 13, completed: false, isActive: false },
    { day: 'Sat', points: 14, completed: false, isActive: false },
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
    const typeMatch = typeFilter === 'all' || c.frequency === typeFilter || c.type === typeFilter;
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

  const getTypeBadgeClass = (frequency: string) => {
    if (frequency === 'daily') return 'frequency-daily';
    if (frequency === 'weekly') return 'frequency-weekly';
    if (frequency === 'track') return 'frequency-track';
    return 'badge-gray';
  };

  const getProgressColor = (points: number) => {
    if (points >= 100) return 'bg-[#8b5cf6]';
    if (points >= 75) return 'bg-[#3b82f6]';
    if (points >= 50) return 'bg-[#22c55e]';
    return 'bg-gray-200';
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
          {/* Header */}
          <div className="compact-daily-progress-header">
            <div className="compact-daily-progress-title-container">
              <h2 className="compact-daily-progress-title">Daily Progress</h2>
              <span className="compact-daily-progress-subtitle">Keep your streak! 🔥</span>
            </div>
            
            {/* Week/Month Toggle */}
            <div className="compact-daily-progress-tabs">
              {['week', 'month'].map(view => (
                <motion.button
                  key={view}
                  {...chipToggleMotion()}
                  onClick={() => setCalendarView(view as 'week' | 'month')}
                  className={clsx(
                    "compact-daily-progress-tab capitalize",
                    calendarView === view ? "compact-daily-progress-tab-active" : "compact-daily-progress-tab-inactive"
                  )}
                >
                  {view}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Compact Calendar Grid */}
          <div className="compact-daily-progress-grid">
            {dailyProgress.map((day, idx) => (
              <div key={idx} className="calendar-day-compact">
                {/* Day Label */}
                <span className="calendar-day-label">{day.day}</span>
                
                {/* Day Cell */}
                <div className={clsx(
                  "calendar-day-cell",
                  day.isActive && "calendar-day-cell-active",
                  !day.isActive && day.completed && "calendar-day-cell-completed",
                  !day.isActive && !day.completed && "calendar-day-cell-empty"
                )}>
                  {/* Sparkle Icon for completed days */}
                  {day.completed && !day.isActive && (
                    <Sparkles className="calendar-day-icon text-[#8200db]" />
                  )}
                  
                  {/* Points */}
                  <span className={clsx(
                    "calendar-day-points",
                    day.isActive && "calendar-day-points-active",
                    !day.isActive && day.completed && "calendar-day-points-completed",
                    !day.isActive && !day.completed && "calendar-day-points-empty"
                  )}>
                    {day.points}
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
              <Trophy size={14} className="text-[#eab308]" />
              <h2 className="leaderboard-compact-header-title">Leaderboard</h2>
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
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="skill">Track</option>
            <option value="community">Assigned</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
        </div>
      </div>

      {/* CHALLENGES GRID */}
      <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChallenges.slice(0, 9).map((challenge, idx) => {
          const isCompleted = challenge.completed;

          return (
            <motion.div
              key={challenge.id}
              {...cardHoverMotion()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card-base p-5 cursor-pointer"
              onClick={() => navigate(`/app/learn/challenges/${challenge.id}/workspace`)}
            >
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Type Badge */}
                <span className={clsx("badge-base", getTypeBadgeClass(challenge.frequency || 'daily'))}>
                  {challenge.frequency || 'weekly'}
                </span>

                {/* Difficulty Badge */}
                <span className={clsx("badge-base", getDifficultyClass(challenge.difficulty))}>
                  {challenge.difficulty}
                </span>

                {/* Completion Status */}
                {isCompleted && (
                  <span className="badge-base badge-green inline-flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Done
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold mb-2 text-app-primary">
                {challenge.title}
              </h3>

              <p className="text-sm mb-4 text-app-secondary leading-relaxed">
                {challenge.description.substring(0, 100)}...
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-4 text-xs text-app-muted">
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} />
                  {challenge.timeEstimateMinutes || 20} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={14} />
                  {challenge.participants || 0}
                </span>
                <span className="inline-flex items-center gap-1 text-[#8b5cf6] font-semibold">
                  <Star size={14} />
                  {challenge.points || 50} pts
                </span>
              </div>

              {/* Category Label */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-app-muted">
                  {challenge.category}
                </span>
              </div>

              {/* View Button */}
              <motion.button
                {...primaryButtonMotion()}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/app/learn/challenges/${challenge.id}/workspace`);
                }}
                className={clsx(
                  "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer",
                  isCompleted ? "btn-secondary" : "btn-primary"
                )}
              >
                {isCompleted ? 'Review' : 'View'}
                <ChevronRight size={16} />
              </motion.button>
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
