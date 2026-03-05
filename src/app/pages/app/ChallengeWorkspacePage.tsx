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
import { getChallengeById, microLearnings } from '../../data/learnData';

const WORKSPACE_DRAFT_KEY = 'challenge_workspace_draft';

function getDraftKey(id: string) {
  return `${WORKSPACE_DRAFT_KEY}_${id}`;
}

export default function ChallengeWorkspacePage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showHelp, setShowHelp] = useState(false);
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
      <div style={{ fontFamily: 'var(--font-primary)', padding: 24 }}>
        <p style={{ color: 'var(--app-text-secondary)' }}>Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>Back to Learn</button>
      </div>
    );
  }

  const relatedMicro = challenge.relatedContentIds?.length
    ? microLearnings.filter(m => challenge.relatedContentIds!.includes(m.id))
    : [];

  const instructions = challenge.instructions || challenge.description;

  return (
    <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 800, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(`/app/learn/challenges/${challengeId}`)} className="flex items-center gap-2 text-sm font-medium cursor-pointer" style={{ color: 'var(--app-text-secondary)' }}>
          <ArrowLeft size={16} /> Back to challenge
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHelp(!showHelp)} className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>
            <HelpCircle size={16} /> Need help?
          </button>
          <button onClick={() => { saveDraft(); navigate(`/app/learn/challenges/${challengeId}`); }} className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>
            <Save size={16} /> Pause & Save
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => setStep(s as 1 | 2 | 3)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer" style={{ backgroundColor: step === s ? '#5236ab' : 'var(--app-tab-bg)', color: step === s ? 'white' : 'var(--app-text-secondary)' }}>
            Step {s} {step === s && <ChevronRight size={14} />}
          </button>
        ))}
      </div>

      {/* Need help panel */}
      {showHelp && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-5 mb-8 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)' }}>Get help</h3>
            <button onClick={() => setShowHelp(false)} className="p-1 rounded cursor-pointer hover:bg-gray-100"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', marginBottom: 8 }}>View Coach Hints</h4>
              {challenge.coachHints?.length ? (
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--app-text-secondary)' }}>
                  {challenge.coachHints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              ) : <p style={{ fontSize: 14, color: 'var(--app-text-hint)' }}>No hints for this challenge.</p>}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', marginBottom: 8 }}>Access Micro-learning</h4>
              {relatedMicro.length > 0 ? (
                <ul className="space-y-2">
                  {relatedMicro.map(m => (
                    <li key={m.id}>
                      <button onClick={() => navigate('/app/learn', { state: { tab: 'micro' } })} className="flex items-center gap-1 text-sm cursor-pointer" style={{ color: '#5236ab' }}><BookOpen size={14} /> {m.title} <ExternalLink size={12} /></button>
                    </li>
                  ))}
                </ul>
              ) : <p style={{ fontSize: 14, color: 'var(--app-text-hint)' }}>No related micro-learnings.</p>}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', marginBottom: 8 }}>Check Prompt Library</h4>
              <button onClick={() => navigate('/app/learn', { state: { tab: 'prompts' } })} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#5236ab' }}>Open Prompt Library <ExternalLink size={12} /></button>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', marginBottom: 8 }}>Join Office Hours</h4>
              <button onClick={() => navigate('/app/learn', { state: { tab: 'officehours' } })} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#5236ab' }}>See Office Hours <ExternalLink size={12} /></button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 1: Read instructions */}
      {step === 1 && (
        <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 12 }}>Step 1: Read instructions</h2>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 8 }}>{challenge.title}</h3>
          <p style={{ fontSize: 15, lineHeight: '24px', color: 'var(--app-text-secondary)', whiteSpace: 'pre-wrap' }}>{instructions}</p>
          <button onClick={() => setStep(2)} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
            Next: Access AI tools <ChevronRight size={18} />
          </button>
        </motion.div>
      )}

      {/* Step 2: Access AI tools */}
      {step === 2 && (
        <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 12 }}>Step 2: Access AI tools</h2>
          <p style={{ fontSize: 15, color: 'var(--app-text-secondary)', marginBottom: 16 }}>Use AI tools to complete this challenge. Open one or more of these:</p>
          <div className="flex flex-wrap gap-3 mb-6">
            <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer" style={{ borderColor: '#5236ab', color: '#5236ab' }}>ChatGPT <ExternalLink size={14} /></a>
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer" style={{ borderColor: '#5236ab', color: '#5236ab' }}>Claude <ExternalLink size={14} /></a>
            <a href="https://copilot.microsoft.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer" style={{ borderColor: '#5236ab', color: '#5236ab' }}>Copilot <ExternalLink size={14} /></a>
          </div>
          <button onClick={() => setStep(3)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
            Next: Work on challenge <ChevronRight size={18} />
          </button>
        </motion.div>
      )}

      {/* Step 3: Work on challenge */}
      {step === 3 && (
        <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 12 }}>Step 3: Work on challenge</h2>
          <p style={{ fontSize: 15, color: 'var(--app-text-secondary)', marginBottom: 16 }}>Use this space for notes, pasted outputs, or links to your work.</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={saveDraft}
            placeholder="Paste outputs, links, or notes here..."
            rows={10}
            className="w-full rounded-lg p-4 outline-none resize-y"
            style={{ fontSize: 14, border: '1px solid var(--app-border-strong)', backgroundColor: 'var(--app-bg)', color: 'var(--app-text-primary)' }}
          />
        </motion.div>
      )}

      {/* Challenge status: Completed / Pause & Save / Stuck */}
      <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-muted)', marginBottom: 12 }}>Challenge status?</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate(`/app/learn/challenges/${challengeId}/submit`)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#1ab977', color: 'white' }}>
            <CheckCircle size={18} /> Completed — Submit
          </button>
          <button onClick={() => { saveDraft(); navigate(`/app/learn/challenges/${challengeId}`); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer font-semibold" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-secondary)' }}>
            <Save size={18} /> Pause & Save
          </button>
          <button onClick={() => setShowHelp(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border cursor-pointer font-semibold" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
            <RotateCcw size={18} /> Stuck — Get help
          </button>
        </div>
      </div>
    </div>
  );
}
