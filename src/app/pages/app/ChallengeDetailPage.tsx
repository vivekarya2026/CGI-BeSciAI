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
      <div style={{ fontFamily: 'var(--font-primary)', padding: 24 }}>
        <p style={{ color: 'var(--app-text-secondary)' }}>Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
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
    <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 800, margin: '0 auto' }}>
      <button
        onClick={() => navigate('/app/learn')}
        className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer"
        style={{ color: 'var(--app-text-secondary)' }}
      >
        <ArrowLeft size={16} /> Back to Learn
      </button>

      {/* Overview box — 9 items */}
      <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 20 }}>{challenge.title}</h1>

        {challenge.objectives && challenge.objectives.length > 0 && (
          <div className="mb-4">
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Objectives</h3>
            <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
              {challenge.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-4">
          <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--app-text-muted)' }}><Clock size={14} /> {challenge.time}</span>
          <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--app-text-muted)' }}><Target size={14} /> {challenge.difficulty}</span>
          <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--app-text-muted)' }}><Sparkles size={14} /> {challenge.points} pts</span>
        </div>

        <p style={{ fontSize: 15, lineHeight: '22px', color: 'var(--app-text-secondary)', marginBottom: 16 }}>{challenge.description}</p>

        {/* Prerequisites */}
        {challenge.prerequisites && challenge.prerequisites.length > 0 && (
          <div className="mb-4">
            <button onClick={() => setShowPrereqs(!showPrereqs)} className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: '#5236ab' }}>
              Prerequisites {showPrereqs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showPrereqs && (
              <ul className="list-disc list-inside mt-2 text-sm space-y-1" style={{ color: 'var(--app-text-secondary)' }}>
                {challenge.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            )}
          </div>
        )}

        {/* Related content */}
        {relatedMicro.length > 0 && (
          <div className="mb-4">
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Related content</h3>
            <ul className="space-y-2">
              {relatedMicro.map(m => (
                <li key={m.id}>
                  <button onClick={() => navigate('/app/learn')} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#5236ab' }}>
                    <BookOpen size={14} /> {m.title} <ExternalLink size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Peer examples placeholder */}
        <div className="mb-4">
          <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Peer examples</h3>
          <p style={{ fontSize: 14, color: 'var(--app-text-hint)' }}>See how others did it — coming soon.</p>
        </div>

        {/* Coach hints */}
        {challenge.coachHints && challenge.coachHints.length > 0 && (
          <div>
            <button onClick={() => setShowHints(!showHints)} className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: '#5236ab' }}>
              Coach hints {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showHints && (
              <ul className="list-disc list-inside mt-2 text-sm space-y-1" style={{ color: 'var(--app-text-secondary)' }}>
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
          className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4"
          style={{ backgroundColor: '#5236ab', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(82,54,171,0.35)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"><Play size={24} /></div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Start Challenge</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Go to workspace</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          onClick={handleSave}
          className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border"
          style={{ backgroundColor: 'var(--app-surface)', borderColor: saved ? '#5236ab' : 'var(--app-border)', color: saved ? '#5236ab' : 'var(--app-text-primary)' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: saved ? 'var(--app-brand-light)' : 'var(--app-tab-bg)' }}>
            <Bookmark size={24} fill={saved ? 'currentColor' : 'none'} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Save for Later</div>
            <div style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>{saved ? 'Saved' : 'Bookmark this challenge'}</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => navigate('/app/learn', { state: { tab: 'micro', related: challenge.id } })}
          className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border"
          style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--app-tab-bg)' }}><FileText size={24} style={{ color: 'var(--app-text-secondary)' }} /></div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text-primary)' }}>View Related Content</div>
            <div style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>Micro-learnings & resources</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setShowPrereqs(true)}
          className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border"
          style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--app-tab-bg)' }}><CheckCircle size={24} style={{ color: 'var(--app-text-secondary)' }} /></div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text-primary)' }}>Check Prerequisites</div>
            <div style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>See what you need first</div>
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
