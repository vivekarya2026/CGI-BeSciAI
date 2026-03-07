import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, BookOpen, MousePointer2, Sparkles } from 'lucide-react';
import { useChallengeTour } from '../context/ChallengeTourContext';

type TourStepId =
  | 'learn-challenges-tab'
  | 'learn-first-challenge'
  | 'detail-start-challenge'
  | 'workspace-step-1'
  | 'workspace-step-1-next'
  | 'workspace-step-2'
  | 'workspace-step-2-next'
  | 'workspace-step-3'
  | 'workspace-complete-submit'
  | 'submit-upload'
  | 'submit-paste-code'
  | 'submit-link-work'
  | 'submit-screenshot'
  | 'submit-reflection-notes'
  | 'submit-reflection-questions'
  | 'submit-review'
  | 'submit-button'
  | 'results-hero'
  | 'results-start-next';

interface TourStep {
  id: TourStepId;
  /** CSS selector for the element we want to spotlight */
  selector: string;
  /** Short label shown in the tooltip title */
  title: string;
  /** Short explanation text */
  body: string;
  /** Restrict this step to specific route prefix (optional) */
  routePrefix?: string;
  /**
   * If true, clicks on the highlighted area will:
   *  - trigger the underlying element .click()
   *  - advance the tour to the next step
   *  All other clicks on the dimmed background are ignored.
   */
  advanceOnTargetClick?: boolean;
}

const POST_ONBOARDING_FLAG = 'post_onboarding_challenge_tour';
const POST_ONBOARDING_DONE = 'post_onboarding_challenge_tour_done';

/** Placement: gap from spotlight, FAB reserve zone, modal height for placement math */
const GAP = 12;
const FAB_ZONE_RIGHT = 80;
const FAB_ZONE_BOTTOM = 80;
const MODAL_ESTIMATED_HEIGHT = 380;
const SPOTLIGHT_PADDING = 8;
const SPOTLIGHT_RADIUS = 12;

/** SVG path for a rounded rectangle (for evenodd cutout). */
function roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  if (r <= 0 || w < 2 * r || h < 2 * r) return `M ${x},${y} h ${w} v ${h} h ${-w} Z`;
  const x2 = x + w;
  const y2 = y + h;
  return `M ${x + r},${y} L ${x2 - r},${y} Q ${x2},${y} ${x2},${y + r} L ${x2},${y2 - r} Q ${x2},${y2} ${x2 - r},${y2} L ${x + r},${y2} Q ${x},${y2} ${x},${y2 - r} L ${x},${y + r} Q ${x},${y} ${x + r},${y} Z`;
}

function getTooltipPlacement(
  rect: DOMRect,
  vw: number,
  vh: number,
  tooltipWidth: number,
  padding: number,
): { top: number; left: number } {
  const modalBottom = (top: number) => top + MODAL_ESTIMATED_HEIGHT;
  const modalRight = (left: number) => left + tooltipWidth;

  const inViewport = (left: number, top: number) =>
    left >= padding &&
    top >= padding &&
    modalRight(left) <= vw - padding &&
    modalBottom(top) <= vh - padding;

  const intersectsSpotlight = (left: number, top: number) =>
    !(
      modalRight(left) <= rect.left - GAP ||
      left >= rect.right + GAP ||
      modalBottom(top) <= rect.top - GAP ||
      top >= rect.bottom + GAP
    );

  const overlapsFab = (left: number, top: number) =>
    modalRight(left) > vw - FAB_ZONE_RIGHT && modalBottom(top) > vh - FAB_ZONE_BOTTOM;

  const valid = (left: number, top: number) =>
    inViewport(left, top) && !intersectsSpotlight(left, top) && !overlapsFab(left, top);

  // 1) Below spotlight — prefer right of spotlight, then left of, then aligned
  let top = rect.bottom + GAP;
  let left = rect.right + GAP;
  if (valid(left, top)) return { top, left };
  left = rect.left - tooltipWidth - GAP;
  if (valid(left, top)) return { top, left };
  left = Math.max(padding, Math.min(rect.left, vw - tooltipWidth - padding));
  if (valid(left, top)) return { top, left };

  // 2) Above spotlight
  top = rect.top - GAP - MODAL_ESTIMATED_HEIGHT;
  left = rect.right + GAP;
  if (valid(left, top)) return { top, left };
  left = rect.left - tooltipWidth - GAP;
  if (valid(left, top)) return { top, left };
  left = Math.max(padding, Math.min(rect.left, vw - tooltipWidth - padding));
  if (valid(left, top)) return { top, left };

  // 3) Right of spotlight
  left = rect.right + GAP;
  top = rect.top + rect.height / 2 - MODAL_ESTIMATED_HEIGHT / 2;
  if (valid(left, top)) return { top, left };
  top = rect.top;
  if (valid(left, top)) return { top, left };
  top = rect.bottom - MODAL_ESTIMATED_HEIGHT;
  if (valid(left, top)) return { top, left };

  // 4) Left of spotlight
  left = rect.left - tooltipWidth - GAP;
  top = rect.top + rect.height / 2 - MODAL_ESTIMATED_HEIGHT / 2;
  if (valid(left, top)) return { top, left };
  top = rect.top;
  if (valid(left, top)) return { top, left };
  top = rect.bottom - MODAL_ESTIMATED_HEIGHT;
  if (valid(left, top)) return { top, left };

  return { top: 72, left: padding };
}

const steps: TourStep[] = [
  {
    id: 'learn-challenges-tab',
    selector: 'button[data-tour-id="learn-tab-challenges"]',
    routePrefix: '/app/learn',
    title: 'Start with Challenges',
    body: 'Click the Challenges tab below to open the challenges list and continue the walkthrough.',
    advanceOnTargetClick: true,
  },
  {
    id: 'learn-first-challenge',
    selector: '[data-tour-id="challenge-card-first-view"]',
    routePrefix: '/app/learn',
    title: 'Open your first challenge',
    body: 'Click this first challenge to see the overview, requirements, and points you can earn.',
    advanceOnTargetClick: true,
  },
  {
    id: 'detail-start-challenge',
    selector: 'button[data-tour-id="challenge-detail-start"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Go to the workspace',
    body: 'Use “Start Challenge” to move into the workspace where you will actually complete the prompt.',
    advanceOnTargetClick: true,
  },
  {
    id: 'workspace-step-1',
    selector: '[data-tour-id="workspace-step-1"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Step 1: Read instructions',
    body: 'Carefully read the challenge instructions and objectives so you know exactly what “good” looks like before touching any tools.',
  },
  {
    id: 'workspace-step-1-next',
    selector: 'button[data-tour-id="workspace-step-1-next"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Move to AI tools',
    body: 'When you are ready, click “Next: Access AI tools” to open or switch to your preferred AI assistant.',
    advanceOnTargetClick: true,
  },
  {
    id: 'workspace-step-2',
    selector: '[data-tour-id="workspace-step-2"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Step 2: Access AI tools',
    body: 'Use tools like ChatGPT, Claude, or Copilot to explore ideas, draft solutions, or get unstuck on this challenge.',
  },
  {
    id: 'workspace-step-2-next',
    selector: 'button[data-tour-id="workspace-step-2-next"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Move into doing the work',
    body: 'Once you’ve used your AI tools, click “Next: Work on challenge” to focus on capturing your final answer.',
    advanceOnTargetClick: true,
  },
  {
    id: 'workspace-step-3',
    selector: '[data-tour-id="workspace-step-3"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Step 3: Work on challenge',
    body: 'Use this workspace to jot notes, paste AI outputs, and collect links so everything for this challenge stays in one place.',
  },
  {
    id: 'workspace-complete-submit',
    selector: 'button[data-tour-id="workspace-complete-submit"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Ready to submit?',
    body: 'Click “Completed — Submit” when you have your final work ready. You can also Pause & Save to return later or use “Stuck — Get help” for hints and micro-learnings.',
    advanceOnTargetClick: true,
  },
  {
    id: 'submit-upload',
    selector: '[data-tour-id="submit-upload"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Upload files',
    body: 'Attach documents or project files for your finished work.',
  },
  {
    id: 'submit-paste-code',
    selector: '[data-tour-id="submit-paste-code"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Paste code',
    body: 'Paste key code snippets so reviewers can see what you built.',
  },
  {
    id: 'submit-link-work',
    selector: '[data-tour-id="submit-link-work"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Link your work',
    body: 'Add a URL to a repo, doc, or link that shows your output.',
  },
  {
    id: 'submit-screenshot',
    selector: '[data-tour-id="submit-screenshot"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Add a screenshot',
    body: 'Paste or drag a screenshot to show your result.',
  },
  {
    id: 'submit-reflection-notes',
    selector: '[data-tour-id="submit-reflection-notes"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Reflection notes',
    body: 'Add context for reviewers: what you tried and how AI helped.',
  },
  {
    id: 'submit-reflection-questions',
    selector: '[data-tour-id="submit-reflection-questions"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Optional deeper reflection',
    body: 'Optional questions to reflect and learn from the challenge.',
  },
  {
    id: 'submit-review',
    selector: '[data-tour-id="submit-review"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Review your submission',
    body: 'Checklist of what you attached. Mark “Looks good” when ready to submit.',
  },
  {
    id: 'submit-button',
    selector: 'button[data-tour-id="submit-button"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Submit Challenge',
    body: 'Click “Submit Challenge” to send your work, lock in your points, and move to feedback and next steps.',
    advanceOnTargetClick: true,
  },
  {
    id: 'results-hero',
    selector: '[data-tour-id="results-hero"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Great work!',
    body: 'This screen confirms you completed the challenge and shows your points, streak bonuses, and status updates.',
  },
  {
    id: 'results-start-next',
    selector: 'button[data-tour-id="results-start-next"]',
    routePrefix: '/app/learn/challenges/',
    title: 'Keep your momentum',
    body: 'When you are ready, click “Start Next Challenge” to immediately jump into your next practice rep.',
    advanceOnTargetClick: true,
  },
];

interface SpotlightState {
  rect: DOMRect | null;
  element: HTMLElement | null;
}

export default function ChallengeGuidedTour() {
  const location = useLocation();
  const { showChallengeTour, startChallengeTour, closeChallengeTour, setCurrentStepId } = useChallengeTour();
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightState>({ rect: null, element: null });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const active = showChallengeTour;
  const prevShowRef = useRef(showChallengeTour);
  const highlightedElementRef = useRef<HTMLElement | null>(null);
  const overlaySvgRef = useRef<SVGSVGElement>(null);

  const TOUR_HIGHLIGHT_CLASS = 'challenge-tour-spotlight-target';

  // Apply/remove visual highlight on the target element (same design as sidebar "Learn" highlight)
  useEffect(() => {
    const next = spotlight.element;
    const prev = highlightedElementRef.current;
    if (prev && prev !== next) {
      prev.classList.remove(TOUR_HIGHLIGHT_CLASS);
    }
    if (next) {
      next.classList.add(TOUR_HIGHLIGHT_CLASS);
      highlightedElementRef.current = next;
    } else {
      highlightedElementRef.current = null;
    }
    return () => {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove(TOUR_HIGHLIGHT_CLASS);
        highlightedElementRef.current = null;
      }
    };
  }, [spotlight.element]);

  // When tour closes, remove highlight from any element
  useEffect(() => {
    if (!active && highlightedElementRef.current) {
      highlightedElementRef.current.classList.remove(TOUR_HIGHLIGHT_CLASS);
      highlightedElementRef.current = null;
    }
  }, [active]);


  // When tour opens, reset to first step
  useEffect(() => {
    if (showChallengeTour && !prevShowRef.current) {
      setStepIndex(0);
    }
    prevShowRef.current = showChallengeTour;
  }, [showChallengeTour]);

  // Post-onboarding: show welcome modal first; do not start tour until user clicks Next
  useEffect(() => {
    if (typeof window === 'undefined' || !location.pathname.startsWith('/app/learn')) return;
    const done = window.localStorage.getItem(POST_ONBOARDING_DONE) === 'true';
    const trigger = window.localStorage.getItem(POST_ONBOARDING_FLAG) === 'true';
    if (!done && trigger) {
      setShowWelcomeModal(true);
      window.localStorage.removeItem(POST_ONBOARDING_FLAG);
    }
  }, [location.pathname]);

  const currentStep: TourStep | null = useMemo(() => {
    if (!active) return null;
    const step = steps[stepIndex];
    if (!step) return null;
    if (step.routePrefix && !location.pathname.startsWith(step.routePrefix)) {
      return null;
    }
    return step;
  }, [active, stepIndex, location.pathname]);

  // Sync current step id to context for demo overrides (e.g. enable Submit button on step 17)
  useEffect(() => {
    if (active && currentStep) {
      setCurrentStepId(currentStep.id);
    } else {
      setCurrentStepId(null);
    }
  }, [active, currentStep, setCurrentStepId]);

  // Recompute spotlight target whenever step or location changes
  useEffect(() => {
    if (!currentStep) {
      setSpotlight({ rect: null, element: null });
      return;
    }

    const findTarget = () => {
      const el = document.querySelector(currentStep.selector) as HTMLElement | null;
      if (!el) {
        setSpotlight({ rect: null, element: null });
        return;
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const rect = el.getBoundingClientRect();
      setSpotlight({ rect, element: el });
    };

    // Initial attempt
    findTarget();

    // Re-run after a short delay in case the DOM is still animating in
    const timer = window.setTimeout(findTarget, 200);
    // Extra retry for steps that depend on client state (e.g. workspace step, tab)
    const retryTimer = window.setTimeout(findTarget, 450);

    const updateRect = () => {
      const el = highlightedElementRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setSpotlight(prev => (prev.element === el ? { ...prev, rect } : prev));
    };

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(retryTimer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep?.selector, location.pathname]);

  const goToNextStep = () => {
    setStepIndex(prev => {
      const next = prev + 1;
      if (next >= steps.length) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(POST_ONBOARDING_DONE, 'true');
        }
        closeChallengeTour();
        return prev;
      }
      return next;
    });
  };

  /** When user clicks Next on the card: trigger target click first (so e.g. tab switches), then advance after a short delay so UI can update. */
  const handleNextClick = () => {
    if (currentStep?.advanceOnTargetClick && spotlight.element) {
      spotlight.element.click();
      window.setTimeout(goToNextStep, 100);
    } else {
      goToNextStep();
    }
  };

  const handleSkip = () => {
    closeChallengeTour();
  };

  const handleWelcomeNext = () => {
    setShowWelcomeModal(false);
    startChallengeTour();
  };

  const handleWelcomeSkip = () => {
    setShowWelcomeModal(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(POST_ONBOARDING_DONE, 'true');
    }
  };

  const handleBackgroundClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    if (!currentStep || !spotlight.rect || !spotlight.element) return;

    if (!currentStep.advanceOnTargetClick) {
      // For non-gated steps, clicking the dimmed background does nothing.
      return;
    }

    const { clientX, clientY } = event;
    const { left, right, top, bottom } = spotlight.rect;

    const inside =
      clientX >= left &&
      clientX <= right &&
      clientY >= top &&
      clientY <= bottom;

    if (inside) {
      // Trigger the underlying element and move to the next step
      spotlight.element.click();
      goToNextStep();
    }
  };

  // Welcome modal (post-onboarding): show before starting the tour
  if (showWelcomeModal) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center p-4"
          style={{ fontFamily: 'var(--font-primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div
            className="absolute inset-0 bg-black/50"
            aria-hidden
            onClick={handleWelcomeSkip}
          />
          <motion.div
            className="relative rounded-2xl overflow-hidden w-full max-w-[420px] pointer-events-auto"
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.15)',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-1.5 w-full"
              style={{ background: 'linear-gradient(90deg, rgb(82, 54, 171), rgb(168, 36, 101), rgb(227, 25, 55))' }}
            />
            <div className="p-5 sm:p-7">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgb(242, 241, 249), rgb(230, 227, 243))',
                    color: 'rgb(82, 54, 171)',
                  }}
                >
                  <Sparkles size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-[22px] font-bold leading-tight" style={{ color: 'rgb(21, 21, 21)' }}>
                    Welcome to BeSciAI!
                  </h2>
                </div>
              </div>
              <p className="text-sm sm:text-[15px] leading-relaxed mb-5 sm:mb-6" style={{ color: 'rgb(92, 92, 92)' }}>
                Ready to master AI? Let&apos;s take a quick interactive tour to show you how to earn points and level up your skills.
              </p>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleWelcomeSkip}
                  className="px-4 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 text-sm font-semibold"
                  style={{ color: 'rgb(118, 118, 118)' }}
                >
                  Skip Tour
                </button>
                <button
                  type="button"
                  onClick={handleWelcomeNext}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#5236ab' }}
                >
                  Start the Tour
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!active || !currentStep) return null;

  const { rect } = spotlight;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 600;
  const isNarrow = vw < 640;
  const tooltipWidth = Math.min(360, vw - 24);
  const padding = isNarrow ? 12 : 16;

  // Position modal so it never overlaps the spotlight or the ByteBot FAB zone
  const placement = rect ? getTooltipPlacement(rect, vw, vh, tooltipWidth, padding) : { top: 72, left: padding };
  const tooltipStyle: React.CSSProperties = {
    top: placement.top,
    left: placement.left,
    right: 'auto',
    maxWidth: tooltipWidth,
  };

  const stepNumber = stepIndex + 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[140] overflow-hidden pointer-events-none"
        style={{ fontFamily: 'var(--font-primary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* SVG overlay: dark fill with evenodd cutout; path receives dimmed clicks, SVG receives hole clicks */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            ref={overlaySvgRef}
            width={vw}
            height={vh}
            style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'auto' }}
            aria-hidden
            onClick={(e) => {
              if (!rect || !spotlight.element || !currentStep?.advanceOnTargetClick) return;
              if (e.target !== overlaySvgRef.current) return;
              const { clientX, clientY } = e;
              const inside =
                clientX >= rect.left &&
                clientX <= rect.right &&
                clientY >= rect.top &&
                clientY <= rect.bottom;
              if (inside) {
                e.preventDefault();
                e.stopPropagation();
                spotlight.element.click();
                goToNextStep();
              }
            }}
          >
            <path
              fill="rgba(0,0,0,0.45)"
              fillRule="evenodd"
              pointerEvents="fill"
              onClick={handleBackgroundClick}
              d={
                rect
                  ? `M 0,0 L ${vw},0 L ${vw},${vh} L 0,${vh} Z ${roundedRectPath(rect.left - SPOTLIGHT_PADDING, rect.top - SPOTLIGHT_PADDING, rect.width + 2 * SPOTLIGHT_PADDING, rect.height + 2 * SPOTLIGHT_PADDING, SPOTLIGHT_RADIUS)}`
                  : `M 0,0 L ${vw},0 L ${vw},${vh} L 0,${vh} Z`
              }
            />
          </svg>
        </motion.div>

        {/* Purple border ring — no dimming, just the outline */}
        {rect && (
          <motion.div
            className="absolute rounded-xl pointer-events-none"
            style={{
              top: rect.top - SPOTLIGHT_PADDING,
              left: rect.left - SPOTLIGHT_PADDING,
              width: rect.width + 2 * SPOTLIGHT_PADDING,
              height: rect.height + 2 * SPOTLIGHT_PADDING,
              background: 'transparent',
              border: '3px solid rgb(82, 54, 171)',
              borderRadius: 12,
              zIndex: 9998,
            }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: 'spring', damping: 20, stiffness: 300 },
            }}
          />
        )}

        {/* Modal card — reference design: gradient bar, icon, badge, progress dots, CTA */}
        <motion.div
          className="absolute rounded-2xl overflow-hidden pointer-events-auto"
          style={{
            ...tooltipStyle,
            backgroundColor: 'rgb(255, 255, 255)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 10000,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        >
          {/* Gradient strip at top */}
          <div
            className="h-1.5 w-full"
            style={{ background: 'linear-gradient(90deg, rgb(82, 54, 171), rgb(168, 36, 101), rgb(227, 25, 55))' }}
          />
          <div className="p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgb(242, 241, 249), rgb(230, 227, 243))', color: 'rgb(82, 54, 171)' }}>
                <BookOpen size={isNarrow ? 24 : 28} />
              </div>
              <button
                onClick={handleSkip}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={isNarrow ? 16 : 20} />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgb(242, 241, 249)', color: 'rgb(82, 54, 171)' }}>
                {stepNumber} of {steps.length}
              </span>
            </div>
            <h3 className="text-base sm:text-[22px] font-bold leading-tight mb-2" style={{ color: 'rgb(21, 21, 21)' }}>
              {currentStep.title}
            </h3>
            <p className="text-sm sm:text-[15px] leading-relaxed mb-5 sm:mb-6" style={{ color: 'rgb(92, 92, 92)' }}>
              {currentStep.body}
            </p>

            {currentStep.advanceOnTargetClick ? (
              <div className="flex items-center gap-2 mb-5 sm:mb-6 p-3 rounded-lg border" style={{ backgroundColor: '#f2f1f9', borderColor: '#cbc3e6' }}>
                <MousePointer2 size={18} className="shrink-0" style={{ color: '#5236ab' }} />
                <span className="text-xs sm:text-[13px] font-bold" style={{ color: '#5236ab' }}>
                  Click the highlighted area to continue
                </span>
              </div>
            ) : (
              <div className="mb-5 sm:mb-6">
                <button
                  onClick={goToNextStep}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#5236ab' }}
                >
                  Got it, next
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Progress dots (pills) */}
            <div className="flex items-center gap-1.5 mb-5 sm:mb-6 flex-wrap">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width: i === stepIndex ? 24 : 8,
                    height: 8,
                    backgroundColor: i === stepIndex ? 'rgb(82, 54, 171)' : i < stepIndex ? 'rgb(203, 195, 230)' : 'rgb(230, 227, 243)',
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 text-sm font-semibold"
                style={{ color: 'rgb(118, 118, 118)' }}
              >
                Skip Tour
              </button>
              <button
                type="button"
                onClick={handleNextClick}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#5236ab' }}
              >
                {stepIndex >= steps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

