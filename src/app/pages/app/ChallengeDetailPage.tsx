/**
 * Challenge Detail Page — Phase 1: Overview + 4 user actions.
 * Route: /app/learn/challenges/:challengeId
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Play, Bookmark, FileText, CheckCircle, Clock, Target, Sparkles,
  BookOpen, Users, Lightbulb, ExternalLink, ChevronDown, ChevronUp,
} from 'lucide-react';
import clsx from 'clsx';
import {
  getChallengeById,
  isChallengeSaved,
  toggleChallengeSaved,
  microLearnings,
} from '../../data/learnData';

export default function ChallengeDetailPage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => (challengeId ? isChallengeSaved(challengeId) : false));
  const [showPrereqs, setShowPrereqs] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const challenge = useMemo(() => (challengeId ? getChallengeById(challengeId) : undefined), [challengeId]);

  if (!challengeId || !challenge) {
    return (
      <div className="p-6">
        <p className="text-app-secondary">Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-primary">
          Back to Learn
        </button>
      </div>
    );
  }

  const handleSave = () => {
    const nowSaved = toggleChallengeSaved(challenge.id);
    setSaved(nowSaved);
    setToast(nowSaved ? 'Saved for later' : 'Removed from saved');
    setTimeout(() => setToast(null), 2000);
  };

  const relatedMicro = challenge.relatedContentIds?.length
    ? microLearnings.filter(m => challenge.relatedContentIds!.includes(m.id))
    : [];

  return (
    <div className="max-w-[800px] mx-auto">
      <button
        onClick={() => navigate('/app/learn')}
        className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer text-app-secondary"
      >
        <ArrowLeft size={16} /> Back to Learn
      </button>

      {/* Overview box — 9 items */}
      <div className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app shadow-[var(--app-shadow)]">
        <h1 className="text-2xl font-bold text-app-primary mb-5">{challenge.title}</h1>

        {challenge.objectives && challenge.objectives.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Objectives</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-app-secondary">
              {challenge.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-4">
          <span className="flex items-center gap-2 text-sm text-app-muted"><Clock size={14} /> {challenge.time}</span>
          <span className="flex items-center gap-2 text-sm text-app-muted"><Target size={14} /> {challenge.difficulty}</span>
          <span className="flex items-center gap-2 text-sm text-app-muted"><Sparkles size={14} /> {challenge.points} pts</span>
        </div>

        <p className="text-[15px] leading-[22px] text-app-secondary mb-4">{challenge.description}</p>

        {/* Prerequisites */}
        {challenge.prerequisites && challenge.prerequisites.length > 0 && (
          <div className="mb-4">
            <button onClick={() => setShowPrereqs(!showPrereqs)} className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-[#5236ab]">
              Prerequisites {showPrereqs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showPrereqs && (
              <ul className="list-disc list-inside mt-2 text-sm space-y-1 text-app-secondary">
                {challenge.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            )}
          </div>
        )}

        {/* Related content */}
        {relatedMicro.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Related content</h3>
            <ul className="space-y-2">
              {relatedMicro.map(m => (
                <li key={m.id}>
                  <button onClick={() => navigate('/app/learn')} className="flex items-center gap-2 text-sm cursor-pointer text-[#5236ab]">
                    <BookOpen size={14} /> {m.title} <ExternalLink size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Peer examples placeholder */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-2">Peer examples</h3>
          <p className="text-sm text-app-hint">See how others did it — coming soon.</p>
        </div>

        {/* Coach hints */}
        {challenge.coachHints && challenge.coachHints.length > 0 && (
          <div>
            <button onClick={() => setShowHints(!showHints)} className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-[#5236ab]">
              Coach hints {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showHints && (
              <ul className="list-disc list-inside mt-2 text-sm space-y-1 text-app-secondary">
                {challenge.coachHints.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => navigate(`/app/learn/challenges/${challenge.id}/workspace`)}
          className="btn-primary rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border-none shadow-[0_4px_14px_rgba(82,54,171,0.35)]"
          data-tour-id="challenge-detail-start"
        >
          <div className="icon-container icon-container-white-transparent rounded-xl"><Play size={24} /></div>
          <div>
            <div className="text-base font-bold">Start Challenge</div>
            <div className="text-[13px] opacity-90">Go to workspace</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          onClick={handleSave}
          className={clsx(
            "rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border bg-app-surface",
            saved ? "border-[#5236ab] text-[#5236ab]" : "border-app text-app-primary"
          )}
        >
          <div className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            saved ? "bg-[var(--app-brand-light)]" : "bg-[var(--app-tab-bg)]"
          )}>
            <Bookmark size={24} fill={saved ? 'currentColor' : 'none'} />
          </div>
          <div>
            <div className="text-base font-bold">Save for Later</div>
            <div className="text-[13px] text-app-muted">{saved ? 'Saved' : 'Bookmark this challenge'}</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => navigate('/app/learn', { state: { tab: 'micro', related: challenge.id } })}
          className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border bg-app-surface border-app"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--app-tab-bg)]"><FileText size={24} className="text-app-secondary" /></div>
          <div>
            <div className="text-base font-bold text-app-primary">View Related Content</div>
            <div className="text-[13px] text-app-muted">Micro-learnings & resources</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setShowPrereqs(true)}
          className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border bg-app-surface border-app"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--app-tab-bg)]"><CheckCircle size={24} className="text-app-secondary" /></div>
          <div>
            <div className="text-base font-bold text-app-primary">Check Prerequisites</div>
            <div className="text-[13px] text-app-muted">See what you need first</div>
          </div>
        </motion.button>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-800 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
