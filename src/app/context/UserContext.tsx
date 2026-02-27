/**
 * ============================================
 * 👤 USER CONTEXT — UserContext.tsx
 * ============================================
 *
 * This file manages ALL user-related data across the app.
 * It uses React Context to share data without passing props.
 *
 * WHAT IS CONTEXT?
 * Think of it like a "global variable" that any component
 * can read. Instead of passing user data through 10 levels
 * of components, any component can just call useUser().
 *
 * WHAT'S STORED HERE:
 * - User info (name, email, avatar)
 * - Archetype (Trailblazer, Guide, etc.)
 * - Progress (modules completed, XP, streak, badges)
 *
 * HOW TO USE IN ANY COMPONENT:
 *   import { useUser } from '../context/UserContext';
 *   const { user, archetype, progress } = useUser();
 *
 * HINT: Data is saved to localStorage so it persists
 * across browser refreshes (simulated persistence).
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================
// SECTION 1: TYPE DEFINITIONS
// ============================================
// These define the "shape" of our data objects.
// TypeScript uses these to catch bugs before you run the code.

/** The 6 possible archetype results from the survey */
export type ArchetypeType =
  | 'Trailblazer'
  | 'Guide'
  | 'Connector'
  | 'Explorer'
  | 'Champion'
  | 'Innovator'
  | null;           // null = user hasn't taken the survey yet

/** Basic user profile info */
interface User {
  name: string;     // Display name (e.g. "Alex Chen")
  avatar: string;   // Avatar URL (empty string = use default)
  email: string;    // Email address
}

/** Tracks the user's learning progress */
interface Progress {
  modulesCompleted: number;   // How many modules they've finished
  totalModules: number;       // Total available modules
  streak: number;             // Consecutive days active
  xp: number;                 // Experience points earned
  level: number;              // Current level (based on XP)
  badges: string[];           // List of earned badge names
}

/** All the data and functions available via useUser() */
interface UserContextType {
  user: User | null;
  archetype: ArchetypeType;
  progress: Progress;
  login: (email: string) => void;
  logout: () => void;
  setArchetype: (archetype: ArchetypeType) => void;
  completeModule: (moduleId: string) => void;
  addXp: (amount: number) => void;
}

// ============================================
// SECTION 2: DEFAULT VALUES
// ============================================
// These are the starting values for a demo user.
// In a real app, these would come from a database.

const defaultProgress: Progress = {
  modulesCompleted: 3,
  totalModules: 12,
  streak: 5,
  xp: 1250,
  level: 3,
  badges: ['Early Adopter', 'Fast Learner'],
};

// ============================================
// SECTION 3: CONTEXT CREATION
// ============================================
// Create the context object. This is like creating the
// "container" that will hold our user data.

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============================================
// SECTION 4: PROVIDER COMPONENT
// ============================================
// This component wraps the entire app (see App.tsx).
// It manages state and provides it to all child components.

export function UserProvider({ children }: { children: React.ReactNode }) {

  /* ---- State Variables ---- */
  const [user, setUser] = useState<User | null>(null);
  const [archetype, setArchetype] = useState<ArchetypeType>(null);
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  /* ---- Load saved data on first render ---- */
  // HINT: useEffect with [] runs ONCE when the component mounts
  useEffect(() => {
    // Try to restore archetype from localStorage
    const storedArchetype = localStorage.getItem('app_archetype');
    if (storedArchetype) {
      setArchetype(storedArchetype as ArchetypeType);
    }

    // Try to restore user data from localStorage
    const storedUser = localStorage.getItem('app_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // If JSON is corrupted, just ignore it
      }
    }
  }, []);

  /* ---- Action: Log In ---- */
  // Creates a user profile and saves it to localStorage
  const login = (email: string) => {
    const userData: User = {
      name: 'Alex Chen',        // Demo user name
      avatar: '',
      email: email,
    };
    setUser(userData);
    localStorage.setItem('app_user', JSON.stringify(userData));
  };

  /* ---- Action: Log Out ---- */
  // Clears all user data from state AND localStorage
  const logout = () => {
    setUser(null);
    setArchetype(null);
    localStorage.removeItem('app_archetype');
    localStorage.removeItem('app_user');
  };

  /* ---- Action: Set Archetype ---- */
  // Called after the survey to save the user's archetype
  const updateArchetype = (newArchetype: ArchetypeType) => {
    setArchetype(newArchetype);
    if (newArchetype) {
      localStorage.setItem('app_archetype', newArchetype);
    } else {
      localStorage.removeItem('app_archetype');
    }
  };

  /* ---- Action: Complete a Module ---- */
  // Awards XP and increments the completed count
  const completeModule = (moduleId: string) => {
    setProgress(prev => ({
      ...prev,                                    // Keep all existing values
      modulesCompleted: prev.modulesCompleted + 1, // +1 module
      xp: prev.xp + 100,                          // +100 XP per module
    }));
  };

  /* ---- Action: Add XP ---- */
  // Adds bonus XP (e.g., from quick wins or challenges)
  const addXp = (amount: number) => {
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  /* ---- Provide all data and actions to children ---- */
  return (
    <UserContext.Provider value={{
      user,
      archetype,
      progress,
      login,
      logout,
      setArchetype: updateArchetype,
      completeModule,
      addXp,
    }}>
      {children}
    </UserContext.Provider>
  );
}

// ============================================
// SECTION 5: CUSTOM HOOK
// ============================================
// This is the function you call in any component
// to access user data. Example:
//   const { user, progress } = useUser();

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}