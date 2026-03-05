/**
 * Challenge Results Page — Immediate feedback, post-submission, What's next.
 * Route: /app/learn/challenges/:challengeId/results
 */

import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, Sparkles, BarChart3, Bell, Share2, Target, LayoutDashboard, MessageSquare } from 'lucide-react';
import { getChallengeById } from '../../data/learnData';
import { useUser } from '../../context/UserContext';

const FEEDBACK_ITEMS = [
  { id: 'confirm', icon: CheckCircle, label: 'Submission received', color: '#1ab977' },
  { id: 'points', icon: Sparkles, label: 'Points awarded', color: '#5236ab' },
  { id: 'score', icon: BarChart3, label: 'Auto-score', sub: 'Your submission is being reviewed', color: '#f59e0b' },
  { id: 'notify', icon: Bell, label: 'Notifications', sub: "We'll notify you when feedback is ready", color: '#0ea5e9' },
];

export default function ChallengeResultsPage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { progress } = useUser();

  const challenge = useMemo(() => (challengeId ? getChallengeById(challengeId) : undefined), [challengeId]);

  const streakBonus = progress.streak >= 3 ? 25 : 0;
  const totalPoints = (challenge?.points ?? 0) + streakBonus;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: challenge?.title ?? 'Challenge', url });
      } catch {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    }
  };

  if (!challengeId || !challenge) {
    return (
      <div style={{ fontFamily: 'var(--font-primary)', padding: 24 }}>
        <p style={{ color: 'var(--app-text-secondary)' }}>Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>Back to Learn</button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 600, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        data-tour-id="results-hero"
      >
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 8 }}>Great work!</h1>
        <p style={{ fontSize: 16, color: 'var(--app-text-secondary)', marginBottom: 24 }}>You completed {challenge.title}</p>

        {/* Immediate feedback — 4 confirmations */}
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Immediate feedback</h2>
          <ul className="space-y-4">
            {FEEDBACK_ITEMS.map((item, i) => (
              <li key={item.id} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}18`, color: item.color }}>
                  <item.icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>{item.label}</div>
                  {item.id === 'points' && <div style={{ fontSize: 14, color: 'var(--app-text-muted)' }}>You earned {challenge.points} XP</div>}
                  {item.sub && <div style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>{item.sub}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Post-submission: streak bonus, awards */}
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>Post-submission</h2>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--app-text-secondary)' }}>
            <li className="flex items-center gap-2"><CheckCircle size={16} style={{ color: '#1ab977' }} /> Submission received</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} style={{ color: '#1ab977' }} /> Points awarded: {challenge.points} XP</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} style={{ color: '#1ab977' }} /> Auto-score in progress</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} style={{ color: '#1ab977' }} /> Notifications sent</li>
            {streakBonus > 0 && <li className="flex items-center gap-2"><Sparkles size={16} style={{ color: '#f59e0b' }} /> Streak bonus: +{streakBonus} XP (total {totalPoints} XP)</li>}
            <li className="flex items-center gap-2"><CheckCircle size={16} style={{ color: '#1ab977' }} /> Badge: Challenge completed</li>
          </ul>
        </div>

        {/* What's next? — 4 options */}
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 12 }}>What&apos;s next?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button whileHover={{ y: -2 }} onClick={() => navigate('/app/learn')} className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
            <MessageSquare size={24} style={{ color: '#5236ab' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>View Feedback Details</div>
              <div style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>See detailed feedback when ready (in Learn)</div>
            </div>
          </motion.button>
          <motion.button whileHover={{ y: -2 }} onClick={handleShare} className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
            <Share2 size={24} style={{ color: '#5236ab' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>Share Success</div>
              <div style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>Copy link or share</div>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => navigate('/app/learn', { state: { tab: 'challenges' } })}
            className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border"
            style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}
            data-tour-id="results-start-next"
          >
            <Target size={24} style={{ color: '#5236ab' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>Start Next Challenge</div>
              <div style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>Browse challenges</div>
            </div>
          </motion.button>
          <motion.button whileHover={{ y: -2 }} onClick={() => navigate('/app/dashboard')} className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border" style={{ backgroundColor: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
            <LayoutDashboard size={24} style={{ color: '#5236ab' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text-primary)' }}>Return to Dashboard</div>
              <div style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>Back to overview</div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
