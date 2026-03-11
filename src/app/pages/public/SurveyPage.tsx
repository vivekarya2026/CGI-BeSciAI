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
import clsx from 'clsx';

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
      <div className="survey-analyzing-screen">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mb-8">
            {analyzeSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: analyzeStep >= i ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="survey-analyzing-step"
              >
                <div className="text-white/80">{step.icon}</div>
                <span className={clsx('survey-analyzing-text', analyzeStep >= i ? 'survey-analyzing-text-active' : 'survey-analyzing-text-inactive')}>{step.text}</span>
                {analyzeStep > i && <CheckCircle size={20} className="text-green-400" />}
              </motion.div>
            ))}
          </div>
          <div className="survey-analyzing-progress">
            <motion.div
              className="survey-analyzing-progress-fill"
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
      <div className="survey-transition-screen">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-center text-white">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-5xl mb-6">
            {transitionType === 'insight' ? '💡' : '🎭'}
          </motion.div>
          <h2 className="survey-transition-title">
            {transitionType === 'insight' ? 'Quick Insight' : 'Archetype Hint'}
          </h2>
          <p className="survey-transition-text">
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
    <div className="survey-container">
      {/* 1. Header & Progress Bar */}
      <header className="survey-header">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="survey-section-label">Section {section}/3</span>
              <span className="survey-section-name">{question.sectionName}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="survey-save-indicator">
                <Save size={14} />
                <span className="survey-save-text">Auto-saved</span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="survey-exit-btn"
              >
                <X size={14} /> Save & Exit
              </button>
            </div>
          </div>
          <div className="survey-progress-bar">
            <motion.div
              className="survey-progress-fill"
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
              key={question.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h2 className="survey-question-title">
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
                      className={clsx('survey-option-button', isSelected ? 'survey-option-selected' : 'survey-option-unselected')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={clsx('survey-option-radio', isSelected ? 'survey-option-radio-selected' : 'survey-option-radio-unselected')}>
                          {isSelected && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="survey-option-radio-dot" />
                          )}
                        </div>
                        <span className={clsx('survey-option-text', isSelected ? 'survey-option-text-selected' : 'survey-option-text-unselected')}>
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
      <footer className="survey-footer">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="survey-btn-back"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className={clsx('survey-btn-next', answers[question.id] ? 'survey-btn-next-enabled' : 'survey-btn-next-disabled')}
          >
            {currentQuestion === totalQuestions - 1 ? 'Complete' : 'Next'} <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
