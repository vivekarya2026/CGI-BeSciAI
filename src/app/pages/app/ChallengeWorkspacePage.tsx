/**
 * Challenge Workspace — Phase 2: Read instructions → AI tools → Submit; Need help? + Status actions.
 * Route: /app/learn/challenges/:challengeId/workspace
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, BookOpen, ExternalLink, Headphones, MessageCircle, User, Play,
  ChevronRight, ChevronDown, ChevronUp, X, Save, CircleHelp, Star, Flame, Target, Home, Clock, Sparkles,
  ListChecks, CheckCircle, Users, Lightbulb,
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getChallengeById, microLearnings } from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import { primaryButtonMotion, secondaryButtonMotion } from '../../components/ui/motionPresets';

const WORKSPACE_DRAFT_KEY = 'challenge_workspace_draft';

function getDraftKey(id: string) {
  return `${WORKSPACE_DRAFT_KEY}_${id}`;
}

type AiToolKey = 'chatgpt' | 'claude' | 'copilot';
const AI_TOOLS: Record<AiToolKey, { label: string; href: string; edgeAddonsSearch: string }> = {
  chatgpt: {
    label: 'ChatGPT',
    href: 'https://chat.openai.com',
    edgeAddonsSearch: 'https://microsoftedge.microsoft.com/addons/search/chatgpt',
  },
  claude: {
    label: 'Claude',
    href: 'https://claude.ai',
    edgeAddonsSearch: 'https://microsoftedge.microsoft.com/addons/search/claude',
  },
  copilot: {
    label: 'Copilot',
    href: 'https://copilot.microsoft.com',
    edgeAddonsSearch: 'https://microsoftedge.microsoft.com/addons/search/copilot',
  },
};

export default function ChallengeWorkspacePage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrereqs, setShowPrereqs] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [openTool, setOpenTool] = useState<AiToolKey | null>(null);
  const [notes, setNotes] = useState(() => {
    if (typeof window === 'undefined' || !challengeId) return '';
    try {
      const raw = localStorage.getItem(getDraftKey(challengeId));
      const data = raw ? JSON.parse(raw) : null;
      return (data?.notes ?? '') as string;
    } catch {
      return '';
    }
  });

  const { progress, addXp } = useUser();

  const challenge = useMemo(() => (challengeId ? getChallengeById(challengeId) : undefined), [challengeId]);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionAwarded, setCompletionAwarded] = useState(false);

  const saveDraft = () => {
    if (!challengeId) return;
    try {
      localStorage.setItem(getDraftKey(challengeId), JSON.stringify({ notes }));
    } catch {}
  };

  if (!challengeId || !challenge) {
    return (
      <div className="p-6">
        <p className="text-app-secondary">Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-primary">Back to Learn</button>
      </div>
    );
  }

  const relatedMicro = challenge.relatedContentIds?.length
    ? microLearnings.filter(m => challenge.relatedContentIds!.includes(m.id))
    : [];

  const instructions = challenge.instructions || challenge.description;
  const isEdge =
    typeof window !== 'undefined' &&
    /Edg\//.test(window.navigator.userAgent) &&
    !/OPR\//.test(window.navigator.userAgent) &&
    !/Brave\//.test(window.navigator.userAgent);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'code-block'],
        ['clean'],
      ],
    }),
    []
  );

  const handleComplete = () => {
    if (!challengeId || !challenge) return;
    // Avoid double-awarding XP if the user clicks multiple times
    if (!completionAwarded) {
      addXp(challenge.points);
      setCompletionAwarded(true);
    }
    setShowCompletionModal(true);
  };

  const handleAiToolClick = (tool: AiToolKey) => {
    const meta = AI_TOOLS[tool];
    if (isEdge) {
      setOpenTool(tool);
      return;
    }
    window.open(meta.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-[800px] mx-auto min-h-[92vh] flex flex-col">
      {/* Progress bar (replaces 3-step stepper) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-app-muted">Progress</span>
          <span className="text-xs font-semibold text-[#5236ab]">{Math.round((step / 4) * 100)}%</span>
        </div>
        <div className="progress-bar-bg progress-bar-bg-thick overflow-hidden rounded-full">
          <motion.div
            className="progress-bar-fill h-full rounded-full"
            initial={false}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          />
        </div>
      </div>

      {/* Need help panel */}
      {showHelp && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-5 mb-8 border bg-app-surface border-app">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-app-primary">Get help</h3>
            <button onClick={() => setShowHelp(false)} className="p-1 rounded cursor-pointer hover:bg-gray-100"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-app-muted mb-2">View Coach Hints</h4>
              {challenge.coachHints?.length ? (
                <ul className="list-disc list-inside text-sm space-y-1 text-app-secondary">
                  {challenge.coachHints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              ) : <p className="text-sm text-app-hint">No hints for this challenge.</p>}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-app-muted mb-2">Access Micro-learning</h4>
              {relatedMicro.length > 0 ? (
                <ul className="space-y-2">
                  {relatedMicro.map(m => (
                    <li key={m.id}>
                      <button onClick={() => navigate('/app/learn', { state: { tab: 'micro' } })} className="flex items-center gap-1 text-sm cursor-pointer text-[#5236ab]"><BookOpen size={14} /> {m.title} <ExternalLink size={12} /></button>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-app-hint">No related micro-learnings.</p>}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-app-muted mb-2">Check Prompt Library</h4>
              <button onClick={() => navigate('/app/prompt-library')} className="flex items-center gap-2 text-sm cursor-pointer text-[#5236ab]">Open Prompt Library <ExternalLink size={12} /></button>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-app-muted mb-2">Join Office Hours</h4>
              <button onClick={() => navigate('/app/office-hours')} className="flex items-center gap-2 text-sm cursor-pointer text-[#5236ab]">See Office Hours <ExternalLink size={12} /></button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 1: Gamified challenge overview (mission brief, meta strip, objectives, description, accordions) */}
      {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app shadow-[var(--app-shadow)]"
          data-tour-id="workspace-step-1"
        >
          {/* Badge + Title */}
          <span className="inline-block text-xs font-medium text-app-muted uppercase tracking-wider mb-2">Step 1 · Mission brief</span>
          <h1 className="text-2xl font-bold text-app-primary mb-5">{challenge.title}</h1>

          {/* Meta strip: time, difficulty badge, XP pill */}
          <div className="flex flex-wrap items-center gap-3 mb-6 py-3 px-4 rounded-xl bg-[var(--app-surface-alt)] border border-[var(--app-border)]">
            <span className="flex items-center gap-2 text-sm text-app-muted"><Clock size={14} /> Est. {challenge.time}</span>
            <span className="flex items-center gap-2">
              <Target size={14} className="text-app-muted shrink-0" />
              <span
                className={[
                  'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  challenge.difficulty === 'Beginner' && 'bg-gray-100 text-gray-700',
                  challenge.difficulty === 'Intermediate' && 'bg-amber-50 text-amber-800',
                  challenge.difficulty === 'Advanced' && 'bg-[var(--app-brand-light)] text-[var(--app-brand)]',
                ].filter(Boolean).join(' ') || 'bg-[var(--app-tab-bg)] text-app-secondary'}
              >
                {challenge.difficulty}
              </span>
            </span>
            <span className="flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[var(--app-brand-light)] text-[var(--app-brand)]">
              <Star size={14} /> +{challenge.points} XP
            </span>
          </div>

          {/* Objectives */}
          {challenge.objectives && challenge.objectives.length > 0 && (
            <div className="mb-5">
              <h3 className="flex items-center gap-2 text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">
                <ListChecks size={14} /> Objectives
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-app-secondary">
                {challenge.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </div>
          )}

          {/* Description */}
          <p className="text-[15px] leading-[22px] text-app-secondary mb-6">{challenge.description}</p>

          {/* Prerequisites accordion */}
          {challenge.prerequisites && challenge.prerequisites.length > 0 && (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => setShowPrereqs(!showPrereqs)}
                className="flex items-center justify-between w-full gap-2 text-sm font-semibold cursor-pointer text-[#5236ab] hover:text-[#4328a0]"
                aria-expanded={showPrereqs}
                aria-controls="workspace-prereqs-content"
                id="workspace-prereqs-trigger"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle size={14} /> Prerequisites
                </span>
                {showPrereqs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <div id="workspace-prereqs-content" role="region" aria-labelledby="workspace-prereqs-trigger" className="overflow-hidden">
                {showPrereqs && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-app-secondary mt-2">
                    {challenge.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Related content */}
          <div className="mb-5">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">
              <BookOpen size={14} /> Related content
            </h3>
            {relatedMicro.length > 0 ? (
              <ul className="space-y-2">
                {relatedMicro.map(m => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => navigate('/app/learn', { state: { tab: 'micro' } })}
                      className="flex items-center gap-2 text-sm cursor-pointer text-[#5236ab] hover:underline"
                    >
                      <BookOpen size={14} /> {m.title} <ExternalLink size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-app-hint">No related content.</p>
            )}
          </div>

          {/* Peer examples */}
          <div className="mb-5">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">
              <Users size={14} /> Peer examples
            </h3>
            <p className="text-sm text-app-hint">See how others did it — coming soon.</p>
          </div>

          {/* Coach hints accordion */}
          {challenge.coachHints && challenge.coachHints.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowHints(!showHints)}
                className="flex items-center justify-between w-full gap-2 text-sm font-semibold cursor-pointer text-[#5236ab] hover:text-[#4328a0]"
                aria-expanded={showHints}
                aria-controls="workspace-hints-content"
                id="workspace-hints-trigger"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb size={14} /> Coach hints
                </span>
                {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <div id="workspace-hints-content" role="region" aria-labelledby="workspace-hints-trigger" className="overflow-hidden">
                {showHints && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-app-secondary mt-2">
                    {challenge.coachHints.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Step 2: Read instructions */}
      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app"
          data-tour-id="workspace-step-2"
        >
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-sm font-medium text-app-secondary hover:text-app-primary cursor-pointer mb-4"
          >
            <ArrowLeft size={16} /> Back to Step 1
          </button>
          <h2 className="text-lg font-bold text-app-primary mb-3">Step 2: Read instructions</h2>
          <h3 className="text-base font-semibold text-app-primary mb-2">{challenge.title}</h3>
          <p className="text-[15px] leading-6 text-app-secondary whitespace-pre-wrap">{instructions}</p>
        </motion.div>
      )}

      {/* Step 3: Access AI tools */}
      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app"
          data-tour-id="workspace-step-3"
        >
          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex items-center gap-2 text-sm font-medium text-app-secondary hover:text-app-primary cursor-pointer mb-4"
          >
            <ArrowLeft size={16} /> Back to Step 2
          </button>
          <h2 className="text-lg font-bold text-app-primary mb-3">Step 3: Access AI tools</h2>
          <p className="text-[15px] text-app-secondary mb-4">Use AI tools to complete this challenge. Open one or more of these:</p>
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleAiToolClick('chatgpt')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#5236ab] cursor-pointer text-[#5236ab]"
            >
              ChatGPT <ExternalLink size={14} />
            </button>
            <button
              type="button"
              onClick={() => handleAiToolClick('claude')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#5236ab] cursor-pointer text-[#5236ab]"
            >
              Claude <ExternalLink size={14} />
            </button>
            <button
              type="button"
              onClick={() => handleAiToolClick('copilot')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#5236ab] cursor-pointer text-[#5236ab]"
            >
              Copilot <ExternalLink size={14} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Submit your work + rich editor submission area */}
      {step === 4 && (
        <motion.div
          key="step4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app"
          data-tour-id="workspace-step-4"
        >
          <button
            type="button"
            onClick={() => setStep(3)}
            className="flex items-center gap-2 text-sm font-medium text-app-secondary hover:text-app-primary cursor-pointer mb-4"
          >
            <ArrowLeft size={16} /> Back to Step 3
          </button>
          <h2 className="text-lg font-bold text-app-primary mb-3">Step 4: Submit your work</h2>
          <p className="text-[15px] text-app-secondary mb-4">
            Use this rich editor to capture everything for your submission — paste text, links, code,
            screenshots, or notes in one place.
          </p>
          <div className="workspace-rich-editor-wrapper">
            <ReactQuill
              theme="snow"
              value={notes}
              onChange={(value) => setNotes(value)}
              onBlur={() => saveDraft()}
              modules={quillModules}
            />
          </div>
        </motion.div>
      )}

      {/* Edge extension guidance modal (best-possible UX from a web app) */}
      {openTool && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Open AI tool extension"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenTool(null)}
            aria-label="Close"
          />
          <div className="relative w-full max-w-[560px] card-base rounded-2xl p-6 border bg-app-surface border-app">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-app-primary">
                  Open {AI_TOOLS[openTool].label} in your Edge extension
                </h3>
                <p className="text-sm text-app-secondary mt-1">
                  Edge doesn’t allow a website to open a third‑party extension panel automatically. Use the install link below, then open the extension from your toolbar/side panel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenTool(null)}
                className="p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-xl border border-app-strong bg-app-bg p-4 mb-4">
              <ol className="text-sm text-app-secondary space-y-2 list-decimal list-inside">
                <li>
                  Install the extension (if you don’t have it yet), then pin it in Edge.
                </li>
                <li>
                  Click the extension icon in the toolbar, or open it from the side panel (like in your screenshot).
                </li>
                <li>
                  Log in if prompted, then return here and continue the challenge.
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
              <a
                href={AI_TOOLS[openTool].edgeAddonsSearch}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer"
              >
                Install / Find extension <ExternalLink size={16} />
              </a>
              <a
                href={AI_TOOLS[openTool].href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer"
              >
                Open web app <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Challenge status: Stuck (left) | Pause & Save + Next (right) — with microinteractions */}
      <div className="card-base rounded-xl p-5 border bg-app-surface border-app mt-auto">
        <h3 className="text-sm font-semibold text-app-muted mb-3">Challenge status?</h3>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <motion.button
            {...secondaryButtonMotion()}
            onClick={() => setShowHelp(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#f59e0b] cursor-pointer font-semibold text-[#f59e0b] bg-amber-50 hover:bg-amber-100"
            data-tour-id="workspace-stuck-help"
          >
            <CircleHelp size={18} className="shrink-0 text-[#f59e0b]" /> Stuck — Get help
          </motion.button>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              {...secondaryButtonMotion()}
              onClick={() => { saveDraft(); navigate('/app/learn', { state: { tab: 'challenges' } }); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-app-strong cursor-pointer font-semibold text-app-secondary bg-transparent hover:bg-gray-50"
            >
              <Save size={18} /> Pause & Save
            </motion.button>
            <motion.button
              {...primaryButtonMotion()}
              onClick={() => {
                if (step < 4) setStep((step + 1) as 1 | 2 | 3 | 4);
                else handleComplete();
              }}
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer"
              data-tour-id="workspace-next"
            >
              {step < 4 ? 'Next' : 'Completed — Submit'}
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Gamified completion modal */}
      {showCompletionModal && (
        <div className="challenge-complete-backdrop">
          <div className="challenge-complete-modal">
            <button
              type="button"
              className="challenge-complete-close"
              onClick={() => setShowCompletionModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="challenge-complete-header">
              <h2 className="challenge-complete-title">Great work!</h2>
              <p className="challenge-complete-subtitle">
                You completed {challenge.title}
              </p>
            </div>
            <div className="challenge-complete-body">
              <div className="challenge-complete-xp-badge">
                <Star size={24} className="challenge-complete-xp-icon" />
                <div className="challenge-complete-xp-text">
                  <span className="label">XP earned</span>
                  <span className="value">+{challenge.points} XP</span>
                </div>
              </div>

              <div className="challenge-complete-streak">
                <Flame size={18} className="challenge-complete-streak-icon" />
                <span className="challenge-complete-streak-text">
                  Streak: {progress.streak} days • Keep it going for bonus XP
                </span>
              </div>

              <div className="challenge-complete-confetti-row">
                <span className="dot dot-pink" />
                <span className="dot dot-amber" />
                <span className="dot dot-purple" />
                <span className="dot dot-blue" />
              </div>
            </div>

            <div className="challenge-complete-actions">
              <button
                type="button"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer"
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/app/learn', { state: { tab: 'challenges' } });
                }}
              >
                <Target size={18} /> Next challenge
              </button>
              <button
                type="button"
                className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer"
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/app/dashboard');
                }}
              >
                <Home size={18} /> Back to home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
