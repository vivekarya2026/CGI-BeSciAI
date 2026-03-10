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
  TrendingUp, Sparkles, Brain, Workflow,
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

const commitments = [
  { id: 'light', label: 'Light', desc: '10 min/day', emoji: '🌱' },
  { id: 'moderate', label: 'Moderate', desc: '20 min/day', emoji: '🌿' },
  { id: 'intensive', label: 'Intensive', desc: '30+ min/day', emoji: '🌳' },
];

const timelineOptions = [
  { id: '2weeks', label: '2 Weeks', duration: 2, skills: 2, desc: 'Quick start basics', icon: <Zap size={24} /> },
  { id: '1month', label: '1 Month', duration: 4, skills: 3, desc: 'Build foundation', icon: <TrendingUp size={24} /> },
  { id: '3months', label: '3 Months', duration: 12, skills: 4, desc: 'Comprehensive learning', icon: <Brain size={24} /> },
  { id: '6months', label: '6 Months', duration: 24, skills: 5, desc: 'Advanced mastery', icon: <Workflow size={24} /> },
  { id: '1year', label: '1 Year', duration: 52, skills: 6, desc: 'Complete expertise', icon: <Sparkles size={24} /> },
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
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);
  const [commitment, setCommitment] = useState<string | null>(null);
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
    if (step === 3) return !!selectedTimeline && !!commitment;  // Must select timeline and commitment
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
            {/* STEP 3: Timeline Cards & Commitment   */}
            {/* ------------------------------------- */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <h2 style={{ fontSize: 24, fontWeight: 600, color: '#151515' }} className="mb-2 text-center">Set Timeline & Commitment</h2>
                <p style={{ fontSize: 16, color: '#5c5c5c' }} className="text-center mb-8">Choose your learning timeline and see projected skill growth</p>

                {/* Timeline Card Selection */}
                <div className="mb-8">
                  <label style={{ fontSize: 14, fontWeight: 600, color: '#151515' }} className="block mb-4">Select Timeline</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timelineOptions.map((option) => {
                      const isSelected = selectedTimeline === option.id;
                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedTimeline(option.id)}
                          className="p-5 rounded-xl border-2 bg-white text-left cursor-pointer transition-all"
                          style={{
                            borderColor: isSelected ? '#8b5cf6' : '#e5e7eb',
                            boxShadow: isSelected ? '0 8px 24px rgba(139,92,246,0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: isSelected ? '#ede9fe' : '#f3f4f6', color: isSelected ? '#8b5cf6' : '#6b7280' }}
                            >
                              {option.icon}
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

                          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#151515', marginBottom: 4 }}>
                            {option.label}
                          </h3>
                          <p style={{ fontSize: 13, color: '#767676', marginBottom: 8 }}>
                            {option.desc}
                          </p>

                          {/* Projected skill growth visualization */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f3f4f6' }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: isSelected ? '#8b5cf6' : '#d1d5db' }}
                                initial={{ width: 0 }}
                                animate={{ width: isSelected ? `${(option.skills / 6) * 100}%` : '0%' }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                          <p style={{ fontSize: 11, color: '#9ca3af' }}>
                            Gain {option.skills} skills • {option.duration} weeks
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Commitment Choices */}
                <label style={{ fontSize: 14, fontWeight: 600, color: '#151515' }} className="block mb-4">Daily Commitment</label>
                <div className="grid grid-cols-3 gap-4">
                  {commitments.map((c) => {
                    const isSelected = commitment === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setCommitment(c.id)}
                        className="p-5 rounded-xl border-2 bg-white text-center cursor-pointer transition-all"
                        style={{
                          borderColor: isSelected ? '#8b5cf6' : '#e5e7eb',
                          boxShadow: isSelected ? '0 4px 12px rgba(139,92,246,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div className="text-2xl mb-2">{c.emoji}</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#151515' }}>{c.label}</div>
                        <div style={{ fontSize: 12, color: '#767676' }}>{c.desc}</div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#8b5cf6' }}
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
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
