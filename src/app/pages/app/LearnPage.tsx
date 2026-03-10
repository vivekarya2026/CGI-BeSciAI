/**
 * ============================================
 * 📖 LEARN PAGE — LearnPage.tsx
 * ============================================
 * Redesigned with Training and Micro-learning tabs matching screenshots
 * CGI Design System 16.0.0 with gamified interactions
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, Zap, Play, Search, CheckCircle, Clock,
  Star, Sparkles, ChevronDown, ChevronRight,
} from 'lucide-react';
import {
  trainings,
  microLearnings,
  type TrainingFormat,
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

  const [activeTab, setActiveTab] = useState<LearnSubTab>('trainings');
  
  // Training filters
  const [trainingSubjectFilter, setTrainingSubjectFilter] = useState<string>('all');
  const [trainingFormatFilter, setTrainingFormatFilter] = useState<string>('all');
  const [trainingLevelFilter, setTrainingLevelFilter] = useState<string>('all');
  
  // Micro-learning filters
  const [microTopicFilter, setMicroTopicFilter] = useState<string>('all');
  const [microToolFilter, setMicroToolFilter] = useState<string>('all');
  const [microSortFilter, setMicroSortFilter] = useState<string>('default');

  // Find unfinished training
  const unfinishedTraining = trainings.find(t => t.progress && t.progress > 0 && t.progress < 100);
  
  // Find unfinished micro-learning
  const completedMicroIds = getCompletedMicroIds();
  const unfinishedLesson = microLearnings.find(m => {
    const isCompleted = m.completed || completedMicroIds.has(m.id);
    return !isCompleted && m.progress && m.progress > 0;
  });

  // Filter trainings
  const filteredTrainings = trainings.filter(t => {
    const subjectOk = trainingSubjectFilter === 'all' || t.category === trainingSubjectFilter;
    const formatOk = trainingFormatFilter === 'all' || t.format === trainingFormatFilter;
    const levelOk = trainingLevelFilter === 'all' || t.difficulty === trainingLevelFilter;
    return subjectOk && formatOk && levelOk;
  });

  // Filter micro-learnings
  const filteredMicro = microLearnings.filter(m => {
    const topicOk = microTopicFilter === 'all' || m.topic === microTopicFilter;
    const toolOk = microToolFilter === 'all' || m.tool === microToolFilter;
    return topicOk && toolOk;
  }).sort((a, b) => {
    if (microSortFilter === 'recent') return (b.addedAt || '').localeCompare(a.addedAt || '');
    if (microSortFilter === 'popular') return (b.hot ? 1 : 0) - (a.hot ? 1 : 0);
    return 0;
  }).slice(0, 6);

  // Handle tab from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'trainings' || tab === 'micro') {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Get unique values for filters
  const subjects = ['all', ...new Set(trainings.map(t => t.category))];
  const formats = ['all', ...new Set(trainings.map(t => t.format).filter(Boolean))];
  const levels = ['all', ...new Set(trainings.map(t => t.difficulty).filter(Boolean))];
  const topics = ['all', ...new Set(microLearnings.map(m => m.topic))];
  const tools = ['all', ...new Set(microLearnings.map(m => m.tool))];

  const getTopicColor = (topic: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Writing': { bg: '#fce7f3', text: '#9f1239' },
      'Productivity': { bg: '#dbeafe', text: '#1e40af' },
      'Data': { bg: '#dcfce7', text: '#166534' },
      'Communication': { bg: '#fef3c7', text: '#92400e' },
    };
    return colors[topic] || { bg: '#f3f4f6', text: '#374151' };
  };

  return (
    <div style={{ fontFamily: 'var(--font-primary)', backgroundColor: 'var(--app-bg)', minHeight: '100vh' }}>
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
          {activeTab === 'trainings' ? 'Trainings' : 'Micro-learnings'}
        </h1>
        <p className="text-sm sm:text-base" style={{ color: 'var(--app-text-secondary)' }}>
          {activeTab === 'trainings' 
            ? 'Build your AI skills with personalized training paths' 
            : 'Quick, focused lessons to master specific AI tools and techniques'}
        </p>
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
            {/* Continue Training Section */}
            {unfinishedTraining && (
              <section className="mb-6">
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--app-text-primary)' }}>
                  Continue Training
                </h2>

                <motion.div
                  {...cardHoverMotion()}
                  className="rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Training Image */}
                    <div
                      className="w-full sm:w-48 h-48 sm:h-auto shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        position: 'relative',
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap size={64} style={{ color: 'white', opacity: 0.9 }} />
                      </div>
                    </div>

                    {/* Training Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="px-2.5 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                        >
                          {unfinishedTraining.difficulty}
                        </span>
                        <span
                          className="px-2.5 py-1 rounded text-xs font-semibold"
                          style={{ backgroundColor: '#f3f4f6', color: 'var(--app-text-secondary)' }}
                        >
                          {unfinishedTraining.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                        {unfinishedTraining.title}
                      </h3>

                      <p className="text-sm mb-4" style={{ color: 'var(--app-text-secondary)' }}>
                        Step {Math.ceil((unfinishedTraining.progress || 0) / (100 / (unfinishedTraining.lessons || 8)))} of journey
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
                            {unfinishedTraining.progress}% complete
                          </span>
                          <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>
                            30 min
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

                      {/* Continue Button - Aligned Right */}
                      <div className="flex justify-end">
                        <motion.button
                          {...primaryButtonMotion()}
                          onClick={() => navigate(`/app/learn/trainings/${unfinishedTraining.id}`)}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer"
                          style={{ backgroundColor: '#8b5cf6', color: 'white' }}
                        >
                          <Play size={16} />
                          Continue Learning
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={trainingSubjectFilter}
                onChange={(e) => setTrainingSubjectFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm cursor-pointer outline-none"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  color: 'var(--app-text-primary)',
                }}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subject' : subject}
                  </option>
                ))}
              </select>

              <select
                value={trainingFormatFilter}
                onChange={(e) => setTrainingFormatFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm cursor-pointer outline-none"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  color: 'var(--app-text-primary)',
                }}
              >
                {formats.map(format => (
                  <option key={format} value={format}>
                    {format === 'all' ? 'All Format' : format}
                  </option>
                ))}
              </select>

              <select
                value={trainingLevelFilter}
                onChange={(e) => setTrainingLevelFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm cursor-pointer outline-none"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  color: 'var(--app-text-primary)',
                }}
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Level' : level}
                  </option>
                ))}
              </select>
            </div>

            {/* Training Grid - 3 columns */}
            <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrainings.slice(0, 6).map((training, idx) => {
                const isCompleted = training.progress === 100;
                const isInProgress = training.progress && training.progress > 0 && training.progress < 100;

                return (
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
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {isCompleted && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: '#dcfce7', color: '#166534' }}
                        >
                          <CheckCircle size={12} />
                          Completed
                        </span>
                      )}
                      <span
                        className="px-2.5 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: '#f3f4f6', color: 'var(--app-text-secondary)' }}
                      >
                        {training.category}
                      </span>
                      {idx === 0 && !isCompleted && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                        >
                          <Star size={12} />
                          Popular
                        </span>
                      )}
                      {idx === 1 && !isCompleted && (
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                        >
                          Required
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                      {training.title}
                    </h3>

                    <p className="text-sm mb-4" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.5 }}>
                      {training.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: 'var(--app-text-muted)' }}>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {training.duration}
                      </span>
                      <span>{training.lessons} lessons</span>
                      <span className="inline-flex items-center gap-1" style={{ color: '#8b5cf6', fontWeight: 600 }}>
                        <Sparkles size={14} />
                        +250 XP
                      </span>
                    </div>

                    {/* Progress Bar (for in-progress) */}
                    {isInProgress && (
                      <div className="mb-4">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ backgroundColor: '#8b5cf6', width: `${training.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <motion.button
                      {...primaryButtonMotion()}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/learn/trainings/${training.id}`);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer"
                      style={{
                        backgroundColor: isCompleted ? '#22c55e' : '#8b5cf6',
                        color: 'white',
                      }}
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
                  </motion.div>
                );
              })}
            </motion.div>
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
            {/* Continue Learning Section */}
            {unfinishedLesson && (
              <section className="mb-6">
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--app-text-primary)' }}>
                  Continue Learning
                </h2>

                <motion.div
                  {...cardHoverMotion()}
                  className="rounded-xl p-6 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                    color: 'white',
                  }}
                  onClick={() => navigate(`/app/learn/micro/${unfinishedLesson.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Play Icon */}
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                      <Play size={32} />
                    </div>

                    {/* Lesson Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded text-xs font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                          {unfinishedLesson.topic}
                        </span>
                        <span className="px-2.5 py-1 rounded text-xs font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                          {unfinishedLesson.tool}
                        </span>
                        <span className="px-2.5 py-1 rounded text-xs font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                          Intermediate
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-2">{unfinishedLesson.title}</h3>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={14} />
                          {unfinishedLesson.duration}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Sparkles size={14} />
                          +{unfinishedLesson.points} pts
                        </span>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <motion.button
                      {...primaryButtonMotion()}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/learn/micro/${unfinishedLesson.id}`);
                      }}
                      className="px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer shrink-0"
                      style={{ backgroundColor: 'white', color: '#8b5cf6' }}
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              </section>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={microTopicFilter}
                onChange={(e) => setMicroTopicFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm cursor-pointer outline-none"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  color: 'var(--app-text-primary)',
                }}
              >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic === 'all' ? 'All Topic' : topic}
                  </option>
                ))}
              </select>

              <select
                value={microToolFilter}
                onChange={(e) => setMicroToolFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm cursor-pointer outline-none"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  color: 'var(--app-text-primary)',
                }}
              >
                {tools.map(tool => (
                  <option key={tool} value={tool}>
                    {tool === 'all' ? 'All Tool' : tool}
                  </option>
                ))}
              </select>

              <select
                value={microSortFilter}
                onChange={(e) => setMicroSortFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm cursor-pointer outline-none"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  color: 'var(--app-text-primary)',
                }}
              >
                <option value="default">Default</option>
                <option value="recent">Recent</option>
                <option value="popular">Popular</option>
              </select>
            </div>

            {/* Micro-learning Grid - 3 columns, 6 items */}
            <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMicro.map((micro, idx) => {
                const isCompleted = micro.completed || completedMicroIds.has(micro.id);
                const topicColors = getTopicColor(micro.topic);

                return (
                  <motion.div
                    key={micro.id}
                    {...cardHoverMotion()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-xl p-5 cursor-pointer relative"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                    onClick={() => navigate(`/app/learn/micro/${micro.id}`)}
                  >
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className="px-2.5 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: topicColors.bg, color: topicColors.text }}
                      >
                        {micro.topic}
                      </span>
                      <span
                        className="px-2.5 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                      >
                        {micro.tool}
                      </span>
                      {isCompleted && (
                        <CheckCircle size={16} style={{ color: '#22c55e' }} />
                      )}
                      {!isCompleted && micro.hot && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                        >
                          <Star size={12} />
                          Trending
                        </span>
                      )}
                      {!isCompleted && !micro.hot && idx % 3 === 1 && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                        >
                          <Star size={12} />
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold mb-2" style={{ color: 'var(--app-text-primary)' }}>
                      {micro.title}
                    </h3>

                    <p className="text-sm mb-4" style={{ color: 'var(--app-text-secondary)', lineHeight: 1.5 }}>
                      {micro.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: 'var(--app-text-muted)' }}>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {micro.duration}
                      </span>
                      <span className="inline-flex items-center gap-1" style={{ color: '#8b5cf6', fontWeight: 600 }}>
                        <Sparkles size={14} />
                        +{micro.points} XP
                      </span>
                    </div>

                    {/* Completion Progress */}
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-xs mb-3" style={{ color: '#22c55e' }}>
                        <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                        <span className="font-semibold">Review</span>
                      </div>
                    )}

                    {/* Circular Start Now Button */}
                    {!isCompleted && (
                      <motion.button
                        {...primaryButtonMotion()}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/app/learn/micro/${micro.id}`);
                        }}
                        className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                        style={{
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
                        }}
                      >
                        <Play size={18} />
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
