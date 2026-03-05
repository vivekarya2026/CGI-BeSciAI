import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

type LearnTabId = 'path' | 'challenges' | 'trainings' | 'micro' | 'officehours' | 'prompts' | 'resources';

interface LearnTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStepTabChange?: (tab: LearnTabId) => void;
}

const steps: { id: number; title: string; body: string; tab?: LearnTabId }[] = [
  { id: 1, title: 'Welcome to your Learn hub', body: 'Build your AI skills with personalized paths, challenges, and resources. Use the tabs to switch between My Learning Path, Challenges, Trainings, Micro-Learnings, Office Hours, Prompt Library, and Resources.' },
  { id: 2, title: 'My Learning Path', body: 'Your personalized journey from AI basics to mastery. See progress, continue your current module, review completed work, and get AI recommendations.', tab: 'path' },
  { id: 3, title: 'Challenges', body: 'Weekly, track, and assigned challenges. Filter by type and difficulty, then view details, start, or save for later.', tab: 'challenges' },
  { id: 4, title: 'Trainings', body: 'Structured courses with certificates. Start a training, preview content, or save for later. Complete to earn points and badges.', tab: 'trainings' },
  { id: 5, title: 'Micro-Learnings', body: 'Bite-sized content (~10 min) with quick points. Filter by topic and tool, mark complete, or apply in a challenge.', tab: 'micro' },
  { id: 6, title: 'Office Hours', body: 'Join live sessions, watch recordings, browse Q&A, or book 1:1 coaching. See upcoming sessions and register.', tab: 'officehours' },
  { id: 7, title: 'Prompt Library', body: 'Search and browse prompts by category. Copy, customize, bookmark, or apply in a challenge. Contribute your own prompts.', tab: 'prompts' },
  { id: 8, title: 'Resources', body: 'Guides, videos, templates, tools, podcasts, and articles. Search and filter by type, then read, watch, or copy.', tab: 'resources' },
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

