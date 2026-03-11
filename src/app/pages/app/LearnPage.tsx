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
  GraduationCap, Zap, Play, CheckCircle, Clock,
  Star, Sparkles, ChevronDown, ChevronRight,
} from 'lucide-react';
import {
  trainings,
  microLearnings,
  getCompletedMicroIds,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import {
  cardHoverMotion,
  primaryButtonMotion,
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
  
  // Find unfinished micro-learning or show most recent/recommended
  const completedMicroIds = getCompletedMicroIds();
  const unfinishedLesson = microLearnings.find(m => {
    const isCompleted = m.completed || completedMicroIds.has(m.id);
    return !isCompleted && m.progress && m.progress > 0;
  });
  
  // If no unfinished lesson, show the first non-completed lesson as recommended
  const recommendedLesson = unfinishedLesson || microLearnings.find(m => {
    const isCompleted = m.completed || completedMicroIds.has(m.id);
    return !isCompleted;
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

  const getTopicClass = (topic: string) => {
    const classes: Record<string, string> = {
      'Writing': 'topic-writing',
      'Productivity': 'topic-productivity',
      'Data': 'topic-data',
      'Communication': 'topic-communication',
    };
    return classes[topic] || 'badge-gray';
  };

  return (
    <div className="font-primary bg-app-bg min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-app-primary">
          {activeTab === 'trainings' ? 'Trainings' : 'Micro-learnings'}
        </h1>
        <p className="text-sm sm:text-base text-app-secondary">
          {activeTab === 'trainings' 
            ? 'Build your AI skills with personalized training paths' 
            : 'Quick, focused lessons to master specific AI tools and techniques'}
        </p>
      </div>

      {/* TAB CONTENT */}
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
                <h2 className="text-lg font-bold mb-4 text-app-primary">
                  Continue Training
                </h2>

                <motion.div
                  {...cardHoverMotion()}
                  className="card-base overflow-hidden cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Training Image */}
                    <div 
                      className="w-full sm:w-48 h-48 sm:h-auto shrink-0 relative bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%), url('/assets/Frame_30-b2059e27-34a7-430f-aed1-416718844c14.png')`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap size={64} className="text-white opacity-90" />
                      </div>
                    </div>

                    {/* Training Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="badge-base badge-yellow">
                          {unfinishedTraining.difficulty}
                        </span>
                        <span className="badge-base badge-gray">
                          {unfinishedTraining.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-2 text-app-primary">
                        {unfinishedTraining.title}
                      </h3>

                      <p className="text-sm mb-4 text-app-secondary">
                        Step {Math.ceil((unfinishedTraining.progress || 0) / (100 / (unfinishedTraining.lessons || 8)))} of journey
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-app-muted">
                            {unfinishedTraining.progress}% complete
                          </span>
                          <span className="text-xs font-medium text-app-muted">
                            30 min
                          </span>
                        </div>
                        <div className="progress-bar-bg progress-bar-bg-thick">
                          <motion.div
                            className="progress-bar-fill"
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
                          className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer"
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
              <div className="relative">
                <select
                  value={trainingSubjectFilter}
                  onChange={(e) => setTrainingSubjectFilter(e.target.value)}
                  className="dropdown-base"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subject' : subject}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
              </div>

              <div className="relative">
                <select
                  value={trainingFormatFilter}
                  onChange={(e) => setTrainingFormatFilter(e.target.value)}
                  className="dropdown-base"
                >
                  {formats.map(format => (
                    <option key={format} value={format}>
                      {format === 'all' ? 'All Format' : format}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
              </div>

              <div className="relative">
                <select
                  value={trainingLevelFilter}
                  onChange={(e) => setTrainingLevelFilter(e.target.value)}
                  className="dropdown-base"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Level' : level}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
              </div>
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
                    className="card-base p-5 cursor-pointer"
                  >
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {isCompleted && (
                        <span className="badge-base badge-green inline-flex items-center gap-1">
                          <CheckCircle size={12} />
                          Completed
                        </span>
                      )}
                      <span className="badge-base badge-gray">
                        {training.category}
                      </span>
                      {idx === 0 && !isCompleted && (
                        <span className="badge-base badge-popular inline-flex items-center gap-1">
                          <Star size={12} />
                          Popular
                        </span>
                      )}
                      {idx === 1 && !isCompleted && (
                        <span className="badge-base badge-required">
                          Required
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold mb-2 text-app-primary">
                      {training.title}
                    </h3>

                    <p className="text-sm mb-4 text-app-secondary leading-relaxed">
                      {training.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-app-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {training.duration}
                      </span>
                      <span>{training.lessons} lessons</span>
                      <span className="inline-flex items-center gap-1 text-[#8b5cf6] font-semibold">
                        <Sparkles size={14} />
                        +250 XP
                      </span>
                    </div>

                    {/* Progress Bar (for in-progress) */}
                    {isInProgress && (
                      <div className="mb-4">
                        <div className="progress-bar-bg progress-bar-bg-thin">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${training.progress}%` }}
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
                      className={clsx(
                        "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer text-white",
                        isCompleted ? "btn-success" : "btn-primary"
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
            {recommendedLesson && (
              <section className="mb-6">
                <h2 className="text-lg font-bold mb-4 text-app-primary">
                  Continue Learning
                </h2>

                <motion.div
                  {...cardHoverMotion()}
                  className="micro-continue-card cursor-pointer"
                  onClick={() => navigate(`/app/learn/micro/${recommendedLesson.id}`)}
                >
                  <div className="flex items-center gap-6">
                    {/* Play Icon - Left */}
                    <div className="micro-continue-play-icon">
                      <Play size={40} className="text-white" />
                    </div>

                    {/* Lesson Details - Center */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="micro-continue-badge-topic">
                          {recommendedLesson.topic}
                        </span>
                        <span className="micro-continue-badge-tool">
                          {recommendedLesson.tool}
                        </span>
                        <span className="micro-continue-badge-level">
                          Intermediate
                        </span>
                      </div>

                      <h3 className="micro-continue-title mb-2">
                        {recommendedLesson.title}
                      </h3>

                      <div className="micro-continue-meta">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={16} />
                          {recommendedLesson.duration}
                        </span>
                        <span className="inline-flex items-center gap-1 micro-continue-meta-points">
                          +{recommendedLesson.points} pts
                        </span>
                      </div>
                    </div>

                    {/* Continue Button - Right */}
                    <motion.button
                      {...primaryButtonMotion()}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/learn/micro/${recommendedLesson.id}`);
                      }}
                      className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-base cursor-pointer shrink-0"
                    >
                      <Play size={20} />
                      {unfinishedLesson ? 'Continue' : 'Start Now'}
                    </motion.button>
                  </div>
                </motion.div>
              </section>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative">
                <select
                  value={microTopicFilter}
                  onChange={(e) => setMicroTopicFilter(e.target.value)}
                  className="dropdown-base"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>
                      {topic === 'all' ? 'All Topic' : topic}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
              </div>

              <div className="relative">
                <select
                  value={microToolFilter}
                  onChange={(e) => setMicroToolFilter(e.target.value)}
                  className="dropdown-base"
                >
                  {tools.map(tool => (
                    <option key={tool} value={tool}>
                      {tool === 'all' ? 'All Tool' : tool}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
              </div>

              <div className="relative">
                <select
                  value={microSortFilter}
                  onChange={(e) => setMicroSortFilter(e.target.value)}
                  className="dropdown-base"
                >
                  <option value="default">Default</option>
                  <option value="recent">Recent</option>
                  <option value="popular">Popular</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
              </div>
            </div>

            {/* Micro-learning Grid - 3 columns, 6 items */}
            <motion.div {...staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMicro.map((micro, idx) => {
                const isCompleted = micro.completed || completedMicroIds.has(micro.id);

                return (
                  <motion.div
                    key={micro.id}
                    {...cardHoverMotion()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card-base p-5 cursor-pointer relative"
                    onClick={() => navigate(`/app/learn/micro/${micro.id}`)}
                  >
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={clsx("badge-base", getTopicClass(micro.topic))}>
                        {micro.topic}
                      </span>
                      <span className="badge-base badge-blue">
                        {micro.tool}
                      </span>
                      {isCompleted && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                      {!isCompleted && micro.hot && (
                        <span className="badge-base badge-trending inline-flex items-center gap-1">
                          <Star size={12} />
                          Trending
                        </span>
                      )}
                      {!isCompleted && !micro.hot && idx % 3 === 1 && (
                        <span className="badge-base badge-popular inline-flex items-center gap-1">
                          <Star size={12} />
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold mb-2 text-app-primary">
                      {micro.title}
                    </h3>

                    <p className="text-sm mb-4 text-app-secondary leading-relaxed">
                      {micro.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-app-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        {micro.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#8b5cf6] font-semibold">
                        <Sparkles size={14} />
                        +{micro.points} XP
                      </span>
                    </div>

                    {/* Completion Progress */}
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-xs text-green-500 mb-3">
                        <div className="flex-1 h-1 rounded-full bg-green-500" />
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
                        className="circular-action-btn absolute bottom-4 right-4"
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
