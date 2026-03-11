/**
 * Challenge Workspace — Phase 2: Read instructions → AI tools → Work; Need help? + Status actions.
 * Route: /app/learn/challenges/:challengeId/workspace
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, BookOpen, ExternalLink, Headphones, MessageCircle, User, Play,
  ChevronRight, HelpCircle, X, Save, CheckCircle, RotateCcw,
} from 'lucide-react';
import clsx from 'clsx';
import { getChallengeById, microLearnings } from '../../data/learnData';

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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showHelp, setShowHelp] = useState(false);
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

  const challenge = useMemo(() => (challengeId ? getChallengeById(challengeId) : undefined), [challengeId]);

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

  const handleAiToolClick = (tool: AiToolKey) => {
    const meta = AI_TOOLS[tool];
    if (isEdge) {
      setOpenTool(tool);
      return;
    }
    window.open(meta.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(`/app/learn/challenges/${challengeId}`)} className="flex items-center gap-2 text-sm font-medium cursor-pointer text-app-secondary">
          <ArrowLeft size={16} /> Back to challenge
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHelp(!showHelp)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-app-strong cursor-pointer text-sm text-app-secondary">
            <HelpCircle size={16} /> Need help?
          </button>
          <button onClick={() => { saveDraft(); navigate(`/app/learn/challenges/${challengeId}`); }} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-app-strong cursor-pointer text-sm text-app-secondary">
            <Save size={16} /> Pause & Save
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <button 
            key={s} 
            onClick={() => setStep(s as 1 | 2 | 3)} 
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer",
              step === s ? "btn-primary" : "bg-[var(--app-tab-bg)] text-app-secondary"
            )}
          >
            Step {s} {step === s && <ChevronRight size={14} />}
          </button>
        ))}
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

      {/* Step 1: Read instructions */}
      {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app"
          data-tour-id="workspace-step-1"
        >
          <h2 className="text-lg font-bold text-app-primary mb-3">Step 1: Read instructions</h2>
          <h3 className="text-base font-semibold text-app-primary mb-2">{challenge.title}</h3>
          <p className="text-[15px] leading-6 text-app-secondary whitespace-pre-wrap">{instructions}</p>
          <button
            onClick={() => setStep(2)}
            className="btn-primary mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer"
            data-tour-id="workspace-step-1-next"
          >
            Next: Access AI tools <ChevronRight size={18} />
          </button>
        </motion.div>
      )}

      {/* Step 2: Access AI tools */}
      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app"
          data-tour-id="workspace-step-2"
        >
          <h2 className="text-lg font-bold text-app-primary mb-3">Step 2: Access AI tools</h2>
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
          <button
            onClick={() => setStep(3)}
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer"
            data-tour-id="workspace-step-2-next"
          >
            Next: Work on challenge <ChevronRight size={18} />
          </button>
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

      {/* Step 3: Work on challenge */}
      {step === 3 && (
        <motion.div
          key="step3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app"
          data-tour-id="workspace-step-3"
        >
          <h2 className="text-lg font-bold text-app-primary mb-3">Step 3: Work on challenge</h2>
          <p className="text-[15px] text-app-secondary mb-4">Use this space for notes, pasted outputs, or links to your work.</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={saveDraft}
            placeholder="Paste outputs, links, or notes here..."
            rows={10}
            className="w-full rounded-lg p-4 outline-none resize-y text-sm border border-app-strong bg-app-bg text-app-primary"
          />
        </motion.div>
      )}

      {/* Challenge status: Completed / Pause & Save / Stuck */}
      <div className="card-base rounded-xl p-5 border bg-app-surface border-app">
        <h3 className="text-sm font-semibold text-app-muted mb-3">Challenge status?</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/app/learn/challenges/${challengeId}/submit`)}
            className="btn-success inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer"
            data-tour-id="workspace-complete-submit"
          >
            <CheckCircle size={18} /> Completed — Submit
          </button>
          <button onClick={() => { saveDraft(); navigate(`/app/learn/challenges/${challengeId}`); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-app-strong cursor-pointer font-semibold text-app-secondary">
            <Save size={18} /> Pause & Save
          </button>
          <button onClick={() => setShowHelp(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#f59e0b] cursor-pointer font-semibold text-[#f59e0b]">
            <RotateCcw size={18} /> Stuck — Get help
          </button>
        </div>
      </div>
    </div>
  );
}
