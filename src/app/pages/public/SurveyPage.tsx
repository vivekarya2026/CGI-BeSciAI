/**
 * ============================================
 * 📝 SURVEY PAGE — SurveyPage.tsx
 * ============================================
 *
 * This component runs the BeSciAI Archetype quiz.
 * It's a multi-step form where users answer questions to determine
 * their learning style (Trailblazer, Guide, etc.).
 *
 * HOW IT WORKS (State Management):
 * 1. `currentQuestion` (number) - Tracks which question we're on
 * 2. `answers` (object) - Stores the user's answers. Looks like: { "q1": "a", "q2": "c" }
 * 3. `showTransition` / `showAnalyzing` - Controls the cool animation screens
 *
 * THE LOGIC:
 * - When they click an answer, we save it (handleAnswer)
 * - When they click Next, we go to the next question (handleNext)
 * - If they finish the last question, we show a loading screen, calculate
 *   their archetype, log them in as a demo user, and navigate to the Reveal page.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Save, X, CheckCircle, Sparkles, Brain, Lightbulb } from 'lucide-react';
import { surveyQuestions } from '../../data/archetypes';
import { useUser } from '../../context/UserContext';

export default function SurveyPage() {
  const navigate = useNavigate();
  // Grab the setUser/setArchetype functions from our global context
  const { setArchetype, login } = useUser();

  // ============================================
  // SECTION 1: STATE VARIABLES
  // ============================================
  const [currentQuestion, setCurrentQuestion] = useState(0);             // 0 = first question
  const [answers, setAnswers] = useState<Record<string, string>>({});    // Keeps track of selected options
  const [showTransition, setShowTransition] = useState(false);           // Shows "Insight" screen between sections
  const [transitionType, setTransitionType] = useState<'insight' | 'hint' | 'complete'>('insight');
  const [showAnalyzing, setShowAnalyzing] = useState(false);             // Shows final loading screen
  const [analyzeStep, setAnalyzeStep] = useState(0);                     // Progress bar for the loading screen

  // ============================================
  // SECTION 2: DERIVED DATA
  // ============================================
  // These variables are calculated based on the current state
  const question = surveyQuestions[currentQuestion];
  const totalQuestions = surveyQuestions.length;
  const section = question.section;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // ============================================
  // SECTION 3: ACTION HANDLERS
  // ============================================

  // When user clicks an option (A, B, C, D)
  const handleAnswer = useCallback((questionId: string, value: string) => {
    // Keep existing answers, but add/update the current one
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  // When user clicks "Next"
  const handleNext = useCallback(() => {
    if (currentQuestion < totalQuestions - 1) {
      const nextQ = surveyQuestions[currentQuestion + 1];

      // If we're moving to a new section, show a cool animation first
      if (nextQ.section !== question.section) {
        setTransitionType(question.section === 1 ? 'insight' : 'hint');
        setShowTransition(true);
        setTimeout(() => {
          setShowTransition(false);
          setCurrentQuestion(prev => prev + 1); // Move to next question after animation
        }, 2500);
      } else {
        // Just standard next question
        setCurrentQuestion(prev => prev + 1);
      }
    } else {
      // It was the last question! Calculate the result.
      handleComplete();
    }
  }, [currentQuestion, totalQuestions, question]);

  // When user clicks "Back"
  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  // Calculates the archetype and sends user to results
  const handleComplete = useCallback(() => {
    // 1. Show the fake loading screen
    setShowAnalyzing(true);
    const steps = [0, 1, 2];
    steps.forEach((step, i) => {
      setTimeout(() => setAnalyzeStep(step), i * 1200);
    });

    // 2. Wait 4 seconds, then do the math
    setTimeout(() => {
      // Calculate archetype by counting which letter they picked most
      const scores: Record<string, number> = {};
      Object.values(answers).forEach(value => {
        scores[value] = (scores[value] || 0) + 1;
      });

      // Find highest score (topArchetype)
      const topArchetype = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'trailblazer';

      const archetypeMap: Record<string, string> = {
        trailblazer: 'Trailblazer',
        guide: 'Guide',
        connector: 'Connector',
        explorer: 'Explorer',
        champion: 'Champion',
        innovator: 'Innovator',
      };

      // 3. Save to global state and jump to Reveal page
      login('alex@example.com');  // Create demo user
      setArchetype(archetypeMap[topArchetype] as any);
      // Pass the ID to the next page using React Router's state feature
      navigate('/reveal', { state: { archetypeId: topArchetype } });
    }, 4000);
  }, [answers, navigate, setArchetype, login]);


  // ============================================
  // SECTION 4: RENDER UI
  // ============================================

  // ---- UI State A: The Loading/Analyzing Screen ----
  if (showAnalyzing) {
    const analyzeSteps = [
      { text: 'Analyzing your responses...', icon: <Brain size={32} /> },
      { text: 'Identifying your archetype...', icon: <Sparkles size={32} /> },
      { text: 'Personalizing your path...', icon: <Lightbulb size={32} /> },
    ];

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #200a58 0%, #5236ab 50%, #a82465 100%)', fontFamily: 'var(--font-primary)' }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mb-8">
            {analyzeSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: analyzeStep >= i ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4 mb-6 text-white"
              >
                <div className="text-white/80">{step.icon}</div>
                <span style={{ fontSize: 18, fontWeight: analyzeStep >= i ? 600 : 400 }}>{step.text}</span>
                {analyzeStep > i && <CheckCircle size={20} className="text-green-400" />}
              </motion.div>
            ))}
          </div>
          <div className="w-64 h-2 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #e31937, #f59e0b)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${(analyzeStep + 1) * 33.3}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // ---- UI State B: The Inter-Section Transition Screen ----
  if (showTransition) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #5236ab 0%, #a82465 100%)', fontFamily: 'var(--font-primary)' }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-center text-white">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-5xl mb-6">
            {transitionType === 'insight' ? '💡' : '🎭'}
          </motion.div>
          <h2 style={{ fontSize: 28, fontWeight: 600 }} className="mb-3">
            {transitionType === 'insight' ? 'Quick Insight' : 'Archetype Hint'}
          </h2>
          <p style={{ fontSize: 16, lineHeight: '24px' }} className="text-white/80 max-w-md">
            {transitionType === 'insight'
              ? "Great responses! Your work style is starting to reveal patterns. Let's explore your AI comfort level next."
              : "Interesting! We're starting to see your archetype emerge. Just a few more questions about your learning style."}
          </p>
        </motion.div>
      </div>
    );
  }

  // ---- UI State C: The Actual Survey Questions ----
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f8f9fb', fontFamily: 'var(--font-primary)' }}>
      {/* 1. Header & Progress Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 14, fontWeight: 700, color: '#5236ab' }}>Section {section}/3</span>
              <span style={{ fontSize: 14, color: '#767676' }}>{question.sectionName}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <Save size={14} />
                <span style={{ fontSize: 12, color: '#767676' }}>Auto-saved</span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ fontSize: 12, color: '#5c5c5c' }}
              >
                <X size={14} /> Save & Exit
              </button>
            </div>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #5236ab, #a82465, #e31937)' }}
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      {/* 2. The Question and Multiple Choice Options */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}     // IMPORTANT: Changing the key tells React to re-animate when the question changes
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h2 className="mb-8 text-center" style={{ fontSize: 24, fontWeight: 600, color: '#151515', lineHeight: '1.3' }}>
                {question.text}
              </h2>

              <div className="flex flex-col gap-3">
                {question.options.map((option, i) => {
                  const isSelected = answers[question.id] === option.value;
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswer(question.id, option.value)}
                      className="w-full text-left p-5 rounded-xl border-2 transition-all cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? '#f2f1f9' : '#ffffff',
                        borderColor: isSelected ? '#5236ab' : '#e5e7eb',
                        boxShadow: isSelected ? '0px 1px 5px rgba(82,54,171,0.15)' : '0px 1px 2px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                          style={{ borderColor: isSelected ? '#5236ab' : '#a8a8a8' }}
                        >
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5236ab' }} />
                          )}
                        </div>
                        <span style={{ fontSize: 16, lineHeight: '24px', color: isSelected ? '#200a58' : '#333333', fontWeight: isSelected ? 600 : 400 }}>
                          {option.text}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Bottom Navigation (Back / Next) */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: 16, color: '#5c5c5c', borderColor: '#e5e7eb', minHeight: 44 }}
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[question.id]}  // Only allow Next if they picked an answer
            className="flex items-center gap-2 px-8 py-3 rounded-lg text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: answers[question.id] ? '#5236ab' : '#cbc3e6',
              fontSize: 16, fontWeight: 600, minHeight: 44,
              boxShadow: answers[question.id] ? '0px 1px 5px rgba(0,0,0,0.12), 0px 2px 2px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {currentQuestion === totalQuestions - 1 ? 'Complete' : 'Next'} <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
