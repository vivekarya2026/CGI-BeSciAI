/**
 * Legacy Challenge Submit Page (redirect only).
 *
 * Submissions now happen directly in the workspace (Step 3 with rich editor + popup).
 * This route simply redirects back to the workspace or Learn home.
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

export default function ChallengeSubmitPage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (challengeId) {
      navigate(`/app/learn/challenges/${challengeId}/workspace`, { replace: true });
    } else {
      navigate('/app/learn', { replace: true });
    }
  }, [challengeId, navigate]);

  return null;
}
