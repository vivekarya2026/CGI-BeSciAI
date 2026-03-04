import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

type LearnTab = 'path' | 'quickwins' | 'resources' | 'assessments';

interface LearnTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStepTabChange?: (tab: LearnTab) => void;
}

const steps: { id: number; title: string; body: string; tab?: LearnTab }[] = [
  {
    id: 1,
    title: 'Welcome to your Learn hub',
    body: 'Use this space to build your AI skills. The tabs at the top let you switch between your path, quick wins, resources, and skill assessments.',
  },
  {
    id: 2,
    title: 'My Adoption Path',
    body: 'Follow a structured sequence of modules and challenges. Start with your current module, then move into upcoming ones as you build confidence.',
    tab: 'path',
  },
  {
    id: 3,
    title: 'Quick Wins',
    body: 'Short, high-impact tasks you can complete in a few minutes to see immediate value in your day-to-day work.',
    tab: 'quickwins',
  },
  {
    id: 4,
    title: 'Resources Library',
    body: 'Browse guides, videos, and templates. Use search and filters to quickly find what you need for a specific task or question.',
    tab: 'resources',
  },
  {
    id: 5,
    title: 'Skill Assessments',
    body: 'Track how your capabilities are growing over time. Skill meters and certifications show your progress toward AI mastery.',
    tab: 'assessments',
  },
];

export default function LearnTour({ isOpen, onClose, onStepTabChange }: LearnTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  if (!isOpen) return null;

  const current = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, index));
    setStepIndex(clamped);
    const step = steps[clamped];
    if (step.tab && onStepTabChange) {
      onStepTabChange(step.tab);
    }
  };

  const handleNext = () => {
    if (isLast) {
      onClose();
      return;
    }
    goToStep(stepIndex + 1);
  };

  const handlePrev = () => {
    if (!isFirst) {
      goToStep(stepIndex - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40" onClick={handleSkip} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-md w-full rounded-2xl bg-white shadow-xl p-6 space-y-4"
          style={{ fontFamily: 'var(--font-primary)' }}
        >
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Learn tour · Step {stepIndex + 1} of {steps.length}
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            {current.title}
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            {current.body}
          </p>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSkip}
              className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Skip tour
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={isFirst}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={12} /> Back
              </button>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
                style={{ backgroundColor: '#5236ab' }}
              >
                {isLast ? 'Finish' : 'Next'}
                {!isLast && <ArrowRight size={12} />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

