export type ArchetypeType = 
  | 'Trailblazer' 
  | 'Guide' 
  | 'Connector' 
  | 'Explorer' 
  | 'Champion' 
  | 'Innovator';

export interface Archetype {
  id: ArchetypeType;
  name: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  traits: string[];
  motivation: string;
  learningStyle: string;
}

export interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    value: ArchetypeType | string;
  }[];
  section: 'work_style' | 'ai_comfort' | 'learning_style';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  archetype: ArchetypeType | null;
  progress: {
    modulesCompleted: number;
    totalModules: number;
    streak: number;
    points: number;
  };
  goals: string[];
  preferences: {
    notifications: boolean;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "15 min"
  type: 'video' | 'article' | 'quiz';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress?: number;
  category: string;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    archetype: ArchetypeType;
  };
  title: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  tags: string[];
}
