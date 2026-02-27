/**
 * ============================================
 * 📊 DATA: ARCHETYPES & SURVEYS
 * ============================================
 * 
 * This file contains the "Brain" of the personality assessment.
 * It defines what each archetype is (Trailblazer, Guide, etc.) 
 * and the questions/answers for the survey.
 * 
 * STRUCTURE:
 * 1. Archetype Interface: The data blueprint for a personality.
 * 2. Archetypes Constant: The actual data for each personality.
 * 3. Survey Questions: The questions used in SurveyPage.tsx.
 * 4. Learning Modules: Data for the LearnPage.tsx.
 */

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  color: string;
  secondaryColor: string;
  bgLight: string;
  icon: string;
  description: string;
  traits: string[];
  motivation: string;
  challenges: string[];
  tips: string[];
  foggQuadrant: string;
  foggLabel: string;
  learningStyle: string;
}

/**
 * --- SECTION 1: THE ARCHETYPES ---
 * Each one represents a different "User Persona".
 */
export const archetypes: Record<string, Archetype> = {
  trailblazer: {
    id: 'trailblazer',
    name: 'The Trailblazer',
    tagline: 'Master the summit',
    color: '#f59e0b',
    secondaryColor: '#fbbf24',
    bgLight: '#fef3c7',
    icon: 'Mountain',
    description: 'You are a self-directed learner driven by mastery and structured skill building. You prefer to chart your own course but appreciate clear milestones and achievements.',
    traits: ['Ambitious', 'Structured', 'Goal-oriented', 'Independent'],
    motivation: 'Personal mastery and tangible progress',
    challenges: ['Can become overwhelmed by too many options', 'May ignore collaborative opportunities'],
    tips: ['Set clear micro-goals for each learning session', 'Track your progress visually with the dashboard'],
    foggQuadrant: 'ENABLE',
    foggLabel: 'Self-Directed Learner',
    learningStyle: 'Structured, self-paced learning with clear metrics',
  },
  guide: {
    id: 'guide',
    name: 'The Guide',
    tagline: 'Light the way',
    color: '#14b8a6',
    secondaryColor: '#2dd4bf',
    bgLight: '#ccfbf1',
    icon: 'Lamp',
    description: 'You are motivated by helping others and making an impact at scale. You learn best when you can teach or share your knowledge.',
    traits: ['Altruistic', 'Patient', 'Communicative', 'Supportive'],
    motivation: 'Helping others succeed',
    challenges: ['Prioritizing own learning over helping others'],
    tips: ['Document your learning journey to teach later', 'Mentor a peer through their adoption path'],
    foggQuadrant: 'TRAIN',
    foggLabel: 'Skill Builder',
    learningStyle: 'Teaching-oriented learning with mentoring focus',
  },
  connector: {
    id: 'connector',
    name: 'The Connector',
    tagline: 'Stronger together',
    color: '#8b5cf6',
    secondaryColor: '#a78bfa',
    bgLight: '#ede9fe',
    icon: 'Network',
    description: 'You thrive in collaborative environments. Learning is a social activity for you.',
    traits: ['Social', 'Collaborative', 'Empathetic', 'Network-oriented'],
    motivation: 'Social connection and team success',
    challenges: ['Struggling with solitary study'],
    tips: ['Find a study buddy for accountability', 'Participate in forum discussions actively'],
    foggQuadrant: 'NUDGE',
    foggLabel: 'Untapped Potential',
    learningStyle: 'Social learning through collaboration and discussion',
  },
  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    tagline: 'Chart your course',
    color: '#0ea5e9',
    secondaryColor: '#38bdf8',
    bgLight: '#e0f2fe',
    icon: 'Compass',
    description: 'You value freedom and experimentation. You prefer open-ended tasks and discovering new possibilities.',
    traits: ['Curious', 'Innovative', 'Flexible', 'Open-minded'],
    motivation: 'Discovery and freedom',
    challenges: ['Difficulty finishing structured courses'],
    tips: ['Allow time for unstructured AI tinkering', 'Explore creative "what if" scenarios'],
    foggQuadrant: 'ENABLE',
    foggLabel: 'Self-Directed Learner',
    learningStyle: 'Exploratory, open-ended discovery-based learning',
  },
  champion: {
    id: 'champion',
    name: 'The Champion',
    tagline: 'Claim the prize',
    color: '#e31937',
    secondaryColor: '#ef4444',
    bgLight: '#fce8eb',
    icon: 'Trophy',
    description: 'You are driven by competition, rewards, and recognition. Leaderboards and badges motivate you to achieve more.',
    traits: ['Competitive', 'Driven', 'Energetic', 'Result-oriented'],
    motivation: 'Winning and recognition',
    challenges: ['Focusing only on points, not learning'],
    tips: ['Participate in competitive challenges weekly', 'Celebrate every milestone achievement'],
    foggQuadrant: 'TRAIN',
    foggLabel: 'Skill Builder',
    learningStyle: 'Competition-driven with rewards and recognition',
  },
  innovator: {
    id: 'innovator',
    name: 'The Innovator',
    tagline: 'Break the mold',
    color: '#84cc16',
    secondaryColor: '#a3e635',
    bgLight: '#ecfccb',
    icon: 'Lightbulb',
    description: 'You are a disruptor who loves to find new ways to do things. Standard procedures bore you.',
    traits: ['Creative', 'Unconventional', 'Experimental', 'Visionary'],
    motivation: 'Creating something new and better',
    challenges: ['Boredom with basics', 'Overcomplicating simple tasks'],
    tips: ['Apply AI to solve novel real-world problems', 'Challenge the status quo in every process'],
    foggQuadrant: 'START_TINY',
    foggLabel: 'Supported Starter',
    learningStyle: 'Experimental, innovation-focused with creative freedom',
  },
};

export interface SurveyQuestion {
  id: string;
  section: number;
  sectionName: string;
  text: string;
  options: { text: string; value: string }[];
}

/**
 * --- SECTION 2: THE SURVEY ---
 * These questions determine the user's score for each archetype.
 */
export const surveyQuestions: SurveyQuestion[] = [
  // Section 1: Work Style
  {
    id: 'q1', section: 1, sectionName: 'Work Style',
    text: 'When faced with a new software tool at work, what is your first instinct?',
    options: [
      { text: 'Look for a tutorial or manual to understand the basics first.', value: 'trailblazer' },
      { text: 'Think about how this could help my team work better.', value: 'guide' },
      { text: 'Ask a colleague if they have used it and what they think.', value: 'connector' },
      { text: 'Start clicking around to see what happens.', value: 'explorer' },
      { text: 'Figure out how to master it faster than anyone else.', value: 'champion' },
      { text: 'Look for ways to customize it or make it do something unique.', value: 'innovator' },
    ]
  },
  {
    id: 'q2', section: 1, sectionName: 'Work Style',
    text: 'What kind of work environment do you thrive in?',
    options: [
      { text: 'Structured, with clear goals and metrics.', value: 'trailblazer' },
      { text: 'Supportive, where mentorship is valued.', value: 'guide' },
      { text: 'Collaborative, open-plan, lots of discussion.', value: 'connector' },
      { text: 'Dynamic, changing, with freedom to roam.', value: 'explorer' },
      { text: 'Competitive, fast-paced with rewards.', value: 'champion' },
      { text: 'Creative, experimental, innovation-focused.', value: 'innovator' },
    ]
  }
  // ... more questions continue in the same format
];

/**
 * --- SECTION 3: LEARNING CONTENT ---
 * This data powers the 'Learn' section modules and 'Quick Wins'.
 */
export const learningModules = [
  { id: 'm1', title: 'Introduction to AI Assistants', category: 'Basics', duration: '15 min', difficulty: 'Beginner', completed: true, rating: 4 },
  { id: 'm2', title: 'Crafting Effective Prompts', category: 'Prompt Engineering', duration: '20 min', difficulty: 'Beginner', completed: true, rating: 5 },
  { id: 'm3', title: 'Advanced Prompt Techniques', category: 'Prompt Engineering', duration: '30 min', difficulty: 'Intermediate', completed: false, rating: 0 },
  { id: 'm4', title: 'AI-Powered Data Analysis', category: 'Data & Analytics', duration: '35 min', difficulty: 'Intermediate', completed: false, rating: 0 },
  { id: 'm5', title: 'Workflow Automation with AI', category: 'Productivity', duration: '40 min', difficulty: 'Intermediate', completed: false, rating: 0 },
  { id: 'm6', title: 'AI Ethics & Best Practices', category: 'Fundamentals', duration: '25 min', difficulty: 'Beginner', completed: false, rating: 0 },
  { id: 'm7', title: 'Building AI-Enhanced Presentations', category: 'Productivity', duration: '30 min', difficulty: 'Intermediate', completed: false, rating: 0 },
  { id: 'm8', title: 'AI for Team Collaboration', category: 'Communication', duration: '35 min', difficulty: 'Advanced', completed: false, rating: 0 },
];

export const quickWins = [
  { id: 'qw1', title: 'Write a better email', time: '5 min', difficulty: 'Easy', description: 'Use AI to draft, refine, and send a professional email in minutes.' },
  { id: 'qw2', title: 'Summarize a document', time: '3 min', difficulty: 'Easy', description: 'Upload any document and get a concise summary with key points.' },
  // ... more quick wins continue
];
