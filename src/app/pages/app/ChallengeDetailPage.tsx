/**
 * Challenge Detail Page — Bypass: redirect to workspace (overview is Step 1 there).
 * Route: /app/learn/challenges/:challengeId
 */

import React, { useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router';
import { getChallengeById } from '../../data/learnData';

export default function ChallengeDetailPage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const challenge = useMemo(() => (challengeId ? getChallengeById(challengeId) : undefined), [challengeId]);

  if (!challengeId) {
    return (
      <div className="p-6">
        <p className="text-app-secondary">Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-primary">
          Back to Learn
        </button>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-6">
        <p className="text-app-secondary">Challenge not found.</p>
        <button onClick={() => navigate('/app/learn')} className="mt-4 px-4 py-2 rounded-lg cursor-pointer btn-primary">
          Back to Learn
        </button>
      </div>
    );
  }

  return <Navigate to={`/app/learn/challenges/${challengeId}/workspace`} replace />;
}
