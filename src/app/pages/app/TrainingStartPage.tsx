/**
 * Training Start / Complete — Launch training, mark complete, certificate.
 * Route: /app/learn/trainings/:trainingId/start
 */

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Award, Sparkles } from 'lucide-react';
import clsx from 'clsx';
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
      <div className="font-primary p-6">
        <p className="text-app-secondary">Training not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-brand-primary">
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
      <div className="page-container-narrow">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-surface-shadow rounded-2xl p-8 text-center"
        >
          <div className="certificate-icon-container">
            <Award size={32} className="text-green-600" />
          </div>
          <h1 className="heading-lg">Training complete!</h1>
          <p className="text-body mb-4">{training.title}</p>
          <p className="text-body-sm text-app-muted">+{TRAINING_XP} XP · Certificate awarded · Progress updated</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => navigate('/app/learn/trainings/' + training.id)} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer btn-brand-secondary">
              Back to Training
            </button>
            <button onClick={() => navigate('/app/learn')} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer btn-brand-primary">
              Back to Learn
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/app/learn/trainings/' + training.id)} className="back-button">
        <ArrowLeft size={16} /> Back to Training
      </button>
      <div className="card-surface-shadow rounded-xl p-6 mb-6">
        <h1 className="heading-lg">{training.title}</h1>
        <p className="text-body-sm mb-6">Launch your training below. When finished, mark complete to earn points and your certificate.</p>
        <div className="rounded-lg p-6 mb-6 flex items-center justify-center bg-app-bg">
          <p className="text-body-sm text-app-muted">Training content loads here (LMS or external link). For MVP, use “Mark complete” when done.</p>
        </div>
        <button onClick={handleMarkComplete} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold cursor-pointer btn-brand-primary">
          <CheckCircle size={18} /> Mark complete
        </button>
      </div>
    </div>
  );
}
