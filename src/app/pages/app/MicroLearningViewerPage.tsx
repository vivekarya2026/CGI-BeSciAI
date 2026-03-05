/**
 * Micro-learning Viewer — content + Mark Complete / Apply in Challenge.
 * Route: /app/learn/micro/:microId
 */

import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Target, Play, Clock, Zap } from 'lucide-react';
import {
  getMicroById,
  setMicroCompleted,
  isMicroCompleted,
  microLearnings,
} from '../../data/learnData';
import { useUser } from '../../context/UserContext';

export default function MicroLearningViewerPage() {
  const { microId } = useParams<{ microId: string }>();
  const navigate = useNavigate();
  const { addXp } = useUser();
  const [completed, setCompleted] = useState(() => (microId ? isMicroCompleted(microId) : false));
  const [justCompleted, setJustCompleted] = useState(false);

  const micro = useMemo(() => (microId ? getMicroById(microId) : undefined), [microId]);

  if (!microId || !micro) {
    return (
      <div style={{ fontFamily: 'var(--font-primary)', padding: 24 }}>
        <p style={{ color: 'var(--app-text-secondary)' }}>Micro-learning not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
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
    <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 800, margin: '0 auto' }}>
      <button
        onClick={() => navigate('/app/learn')}
        className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer"
        style={{ color: 'var(--app-text-secondary)' }}
      >
        <ArrowLeft size={16} /> Back to Learn
      </button>

      <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#f2f1f9', color: '#5236ab' }}>{micro.topic}</span>
            <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-secondary)' }}>{micro.tool}</span>
            {micro.skillLevel && <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--app-tab-bg)', color: 'var(--app-text-muted)' }}>{micro.skillLevel}</span>}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 8 }}>{micro.title}</h1>
          <p style={{ fontSize: 15, color: 'var(--app-text-secondary)', marginBottom: 16 }}>{micro.description}</p>
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--app-text-muted)' }}>
            <span className="flex items-center gap-1"><Clock size={14} /> ~{micro.duration}</span>
            <span className="flex items-center gap-1"><Zap size={14} /> +{micro.points} pts</span>
          </div>
        </div>
        <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
          {micro.contentUrl ? (
            <a href={micro.contentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: '#5236ab', color: 'white' }}>
              <Play size={18} /> Open content
            </a>
          ) : (
            <p style={{ fontSize: 14, color: 'var(--app-text-muted)' }}>Content loads here (video or interactive)</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={handleMarkComplete}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer"
          style={{ backgroundColor: completed ? 'var(--app-tab-bg)' : '#5236ab', color: completed ? 'var(--app-text-muted)' : 'white' }}
        >
          <CheckCircle size={18} /> {completed ? 'Completed' : 'Mark complete'}
        </button>
        <button
          onClick={handleApplyInChallenge}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer border"
          style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)' }}
        >
          <Target size={18} /> Apply in Challenge
        </button>
      </div>

      {justCompleted && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
          <p className="font-medium">Progress updated. +{micro.points} points awarded. Micro-learning referenced for challenges.</p>
        </motion.div>
      )}

      {related.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--app-text-primary)', marginBottom: 12 }}>Recommend related content</h2>
          <ul className="space-y-2">
            {related.map(m => (
              <li key={m.id}>
                <button onClick={() => navigate('/app/learn/micro/' + m.id)} className="text-sm font-medium cursor-pointer" style={{ color: '#5236ab' }}>
                  {m.title} · {m.duration}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
