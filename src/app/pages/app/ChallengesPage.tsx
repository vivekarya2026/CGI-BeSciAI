/**
 * ============================================
 * CHALLENGES PAGE — ChallengesPage.tsx
 * ============================================
 * Standalone challenges page with Daily, Weekly, Skill-based, and Community challenges
 * Gamified with CGI Design System 16.0.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Target, Trophy, Flame, Star, Clock, Users, Search,
  Filter, ChevronRight, CheckCircle2, Play, Zap,
} from 'lucide-react';
import {
  challenges,
  type ChallengeType,
  isChallengeSaved,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import {
  cardHoverMotion,
  primaryButtonMotion,
  secondaryButtonMotion,
  chipToggleMotion,
  staggerContainer,
} from '../../components/ui/motionPresets';

export default function ChallengesPage() {
  const navigate = useNavigate();
  const { progress } = useUser();
  const [typeFilter, setTypeFilter] = useState<'all' | ChallengeType>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const completedChallenges = challenges.filter(c => c.completed).length;
  const dailyChallenges = challenges.filter(c => c.frequency === 'daily');
  const weeklyChallenges = challenges.filter(c => c.frequency === 'weekly');
  const skillChallenges = challenges.filter(c => c.type === 'skill');
  const communityChallenges = challenges.filter(c => c.type === 'community');

  // Daily challenges completed today
  const dailyCompleted = dailyChallenges.filter(c => c.completed).length;
  // Weekly challenges completed this week
  const weeklyCompleted = weeklyChallenges.filter(c => c.completed).length;
  // Total points from challenges
  const totalPoints = challenges.filter(c => c.completed).reduce((sum, c) => sum + (c.points || 0), 0);

  // Filter challenges
  const filteredChallenges = challenges.filter(c => {
    const typeMatch = typeFilter === 'all' || c.type === typeFilter;
    const diffMatch = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
    const searchMatch = !searchQuery.trim() || 
      (c.title + c.description).toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && diffMatch && searchMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
      case 'medium': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'hard': return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const getProgressState = (challenge: any) => {
    if (challenge.completed) return { label: 'Completed', color: '#22c55e', icon: <CheckCircle2 size={16} /> };
    if (challenge.progress && challenge.progress > 0) return { label: 'In Progress', color: '#f59e0b', icon: <Play size={16} /> };
    return { label: 'Not Started', color: '#9ca3af', icon: <Target size={16} /> };
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary)', backgroundColor: 'var(--app-bg)', minHeight: '100vh' }}>
      {/* ============================================ */}
      {/* HEADER WITH STATS */}
      {/* ============================================ */}
      <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
              Challenges
            </h1>
            <p className="text-sm sm:text-base" style={{ color: 'var(--app-text-secondary)' }}>
              Complete challenges to earn XP, maintain your streak, and unlock achievements
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {/* Daily Challenges Completed */}
          <motion.div
            {...cardHoverMotion()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-5 cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                <Flame size={24} style={{ color: '#f59e0b' }} />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
                  {dailyCompleted}/{dailyChallenges.length}
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                  Daily Challenges
                </p>
              </div>
            </div>
          </motion.div>

          {/* Weekly Challenges Completed */}
          <motion.div
            {...cardHoverMotion()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl p-5 cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                <Trophy size={24} style={{ color: '#3b82f6' }} />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
                  {weeklyCompleted}/{weeklyChallenges.length}
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                  Weekly Challenges
                </p>
              </div>
            </div>
          </motion.div>

          {/* Total Points Earned */}
          <motion.div
            {...cardHoverMotion()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl p-5 cursor-pointer"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
                <Star size={24} style={{ color: '#eab308' }} />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
                  {totalPoints.toLocaleString()}
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--app-text-secondary)' }}>
                  Points Earned
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </header>

      {/* ============================================ */}
      {/* FILTERS & SEARCH */}
      {/* ============================================ */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
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

        {/* Type Filter */}
        <div className="flex gap-2">
          {['all', 'daily', 'weekly', 'skill', 'community'].map((type) => (
            <motion.button
              key={type}
              {...chipToggleMotion()}
              onClick={() => setTypeFilter(type as any)}
              className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer capitalize"
              style={{
                backgroundColor: typeFilter === type ? '#8b5cf6' : '#ffffff',
                color: typeFilter === type ? '#ffffff' : 'var(--app-text-secondary)',
                border: `1px solid ${typeFilter === type ? '#8b5cf6' : '#e5e7eb'}`,
              }}
            >
              {type}
            </motion.button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2">
          {['all', 'easy', 'medium', 'hard'].map((diff) => (
            <motion.button
              key={diff}
              {...chipToggleMotion()}
              onClick={() => setDifficultyFilter(diff)}
              className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer capitalize"
              style={{
                backgroundColor: difficultyFilter === diff ? '#8b5cf6' : '#ffffff',
                color: difficultyFilter === diff ? '#ffffff' : 'var(--app-text-secondary)',
                border: `1px solid ${difficultyFilter === diff ? '#8b5cf6' : '#e5e7eb'}`,
              }}
            >
              {diff}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* DAILY CHALLENGES */}
      {/* ============================================ */}
      {(typeFilter === 'all' || typeFilter === 'daily') && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={24} style={{ color: '#f59e0b' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
              Daily Challenges
            </h2>
            <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
              {dailyCompleted}/{dailyChallenges.length} completed
            </span>
          </div>

          <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyChallenges.slice(0, 3).map((challenge, idx) => {
              const diffColors = getDifficultyColor(challenge.difficulty);
              const progressState = getProgressState(challenge);

              return (
                <motion.div
                  key={challenge.id}
                  {...cardHoverMotion()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/app/learn/challenges/${challenge.id}/workspace`)}
                  className="rounded-xl p-5 cursor-pointer"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: diffColors.bg, color: diffColors.text }}
                      >
                        {challenge.difficulty}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: '#f3f4f6', color: progressState.color }}
                      >
                        {progressState.icon}
                        {progressState.label}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                    {challenge.title}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.5 }}>
                    {challenge.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--app-text-muted)' }}>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {challenge.timeEstimateMinutes || 15} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users size={14} />
                        {challenge.participants || 0}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: '#eab308' }}>
                      <Star size={16} />
                      {challenge.points || 50}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* ============================================ */}
      {/* WEEKLY CHALLENGES */}
      {/* ============================================ */}
      {(typeFilter === 'all' || typeFilter === 'weekly') && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={24} style={{ color: '#3b82f6' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
              Weekly Challenges
            </h2>
            <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
              {weeklyCompleted}/{weeklyChallenges.length} completed
            </span>
          </div>

          <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyChallenges.slice(0, 2).map((challenge, idx) => {
              const diffColors = getDifficultyColor(challenge.difficulty);
              const progressState = getProgressState(challenge);

              return (
                <motion.div
                  key={challenge.id}
                  {...cardHoverMotion()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/app/learn/challenges/${challenge.id}/workspace`)}
                  className="rounded-xl p-6 cursor-pointer"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: diffColors.bg, color: diffColors.text }}
                      >
                        {challenge.difficulty}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: '#f3f4f6', color: progressState.color }}
                      >
                        {progressState.icon}
                        {progressState.label}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: '#eab308' }}>
                      <Star size={18} />
                      {challenge.points || 100}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                    {challenge.title}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.5 }}>
                    {challenge.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--app-text-muted)' }}>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} />
                      {challenge.timeEstimateMinutes || 30} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users size={14} />
                      {challenge.participants || 0} participants
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Target size={14} />
                      {challenge.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* ============================================ */}
      {/* SKILL-BASED CHALLENGES */}
      {/* ============================================ */}
      {(typeFilter === 'all' || typeFilter === 'skill') && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={24} style={{ color: '#8b5cf6' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
              Skill-based Challenges
            </h2>
          </div>

          <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillChallenges.slice(0, 6).map((challenge, idx) => {
              const diffColors = getDifficultyColor(challenge.difficulty);
              const progressState = getProgressState(challenge);

              return (
                <motion.div
                  key={challenge.id}
                  {...cardHoverMotion()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/app/learn/challenges/${challenge.id}/workspace`)}
                  className="rounded-xl p-5 cursor-pointer"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ backgroundColor: diffColors.bg, color: diffColors.text }}
                    >
                      {challenge.difficulty}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                      style={{ backgroundColor: '#f3f4f6', color: progressState.color }}
                    >
                      {progressState.icon}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                    {challenge.title}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.5 }}>
                    {challenge.description.substring(0, 80)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--app-text-muted)' }}>
                      <Clock size={14} />
                      {challenge.timeEstimateMinutes || 20} min
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: '#eab308' }}>
                      <Star size={16} />
                      {challenge.points || 75}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* ============================================ */}
      {/* COMMUNITY CHALLENGES */}
      {/* ============================================ */}
      {(typeFilter === 'all' || typeFilter === 'community') && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users size={24} style={{ color: '#22c55e' }} />
            <h2 className="text-xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
              Community Challenges
            </h2>
          </div>

          <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityChallenges.slice(0, 4).map((challenge, idx) => {
              const diffColors = getDifficultyColor(challenge.difficulty);
              const progressState = getProgressState(challenge);

              return (
                <motion.div
                  key={challenge.id}
                  {...cardHoverMotion()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/app/learn/challenges/${challenge.id}/workspace`)}
                  className="rounded-xl p-5 cursor-pointer"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: diffColors.bg, color: diffColors.text }}
                      >
                        {challenge.difficulty}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: '#f3f4f6', color: progressState.color }}
                      >
                        {progressState.icon}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                    {challenge.title}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.5 }}>
                    {challenge.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--app-text-muted)' }}>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {challenge.timeEstimateMinutes || 25} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users size={14} />
                        {challenge.participants || 0}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: '#eab308' }}>
                      <Star size={16} />
                      {challenge.points || 60}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}
    </div>
  );
}
