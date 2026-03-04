/**
 * ============================================
 * 📖 LEARN PAGE — LearnPage.tsx
 * ============================================
 * 
 * This is the educational hub of the app.
 * It's split into 4 main sub-tabs to keep things organized.
 * 
 * 🗺️ SUB-TABS:
 * 1. My Adoption Path: The user's main module sequence (Current, Completed, Upcoming).
 * 2. Quick Wins: Bite-sized tasks that can be done in < 5 minutes.
 * 3. Resource Library: A searchable collection of guides, videos, and templates.
 * 4. Skill Assessments: Progress meters for specific skills and certifications.
 * 
 * HINT FOR BEGINNERS:
 * We use a `useState` variable called `activeTab` to decide which of the 4 
 * sections to show. When the user clicks a tab button, we change `activeTab`, 
 * which triggers React to re-render and show the new section.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, Zap, Library, Award, Play, Clock, Lock, Star,
  CheckCircle, ChevronRight, Copy, Timer, Search, Filter,
  FileText, Video, Bookmark, ArrowRight,
} from 'lucide-react';
import { learningModules, quickWins } from '../../data/archetypes';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router';
import LearnTour from '../../components/LearnTour';

// Defining the types for our tabs (TypeScript helper)
type SubTab = 'path' | 'quickwins' | 'resources' | 'assessments';

export default function LearnPage() {
  const { progress, archetype } = useUser();
  const navigate = useNavigate();

  // -- Local Page State --
  const [activeTab, setActiveTab] = useState<SubTab>('path'); // Starts on the "Path" tab
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState<'all' | 'guide' | 'video' | 'template'>('all');
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Tab definitions for the sub-navigation menu
  const tabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'path', label: 'My Adoption Path', icon: <BookOpen size={16} /> },
    { id: 'quickwins', label: 'Quick Wins', icon: <Zap size={16} /> },
    { id: 'resources', label: 'Resources Library', icon: <Library size={16} /> },
    { id: 'assessments', label: 'Skill Assessments', icon: <Award size={16} /> },
  ];

  // -- Data Sorting (Derived State) --
  const completed = learningModules.filter(m => m.completed);
  const current = learningModules.find(m => !m.completed && !m.locked);
  const upcoming = learningModules.filter(m => !m.completed && m.id !== current?.id);

  // Mock static data for the library and skills
  const resources = [
    { id: 'r1', type: 'guide', title: 'Beginner\'s Guide to Prompt Engineering', desc: 'A step-by-step walkthrough for crafting effective prompts.', duration: '15 min', saved: false },
    { id: 'r2', type: 'video', title: 'AI for Data Analysis — Tutorial', desc: 'Video walkthrough of using AI to analyze spreadsheets.', duration: '12 min', saved: true },
    { id: 'r3', type: 'template', title: 'Email Writing Prompt Template', desc: 'Reusable template for professional email drafting.', duration: '5 min', saved: false },
    { id: 'r4', type: 'guide', title: 'Best Practices for AI Ethics', desc: 'A checklist for responsible AI usage in the workplace.', duration: '10 min', saved: false },
    { id: 'r5', type: 'video', title: 'Workflow Automation Masterclass', desc: 'Learn to build AI-powered workflows from scratch.', duration: '25 min', saved: true },
    { id: 'r6', type: 'template', title: 'Meeting Summary Prompt', desc: 'Auto-generate structured meeting notes and action items.', duration: '3 min', saved: false },
  ];

  const skills = [
    { name: 'Prompt Engineering', level: 72, maxLevel: 100, color: '#5236ab' },
    { name: 'Workflow Automation', level: 45, maxLevel: 100, color: '#14b8a6' },
    { name: 'AI Ethics', level: 30, maxLevel: 100, color: '#f59e0b' },
    { name: 'Advanced Techniques', level: 15, maxLevel: 100, color: '#e31937' },
    { name: 'Data Analysis', level: 55, maxLevel: 100, color: '#0ea5e9' },
  ];

  const typeIcons: Record<string, React.ReactNode> = {
    guide: <FileText size={18} />,
    video: <Video size={18} />,
    template: <Copy size={18} />,
  };

  // Auto-run the Learn tour once for newly onboarded users
  useEffect(() => {
    const seen = typeof window !== 'undefined' ? localStorage.getItem('learn_tour_seen_v1') : 'true';
    if (!seen) {
      setIsTourOpen(true);
      localStorage.setItem('learn_tour_seen_v1', 'true');
    }
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-primary)' }}>
      {/* ============================================ */}
      {/* SECTION 1: HEADER                          */}
      {/* ============================================ */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--app-text-primary)' }}>Learn</h1>
          <p style={{ fontSize: 16, color: 'var(--app-text-secondary)', lineHeight: '24px' }}>
            Build your AI skills with personalized modules, quick wins, resources, and skill assessments.
          </p>
        </div>
        <button
          onClick={() => setIsTourOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium"
          style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)', backgroundColor: 'var(--app-surface)' }}
        >
          <BookOpen size={14} /> Show me around
        </button>
      </div>

      {/* ============================================ */}
      {/* SECTION 2: SUB-TAB NAVIGATION               */}
      {/* ============================================ */}
      <div className="flex gap-1 rounded-xl p-1 mb-8 overflow-x-auto" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
          </button>
        ))}
      </div>

      {/* ============================================ */}
      {/* SECTION 3: TAB CONTENT (Dynamic Rendering)  */}
      {/* ============================================ */}
      <AnimatePresence mode="wait">

        {/* --- TAB A: MY ADOPTION PATH --- */}
        {activeTab === 'path' && (
          <motion.div
            key="path"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Optional Archetype CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              style={{ backgroundColor: 'var(--app-surface)', border: '1px dashed var(--app-border-strong)' }}
            >
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-1">
                  Discover Your Adoption Archetype
                </h2>
                <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', lineHeight: '20px' }}>
                  Take a short behavioral assessment to understand your AI adoption style. Use it as an optional lens on your learning journey.
                </p>
              </div>
              <button
                onClick={() => navigate('/survey')}
                className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: '#5236ab', color: 'white' }}
              >
                Take Archetype Assessment
              </button>
            </motion.div>

            {/* 1. The Active/Current Module */}
            {current && (
              <div className="mb-8">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">
                  Continue Learning
                </h2>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="rounded-xl border-2 p-6 flex flex-col lg:flex-row items-start lg:items-center gap-6"
                  style={{ backgroundColor: 'var(--app-surface)', borderColor: '#5236ab', boxShadow: '0 4px 16px rgba(82,54,171,0.1)' }}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--app-brand-light)' }}>
                    <Play size={28} style={{ color: '#5236ab' }} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#fef6e9', color: '#855a14', fontSize: 12 }}>
                        {current.difficulty}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>
                        {current.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{current.title}</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="flex items-center gap-1" style={{ fontSize: 14, color: 'var(--app-text-muted)' }}>
                        <Clock size={14} /> {current.duration}
                      </span>
                    </div>
                    {/* Visual Progress Bar for this specific module */}
                    <div className="h-2 rounded-full overflow-hidden w-full max-w-xs" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: '#5236ab' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(current as any).progress || 0}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }} className="mt-1 block">
                      {(current as any).progress || 0}% complete
                    </span>
                  </div>
                  <button
                    className="px-6 py-3 rounded-lg text-white font-semibold shrink-0 cursor-pointer"
                    style={{ backgroundColor: '#5236ab', fontSize: 16 }}
                  >
                    Continue Learning
                  </button>
                </motion.div>
              </div>
            )}

            {/* 2. Grid of Completed Modules */}
            {completed.length > 0 && (
              <div className="mb-8">
                <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">
                  Completed ({completed.length})
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completed.map((mod, i) => (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -3 }}
                      className="rounded-xl p-5 cursor-pointer"
                      style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle size={18} style={{ color: '#1ab977' }} />
                        <span style={{ fontSize: 12, color: '#1ab977', fontWeight: 600 }}>Completed</span>
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{mod.title}</h4>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{mod.duration}</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12} fill={s <= (mod.rating || 0) ? '#f59e0b' : 'none'} style={{ color: s <= (mod.rating || 0) ? '#f59e0b' : 'var(--app-text-hint)' }} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. List of Upcoming Modules */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">
                Upcoming Modules
              </h2>
              <div className="space-y-3">
                {upcoming.map((mod, i) => (
                  <motion.div
                    key={mod.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`rounded-xl p-5 flex items-center gap-4 ${mod.locked ? 'opacity-60' : 'cursor-pointer'}`}
                    style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: '0px 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: mod.locked ? 'var(--app-tab-bg)' : 'var(--app-brand-light)', color: mod.locked ? 'var(--app-text-hint)' : '#5236ab' }}
                    >
                      {mod.locked ? <Lock size={18} /> : <BookOpen size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 style={{ fontSize: 16, fontWeight: 500, color: mod.locked ? 'var(--app-text-hint)' : 'var(--app-text-primary)' }}>{mod.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span style={{ fontSize: 12, color: 'var(--app-text-hint)' }}>{mod.duration}</span>
                        <span className="px-2 py-0.5 rounded text-xs" style={{
                          backgroundColor: mod.difficulty === 'Expert' ? '#1e1b4b' : mod.difficulty === 'Advanced' ? '#fce8eb' : mod.difficulty === 'Intermediate' ? '#fef6e9' : '#e8f8f1',
                          color: mod.difficulty === 'Expert' ? '#ffffff' : mod.difficulty === 'Advanced' ? '#7d0d1e' : mod.difficulty === 'Intermediate' ? '#855a14' : '#0e6641',
                          fontSize: 11,
                          fontWeight: 600,
                        }}>
                          {mod.difficulty}
                        </span>
                      </div>
                    </div>
                    {!mod.locked && (
                      <button className="px-4 py-2 rounded-lg border cursor-pointer transition-colors"
                        style={{ borderColor: '#5236ab', color: '#5236ab', fontSize: 14, fontWeight: 600 }}
                      >
                        Preview
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB B: QUICK WINS --- */}
        {activeTab === 'quickwins' && (
          <motion.div
            key="quickwins"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Featured Daily Challenge Card */}
            <div className="bg-gradient-to-r from-[#5236ab] to-[#a82465] rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Timer size={18} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Today's Challenge</span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }} className="mb-2">
                5-Minute Prompt Remix
              </h3>
              <p style={{ fontSize: 16, lineHeight: '24px' }} className="text-white/80 mb-5">
                Take yesterday's prompt and improve it for a different audience. Can you make it work for both technical and non-technical readers?
              </p>
              <button className="px-6 py-3 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: 'white', color: '#5236ab', fontSize: 14 }}>
                Start Challenge
              </button>
            </div>

            {/* List of other Quick Wins */}
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">
              Task-Based Solutions
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {quickWins.map((qw, i) => (
                <motion.div
                  key={qw.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  className="rounded-xl p-5 cursor-pointer"
                  style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{
                      backgroundColor: qw.difficulty === 'Easy' ? '#e8f8f1' : '#fef6e9',
                      color: qw.difficulty === 'Easy' ? '#0e6641' : '#855a14',
                      fontSize: 12,
                    }}>
                      {qw.difficulty}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>
                      <Clock size={12} /> {qw.time}
                    </span>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{qw.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: '20px', color: 'var(--app-text-secondary)' }} className="mb-4">{qw.description}</p>
                  <button className="w-full py-2 rounded-lg text-center font-semibold cursor-pointer"
                    style={{ backgroundColor: 'var(--app-brand-light)', color: 'var(--app-brand)', fontSize: 14 }}
                  >
                    Try It Now
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Daily Prompt Copy-Paste Section */}
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">
                Daily Prompt
              </h2>
              <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: 'var(--app-bg)' }}>
                <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--app-text-secondary)', fontStyle: 'italic' }}>
                  "You are a project manager preparing a status update. Summarize the following project data into a concise
                  2-paragraph update highlighting risks, wins, and next steps. Tone: professional but friendly."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
                  style={{ backgroundColor: '#5236ab', color: 'white', fontSize: 14, fontWeight: 600 }}
                  onClick={() => alert('Prompt copied to clipboard!')}
                >
                  <Copy size={14} /> Copy Prompt
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer" style={{ border: '1px solid var(--app-border-strong)', fontSize: 14, color: 'var(--app-text-secondary)', backgroundColor: 'transparent' }}>
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB C: RESOURCES --- */}
        {activeTab === 'resources' && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search Bar and Filter Button */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--app-text-hint)' }} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg outline-none"
                  style={{ fontSize: 16, minHeight: 44, backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border-strong)', color: 'var(--app-text-primary)' }}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ border: '1px solid var(--app-border-strong)', backgroundColor: 'var(--app-surface)', color: 'var(--app-text-secondary)' }}>
                <Filter size={16} /> Filters
              </button>
            </div>

            {/* Resource Category Filter Tabs */}
            <div className="flex gap-2 mb-6">
              {(['all', 'guide', 'video', 'template'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setResourceFilter(filter)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer capitalize"
                  style={{
                    backgroundColor: resourceFilter === filter ? '#5236ab' : 'var(--app-surface)',
                    color: resourceFilter === filter ? 'white' : 'var(--app-text-secondary)',
                    border: resourceFilter === filter ? 'none' : '1px solid var(--app-border-strong)',
                    fontSize: 14,
                  }}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1) + 's'}
                </button>
              ))}
            </div>

            {/* Grid of Resource Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources
                .filter(r => resourceFilter === 'all' || r.type === resourceFilter)
                .filter(r =>
                  !searchQuery.trim()
                    ? true
                    : (r.title + r.desc).toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((resource, i) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="rounded-xl p-5 cursor-pointer"
                  style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: resource.type === 'guide' ? '#f2f1f9' : resource.type === 'video' ? '#fce8eb' : '#ccfbf1',
                          color: resource.type === 'guide' ? '#5236ab' : resource.type === 'video' ? '#e31937' : '#14b8a6',
                        }}
                      >
                        {typeIcons[resource.type]}
                      </div>
                      <span className="capitalize" style={{ fontSize: 12, color: 'var(--app-text-muted)', fontWeight: 600 }}>
                        {resource.type}
                      </span>
                    </div>
                    <Bookmark size={16} style={{ color: resource.saved ? '#5236ab' : 'var(--app-text-hint)' }} fill={resource.saved ? '#5236ab' : 'none'} />
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-2">{resource.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: '20px', color: 'var(--app-text-secondary)' }} className="mb-3">{resource.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--app-text-hint)' }}>
                      <Clock size={12} /> {resource.duration}
                    </span>
                    <button style={{ fontSize: 14, color: 'var(--app-brand)', fontWeight: 600 }}>
                      View →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- TAB D: ASSESSMENTS --- */}
        {activeTab === 'assessments' && (
          <motion.div
            key="assessments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Visual Skill Levels Section (Progress Meters) */}
            <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-6">
                Your Skill Levels
              </h2>
              <div className="space-y-5">
                {skills.map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-secondary)' }}>{skill.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: skill.color }}>{skill.level}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: skill.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Badges to unlock */}
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--app-text-primary)' }} className="mb-4">
              Earn Certifications
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'AI Fundamentals', requirements: 4, completed: 3, icon: '🎓' },
                { title: 'Prompt Engineering Pro', requirements: 6, completed: 2, icon: '⚡' },
                { title: 'AI Ethics Champion', requirements: 3, completed: 0, icon: '🛡️' },
                { title: 'Workflow Automation Expert', requirements: 5, completed: 1, icon: '🔄' },
              ].map((cert, i) => {
                const pct = Math.round((cert.completed / cert.requirements) * 100);
                return (
                  <div key={i} className="rounded-xl p-5" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{cert.icon}</span>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}>{cert.title}</h4>
                        <span style={{ fontSize: 12, color: 'var(--app-text-muted)' }}>{cert.completed}/{cert.requirements} requirements</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: '#5236ab' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                      />
                    </div>
                    <button className="w-full py-2.5 rounded-lg text-center font-semibold text-sm" style={{ backgroundColor: 'var(--app-brand-light)', color: 'var(--app-brand)' }}>
                      View Requirements
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LearnTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onStepTabChange={(tab) => setActiveTab(tab as SubTab)}
      />
    </div>
  );
}
