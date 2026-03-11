/**
 * Challenge Results Page — Immediate feedback, post-submission, What's next.
 * Route: /app/learn/challenges/:challengeId/results
 */

import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, Sparkles, BarChart3, Bell, Share2, Target, LayoutDashboard, MessageSquare } from 'lucide-react';
import clsx from 'clsx';
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
      <div className="p-6">
        <p className="text-app-secondary">Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-primary">Back to Learn</button>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        data-tour-id="results-hero"
      >
        <h1 className="text-[26px] font-bold text-app-primary mb-2">Great work!</h1>
        <p className="text-base text-app-secondary mb-6">You completed {challenge.title}</p>

        {/* Immediate feedback — 4 confirmations */}
        <div className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app shadow-[var(--app-shadow)]">
          <h2 className="text-sm font-semibold text-app-muted uppercase tracking-wider mb-4">Immediate feedback</h2>
          <ul className="space-y-4">
            {FEEDBACK_ITEMS.map((item, i) => (
              <li key={item.id} className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}18`, color: item.color }}
                >
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-app-primary">{item.label}</div>
                  {item.id === 'points' && <div className="text-sm text-app-muted">You earned {challenge.points} XP</div>}
                  {item.sub && <div className="text-[13px] text-app-muted">{item.sub}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Post-submission: streak bonus, awards */}
        <div className="card-base rounded-xl p-6 mb-8 bg-app-surface border-app">
          <h2 className="text-sm font-semibold text-app-muted uppercase tracking-wider mb-4">Post-submission</h2>
          <ul className="space-y-3 text-sm text-app-secondary">
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#1ab977]" /> Submission received</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#1ab977]" /> Points awarded: {challenge.points} XP</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#1ab977]" /> Auto-score in progress</li>
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#1ab977]" /> Notifications sent</li>
            {streakBonus > 0 && <li className="flex items-center gap-2"><Sparkles size={16} className="text-[#f59e0b]" /> Streak bonus: +{streakBonus} XP (total {totalPoints} XP)</li>}
            <li className="flex items-center gap-2"><CheckCircle size={16} className="text-[#1ab977]" /> Badge: Challenge completed</li>
          </ul>
        </div>

        {/* What's next? — 4 options */}
        <h2 className="text-base font-semibold text-app-primary mb-3">What&apos;s next?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button whileHover={{ y: -2 }} onClick={() => navigate('/app/learn')} className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border bg-app-surface border-app">
            <MessageSquare size={24} className="text-[#5236ab]" />
            <div>
              <div className="text-[15px] font-semibold text-app-primary">View Feedback Details</div>
              <div className="text-[13px] text-app-muted">See detailed feedback when ready (in Learn)</div>
            </div>
          </motion.button>
          <motion.button whileHover={{ y: -2 }} onClick={handleShare} className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border bg-app-surface border-app">
            <Share2 size={24} className="text-[#5236ab]" />
            <div>
              <div className="text-[15px] font-semibold text-app-primary">Share Success</div>
              <div className="text-[13px] text-app-muted">Copy link or share</div>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => navigate('/app/learn', { state: { tab: 'challenges' } })}
            className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border bg-app-surface border-app"
            data-tour-id="results-start-next"
          >
            <Target size={24} className="text-[#5236ab]" />
            <div>
              <div className="text-[15px] font-semibold text-app-primary">Start Next Challenge</div>
              <div className="text-[13px] text-app-muted">Browse challenges</div>
            </div>
          </motion.button>
          <motion.button whileHover={{ y: -2 }} onClick={() => navigate('/app/dashboard')} className="rounded-xl p-5 text-left cursor-pointer flex items-center gap-4 border bg-app-surface border-app">
            <LayoutDashboard size={24} className="text-[#5236ab]" />
            <div>
              <div className="text-[15px] font-semibold text-app-primary">Return to Dashboard</div>
              <div className="text-[13px] text-app-muted">Back to overview</div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
