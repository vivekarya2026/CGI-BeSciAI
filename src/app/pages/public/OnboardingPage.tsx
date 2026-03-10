/**
 * ============================================
 * 🚀 ONBOARDING PAGE — OnboardingPage.tsx
 * ============================================
 *
 * This is the final step before the user enters the main app!
 * It's a 3-step wizard where the user configures their goals.
 *
 * HOW IT WORKS (State Management):
 * - `step` (number): Tracks which screen of the wizard we are on (1, 2, or 3).
 * - `selectedGoal` (string): The single main goal they chose in step 1.
 * - `selectedFocus` (array): The 2-4 areas they selected in step 2.
 * - `timeline` / `commitment`: Slider values for step 3.
 *
 * HINT: 
 * We use a helper function `canProceed()` that checks if
 * the user has filled out the current step before enabling the "Next" button.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, Sparkles, Brain, Workflow, Zap,
  PenTool, BarChart3, Code, Search, Palette, FolderKanban,
  ArrowLeft, ArrowRight, Rocket, Check,
} from 'lucide-react';

// ============================================
// SECTION 1: STATIC DATA
// ============================================
// These arrays hold the static content for the buttons.
// Storing them in arrays keeps our HTML clean—we just `.map()` over them.

const goals = [
  { id: 'productivity', title: 'Increase Productivity', desc: 'Automate tasks and save hours every week.', icon: <TrendingUp size={28} />, color: '#5236ab' },
  { id: 'creativity', title: 'Enhance Creativity', desc: 'Generate fresh ideas and creative content faster.', icon: <Sparkles size={28} />, color: '#a82465' },
  { id: 'decisions', title: 'Improve Decision Making', desc: 'Use AI-powered insights for smarter choices.', icon: <Brain size={28} />, color: '#14b8a6' },
  { id: 'workflows', title: 'Streamline Workflows', desc: 'Build efficient processes with AI automation.', icon: <Workflow size={28} />, color: '#f59e0b' },
];

const focusAreas = [
  { id: 'writing', label: 'Writing & Communication', icon: <PenTool size={16} /> },
  { id: 'data', label: 'Data Analysis', icon: <BarChart3 size={16} /> },
  { id: 'code', label: 'Code & Development', icon: <Code size={16} /> },
  { id: 'research', label: 'Research & Learning', icon: <Search size={16} /> },
  { id: 'design', label: 'Design & Creativity', icon: <Palette size={16} /> },
  { id: 'pm', label: 'Project Management', icon: <FolderKanban size={16} /> },
];

const learningPaths = [
  {
    id: 'quick-start',
    title: 'Quick Start',
    timeline: '2 Weeks',
    commitment: 'Light',
    dailyTime: '10 min/day',
    duration: 2,
    skills: 2,
    desc: 'Perfect for busy schedules - get AI basics fast',
    icon: <Zap size={24} />,
    emoji: '🌱',
  },
  {
    id: 'foundation',
    title: 'Foundation Builder',
    timeline: '1 Month',
    commitment: 'Moderate',
    dailyTime: '20 min/day',
    duration: 4,
    skills: 3,
    desc: 'Balanced approach to build solid AI fundamentals',
    icon: <TrendingUp size={24} />,
    emoji: '🌿',
  },
  {
    id: 'comprehensive',
    title: 'Comprehensive Path',
    timeline: '3 Months',
    commitment: 'Moderate',
    dailyTime: '20 min/day',
    duration: 12,
    skills: 4,
    desc: 'Thorough learning with practical applications',
    icon: <Brain size={24} />,
    emoji: '🌿',
  },
  {
    id: 'mastery',
    title: 'Mastery Track',
    timeline: '6 Months',
    commitment: 'Intensive',
    dailyTime: '30+ min/day',
    duration: 24,
    skills: 5,
    desc: 'Deep dive into advanced AI capabilities',
    icon: <Workflow size={24} />,
    emoji: '🌳',
  },
  {
    id: 'expert',
    title: 'Expert Journey',
    timeline: '1 Year',
    commitment: 'Intensive',
    dailyTime: '30+ min/day',
    duration: 52,
    skills: 6,
    desc: 'Complete transformation to AI expert',
    icon: <Sparkles size={24} />,
    emoji: '🌳',
  },
];

// ============================================
// SECTION 2: COMPONENT LOGIC
// ============================================

export default function OnboardingPage() {
  const navigate = useNavigate();

  // -- State --
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // -- Action: Toggle Focus Items --
  // This allows multiple selections, up to a maximum of 4
  const toggleFocus = (id: string) => {
    setSelectedFocus(prev => {
      // If it exists, remove it
      if (prev.includes(id)) return prev.filter(f => f !== id);
      // If we already have 4, don't allow more
      if (prev.length >= 4) return prev;
      // Otherwise, add it
      return [...prev, id];
    });
  };

  // -- Validation: Can the user click Next? --
  const canProceed = () => {
    if (step === 1) return !!selectedGoal;             // Must have picked 1 goal
    if (step === 2) return selectedFocus.length >= 2;  // Must pick at least 2 focuses
    if (step === 3) return !!selectedPath;             // Must select a learning path
    return false;
  };

  // -- Action: Finish Onboarding --
  // Show celebration then redirect to Dashboard
  const handleLaunch = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('post_onboarding_challenge_tour', 'true');
      }
    } catch {
      // Ignore storage errors
    }
    
    // Show celebration animation
    setShowCelebration(true);
    
    // Redirect to Dashboard after animation
    setTimeout(() => {
      navigate('/app/dashboard');
    }, 2000);
  };

  // ============================================
  // SECTION 3: RENDER UI
  // ============================================

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fb', fontFamily: 'var(--font-primary)' }}>
      {/* ---- Progress Header ---- */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 style={{ fontSize: 20, fontWeight: 600, color: '#151515' }}>Set Your Goals</h1>
            <span style={{ fontSize: 14, color: '#767676' }}>Step {step} of 3</span>
          </div>
          {/* Visual Step Indicator (3 blocks) */}
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 h-1.5 rounded-full transition-all" style={{ backgroundColor: s <= step ? '#5236ab' : '#e6e3f3' }} />
            ))}
          </div>
        </div>
      </header>

      {/* ---- Dynamic Content Area ---- */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* AnimatePresence allows us to animate components OUT as well as IN */}
          <AnimatePresence mode="wait">

            {/* ------------------------------------- */}
            {/* STEP 1: Select Goal Container         */}
            {/* ------------------------------------- */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <h2 style={{ fontSize: 24, fontWeight: 600, color: '#151515' }} className="mb-2 text-center">Select Your Primary Goal</h2>
                <p style={{ fontSize: 16, color: '#5c5c5c', lineHeight: '24px' }} className="text-center mb-8">Choose the goal that matters most to you right now.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {goals.map((goal) => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <motion.button
                        key={goal.id} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedGoal(goal.id)}
                        className="text-left p-6 rounded-xl border-2 bg-white transition-all cursor-pointer"
                        style={{ borderColor: isSelected ? goal.color : '#e5e7eb', boxShadow: isSelected ? `0 4px 16px ${goal.color}20` : '0 1px 3px rgba(0,0,0,0.04)' }}
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${goal.color}12`, color: goal.color }}>
                          {goal.icon}
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#151515' }} className="mb-1">{goal.title}</h3>
                        <p style={{ fontSize: 14, lineHeight: '20px', color: '#767676' }}>{goal.desc}</p>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: goal.color }}>
                            <Check size={14} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ------------------------------------- */}
            {/* STEP 2: Choose Focus Areas            */}
            {/* ------------------------------------- */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <h2 style={{ fontSize: 24, fontWeight: 600, color: '#151515' }} className="mb-2 text-center">Choose Focus Areas</h2>
                <p style={{ fontSize: 16, color: '#5c5c5c' }} className="text-center mb-8">Select 2-4 areas you want to improve with AI.</p>

                <div className="flex flex-wrap gap-3 justify-center">
                  {focusAreas.map((area) => {
                    const isSelected = selectedFocus.includes(area.id);
                    return (
                      <motion.button
                        key={area.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => toggleFocus(area.id)}
                        className="flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all cursor-pointer"
                        style={{ backgroundColor: isSelected ? '#5236ab' : 'white', borderColor: isSelected ? '#5236ab' : '#e5e7eb', color: isSelected ? 'white' : '#333333', fontSize: 14, fontWeight: isSelected ? 600 : 400 }}
                      >
                        {area.icon} {area.label}
                      </motion.button>
                    );
                  })}
                </div>
                {/* Visual feedback on selection count */}
                <p className="text-center mt-4" style={{ fontSize: 12, color: '#a8a8a8' }}>
                  {selectedFocus.length}/4 selected (minimum 2)
                </p>
              </motion.div>
            )}

            {/* ------------------------------------- */}
            {/* STEP 3: Choose Learning Path          */}
            {/* ------------------------------------- */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <h2 style={{ fontSize: 24, fontWeight: 600, color: '#151515' }} className="mb-2 text-center">Choose Your Learning Path</h2>
                <p style={{ fontSize: 16, color: '#5c5c5c' }} className="text-center mb-3">Select the journey that fits your schedule and learning goals</p>
                
                {/* Helpful Notes */}
                <div className="max-w-2xl mx-auto mb-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                      <Sparkles size={16} />
                      <span>You can update your goals anytime</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                      <TrendingUp size={16} />
                      <span>Higher daily commitment = Faster completion</span>
                    </div>
                  </div>
                </div>

                {/* Learning Path Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {learningPaths.map((path) => {
                    const isSelected = selectedPath === path.id;
                    const isRecommended = path.id === 'quick-start';
                    return (
                      <motion.button
                        key={path.id}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPath(path.id)}
                        className="p-5 rounded-xl border-2 bg-white text-left cursor-pointer transition-all relative"
                        style={{
                          borderColor: isSelected ? '#8b5cf6' : isRecommended ? '#22c55e' : '#e5e7eb',
                          boxShadow: isSelected 
                            ? '0 8px 24px rgba(139,92,246,0.2)' 
                            : isRecommended 
                              ? '0 4px 16px rgba(34,197,94,0.15)' 
                              : '0 1px 3px rgba(0,0,0,0.04)',
                          background: isRecommended && !isSelected ? 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' : '#ffffff',
                        }}
                      >
                        {/* Recommended Badge */}
                        {isRecommended && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                            style={{ backgroundColor: '#22c55e', color: 'white', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' }}
                          >
                            <Sparkles size={12} />
                            Recommended
                          </motion.div>
                        )}

                        {/* Header: Icon + Checkmark */}
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: isSelected ? '#ede9fe' : '#f3f4f6', color: isSelected ? '#8b5cf6' : '#6b7280' }}
                          >
                            {path.icon}
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: '#8b5cf6' }}
                            >
                              <Check size={14} className="text-white" />
                            </motion.div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#151515', marginBottom: 6 }}>
                          {path.title}
                        </h3>

                        {/* Timeline + Commitment Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: isSelected ? '#ede9fe' : '#f3f4f6',
                              color: isSelected ? '#8b5cf6' : '#6b7280',
                            }}
                          >
                            {path.timeline} • {path.dailyTime}
                          </span>
                          <span className="text-lg">{path.emoji}</span>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: 13, color: '#767676', marginBottom: 10, lineHeight: 1.5 }}>
                          {path.desc}
                        </p>

                        {/* Skill Growth Progress Bar */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: isSelected ? '#8b5cf6' : '#d1d5db' }}
                              initial={{ width: 0 }}
                              animate={{ width: isSelected ? `${(path.skills / 6) * 100}%` : '0%' }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </div>

                        {/* Footer: Skills + Duration */}
                        <p style={{ fontSize: 11, color: '#9ca3af' }}>
                          Gain {path.skills} skills • {path.duration} weeks
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ---- Footer Navigation ---- */}
      <footer className="bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            // Go back down to step 1 minimum
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: 16, color: '#5c5c5c', borderColor: '#e5e7eb', minHeight: 44 }}
          >
            <ArrowLeft size={18} /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 rounded-lg text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: canProceed() ? '#5236ab' : '#cbc3e6',
                fontSize: 16, fontWeight: 600, minHeight: 44,
                boxShadow: canProceed() ? '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            // Final Step Button
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleLaunch}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 rounded-lg text-white font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canProceed() ? 'linear-gradient(90deg, #e31937, #a82465, #5236ab)' : '#cbc3e6',
                fontSize: 16, minHeight: 44,
                boxShadow: canProceed() ? '0 4px 16px rgba(82,54,171,0.3)' : 'none',
              }}
            >
              <Rocket size={18} /> Start Learning
            </motion.button>
          )}
        </div>
      </footer>

      {/* ============================================ */}
      {/* CELEBRATION OVERLAY */}
      {/* ============================================ */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: 2,
                ease: 'easeInOut',
              }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Goals Set!</h2>
            <p className="text-lg text-white/80">Redirecting to your dashboard...</p>
            
            {/* Sparkle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI) / 4) * 100,
                  y: Math.sin((i * Math.PI) / 4) * 100,
                }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: '#8b5cf6' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
