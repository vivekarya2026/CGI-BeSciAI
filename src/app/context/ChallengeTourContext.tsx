/**
 * Challenge Tour Context — Start or skip the challenge walkthrough anytime.
 * Used by "Show me around" (LearnPage) to start, and by ChallengeGuidedTour to close on skip/complete.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ChallengeTourContextType {
  /** Whether the challenge walkthrough overlay is visible */
  showChallengeTour: boolean;
  /** Current step id when tour is active (e.g. 'submit-button'); null when inactive. Used for demo overrides. */
  currentStepId: string | null;
  /** Start the walkthrough from step 1 (e.g. from "Show me around") */
  startChallengeTour: () => void;
  /** Close the walkthrough (skip or complete) */
  closeChallengeTour: () => void;
  /** Set the current tour step id (called by ChallengeGuidedTour). */
  setCurrentStepId: (id: string | null) => void;
}

const ChallengeTourContext = createContext<ChallengeTourContextType | undefined>(undefined);

export function ChallengeTourProvider({ children }: { children: React.ReactNode }) {
  const [showChallengeTour, setShowChallengeTour] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);

  const startChallengeTour = useCallback(() => {
    setShowChallengeTour(true);
  }, []);

  const closeChallengeTour = useCallback(() => {
    setShowChallengeTour(false);
    setCurrentStepId(null);
  }, []);

  return (
    <ChallengeTourContext.Provider
      value={{
        showChallengeTour,
        currentStepId,
        startChallengeTour,
        closeChallengeTour,
        setCurrentStepId,
      }}
    >
      {children}
    </ChallengeTourContext.Provider>
  );
}

export function useChallengeTour() {
  const context = useContext(ChallengeTourContext);
  if (context === undefined) {
    throw new Error('useChallengeTour must be used within a ChallengeTourProvider');
  }
  return context;
}
