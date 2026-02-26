import React, { createContext, useContext, useState, useEffect } from 'react';

export type ArchetypeType = 'Trailblazer' | 'Guide' | 'Connector' | 'Explorer' | 'Champion' | 'Innovator' | null;

interface User {
  name: string;
  avatar: string;
  email: string;
}

interface Progress {
  modulesCompleted: number;
  totalModules: number;
  streak: number;
  xp: number;
  level: number;
  badges: string[];
}

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

const defaultProgress: Progress = {
  modulesCompleted: 3,
  totalModules: 12,
  streak: 5,
  xp: 1250,
  level: 3,
  badges: ['Early Adopter', 'Fast Learner'],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [archetype, setArchetype] = useState<ArchetypeType>(null);
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  // Load from local storage on mount (simulated persistence)
  useEffect(() => {
    const storedArchetype = localStorage.getItem('app_archetype');
    if (storedArchetype) {
      setArchetype(storedArchetype as ArchetypeType);
    }
    
    const storedUser = localStorage.getItem('app_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
  }, []);

  const login = (email: string) => {
    const userData = {
      name: 'Alex Chen',
      avatar: '',
      email: email,
    };
    setUser(userData);
    localStorage.setItem('app_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setArchetype(null);
    localStorage.removeItem('app_archetype');
    localStorage.removeItem('app_user');
  };

  const updateArchetype = (newArchetype: ArchetypeType) => {
    setArchetype(newArchetype);
    if (newArchetype) {
      localStorage.setItem('app_archetype', newArchetype);
    } else {
      localStorage.removeItem('app_archetype');
    }
  };

  const completeModule = (moduleId: string) => {
    setProgress(prev => ({
      ...prev,
      modulesCompleted: prev.modulesCompleted + 1,
      xp: prev.xp + 100,
    }));
  };

  const addXp = (amount: number) => {
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

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

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}