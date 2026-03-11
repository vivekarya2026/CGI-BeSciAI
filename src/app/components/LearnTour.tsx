import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

type LearnTabId = 'path' | 'challenges' | 'trainings' | 'micro';

interface LearnTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStepTabChange?: (tab: LearnTabId) => void;
}

const steps: { id: number; title: string; body: string; tab?: LearnTabId }[] = [
  { id: 1, title: 'Welcome to your Learn hub', body: 'Build your AI skills with personalized paths, challenges, and resources. Use the tabs to switch between My Learning Path, Challenges, Trainings, and Micro-Learnings. Office Hours, Prompt Library, and Resources are in the sidebar.' },
  { id: 2, title: 'My Learning Path', body: 'Your personalized journey from AI basics to mastery. See progress, continue your current module, review completed work, and get AI recommendations.', tab: 'path' },
  { id: 3, title: 'Challenges', body: 'Weekly, track, and assigned challenges. Filter by type and difficulty, then view details, start, or save for later.', tab: 'challenges' },
  { id: 4, title: 'Trainings', body: 'Structured courses with certificates. Start a training, preview content, or save for later. Complete to earn points and badges.', tab: 'trainings' },
  { id: 5, title: 'Micro-Learnings', body: 'Bite-sized content (~10 min) with quick points. Filter by topic and tool, mark complete, or apply in a challenge.', tab: 'micro' },
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
        className="learn-tour-backdrop"
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
          className="learn-tour-modal space-y-4"
        >
          <button
            onClick={handleSkip}
            className="learn-tour-close hover:bg-gray-100"
          >
            <X size={16} />
          </button>

          <div className="learn-tour-step-label">
            Learn tour · Step {stepIndex + 1} of {steps.length}
          </div>

          <h2 className="learn-tour-title">
            {current.title}
          </h2>

          <p className="learn-tour-body">
            {current.body}
          </p>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSkip}
              className="learn-tour-skip hover:text-gray-700"
            >
              Skip tour
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={isFirst}
                className="learn-tour-back disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={12} /> Back
              </button>
              <button
                onClick={handleNext}
                className="learn-tour-next"
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

