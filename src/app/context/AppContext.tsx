import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Archetype = 
  | 'Trailblazer' 
  | 'Guide' 
  | 'Connector' 
  | 'Explorer' 
  | 'Champion' 
  | 'Innovator'
  | null;

interface UserState {
  name: string;
  archetype: Archetype;
  completedModules: number;
  totalModules: number;
  streak: number;
  points: number;
}

interface AppContextType {
  user: UserState;
  updateUser: (updates: Partial<UserState>) => void;
  setArchetype: (archetype: Archetype) => void;
}

const defaultUser: UserState = {
  name: 'Alex',
  archetype: null,
  completedModules: 3,
  totalModules: 12,
  streak: 5,
  points: 1250,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(defaultUser);

  const updateUser = (updates: Partial<UserState>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const setArchetype = (archetype: Archetype) => {
    updateUser({ archetype });
  };

  return (
    <AppContext.Provider value={{ user, updateUser, setArchetype }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
