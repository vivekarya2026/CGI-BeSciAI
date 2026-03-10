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
  ChevronRight, CheckCircle2, Play, Calendar, TrendingUp,
} from 'lucide-react';
import {
  challenges,
  type ChallengeType,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import {
  cardHoverMotion,
  primaryButtonMotion,
  chipToggleMotion,
  staggerContainer,
} from '../../components/ui/motionPresets';

export default function ChallengesPage() {
  const navigate = useNavigate();
  const { progress } = useUser();
  const [typeFilter, setTypeFilter] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');

  // Mock daily progress data (points earned each day)
  const dailyProgress = [
    { day: 'Sun', points: 50, completed: true },
    { day: 'Mon', points: 75, completed: true },
    { day: 'Tue', points: 100, completed: true },
    { day: 'Wed', points: 50, completed: true },
    { day: 'Thu', points: 0, completed: false },
    { day: 'Fri', points: 0, completed: false },
    { day: 'Sat', points: 0, completed: false },
  ];

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', xp: 2450, isYou: false },
    { rank: 2, name: 'You', xp: 1820, isYou: true },
    { rank: 3, name: 'Alex Kim', xp: 1650, isYou: false },
  ];

  // Filter challenges
  const filteredChallenges = challenges.filter(c => {
    const typeMatch = typeFilter === 'all' || c.frequency === typeFilter || c.type === typeFilter;
    const searchMatch = !searchQuery.trim() || 
      (c.title + c.description).toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
      case 'beginner':
        return { bg: '#dcfce7', text: '#166534' };
      case 'medium':
      case 'intermediate':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'hard':
      case 'advanced':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getTypeBadgeColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'weekly':
        return { bg: '#ede9fe', text: '#6d28d9' };
      case 'track':
        return { bg: '#dbeafe', text: '#1e40af' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getProgressColor = (points: number) => {
    if (points >= 100) return '#8b5cf6';
    if (points >= 75) return '#3b82f6';
    if (points >= 50) return '#22c55e';
    return '#e5e7eb';
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary)', backgroundColor: 'var(--app-bg)', minHeight: '100vh' }}>
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
          Daily Challenges
        </h1>
        <p className="text-sm sm:text-base mb-6" style={{ color: 'var(--app-text-secondary)' }}>
          Level up your skills with hands-on challenges
        </p>
      </div>

      {/* ============================================ */}
      {/* MAIN LAYOUT: Daily Progress + Leaderboard */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Daily Progress Widget */}
        <motion.div
          {...cardHoverMotion()}
          className="lg:col-span-2 rounded-xl p-6"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--app-text-primary)' }}>
              Daily Progress
            </h2>
            <div className="flex gap-2">
              {['week', 'month'].map(view => (
                <motion.button
                  key={view}
                  {...chipToggleMotion()}
                  onClick={() => setCalendarView(view as 'week' | 'month')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer"
                  style={{
                    backgroundColor: calendarView === view ? '#8b5cf6' : '#f3f4f6',
                    color: calendarView === view ? '#ffffff' : 'var(--app-text-secondary)',
                  }}
                >
                  {view}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-3 mb-4">
            {dailyProgress.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center"
              >
                <span className="text-xs font-medium mb-2" style={{ color: 'var(--app-text-muted)' }}>
                  {day.day}
                </span>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: day.completed ? getProgressColor(day.points) : '#f3f4f6',
                    color: day.completed ? '#ffffff' : 'var(--app-text-muted)',
                  }}
                >
                  {day.completed ? day.points : '—'}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Streak Message */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
            <Flame size={20} style={{ color: '#f59e0b' }} />
            <span className="text-sm font-semibold" style={{ color: '#92400e' }}>
              Keep your streak! Complete today's challenge
            </span>
          </div>
        </motion.div>

        {/* Leaderboard Sidebar */}
        <motion.div
          {...cardHoverMotion()}
          className="rounded-xl p-6"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={20} style={{ color: '#eab308' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--app-text-primary)' }}>
              Leaderboard
            </h2>
          </div>

          {/* Top 3 Users */}
          <div className="space-y-3 mb-4">
            {leaderboard.map((user, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: user.isYou ? '#ede9fe' : '#f9fafb',
                  border: user.isYou ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                }}
              >
                {/* Rank Badge */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    backgroundColor: idx === 0 ? '#fef3c7' : '#f3f4f6',
                    color: idx === 0 ? '#92400e' : 'var(--app-text-secondary)',
                  }}
                >
                  {user.rank}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate" style={{ color: 'var(--app-text-primary)' }}>
                      {user.name}
                    </span>
                    {user.isYou && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
                    {user.xp.toLocaleString()} XP
                  </div>
                </div>

                {/* Trophy Icon for #1 */}
                {idx === 0 && <Trophy size={18} style={{ color: '#eab308' }} />}
              </motion.div>
            ))}
          </div>

          {/* View Full Leaderboard Link */}
          <motion.button
            {...primaryButtonMotion()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
            style={{ backgroundColor: '#f3f4f6', color: '#8b5cf6' }}
          >
            View Full Leaderboard
            <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* SEARCH & FILTER */}
      {/* ============================================ */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--app-text-hint)' }} />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg outline-none"
            style={{
              fontSize: 14,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              color: 'var(--app-text-primary)',
            }}
          />
        </div>

        {/* Filter by Type Dropdown */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 rounded-lg text-sm cursor-pointer outline-none"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            color: 'var(--app-text-primary)',
          }}
        >
          <option value="all">Filter by type - All</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="skill">Track</option>
          <option value="community">Assigned</option>
        </select>
      </div>

      {/* ============================================ */}
      {/* CHALLENGES GRID */}
      {/* ============================================ */}
      <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChallenges.slice(0, 9).map((challenge, idx) => {
          const diffColors = getDifficultyColor(challenge.difficulty);
          const typeBadge = getTypeBadgeColor(challenge.frequency || 'daily');
          const isCompleted = challenge.completed;

          return (
            <motion.div
              key={challenge.id}
              {...cardHoverMotion()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl p-5 cursor-pointer"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
              onClick={() => navigate(`/app/learn/challenges/${challenge.id}/workspace`)}
            >
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {/* Type Badge */}
                <span
                  className="px-2.5 py-1 rounded text-xs font-semibold capitalize"
                  style={{ backgroundColor: typeBadge.bg, color: typeBadge.text }}
                >
                  {challenge.frequency || 'weekly'}
                </span>

                {/* Difficulty Badge */}
                <span
                  className="px-2.5 py-1 rounded text-xs font-semibold"
                  style={{ backgroundColor: diffColors.bg, color: diffColors.text }}
                >
                  {challenge.difficulty}
                </span>

                {/* Completion Status */}
                {isCompleted && (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#dcfce7', color: '#166534' }}
                  >
                    <CheckCircle2 size={12} />
                    Done
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                {challenge.title}
              </h3>

              <p className="text-sm mb-4" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.5 }}>
                {challenge.description.substring(0, 100)}...
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: 'var(--app-text-muted)' }}>
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} />
                  {challenge.timeEstimateMinutes || 20} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={14} />
                  {challenge.participants || 0}
                </span>
                <span className="inline-flex items-center gap-1" style={{ color: '#8b5cf6', fontWeight: 600 }}>
                  <Star size={14} />
                  {challenge.points || 50} pts
                </span>
              </div>

              {/* Category Label */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
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
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer"
                style={{
                  backgroundColor: isCompleted ? '#f3f4f6' : '#8b5cf6',
                  color: isCompleted ? 'var(--app-text-secondary)' : 'white',
                }}
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
          <Target size={48} className="mx-auto mb-4" style={{ color: 'var(--app-text-hint)' }} />
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--app-text-secondary)' }}>
            No challenges found
          </p>
          <p className="text-sm" style={{ color: 'var(--app-text-muted)' }}>
            Try adjusting your filters or search query
          </p>
        </motion.div>
      )}
    </div>
  );
}
