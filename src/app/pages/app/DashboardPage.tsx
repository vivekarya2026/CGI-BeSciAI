/**
 * ============================================
 * DASHBOARD PAGE — DashboardPage.tsx (CGI Design System v16)
 * ============================================
 * Redesigned to match Capstone Figma with CGI Experience Design System
 * Three-column responsive layout with gamified microinteractions
 */

import React, { useState, useEffect } from 'react';
import { motion, useAnimate } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  CheckCircle2, Flame, Star, Trophy, Play, Zap, Sparkles,
  Clock, Calendar, Video, Bell, BookOpen, Users, FileText,
  AlertCircle, MessageSquare,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { learningModules } from '../../data/archetypes';
import {
  microLearnings,
  challenges,
  officeHourLive,
  officeHourUpcoming,
} from '../../data/learnData';
import {
  cardHoverMotion,
  primaryButtonMotion,
  secondaryButtonMotion,
  chipToggleMotion,
} from '../../components/ui/motionPresets';

// CGI Design System Colors
const CGI_COLORS = {
  primary: '#9810fa',
  textPrimary: '#101828',
  textSecondary: '#4a5565',
  border: '#e5e7eb',
  background: '#f9fafb',
  white: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
};

// Learning Journey Stages (6 stages as per Figma)
const JOURNEY_STAGES = [
  { id: 1, label: 'AI Basics', status: 'completed' as const },
  { id: 2, label: 'Prompt Engineering', status: 'completed' as const },
  { id: 3, label: 'Productivity', status: 'completed' as const },
  { id: 4, label: 'Automation', status: 'current' as const },
  { id: 5, label: 'Advanced AI', status: 'locked' as const },
  { id: 6, label: 'AI Mastery', status: 'locked' as const },
];

// Animated counter component
function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

// Time-based greeting
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, progress } = useUser();

  // Calculate stats
  const longestStreak = 21;
  const currentStreak = progress.streak || 14;
  const totalXP = progress.xp || 1850;
  const challengesCompleted = 23;

  // Current lesson (first incomplete module)
  const currentLesson = learningModules.find(m => !m.completed && !m.locked);
  const lessonProgress = 80; // 80% complete
  const timeRemaining = '8 min remaining';

  // Today's challenge
  const dayIndex = Math.floor(Date.now() / 86400000);
  const todayChallenge = challenges[dayIndex % challenges.length];

  // Journey progress
  const completedStages = JOURNEY_STAGES.filter(s => s.status === 'completed').length;
  const totalStages = JOURNEY_STAGES.length;
  const journeyProgress = Math.round((completedStages / totalStages) * 100);

  // Announcements data
  const announcements = [
    {
      id: 1,
      type: 'new' as const,
      icon: <Bell size={20} />,
      title: 'Platform Update',
      description: 'New learning paths available',
      action: 'View',
    },
    {
      id: 2,
      type: 'action' as const,
      icon: <MessageSquare size={20} />,
      title: 'Quick Survey',
      description: 'Help us improve the course',
      action: 'Take Survey',
    },
    {
      id: 3,
      type: 'info' as const,
      icon: <Users size={20} />,
      title: 'Instructor Announcement',
      description: 'New office hours added',
      action: 'View',
    },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: CGI_COLORS.background, minHeight: '100vh' }}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          {/* Greeting */}
          <h1 style={{
            fontSize: 30,
            fontWeight: 700,
            color: CGI_COLORS.textPrimary,
            letterSpacing: '-0.4px',
            marginBottom: 8,
          }}>
            {getTimeBasedGreeting()}, {user?.name || 'Alex'}! 👋
          </h1>
          <p style={{
            fontSize: 18,
            fontWeight: 400,
            color: CGI_COLORS.textSecondary,
            letterSpacing: '-0.44px',
            marginBottom: 24,
          }}>
            Ready to continue your learning journey today?
          </p>

          {/* KPI Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Longest Streak */}
            <motion.div
              {...cardHoverMotion()}
              className="bg-white border rounded-[14px] p-4 flex items-center gap-3"
              style={{
                borderColor: CGI_COLORS.border,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <div className="text-2xl">🏆</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: CGI_COLORS.primary, letterSpacing: '-0.45px' }}>
                  <AnimatedCounter value={longestStreak} />
                </div>
                <div style={{ fontSize: 12, color: CGI_COLORS.textSecondary }}>Longest streak</div>
              </div>
            </motion.div>

            {/* Current Streak */}
            <motion.div
              {...cardHoverMotion()}
              className="bg-white border rounded-[14px] p-4 flex items-center gap-3"
              style={{
                borderColor: CGI_COLORS.border,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <div className="text-2xl">🔥</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: CGI_COLORS.primary, letterSpacing: '-0.45px' }}>
                  <AnimatedCounter value={currentStreak} />
                </div>
                <div style={{ fontSize: 12, color: CGI_COLORS.textSecondary }}>Current streak</div>
              </div>
            </motion.div>

            {/* XP */}
            <motion.div
              {...cardHoverMotion()}
              className="bg-white border rounded-[14px] p-4 flex items-center gap-3"
              style={{
                borderColor: CGI_COLORS.border,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <div className="text-2xl">⭐</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: CGI_COLORS.primary, letterSpacing: '-0.45px' }}>
                  <AnimatedCounter value={totalXP} />
                </div>
                <div style={{ fontSize: 12, color: CGI_COLORS.textSecondary }}>XP</div>
              </div>
            </motion.div>

            {/* Challenges Completed */}
            <motion.div
              {...cardHoverMotion()}
              className="bg-white border rounded-[14px] p-4 flex items-center gap-3"
              style={{
                borderColor: CGI_COLORS.border,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <div className="text-2xl">✅</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: CGI_COLORS.primary, letterSpacing: '-0.45px' }}>
                  <AnimatedCounter value={challengesCompleted} />
                </div>
                <div style={{ fontSize: 12, color: CGI_COLORS.textSecondary }}>Challenges Completed</div>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content: 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Resume Where You Left Off */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border rounded-[14px] p-6"
              style={{
                borderColor: CGI_COLORS.border,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, color: CGI_COLORS.textPrimary, marginBottom: 16 }}>
                Resume Where You Left Off
              </h2>

              {currentLesson && (
                <motion.div
                  {...cardHoverMotion()}
                  className="flex flex-col sm:flex-row gap-4 cursor-pointer"
                  onClick={() => navigate('/app/learn')}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-full sm:w-32 h-32 rounded-lg shrink-0 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <BookOpen size={48} color="white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: CGI_COLORS.textPrimary, marginBottom: 8 }}>
                        Understanding AI Context Windows
                      </h3>
                      <span
                        className="inline-block px-2 py-1 rounded text-xs font-medium mb-3"
                        style={{ backgroundColor: '#f3f4f6', color: CGI_COLORS.textSecondary }}
                      >
                        Communication Foundations
                      </span>
                    </div>

                    <div>
                      {/* Progress Bar */}
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span style={{ color: CGI_COLORS.textSecondary }}>{lessonProgress}% complete</span>
                        <span style={{ color: CGI_COLORS.textSecondary }}>{timeRemaining}</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: CGI_COLORS.primary }}
                          initial={{ width: 0 }}
                          animate={{ width: `${lessonProgress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>

                      {/* Button */}
                      <motion.button
                        {...primaryButtonMotion()}
                        onClick={(e) => { e.stopPropagation(); navigate('/app/learn'); }}
                        className="px-6 py-2.5 rounded-[10px] font-semibold text-sm"
                        style={{ backgroundColor: CGI_COLORS.primary, color: 'white' }}
                      >
                        Resume Lesson
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.section>

            {/* Today's Challenge */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border rounded-[14px] p-6"
              style={{
                borderColor: CGI_COLORS.border,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, color: CGI_COLORS.textPrimary, marginBottom: 8 }}>
                Today's Challenge
              </h2>
              <p style={{ fontSize: 14, color: CGI_COLORS.textSecondary, marginBottom: 16 }}>
                Complete this to keep your streak going
              </p>

              <motion.div
                {...cardHoverMotion()}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[10px] p-5 cursor-pointer"
                onClick={() => navigate('/app/challenges')}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <Zap size={20} style={{ color: CGI_COLORS.primary }} />
                  </div>
                  <div className="flex-1">
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: CGI_COLORS.textPrimary, marginBottom: 4 }}>
                      {todayChallenge.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm" style={{ color: CGI_COLORS.textSecondary }}>
                      <Clock size={14} />
                      <span>{todayChallenge.time}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  {...primaryButtonMotion()}
                  onClick={(e) => { e.stopPropagation(); navigate('/app/challenges'); }}
                  className="w-full px-6 py-3 rounded-[10px] font-semibold text-sm"
                  style={{ backgroundColor: CGI_COLORS.primary, color: 'white' }}
                >
                  Start Challenge
                </motion.button>
              </motion.div>
            </motion.section>

            {/* Your Learning Journey */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border rounded-[14px] p-6"
              style={{
                borderColor: CGI_COLORS.border,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} style={{ color: CGI_COLORS.primary }} />
                <h2 style={{ fontSize: 20, fontWeight: 700, color: CGI_COLORS.textPrimary }}>
                  Your Learning Journey
                </h2>
              </div>
              <p style={{ fontSize: 14, color: CGI_COLORS.textSecondary, marginBottom: 24 }}>
                You'll gain 6 new skills by completing this program
              </p>

              {/* Timeline */}
              <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
                {JOURNEY_STAGES.map((stage, index) => (
                  <React.Fragment key={stage.id}>
                    {/* Stage Circle */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex flex-col items-center gap-2"
                      style={{ minWidth: 80 }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm"
                        style={{
                          backgroundColor:
                            stage.status === 'completed'
                              ? CGI_COLORS.primary
                              : stage.status === 'current'
                              ? 'white'
                              : '#f3f4f6',
                          color:
                            stage.status === 'completed'
                              ? 'white'
                              : stage.status === 'current'
                              ? CGI_COLORS.primary
                              : CGI_COLORS.textSecondary,
                          border: stage.status === 'current' ? `2px solid ${CGI_COLORS.primary}` : 'none',
                        }}
                      >
                        {stage.status === 'completed' ? <CheckCircle2 size={24} /> : index + 1}
                      </div>
                      <span
                        className="text-xs text-center"
                        style={{
                          color:
                            stage.status === 'completed' || stage.status === 'current'
                              ? CGI_COLORS.textPrimary
                              : CGI_COLORS.textSecondary,
                          fontWeight: stage.status === 'current' ? 600 : 400,
                        }}
                      >
                        {stage.label}
                      </span>
                    </motion.div>

                    {/* Connector Line */}
                    {index < JOURNEY_STAGES.length - 1 && (
                      <div
                        className="flex-1 h-0.5 mx-2"
                        style={{
                          backgroundColor:
                            JOURNEY_STAGES[index + 1].status === 'completed'
                              ? CGI_COLORS.primary
                              : '#e5e7eb',
                          minWidth: 20,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span style={{ color: CGI_COLORS.textSecondary }}>
                    {completedStages} of {totalStages} modules completed
                  </span>
                  <span style={{ color: CGI_COLORS.textPrimary, fontWeight: 600 }}>
                    {journeyProgress}% complete
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: CGI_COLORS.primary }}
                    initial={{ width: 0 }}
                    animate={{ width: `${journeyProgress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming & Learning Updates */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border rounded-[14px] p-6"
              style={{
                borderColor: CGI_COLORS.border,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, color: CGI_COLORS.textPrimary, marginBottom: 16 }}>
                Upcoming & Learning Updates
              </h2>

              <div className="space-y-4">
                {/* Live Session */}
                {officeHourLive && (
                  <motion.div
                    {...cardHoverMotion()}
                    className="border rounded-[10px] p-4 cursor-pointer"
                    style={{ borderColor: CGI_COLORS.border }}
                    onClick={() => navigate('/app/office-hours')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                      >
                        Live Session
                      </span>
                      <Users size={16} style={{ color: CGI_COLORS.textSecondary }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: CGI_COLORS.textPrimary, marginBottom: 8 }}>
                      {officeHourLive.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: CGI_COLORS.textSecondary }}>
                      Tomorrow • 2:00 PM
                    </p>
                    <p className="text-xs mb-3" style={{ color: CGI_COLORS.textSecondary }}>
                      Instructor: {officeHourLive.instructor}
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        {...primaryButtonMotion()}
                        onClick={(e) => { e.stopPropagation(); navigate('/app/office-hours'); }}
                        className="flex-1 px-4 py-2 rounded-[10px] font-medium text-sm"
                        style={{ backgroundColor: CGI_COLORS.primary, color: 'white' }}
                      >
                        Join
                      </motion.button>
                      <motion.button
                        {...secondaryButtonMotion()}
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-[10px] font-medium text-sm border"
                        style={{ borderColor: CGI_COLORS.border, color: CGI_COLORS.textPrimary }}
                      >
                        Remind Me
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Upcoming Sessions */}
                {officeHourUpcoming.slice(0, 2).map((session) => (
                  <motion.div
                    key={session.id}
                    {...cardHoverMotion()}
                    className="border rounded-[10px] p-4 cursor-pointer"
                    style={{ borderColor: CGI_COLORS.border }}
                    onClick={() => navigate('/app/office-hours')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                      >
                        New Lesson
                      </span>
                      <BookOpen size={16} style={{ color: CGI_COLORS.textSecondary }} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: CGI_COLORS.textPrimary, marginBottom: 8 }}>
                      {session.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: CGI_COLORS.textSecondary }}>
                      {session.duration}
                    </p>
                    <motion.button
                      {...secondaryButtonMotion()}
                      onClick={(e) => { e.stopPropagation(); navigate('/app/office-hours'); }}
                      className="w-full px-4 py-2 rounded-[10px] font-medium text-sm border"
                      style={{ borderColor: CGI_COLORS.border, color: CGI_COLORS.textPrimary }}
                    >
                      Start
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Announcements & Feedback */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white border rounded-[14px] p-6"
              style={{
                borderColor: CGI_COLORS.border,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, color: CGI_COLORS.textPrimary, marginBottom: 16 }}>
                Announcements & Feedback
              </h2>

              <div className="space-y-4">
                {announcements.map((item) => (
                  <motion.div
                    key={item.id}
                    {...cardHoverMotion()}
                    className="border rounded-[10px] p-4 cursor-pointer"
                    style={{ borderColor: CGI_COLORS.border }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor:
                            item.type === 'new'
                              ? '#dbeafe'
                              : item.type === 'action'
                              ? '#fef3c7'
                              : '#f3f4f6',
                          color:
                            item.type === 'new'
                              ? '#1e40af'
                              : item.type === 'action'
                              ? '#92400e'
                              : CGI_COLORS.textSecondary,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 style={{ fontSize: 14, fontWeight: 600, color: CGI_COLORS.textPrimary }}>
                            {item.title}
                          </h3>
                          {item.type === 'new' && (
                            <span
                              className="px-2 py-0.5 rounded text-xs font-semibold"
                              style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                            >
                              New
                            </span>
                          )}
                          {item.type === 'action' && (
                            <span
                              className="px-2 py-0.5 rounded text-xs font-semibold"
                              style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                            >
                              Action Needed
                            </span>
                          )}
                        </div>
                        <p className="text-sm mb-3" style={{ color: CGI_COLORS.textSecondary }}>
                          {item.description}
                        </p>
                        <motion.button
                          {...secondaryButtonMotion()}
                          className="px-4 py-1.5 rounded-[10px] font-medium text-xs border"
                          style={{ borderColor: CGI_COLORS.border, color: CGI_COLORS.textPrimary }}
                        >
                          {item.action}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
