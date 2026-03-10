/**
 * ============================================
 * 📖 LEARN PAGE — LearnPage.tsx
 * ============================================
 * Restructured Learn page with only 2 tabs: Training and Micro-learning
 * Each tab has Resume section at top and 6-item filterable library
 * CGI Design System 16.0.0 with gamified interactions
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, Zap, Play, Search, CheckCircle, Clock,
  Star, Bookmark, Video, Headphones, FileText, Sparkles,
} from 'lucide-react';
import {
  trainings,
  microLearnings,
  type TrainingFormat,
  isTrainingSaved,
  getCompletedMicroIds,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import { useNavigate, useLocation } from 'react-router';
import {
  cardHoverMotion,
  primaryButtonMotion,
  secondaryButtonMotion,
  chipToggleMotion,
  staggerContainer,
} from '../../components/ui/motionPresets';

export type LearnSubTab = 'trainings' | 'micro';

export default function LearnPage() {
  const { progress } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Default to 'trainings' tab
  const [activeTab, setActiveTab] = useState<LearnSubTab>('trainings');
  
  // Training filters
  const [trainingFormatFilter, setTrainingFormatFilter] = useState<'all' | TrainingFormat>('all');
  const [trainingDifficultyFilter, setTrainingDifficultyFilter] = useState<string>('all');
  const [trainingSearch, setTrainingSearch] = useState('');
  
  // Micro-learning filters
  const [microSearch, setMicroSearch] = useState('');
  const [microFilterTopic, setMicroFilterTopic] = useState<string>('all');
  const [microFilterTool, setMicroFilterTool] = useState<string>('all');
  const [microFilterSort, setMicroFilterSort] = useState<'default' | 'recent' | 'popular'>('default');

  const tabs: { id: LearnSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'trainings', label: 'Training', icon: <GraduationCap size={18} /> },
    { id: 'micro', label: 'Micro-learning', icon: <Zap size={18} /> },
  ];

  // Find unfinished training (has progress > 0 but not completed)
  const unfinishedTraining = trainings.find(t => t.progress && t.progress > 0 && t.progress < 100);
  
  // Find unfinished micro-learning
  const completedMicroIds = getCompletedMicroIds();
  const unfinishedLesson = microLearnings.find(m => {
    const isCompleted = m.completed || completedMicroIds.has(m.id);
    return !isCompleted && m.progress && m.progress > 0;
  });

  // Filter trainings
  const filteredTrainings = trainings
    .filter(t => {
      const formatOk = trainingFormatFilter === 'all' || t.format === trainingFormatFilter;
      const diffOk = trainingDifficultyFilter === 'all' || t.difficulty === trainingDifficultyFilter;
      const searchOk = !trainingSearch.trim() || 
        (t.title + t.description).toLowerCase().includes(trainingSearch.toLowerCase());
      return formatOk && diffOk && searchOk;
    })
    .slice(0, 6); // Show exactly 6

  // Filter micro-learnings
  const filteredMicro = microLearnings
    .filter(m => {
      const topicOk = microFilterTopic === 'all' || m.topic === microFilterTopic;
      const toolOk = microFilterTool === 'all' || m.tool === microFilterTool;
      const searchOk = !microSearch.trim() || 
        (m.title + m.description).toLowerCase().includes(microSearch.toLowerCase());
      return topicOk && toolOk && searchOk;
    })
    .sort((a, b) => {
      if (microFilterSort === 'recent') return (b.addedAt || '').localeCompare(a.addedAt || '');
      if (microFilterSort === 'popular') return (b.hot ? 1 : 0) - (a.hot ? 1 : 0);
      return 0;
    })
    .slice(0, 6); // Show exactly 6

  // Handle tab state from navigation
  useEffect(() => {
    const state = location.state as { tab?: LearnSubTab; mode?: string } | null;
    const tab = state?.tab;
    const mode = state?.mode;
    
    // Support both 'tab' and 'mode' for backward compatibility
    if (mode === 'training') setActiveTab('trainings');
    else if (tab === 'trainings' || tab === 'micro') setActiveTab(tab);
  }, [location.state]);

  // Get unique topics and tools for filters
  const topics = ['all', ...new Set(microLearnings.map(m => m.topic))];
  const tools = ['all', ...new Set(microLearnings.map(m => m.tool))];

  const getFormatIcon = (format?: TrainingFormat) => {
    switch (format) {
      case 'video': return <Video size={16} />;
      case 'interactive': return <Sparkles size={16} />;
      case 'lms': return <FileText size={16} />;
      case 'certification': return <Star size={16} />;
      default: return <GraduationCap size={16} />;
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary)', backgroundColor: 'var(--app-bg)', minHeight: '100vh' }}>
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
              Learn
            </h1>
            <p className="text-sm sm:text-base" style={{ color: 'var(--app-text-secondary)' }}>
              Build your AI skills with structured training and bite-sized micro-lessons
            </p>
          </div>

          {/* Stats badges */}
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
              <GraduationCap size={16} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {progress.modulesCompleted}/{progress.totalModules} Modules
              </span>
            </motion.div>
            <motion.div
              {...chipToggleMotion()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer"
              style={{ backgroundColor: '#fef6e9', color: '#654510' }}
            >
              <Zap size={16} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>{progress.streak} Streak</span>
            </motion.div>
          </div>
        </div>

        {/* Tab strip */}
        <div className="flex gap-2 rounded-xl p-1" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              {...(activeTab === tab.id ? chipToggleMotion() : secondaryButtonMotion())}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all cursor-pointer"
              style={{
                fontSize: 15,
                fontWeight: activeTab === tab.id ? 600 : 500,
                backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? '#8b5cf6' : 'var(--app-text-secondary)',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(139,92,246,0.15)' : 'none',
              }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* TAB CONTENT */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">
        {/* TRAINING TAB */}
        {activeTab === 'trainings' && (
          <motion.div
            key="trainings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Resume Training Section */}
            {unfinishedTraining && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-6 mb-6"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--app-text-primary)' }}>
                  Resume Training
                </h2>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Training thumbnail */}
                  <div
                    className="w-full sm:w-32 h-32 rounded-lg shrink-0 overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                      position: 'relative',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getFormatIcon(unfinishedTraining.format)}
                      <GraduationCap size={48} style={{ color: 'white', opacity: 0.9 }} />
                    </div>
                  </div>

                  {/* Training details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: '#f3f4f6', color: 'var(--app-text-secondary)' }}
                        >
                          {unfinishedTraining.category}
                        </span>
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                        >
                          {unfinishedTraining.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--app-text-primary)' }}>
                        {unfinishedTraining.title}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: 'var(--app-text-secondary)' }}>
                        {unfinishedTraining.description}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
                          {unfinishedTraining.progress}% complete
                        </span>
                        <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
                          {unfinishedTraining.lessons} lessons • {unfinishedTraining.duration}
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: '#8b5cf6' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${unfinishedTraining.progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    {/* Resume button */}
                    <motion.button
                      {...primaryButtonMotion()}
                      onClick={() => navigate(`/app/learn/trainings/${unfinishedTraining.id}`)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer self-start"
                      style={{ backgroundColor: '#8b5cf6', color: 'white' }}
                    >
                      <Play size={16} />
                      Resume Training
                    </motion.button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Training Library Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
                  Training Library
                </h2>
              </div>

              {/* Filters */}
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--app-text-hint)' }} />
                  <input
                    type="text"
                    placeholder="Search trainings..."
                    value={trainingSearch}
                    onChange={(e) => setTrainingSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none"
                    style={{
                      fontSize: 14,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      color: 'var(--app-text-primary)',
                    }}
                  />
                </div>

                {/* Format filter */}
                <div className="flex gap-2">
                  {['all', 'video', 'interactive', 'lms', 'certification'].map((format) => (
                    <motion.button
                      key={format}
                      {...chipToggleMotion()}
                      onClick={() => setTrainingFormatFilter(format as any)}
                      className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer capitalize"
                      style={{
                        backgroundColor: trainingFormatFilter === format ? '#8b5cf6' : '#ffffff',
                        color: trainingFormatFilter === format ? '#ffffff' : 'var(--app-text-secondary)',
                        border: `1px solid ${trainingFormatFilter === format ? '#8b5cf6' : '#e5e7eb'}`,
                      }}
                    >
                      {format}
                    </motion.button>
                  ))}
                </div>

                {/* Difficulty filter */}
                <div className="flex gap-2">
                  {['all', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                    <motion.button
                      key={diff}
                      {...chipToggleMotion()}
                      onClick={() => setTrainingDifficultyFilter(diff)}
                      className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
                      style={{
                        backgroundColor: trainingDifficultyFilter === diff ? '#8b5cf6' : '#ffffff',
                        color: trainingDifficultyFilter === diff ? '#ffffff' : 'var(--app-text-secondary)',
                        border: `1px solid ${trainingDifficultyFilter === diff ? '#8b5cf6' : '#e5e7eb'}`,
                      }}
                    >
                      {diff}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Training grid - exactly 6 items */}
              <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrainings.map((training, idx) => (
                  <motion.div
                    key={training.id}
                    {...cardHoverMotion()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/app/learn/trainings/${training.id}`)}
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
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: '#f3f4f6', color: 'var(--app-text-secondary)' }}
                        >
                          {getFormatIcon(training.format)}
                          {training.format || 'Course'}
                        </span>
                      </div>
                      {training.progress === 100 && (
                        <CheckCircle size={20} style={{ color: '#22c55e' }} />
                      )}
                    </div>

                    <h3 className="text-base font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                      {training.title}
                    </h3>

                    <p className="text-sm mb-3" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.5 }}>
                      {training.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                      >
                        {training.difficulty}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                        {training.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--app-text-muted)' }}>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {training.duration}
                      </span>
                      <span>{training.lessons} lessons</span>
                    </div>

                    {training.progress && training.progress > 0 && training.progress < 100 && (
                      <div className="mt-3">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ backgroundColor: '#8b5cf6', width: `${training.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </motion.div>
        )}

        {/* MICRO-LEARNING TAB */}
        {activeTab === 'micro' && (
          <motion.div
            key="micro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Resume Lesson Section */}
            {unfinishedLesson && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-6 mb-6"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--app-text-primary)' }}>
                  Resume Lesson
                </h2>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Lesson thumbnail */}
                  <div
                    className="w-full sm:w-32 h-32 rounded-lg shrink-0 overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      position: 'relative',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap size={48} style={{ color: 'white', opacity: 0.9 }} />
                    </div>
                  </div>

                  {/* Lesson details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: '#f3f4f6', color: 'var(--app-text-secondary)' }}
                        >
                          {unfinishedLesson.topic}
                        </span>
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                        >
                          {unfinishedLesson.tool}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--app-text-primary)' }}>
                        {unfinishedLesson.title}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: 'var(--app-text-secondary)' }}>
                        {unfinishedLesson.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                        <Clock size={14} className="inline mr-1" />
                        {unfinishedLesson.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: '#eab308' }}>
                        <Star size={16} />
                        {unfinishedLesson.points} pts
                      </span>
                    </div>

                    {/* Resume button */}
                    <motion.button
                      {...primaryButtonMotion()}
                      onClick={() => navigate(`/app/learn/micro/${unfinishedLesson.id}`)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer self-start"
                      style={{ backgroundColor: '#f59e0b', color: 'white' }}
                    >
                      <Play size={16} />
                      Resume Lesson
                    </motion.button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Micro-learning Library Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--app-text-primary)' }}>
                  Micro-learning Library
                </h2>
              </div>

              {/* Filters */}
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--app-text-hint)' }} />
                  <input
                    type="text"
                    placeholder="Search micro-lessons..."
                    value={microSearch}
                    onChange={(e) => setMicroSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none"
                    style={{
                      fontSize: 14,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      color: 'var(--app-text-primary)',
                    }}
                  />
                </div>

                {/* Topic filter */}
                <select
                  value={microFilterTopic}
                  onChange={(e) => setMicroFilterTopic(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm cursor-pointer outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    color: 'var(--app-text-primary)',
                  }}
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>
                      {topic === 'all' ? 'All Topics' : topic}
                    </option>
                  ))}
                </select>

                {/* Tool filter */}
                <select
                  value={microFilterTool}
                  onChange={(e) => setMicroFilterTool(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm cursor-pointer outline-none"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    color: 'var(--app-text-primary)',
                  }}
                >
                  {tools.map(tool => (
                    <option key={tool} value={tool}>
                      {tool === 'all' ? 'All Tools' : tool}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <div className="flex gap-2">
                  {[
                    { id: 'default', label: 'Default' },
                    { id: 'recent', label: 'Recent' },
                    { id: 'popular', label: 'Popular' },
                  ].map((sort) => (
                    <motion.button
                      key={sort.id}
                      {...chipToggleMotion()}
                      onClick={() => setMicroFilterSort(sort.id as any)}
                      className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
                      style={{
                        backgroundColor: microFilterSort === sort.id ? '#f59e0b' : '#ffffff',
                        color: microFilterSort === sort.id ? '#ffffff' : 'var(--app-text-secondary)',
                        border: `1px solid ${microFilterSort === sort.id ? '#f59e0b' : '#e5e7eb'}`,
                      }}
                    >
                      {sort.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Micro-learning grid - exactly 6 items */}
              <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMicro.map((micro, idx) => {
                  const isCompleted = micro.completed || completedMicroIds.has(micro.id);

                  return (
                    <motion.div
                      key={micro.id}
                      {...cardHoverMotion()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => navigate(`/app/learn/micro/${micro.id}`)}
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
                            style={{ backgroundColor: '#f3f4f6', color: 'var(--app-text-secondary)' }}
                          >
                            {micro.topic}
                          </span>
                          {micro.hot && (
                            <span
                              className="px-2 py-1 rounded text-xs font-semibold"
                              style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                            >
                              🔥 Hot
                            </span>
                          )}
                        </div>
                        {isCompleted && (
                          <CheckCircle size={20} style={{ color: '#22c55e' }} />
                        )}
                      </div>

                      <h3 className="text-base font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                        {micro.title}
                      </h3>

                      <p className="text-sm mb-3" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.5 }}>
                        {micro.description}
                      </p>

                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                        >
                          {micro.tool}
                        </span>
                        {micro.rating && (
                          <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                            ⭐ {micro.rating}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--app-text-muted)' }}>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={14} />
                          {micro.duration}
                        </span>
                        <span className="inline-flex items-center gap-1 font-bold" style={{ color: '#eab308' }}>
                          <Star size={14} />
                          {micro.points} pts
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
