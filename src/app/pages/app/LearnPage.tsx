/**
 * ============================================
 * 📖 LEARN PAGE — LearnPage.tsx
 * ============================================
 * Learn section landing: header, progress, "Continue where you left off" banner,
 * then 4 tabs: My Learning Path, Challenges, Trainings, Micro-Learnings.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, Target, GraduationCap, Zap, Play, ChevronRight,
  CheckCircle, Search, Video, Bookmark, Sparkles, Users, Headphones, Clock,
} from 'lucide-react';
import { learningModules } from '../../data/archetypes';
import {
  challenges,
  trainings,
  microLearnings,
  type ChallengeType,
  type TrainingFormat,
  isChallengeSaved,
  isTrainingSaved,
  getCompletedMicroIds,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import { useNavigate, useLocation } from 'react-router';
import { useChallengeTour } from '../../context/ChallengeTourContext';
import {
  cardHoverMotion,
  primaryButtonMotion,
  secondaryButtonMotion,
  chipToggleMotion,
  staggerContainer,
} from '../../components/ui/motionPresets';

export type LearnSubTab = 'path' | 'challenges' | 'trainings' | 'micro';

const JOURNEY_STAGES = [
  { id: 1, label: 'AI Basics', done: true },
  { id: 2, label: 'Prompt Craft', done: true },
  { id: 3, label: 'Productivity', done: true },
  { id: 4, label: 'Advanced', done: false, current: true },
  { id: 5, label: 'Automation', done: false },
  { id: 6, label: 'Mastery', done: false },
];

export default function LearnPage() {
  const { progress } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<LearnSubTab>('path');
  const [challengeFilter, setChallengeFilter] = useState<'all' | ChallengeType>('all');
  const [challengeSearch, setChallengeSearch] = useState('');
  const [trainingFormatFilter, setTrainingFormatFilter] = useState<'all' | TrainingFormat>('all');
  const [trainingDifficultyFilter, setTrainingDifficultyFilter] = useState<string>('all');
  const [microSearch, setMicroSearch] = useState('');
  const [microFilterTopic, setMicroFilterTopic] = useState<string>('all');
  const [microFilterTool, setMicroFilterTool] = useState<string>('all');
  const [microFilterSort, setMicroFilterSort] = useState<'default' | 'recent' | 'popular'>('default');

  const tabs: { id: LearnSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'path', label: 'My Learning Path', icon: <BookOpen size={16} /> },
    { id: 'challenges', label: 'Challenges', icon: <Target size={16} /> },
    { id: 'trainings', label: 'Trainings', icon: <GraduationCap size={16} /> },
    { id: 'micro', label: 'Micro-Learnings', icon: <Zap size={16} /> },
  ];

  const { startChallengeTour } = useChallengeTour();
  const completed = learningModules.filter(m => m.completed);
  const current = learningModules.find(m => !m.completed && !m.locked);
  const upcoming = learningModules.filter(m => !m.completed && m.id !== current?.id);
  const dayIndex = Math.floor(Date.now() / 86400000);
  const todayMicro = microLearnings[dayIndex % microLearnings.length];

  const journeyPct = progress.totalModules ? Math.round((progress.modulesCompleted / progress.totalModules) * 100) : 0;
  const completedMicroIds = getCompletedMicroIds();
  const microCompleted = microLearnings.filter(m => m.completed || completedMicroIds.has(m.id)).length;
  const microPoints = microLearnings.filter(m => m.completed || completedMicroIds.has(m.id)).reduce((sum, m) => sum + m.points, 0);

  const filteredTrainings = trainings.filter(t => {
    const formatOk = trainingFormatFilter === 'all' || t.format === trainingFormatFilter;
    const diffOk = trainingDifficultyFilter === 'all' || t.difficulty === trainingDifficultyFilter;
    return formatOk && diffOk;
  });

  const filteredMicro = microLearnings
    .filter(m => {
      const topicOk = microFilterTopic === 'all' || m.topic === microFilterTopic;
      const toolOk = microFilterTool === 'all' || m.tool === microFilterTool;
      const searchOk = !microSearch.trim() || (m.title + m.description).toLowerCase().includes(microSearch.toLowerCase());
      return topicOk && toolOk && searchOk;
    })
    .sort((a, b) => {
      if (microFilterSort === 'recent') return (b.addedAt || '').localeCompare(a.addedAt || '');
      if (microFilterSort === 'popular') return (b.hot ? 1 : 0) - (a.hot ? 1 : 0);
      return 0;
    });

  useEffect(() => {
    const state = location.state as { tab?: LearnSubTab } | null;
    const tab = state?.tab;
    if (tab === 'path' || tab === 'challenges' || tab === 'trainings' || tab === 'micro') setActiveTab(tab);
  }, [location.state]);

  const filteredChallenges = challenges
    .filter(c => challengeFilter === 'all' || c.type === challengeFilter)
    .filter(c => !challengeSearch.trim() || (c.title + c.description).toLowerCase().includes(challengeSearch.toLowerCase()));

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* ---------- Learn landing: header + progress + continue banner ---------- */}
      <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--app-text-primary)' }}>Learn</h1>
          <p style={{ fontSize: 16, color: 'var(--app-text-secondary)', lineHeight: '24px' }}>
            Build your AI skills with personalized paths, challenges, and resources.
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
          <motion.button
            {...secondaryButtonMotion()}
            onClick={startChallengeTour}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium"
            style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)', backgroundColor: 'var(--app-surface)' }}
          >
            <BookOpen size={14} /> Show me around
          </motion.button>
        </div>
      </div>

      {/* Two cards: Today's Micro Learning (left) + Continue Learning / Start challenge (right) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Left card — Today's Micro Learning */}
        <motion.div
          {...cardHoverMotion()}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-4 p-5 sm:p-6 cursor-pointer min-w-0"
          style={{ backgroundColor: '#ffffff', border: '1px solid #5236ab', boxShadow: '0 1px 3px rgba(82,54,171,0.08)' }}
          onClick={() => setActiveTab('micro')}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(82,54,171,0.12)' }}>
            <Zap size={28} strokeWidth={2} style={{ color: '#5236ab' }} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>Today</span>
              <span style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>{todayMicro.topic}</span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 6 }}>Today&apos;s Micro Learning</h2>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--app-text-primary)', marginBottom: 4 }}>{todayMicro.title}</p>
            <p className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--app-text-muted)' }}>
              <Clock size={14} style={{ flexShrink: 0 }} />
              <span>{todayMicro.duration}</span>
              <span style={{ opacity: 0.6 }}>·</span>
              <span>{todayMicro.points} pts</span>
            </p>
          </div>
          <motion.button
            {...primaryButtonMotion()}
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTab('micro'); }}
            className="px-5 py-2.5 rounded-lg text-white font-semibold shrink-0 cursor-pointer self-center sm:self-auto text-sm"
            style={{ backgroundColor: '#5236ab' }}
          >
            Do this micro
          </motion.button>
        </motion.div>

        {/* Right card — Continue Learning (course progress) or Start a challenge */}
        <motion.div
          {...cardHoverMotion()}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-4 p-5 sm:p-6 cursor-pointer min-w-0"
          style={{ backgroundColor: '#ffffff', border: '1px solid #5236ab', boxShadow: '0 1px 3px rgba(82,54,171,0.08)' }}
          onClick={() => setActiveTab('challenges')}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(82,54,171,0.12)' }}>
            <Play size={28} strokeWidth={2} style={{ color: '#5236ab' }} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {current ? (
              <>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ backgroundColor: '#fef3c7', color: '#1c1917' }}>{current.difficulty}</span>
                  <span style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>{current.category}</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 6 }}>Continue Learning</h2>
                <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--app-text-primary)', marginBottom: 4 }}>{current.title}</p>
                <p className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--app-text-muted)', marginBottom: 8 }}>
                  <Clock size={14} style={{ flexShrink: 0 }} />
                  <span>{current.duration}</span>
                  <span style={{ opacity: 0.6 }}>·</span>
                  <span>Step {JOURNEY_STAGES.findIndex(s => s.current) + 1 || 4} of journey</span>
                </p>
                <div className="h-2 rounded-full overflow-hidden w-full max-w-xs" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: '#5236ab' }} initial={{ width: 0 }} animate={{ width: `${(current as any).progress ?? 60}%` }} transition={{ duration: 0.8 }} />
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 6 }}>Start a challenge</h2>
                <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', marginBottom: 0 }}>Pick a challenge and earn XP. Weekly, track, and assigned challenges await.</p>
              </>
            )}
          </div>
          <motion.button
            {...primaryButtonMotion()}
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTab('challenges'); }}
            className="px-5 py-2.5 rounded-lg text-white font-semibold shrink-0 cursor-pointer self-center sm:self-auto text-sm"
            style={{ backgroundColor: '#5236ab' }}
          >
            {current ? 'Continue Learning' : 'View challenges'}
          </motion.button>
        </motion.div>
      </div>

      {/* Tab strip */}
      <div className="flex gap-1 rounded-xl p-1 mb-8 overflow-x-auto" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
        {tabs.map(tab => (
          <motion.button
            {...(activeTab === tab.id ? chipToggleMotion() : secondaryButtonMotion())}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-tour-id={tab.id === 'challenges' ? 'learn-tab-challenges' : undefined}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all cursor-pointer"
            style={{
              fontSize: 14,
              fontWeight: activeTab === tab.id ? 600 : 400,
              backgroundColor: activeTab === tab.id ? 'var(--app-surface)' : 'transparent',
              color: activeTab === tab.id ? '#5236ab' : 'var(--app-text-secondary)',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* --- My Learning Path --- */}
        {activeTab === 'path' && (
          <motion.div key="path" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {/* Optional Archetype CTA — hidden per product request */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden rounded-xl p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              style={{ backgroundColor: 'var(--app-surface)', border: '1px dashed var(--app-border-strong)' }}
              aria-hidden
            >
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-1">Discover Your Adoption Archetype</h2>
                <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', lineHeight: '20px' }}>
                  Take a short behavioral assessment to understand your AI adoption style. Use it as an optional lens on your learning journey.
                </p>
              </div>
              <button onClick={() => navigate('/survey')} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ backgroundColor: '#5236ab', color: 'white' }}>
                Take Archetype Assessment
              </button>
            </motion.div>

            {/* YOUR JOURNEY — AI Adoption Learning Path (card per design) */}
            <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target size={16} style={{ color: '#5236ab' }} />
                    <h2 style={{ fontSize: 11, fontWeight: 600, color: '#5236ab', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your Journey</h2>
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--app-text-primary)' }} className="mb-3">AI Adoption Learning Path</h3>
                  <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', lineHeight: 1.5, maxWidth: 520 }}>
                    A personalized journey from AI basics to mastery. Complete modules to unlock new skills and earn certifications.
                  </p>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#5236ab 0deg ${journeyPct * 3.6}deg, #e5e7eb ${journeyPct * 3.6}deg 360deg)` }}>
                    <div className="absolute inset-1.5 rounded-full flex flex-col items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#5236ab' }}>{journeyPct}%</span>
                      <span style={{ fontSize: 11, color: 'var(--app-text-muted)' }}>Complete</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}><CheckCircle size={16} style={{ color: '#059669' }} /></span>
                  <span style={{ color: 'var(--app-text-primary)' }}><strong>{completed.length}</strong> Completed</span>
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(82,54,171,0.12)' }}><BookOpen size={16} style={{ color: '#5236ab' }} /></span>
                  <span style={{ color: 'var(--app-text-primary)' }}><strong>{upcoming.length}</strong> Remaining</span>
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fef3c7' }}><Sparkles size={16} style={{ color: '#d97706' }} /></span>
                  <span style={{ color: 'var(--app-text-primary)' }}><strong>{progress.xp}</strong> XP Earned</span>
                </span>
              </div>
              {/* Horizontal stepper: circles above labels, connecting lines — hidden per design */}
              <div className="flex flex-wrap items-start gap-0" style={{ display: 'none' }} aria-hidden>
                {JOURNEY_STAGES.map((s, i) => (
                  <React.Fragment key={s.id}>
                    <div className="flex flex-col items-center" style={{ minWidth: 80 }}>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
                        style={{
                          backgroundColor: s.done ? '#059669' : s.current ? '#5236ab' : 'transparent',
                          color: s.done || s.current ? '#ffffff' : 'var(--app-text-hint)',
                          border: s.done || s.current ? 'none' : '2px solid #e5e7eb',
                        }}
                      >
                        {s.done ? <CheckCircle size={14} style={{ color: '#fff' }} /> : s.current ? s.id : s.id}
                      </div>
                      <span className="mt-2 text-xs font-medium text-center" style={{ color: s.done || s.current ? 'var(--app-text-primary)' : 'var(--app-text-hint)' }}>{s.label}</span>
                    </div>
                    {i < JOURNEY_STAGES.length - 1 && (
                      <div className="flex items-center self-start pt-3" style={{ width: 24, minWidth: 24 }}>
                        <div className="h-0.5 flex-1" style={{ backgroundColor: s.done ? '#059669' : '#e5e7eb' }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p style={{ fontSize: 13, color: 'var(--app-text-muted)', marginTop: 16, display: 'none' }} aria-hidden>~{Math.max(1, Math.ceil(upcoming.length / 2))} weeks to go</p>
            </div>

            {/* Completed */}
            {completed.length > 0 && (
              <div className="mb-8">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">Completed ({completed.length})</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completed.map((mod, i) => (
                    <motion.div key={mod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }} className="rounded-xl p-5 cursor-pointer" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
                      <div className="flex items-center gap-2 mb-3"><CheckCircle size={18} style={{ color: '#1ab977' }} /><span style={{ fontSize: 12, color: '#1ab977', fontWeight: 600 }}>Completed</span></div>
                      <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{mod.title}</h4>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{mod.duration}</span>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#f59e0b', fontSize: 12 }}>★</span>)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Modules — hidden per design */}
            <div style={{ display: 'none' }} aria-hidden>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">Upcoming Modules</h2>
              <div className="space-y-3">
                {upcoming.map((mod, i) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`rounded-xl p-5 flex items-center gap-4 ${mod.locked ? 'opacity-60' : 'cursor-pointer'}`}
                    style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: mod.locked ? 'var(--app-tab-bg)' : 'var(--app-brand-light)', color: mod.locked ? 'var(--app-text-hint)' : '#5236ab' }}>
                      {mod.locked ? <BookOpen size={18} /> : <BookOpen size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 style={{ fontSize: 16, fontWeight: 500, color: mod.locked ? 'var(--app-text-hint)' : 'var(--app-text-primary)' }}>{mod.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span style={{ fontSize: 12, color: 'var(--app-text-hint)' }}>{mod.duration}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: mod.difficulty === 'Expert' ? '#1e1b4b' : mod.difficulty === 'Advanced' ? '#fce8eb' : '#fef6e9', color: mod.difficulty === 'Expert' ? '#fff' : mod.difficulty === 'Advanced' ? '#7d0d1e' : '#855a14' }}>{mod.difficulty}</span>
                      </div>
                    </div>
                    {!mod.locked && <button className="px-4 py-2 rounded-lg border cursor-pointer" style={{ borderColor: '#5236ab', color: '#5236ab', fontSize: 14, fontWeight: 600 }}>Preview</button>}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- Challenges --- */}
        {activeTab === 'challenges' && (
          <motion.div key="challenges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--app-text-hint)' }} />
                <input type="text" placeholder="Search challenges..." value={challengeSearch} onChange={(e) => setChallengeSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg outline-none" style={{ fontSize: 16, backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }} />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" style={{ color: 'var(--app-text-muted)', whiteSpace: 'nowrap' }}>Filter by type</label>
                <select value={challengeFilter} onChange={(e) => setChallengeFilter(e.target.value as 'all' | ChallengeType)} className="cursor-pointer rounded-lg border pl-3 pr-8 py-2.5 text-sm font-medium outline-none appearance-none bg-no-repeat bg-right" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)', minWidth: 140, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}>
                  <option value="all">All</option>
                  <option value="weekly">Weekly</option>
                  <option value="track">Track</option>
                  <option value="assigned">Assigned</option>
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(`/app/learn/challenges/${c.id}`)}
                  className="rounded-xl p-5 cursor-pointer"
                  style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                  data-tour-id={i === 0 ? 'challenge-card-first-view' : undefined}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#f2f1f9', color: '#5236ab' }}>{c.type}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: c.difficulty === 'Beginner' ? '#e8f8f1' : c.difficulty === 'Advanced' ? '#fce8eb' : '#fef6e9', color: c.difficulty === 'Beginner' ? '#0e6641' : c.difficulty === 'Advanced' ? '#7d0d1e' : '#855a14' }}>{c.difficulty}</span>
                    </div>
                    <Bookmark size={16} style={{ color: isChallengeSaved(c.id) ? '#5236ab' : 'var(--app-text-hint)' }} fill={isChallengeSaved(c.id) ? '#5236ab' : 'none'} />
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{c.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: '20px', color: 'var(--app-text-secondary)' }} className="mb-4">{c.description}</p>
                  <div className="flex items-center gap-4 text-sm mb-3" style={{ color: 'var(--app-text-muted)' }}>
                    <span className="flex items-center gap-1"><Clock size={12} /> {c.time}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {c.participants}</span>
                    <span className="flex items-center gap-1"><Sparkles size={12} /> {c.points} pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-secondary)' }}>{c.category}</span>
                    <span className="text-sm font-semibold" style={{ color: '#5236ab' }}>View &gt;</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- Trainings --- */}
        {activeTab === 'trainings' && (
          <motion.div key="trainings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <label className="text-sm font-medium" style={{ color: 'var(--app-text-muted)' }}>Format</label>
              <select value={trainingFormatFilter} onChange={(e) => setTrainingFormatFilter(e.target.value as 'all' | TrainingFormat)} className="cursor-pointer rounded-lg border pl-3 pr-8 py-2.5 text-sm font-medium outline-none appearance-none bg-no-repeat bg-right" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)', minWidth: 160, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}>
                <option value="all">All formats</option>
                <option value="lms">LMS</option>
                <option value="video">Video</option>
                <option value="interactive">Interactive</option>
                <option value="certification">Certification</option>
              </select>
              <label className="text-sm font-medium ml-4" style={{ color: 'var(--app-text-muted)' }}>Difficulty</label>
              <select value={trainingDifficultyFilter} onChange={(e) => setTrainingDifficultyFilter(e.target.value)} className="cursor-pointer rounded-lg border pl-3 pr-8 py-2.5 text-sm font-medium outline-none appearance-none bg-no-repeat bg-right" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)', minWidth: 140, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}>
                <option value="all">All</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrainings.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }} onClick={() => navigate(`/app/learn/trainings/${t.id}`)} className="rounded-xl p-5 cursor-pointer" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} style={{ color: '#5236ab' }} />
                      <span style={{ fontSize: 12, color: 'var(--app-text-muted)', fontWeight: 600 }}>{t.category}</span>
                    </div>
                    <Bookmark size={16} style={{ color: isTrainingSaved(t.id) ? '#5236ab' : 'var(--app-text-hint)' }} fill={isTrainingSaved(t.id) ? '#5236ab' : 'none'} />
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{t.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: '20px', color: 'var(--app-text-secondary)' }} className="mb-4">{t.description}</p>
                  <div className="flex items-center justify-between text-sm" style={{ color: 'var(--app-text-muted)' }}>
                    <span>{t.duration} · {t.lessons} lessons</span>
                    {t.progress != null && <span style={{ color: '#5236ab', fontWeight: 600 }}>{t.progress}%</span>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/app/learn/trainings/${t.id}`); }} className="mt-3 text-sm font-semibold cursor-pointer" style={{ color: '#5236ab' }}>View →</button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- Micro-Learnings --- */}
        {activeTab === 'micro' && (
          <motion.div key="micro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                <Zap size={18} style={{ color: '#5236ab' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>{microCompleted} Completed</span>
              </div>
              <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                <Sparkles size={18} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>{microPoints} Points Earned</span>
              </div>
              <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                <BookOpen size={18} style={{ color: '#14b8a6' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-primary)' }}>{microLearnings.length} Available</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--app-text-hint)' }} />
                <input type="text" placeholder="Search micro-learnings..." value={microSearch} onChange={(e) => setMicroSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg outline-none" style={{ fontSize: 16, backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium" style={{ color: 'var(--app-text-muted)' }}>Topic</label>
                <select value={microFilterTopic} onChange={(e) => setMicroFilterTopic(e.target.value)} className="cursor-pointer rounded-lg border pl-3 pr-8 py-2.5 text-sm font-medium outline-none appearance-none bg-no-repeat bg-right" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)', minWidth: 160, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}>
                  <option value="all">All topics</option>
                  <option value="Writing">Writing</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Data">Data</option>
                  <option value="Prompt Engineering">Prompt Engineering</option>
                </select>
                <label className="text-sm font-medium" style={{ color: 'var(--app-text-muted)' }}>Tool</label>
                <select value={microFilterTool} onChange={(e) => setMicroFilterTool(e.target.value)} className="cursor-pointer rounded-lg border pl-3 pr-8 py-2.5 text-sm font-medium outline-none appearance-none bg-no-repeat bg-right" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)', minWidth: 120, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}>
                  <option value="all">All tools</option>
                  <option value="ChatGPT">ChatGPT</option>
                  <option value="Copilot">Copilot</option>
                  <option value="Claude">Claude</option>
                  <option value="Any">Any</option>
                </select>
                <label className="text-sm font-medium" style={{ color: 'var(--app-text-muted)' }}>Sort by</label>
                <select value={microFilterSort} onChange={(e) => setMicroFilterSort(e.target.value as 'default' | 'recent' | 'popular')} className="cursor-pointer rounded-lg border pl-3 pr-8 py-2.5 text-sm font-medium outline-none appearance-none bg-no-repeat bg-right" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)', minWidth: 130, backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center' }}>
                  <option value="default">Default</option>
                  <option value="recent">Recently added</option>
                  <option value="popular">Most popular</option>
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMicro.map((m, i) => {
                const isCompleted = m.completed || completedMicroIds.has(m.id);
                return (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }} onClick={() => navigate(`/app/learn/micro/${m.id}`)} className="rounded-xl p-5 cursor-pointer" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#f2f1f9', color: '#5236ab' }}>{m.topic}</span>
                        <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-secondary)' }}>{m.tool}</span>
                        {m.skillLevel && <span className="px-2 py-0.5 rounded text-xs" style={{ color: 'var(--app-text-muted)' }}>{m.skillLevel}</span>}
                      </div>
                      {m.hot && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#fce8eb', color: '#e31937' }}>HOT</span>}
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{m.title}</h4>
                    <p style={{ fontSize: 14, lineHeight: '20px', color: 'var(--app-text-secondary)' }} className="mb-4">{m.description}</p>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{m.duration} · +{m.points} pts</span>
                      {isCompleted ? <CheckCircle size={18} style={{ color: '#1ab977' }} /> : <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#5236ab', color: 'white' }}><Play size={14} /></span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
