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
import clsx from 'clsx';

// ============================================
// SECTION 1: STATIC DATA
// ============================================
// These arrays hold the static content for the buttons.
// Storing them in arrays keeps our HTML clean—we just `.map()` over them.

const goals = [
  { id: 'productivity', title: 'Increase Productivity', desc: 'Automate tasks and save hours every week.', icon: <TrendingUp size={28} />, color: 'var(--cgi-purple)' },
  { id: 'creativity', title: 'Enhance Creativity', desc: 'Generate fresh ideas and creative content faster.', icon: <Sparkles size={28} />, color: '#a82465' },
  { id: 'decisions', title: 'Improve Decision Making', desc: 'Use AI-powered insights for smarter choices.', icon: <Brain size={28} />, color: 'var(--archetype-guide)' },
  { id: 'workflows', title: 'Streamline Workflows', desc: 'Build efficient processes with AI automation.', icon: <Workflow size={28} />, color: 'var(--archetype-trailblazer)' },
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
    timeline: '6 Weeks',
    commitment: 'Light',
    dailyTime: '10 min/day',
    duration: 6,
    skills: 3,
    desc: 'Perfect for busy schedules - steady progress at your pace',
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
    desc: 'Balanced approach to build solid AI fundamentals faster',
    icon: <TrendingUp size={24} />,
    emoji: '🌿',
  },
  {
    id: 'comprehensive',
    title: 'Comprehensive Path',
    timeline: '2 Months',
    commitment: 'Moderate',
    dailyTime: '20 min/day',
    duration: 8,
    skills: 4,
    desc: 'Thorough learning with practical applications',
    icon: <Brain size={24} />,
    emoji: '🌿',
  },
  {
    id: 'mastery',
    title: 'Mastery Track',
    timeline: '6 Weeks',
    commitment: 'Intensive',
    dailyTime: '30+ min/day',
    duration: 6,
    skills: 5,
    desc: 'Deep dive into advanced AI - accelerated learning',
    icon: <Workflow size={24} />,
    emoji: '🌳',
  },
  {
    id: 'expert',
    title: 'Expert Journey',
    timeline: '3 Months',
    commitment: 'Intensive',
    dailyTime: '30+ min/day',
    duration: 12,
    skills: 6,
    desc: 'Complete transformation to AI expert with intensive focus',
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
    <div className="onboarding-container">
      {/* ---- Progress Header ---- */}
      <header className="onboarding-header">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="onboarding-header-title">Set Your Goals</h1>
            <span className="onboarding-header-step">Step {step} of 3</span>
          </div>
          {/* Visual Step Indicator (3 blocks) */}
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={clsx('onboarding-step-indicator', s <= step ? 'onboarding-step-active' : 'onboarding-step-inactive')} />
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
                <h2 className="onboarding-step-title">Select Your Primary Goal</h2>
                <p className="onboarding-step-subtitle">Choose the goal that matters most to you right now.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {goals.map((goal) => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <motion.button
                        key={goal.id}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedGoal(goal.id)}
                        className={clsx('onboarding-goal-card', isSelected ? 'onboarding-goal-card-selected' : 'onboarding-goal-card-unselected')}
                        style={{
                          borderColor: isSelected ? goal.color : undefined,
                          boxShadow: isSelected ? `0 4px 16px ${goal.color}20` : undefined,
                        }}
                      >
                        <div className="onboarding-goal-icon" style={{ backgroundColor: `${goal.color}12`, color: goal.color }}>
                          {goal.icon}
                        </div>
                        <h3 className="onboarding-goal-title">{goal.title}</h3>
                        <p className="onboarding-goal-desc">{goal.desc}</p>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="onboarding-goal-checkmark" style={{ backgroundColor: goal.color }}>
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
                <h2 className="onboarding-step-title">Choose Focus Areas</h2>
                <p className="onboarding-step-subtitle">Select 2-4 areas you want to improve with AI.</p>

                <div className="flex flex-wrap gap-3 justify-center">
                  {focusAreas.map((area) => {
                    const isSelected = selectedFocus.includes(area.id);
                    return (
                      <motion.button
                        key={area.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleFocus(area.id)}
                        className={clsx('onboarding-focus-chip', isSelected ? 'onboarding-focus-chip-selected' : 'onboarding-focus-chip-unselected')}
                      >
                        {area.icon} {area.label}
                      </motion.button>
                    );
                  })}
                </div>
                {/* Visual feedback on selection count */}
                <p className="onboarding-focus-counter">
                  {selectedFocus.length}/4 selected (minimum 2)
                </p>
              </motion.div>
            )}

            {/* ------------------------------------- */}
            {/* STEP 3: Choose Learning Path          */}
            {/* ------------------------------------- */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <h2 className="onboarding-step-title">Choose Your Learning Path</h2>
                <p className="onboarding-step-subtitle mb-2">Select the journey that fits your schedule and learning goals</p>
                <p className="text-center mb-8 text-sm text-gray-400">
                  💡 Don't worry, you can update your goals and preferences anytime from your dashboard
                </p>

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
                        className={clsx(
                          'onboarding-path-card',
                          isSelected && 'onboarding-path-card-selected',
                          isRecommended && !isSelected && 'onboarding-path-card-standard',
                          !isSelected && !isRecommended && 'onboarding-path-card-standard'
                        )}
                      >
                        {/* Recommended Badge */}
                        {isRecommended && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="onboarding-path-badge-recommended"
                          >
                            ⭐ Recommended
                          </motion.div>
                        )}

                        {/* Header: Icon + Checkmark */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={clsx('onboarding-path-icon-container', isSelected ? 'onboarding-path-icon-selected' : 'onboarding-path-icon-unselected')}>
                            {path.icon}
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 rounded-full flex items-center justify-center bg-cgi-purple"
                            >
                              <Check size={14} className="text-white" />
                            </motion.div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="onboarding-path-title">
                          {path.title}
                        </h3>

                        {/* Timeline + Commitment Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={clsx('onboarding-path-timeline-badge', isSelected ? 'onboarding-path-timeline-selected' : 'onboarding-path-timeline-unselected')}>
                            {path.timeline} • {path.dailyTime}
                          </span>
                          <span className="text-lg">{path.emoji}</span>
                        </div>

                        {/* Description */}
                        <p className="onboarding-path-desc">
                          {path.desc}
                        </p>

                        {/* Skill Growth Progress Bar */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="onboarding-path-progress-bar">
                            <motion.div
                              className={clsx('onboarding-path-progress-fill', isSelected ? 'onboarding-path-progress-selected' : 'onboarding-path-progress-unselected')}
                              initial={{ width: 0 }}
                              animate={{ width: isSelected ? `${(path.skills / 6) * 100}%` : '0%' }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </div>

                        {/* Footer: Skills + Duration */}
                        <p className="onboarding-path-footer">
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
      <footer className="onboarding-footer">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="onboarding-btn-back"
          >
            <ArrowLeft size={18} /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              disabled={!canProceed()}
              className={clsx('onboarding-btn-next', canProceed() ? 'onboarding-btn-next-enabled' : 'onboarding-btn-next-disabled')}
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLaunch}
              disabled={!canProceed()}
              className={clsx('onboarding-btn-launch', canProceed() ? 'onboarding-btn-launch-enabled' : 'onboarding-btn-launch-disabled')}
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
          className="onboarding-celebration-overlay"
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
                className="onboarding-celebration-sparkle"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
