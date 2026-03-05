import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

type LearnTabId = 'path' | 'challenges' | 'trainings' | 'micro' | 'officehours' | 'prompts' | 'resources';

interface LearnTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStepTabChange?: (tab: LearnTabId) => void;
}

const steps: { id: number; title: string; body: string; tab?: LearnTabId; targetId?: string }[] = [
  { id: 1, title: 'Challenges Overview', body: 'Welcome to the Challenges page! Here you can find various challenges to put your AI skills to the test.', tab: 'challenges', targetId: 'tour-target-challenges' },
  { id: 2, title: 'Find a Challenge', body: 'Looking for something specific? Use this search bar to quickly find challenges by name or keyword.', tab: 'challenges', targetId: 'tour-target-challenges-search' },
  { id: 3, title: 'Filter by Type', body: 'Narrow down the list by selecting a specific challenge type: Weekly, Track, or Assigned.', tab: 'challenges', targetId: 'tour-target-challenges-filter' },
  { id: 4, title: 'Challenge Cards', body: 'Each card provides key details like difficulty, required time, points you can earn, and how many peers are participating. Click one to start learning!', tab: 'challenges', targetId: 'tour-target-challenges-card-0' },
];

export default function LearnTour({ isOpen, onClose, onStepTabChange }: LearnTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const current = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setTargetRect(null);
      return;
    }

    // Delay checking the rect to allow for potential tab change & rendering
    const updateRect = () => {
      if (current.targetId) {
        const el = document.getElementById(current.targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            const freshEl = document.getElementById(current.targetId!);
            if (freshEl) {
              setTargetRect(freshEl.getBoundingClientRect());
            }
          }, 350); // wait for scroll
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }
    };

    updateRect();

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [isOpen, stepIndex, current.targetId]);

  if (!isOpen) return null;

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, index));
    const step = steps[clamped];
    if (step.tab && onStepTabChange) {
      onStepTabChange(step.tab);
    }
    setStepIndex(clamped);
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

  let popoverStyle: React.CSSProperties = {};
  if (targetRect) {
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;

    let top = targetRect.bottom + 12;
    let left = targetRect.left;

    if (spaceBelow < 250 && spaceAbove > 250) {
      top = targetRect.top - 200; // approximate popover height
    }

    if (left + 400 > window.innerWidth) {
      left = window.innerWidth - 420;
    }
    if (left < 20) {
      left = 20;
    }

    popoverStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      margin: 0,
    };
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-auto"
          preserveAspectRatio="none"
          onClick={handleSkip}
        >
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              {targetRect && (
                <motion.rect
                  x={targetRect.left - 6}
                  y={targetRect.top - 6}
                  width={targetRect.width + 12}
                  height={targetRect.height + 12}
                  rx="8"
                  fill="black"
                  initial={false}
                  animate={{
                    x: targetRect.left - 6,
                    y: targetRect.top - 6,
                    width: targetRect.width + 12,
                    height: targetRect.height + 12,
                  }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#spotlight-mask)"
          />
        </svg>

        <motion.div
          className={`relative max-w-md w-full rounded-2xl bg-white shadow-xl p-6 space-y-4 pointer-events-auto ${!targetRect ? 'mx-auto mt-[20vh]' : ''}`}
          style={{ fontFamily: 'var(--font-primary)', ...popoverStyle }}
          initial={false}
          animate={{
            top: popoverStyle.top,
            left: popoverStyle.left,
            y: !targetRect ? 20 : 0,
            opacity: 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
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


