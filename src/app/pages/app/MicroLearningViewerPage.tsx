/**
 * Micro-learning Viewer — content + Mark Complete / Apply in Challenge.
 * Route: /app/learn/micro/:microId
 */

import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Target, Play, Clock, Zap, MessageSquare } from 'lucide-react';
import clsx from 'clsx';
import {
  getMicroById,
  setMicroCompleted,
  isMicroCompleted,
  microLearnings,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';
import { NotificationsPanel } from '../../components/NotificationsPanel';
import { DashboardMiniMessages } from '../../components/DashboardMiniMessages';

export default function MicroLearningViewerPage() {
  const { microId } = useParams<{ microId: string }>();
  const navigate = useNavigate();
  const { addXp } = useUser();
  const [completed, setCompleted] = useState(() => (microId ? isMicroCompleted(microId) : false));
  const [justCompleted, setJustCompleted] = useState(false);
  const [miniMessagesOpen, setMiniMessagesOpen] = useState(false);

  const micro = useMemo(() => (microId ? getMicroById(microId) : undefined), [microId]);

  if (!microId || !micro) {
    return (
      <div className="font-primary p-6">
        <p className="text-app-secondary">Micro-learning not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-brand-primary">
          Back to Learn
        </button>
      </div>
    );
  }

  const handleMarkComplete = () => {
    if (completed) return;
    setMicroCompleted(micro.id);
    addXp(micro.points);
    setCompleted(true);
    setJustCompleted(true);
  };

  const handleApplyInChallenge = () => {
    navigate('/app/learn', { state: { tab: 'challenges', fromMicro: microId } });
  };

  const related = microLearnings
    .filter(m => m.id !== micro.id && (m.topic === micro.topic || m.tool === micro.tool))
    .slice(0, 3);

  return (
    <div className="page-container-wide">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate('/app/learn')}
          className="back-button"
        >
          <ArrowLeft size={16} /> Back to Learn
        </button>
        <div className="flex gap-2 relative shrink-0">
          <NotificationsPanel onNavigate={(path) => navigate(path)} />
          <button
            type="button"
            className="notifications-bell"
            onClick={() => setMiniMessagesOpen(prev => !prev)}
            aria-label="Open messages"
          >
            <MessageSquare size={18} className="text-app-muted" />
            <span className="notifications-badge">3</span>
          </button>
        </div>
      </div>

      <div className="card-surface-shadow rounded-xl overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge-base badge-topic-primary">{micro.topic}</span>
            <span className="badge-base badge-tab-bg">{micro.tool}</span>
            {micro.skillLevel && <span className="badge-base badge-tab-muted">{micro.skillLevel}</span>}
          </div>
          <h1 className="heading-lg">{micro.title}</h1>
          <p className="text-body mb-4">{micro.description}</p>
          <div className="flex items-center gap-4 text-sm text-app-muted">
            <span className="flex items-center gap-1"><Clock size={14} /> ~{micro.duration}</span>
            <span className="flex items-center gap-1"><Zap size={14} /> +{micro.points} pts</span>
          </div>
        </div>
        <div className="video-placeholder">
          {micro.contentUrl ? (
            <a href={micro.contentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium btn-brand-primary">
              <Play size={18} /> Open content
            </a>
          ) : (
            <p className="text-body-sm text-app-muted">Content loads here (video or interactive)</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={handleMarkComplete}
          className={clsx(
            "inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer",
            completed ? "btn-completed" : "btn-brand-primary"
          )}
        >
          <CheckCircle size={18} /> {completed ? 'Completed' : 'Mark complete'}
        </button>
        <button
          onClick={handleApplyInChallenge}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer btn-brand-secondary"
        >
          <Target size={18} /> Apply in Challenge
        </button>
      </div>

      {justCompleted && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="success-message mb-6">
          <p className="font-medium">Progress updated. +{micro.points} points awarded. Micro-learning referenced for challenges.</p>
        </motion.div>
      )}

      {related.length > 0 && (
        <div>
          <h2 className="heading-md">Recommend related content</h2>
          <ul className="space-y-2">
            {related.map(m => (
              <li key={m.id}>
                <button onClick={() => navigate('/app/learn/micro/' + m.id)} className="text-sm font-medium cursor-pointer link-brand">
                  {m.title} · {m.duration}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <DashboardMiniMessages
        isOpen={miniMessagesOpen}
        onClose={() => setMiniMessagesOpen(false)}
        onOpenFullMessages={() => navigate('/app/messages')}
      />
    </div>
  );
}
