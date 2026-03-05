/**
 * Training Start / Complete — Launch training, mark complete, certificate.
 * Route: /app/learn/trainings/:trainingId/start
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Award, Sparkles } from 'lucide-react';
import { getTrainingById } from '../../data/learnData';
import { useUser } from '../../context/UserContext';

const TRAINING_XP = 50;

export default function TrainingStartPage() {
  const { trainingId } = useParams<{ trainingId: string }>();
  const navigate = useNavigate();
  const { addXp } = useUser();
  const [completed, setCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const training = useMemo(() => (trainingId ? getTrainingById(trainingId) : undefined), [trainingId]);

  if (!trainingId || !training) {
    return (
      <div style={{ fontFamily: 'var(--font-primary)', padding: 24 }}>
        <p style={{ color: 'var(--app-text-secondary)' }}>Training not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
          Back to Learn
        </button>
      </div>
    );
  }

  const handleMarkComplete = () => {
    addXp(TRAINING_XP);
    setCompleted(true);
    setShowCertificate(true);
  };

  if (showCertificate) {
    return (
      <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 560, margin: '0 auto', padding: 24 }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
        >
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}>
            <Award size={32} style={{ color: '#059669' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 8 }}>Training complete!</h1>
          <p style={{ fontSize: 15, color: 'var(--app-text-secondary)', marginBottom: 16 }}>{training.title}</p>
          <p style={{ fontSize: 14, color: 'var(--app-text-muted)' }}>+{TRAINING_XP} XP · Certificate awarded · Progress updated</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => navigate('/app/learn/trainings/' + training.id)} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border" style={{ borderColor: 'var(--app-border-strong)', color: 'var(--app-text-primary)' }}>
              Back to Training
            </button>
            <button onClick={() => navigate('/app/learn')} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
              Back to Learn
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-primary)', maxWidth: 700, margin: '0 auto' }}>
      <button onClick={() => navigate('/app/learn/trainings/' + training.id)} className="flex items-center gap-2 mb-6 text-sm font-medium cursor-pointer" style={{ color: 'var(--app-text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Training
      </button>
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--app-text-primary)', marginBottom: 8 }}>{training.title}</h1>
        <p style={{ fontSize: 14, color: 'var(--app-text-secondary)', marginBottom: 24 }}>Launch your training below. When finished, mark complete to earn points and your certificate.</p>
        <div className="rounded-lg p-6 mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--app-tab-bg)' }}>
          <p style={{ fontSize: 14, color: 'var(--app-text-muted)' }}>Training content loads here (LMS or external link). For MVP, use “Mark complete” when done.</p>
        </div>
        <button onClick={handleMarkComplete} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer" style={{ backgroundColor: '#5236ab', color: 'white' }}>
          <CheckCircle size={18} /> Mark complete
        </button>
      </div>
    </div>
  );
}
