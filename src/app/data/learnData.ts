/**
 * Learn section data: Challenges, Trainings, Micro-Learnings, Office Hours, Prompt Library, Resources.
 */

export type ChallengeType = 'weekly' | 'track' | 'assigned';
export type ChallengeDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Challenge {
  id: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  title: string;
  description: string;
  time: string;
  participants: number;
  points: number;
  category: string;
  saved?: boolean;
  /** Bullet objectives for overview (2–4 items) */
  objectives?: string[];
  /** Prerequisites (knowledge or modules) */
  prerequisites?: string[];
  /** IDs for related micro-learnings or resources */
  relatedContentIds?: string[];
  /** Short hints from coach (expandable on detail/workspace) */
  coachHints?: string[];
  /** Longer instructions for workspace Step 1 */
  instructions?: string;
}

export const challenges: Challenge[] = [
  { id: 'c1', type: 'weekly', difficulty: 'Beginner', title: 'Weekly Prompt Challenge', description: 'Compare two prompt outputs for the same task and document which works better and why.', time: '30 min', participants: 234, points: 150, category: 'Prompt Engineering', objectives: ['Compare two prompts for the same task', 'Document which output works better and why', 'Share one takeaway with your team'], prerequisites: ['Basic familiarity with a chat AI'], relatedContentIds: ['ml3', 'ml5'], coachHints: ['Try the same prompt with "be concise" vs "be detailed"', 'Include role + task + format in both'], instructions: 'Pick a real work task. Run it with two different prompt phrasings in your AI tool. Capture both outputs, then write 2–3 sentences on which worked better and why. Optional: share one takeaway in Community.' },
  { id: 'c2', type: 'track', difficulty: 'Intermediate', title: 'Data Analysis Sprint', description: 'Use AI to analyze a dataset and produce a one-page visual report with insights.', time: '45 min', participants: 89, points: 200, category: 'Data Analysis', saved: true, objectives: ['Analyze a dataset with AI', 'Produce a one-page visual report', 'Highlight 3–5 key insights'], prerequisites: ['Intro to AI Assistants', 'Crafting Effective Prompts'], relatedContentIds: ['ml4', 'ml6', 'ml10'], coachHints: ['Upload a small CSV or paste a sample', 'Ask for "summary stats then 3 insights" in one prompt'], instructions: 'Choose a dataset (spreadsheet, CSV, or paste a sample). Use an AI tool to summarize it and suggest visualizations. Produce a one-page report (document or slide) with 3–5 key insights and one recommended chart.' },
  { id: 'c3', type: 'track', difficulty: 'Intermediate', title: 'Email Automation Flow', description: 'Design an AI-powered email workflow that drafts, revises, and schedules follow-ups.', time: '60 min', participants: 56, points: 250, category: 'Automation', objectives: ['Design an email workflow', 'Include draft, revise, and follow-up steps', 'Document the flow'], prerequisites: ['AI for Email & Communication'], relatedContentIds: ['ml9', 'r3'], coachHints: ['Start with one trigger (e.g. "after meeting")', 'Use a prompt template for the first draft'], instructions: 'Map a simple email workflow: trigger (e.g. after a meeting), draft (AI), revise (you), and follow-up (reminder or template). Document each step and one sample prompt for the draft step.' },
  { id: 'c4', type: 'weekly', difficulty: 'Beginner', title: 'Team Meeting Summarizer', description: 'Build a simple system that turns raw meeting notes into structured summaries and action items.', time: '25 min', participants: 312, points: 100, category: 'Productivity', objectives: ['Turn raw notes into a structured summary', 'Extract action items and owners', 'Reuse one prompt for next time'], prerequisites: [], relatedContentIds: ['ml2', 'ml11', 'r6'], coachHints: ['Use "Summarize in 3 sections: Summary, Decisions, Action Items"', 'Paste real notes (anonymized) for best results'], instructions: 'Take raw meeting notes (yours or sample). Use AI to generate: (1) 2–3 sentence summary, (2) key decisions, (3) action items with owners. Save the prompt you used so you can reuse it.' },
  { id: 'c5', type: 'track', difficulty: 'Advanced', title: 'Advanced Prompt Chain', description: 'Design a multi-step prompt chain that takes an input and produces a polished deliverable.', time: '90 min', participants: 42, points: 300, category: 'Prompt Engineering', objectives: ['Design a multi-step prompt chain', 'Use output of step N as input to step N+1', 'Produce one polished deliverable'], prerequisites: ['Advanced Prompt Techniques'], relatedContentIds: ['ml3', 'ml5', 'ml12'], coachHints: ['Step 1: extract/outline, Step 2: expand, Step 3: polish', 'Pass the previous output explicitly into the next prompt'], instructions: 'Design a 3-step chain (e.g. outline → draft → polish). Run it with one real input. Document each step and the final deliverable.' },
  { id: 'c6', type: 'assigned', difficulty: 'Intermediate', title: 'Manager-Assigned: Q1 Report', description: 'Prepare a Q1 performance report using AI to summarize data and suggest next steps.', time: '45 min', participants: 18, points: 175, category: 'Strategy', objectives: ['Summarize Q1 data with AI', 'Suggest next steps', 'Present in a short report format'], prerequisites: ['AI for Email & Communication', 'Crafting Effective Prompts'], relatedContentIds: ['r9'], coachHints: ['Aggregate data first (or use a sample)', 'Ask for "risks, wins, and recommended next steps"'], instructions: 'Using real or sample Q1 data, use AI to summarize performance, highlight risks and wins, and suggest 3–5 next steps. Produce a short report (1–2 pages) suitable for leadership.' },
];

const SAVED_CHALLENGES_KEY = 'learn_saved_challenges';

/** Get challenge by id; returns undefined if not found */
export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find(c => c.id === id);
}

/** Get saved challenge IDs from localStorage */
export function getSavedChallengeIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(SAVED_CHALLENGES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/** Toggle saved state for a challenge and persist */
export function toggleChallengeSaved(id: string): boolean {
  const set = getSavedChallengeIds();
  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(SAVED_CHALLENGES_KEY, JSON.stringify([...set]));
  }
  return set.has(id);
}

/** Check if a challenge is saved */
export function isChallengeSaved(id: string): boolean {
  return getSavedChallengeIds().has(id);
}

export type TrainingFormat = 'lms' | 'video' | 'interactive' | 'certification';

export interface Training {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  category: string;
  progress?: number;
  format?: TrainingFormat;
  difficulty?: string;
  objectives?: string[];
  prerequisites?: string[];
  certificateInfo?: string;
  syllabus?: string[];
  introVideoUrl?: string;
  reviews?: { rating: number; text: string }[];
}

export const trainings: Training[] = [
  { id: 't1', title: 'AI Fundamentals Certificate', description: 'Core concepts of AI and responsible use in the workplace.', duration: '2 hrs', lessons: 8, category: 'Fundamentals', progress: 100, format: 'certification', difficulty: 'Beginner', objectives: ['Understand AI basics', 'Apply responsible AI practices', 'Recognize use cases'], prerequisites: [], certificateInfo: 'Certificate of completion', syllabus: ['Intro to AI', 'Ethics', 'Use cases', 'Hands-on'], reviews: [{ rating: 5, text: 'Clear and practical.' }] },
  { id: 't2', title: 'Prompt Engineering Pro', description: 'Advanced prompting techniques and chain-of-thought.', duration: '3 hrs', lessons: 12, category: 'Prompt Engineering', progress: 40, format: 'video', difficulty: 'Intermediate', objectives: ['Master advanced prompts', 'Use chain-of-thought', 'Optimize outputs'], prerequisites: ['AI Fundamentals'], certificateInfo: 'Prompt Pro badge', syllabus: ['Advanced patterns', 'CoT', 'Few-shot'], reviews: [{ rating: 4, text: 'Great depth.' }] },
  { id: 't3', title: 'Data & AI Workflows', description: 'Integrate AI into data pipelines and reporting.', duration: '2.5 hrs', lessons: 10, category: 'Data', format: 'interactive', difficulty: 'Intermediate', objectives: ['Build AI data pipelines', 'Automate reporting'], prerequisites: ['AI Fundamentals'], certificateInfo: 'Data AI certificate', syllabus: ['Pipelines', 'Reporting'] },
  { id: 't4', title: 'AI for Managers', description: 'Lead AI adoption and measure impact on your team.', duration: '1.5 hrs', lessons: 6, category: 'Leadership', format: 'lms', difficulty: 'Beginner', objectives: ['Lead adoption', 'Measure impact'], prerequisites: [], certificateInfo: 'Leadership badge', syllabus: ['Strategy', 'Metrics'] },
];

const SAVED_TRAININGS_KEY = 'learn_saved_trainings';
export function getTrainingById(id: string): Training | undefined {
  return trainings.find(t => t.id === id);
}
export function getSavedTrainingIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(SAVED_TRAININGS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch { return new Set(); }
}
export function toggleTrainingSaved(id: string): boolean {
  const set = getSavedTrainingIds();
  if (set.has(id)) set.delete(id); else set.add(id);
  if (typeof window !== 'undefined') localStorage.setItem(SAVED_TRAININGS_KEY, JSON.stringify([...set]));
  return set.has(id);
}
export function isTrainingSaved(id: string): boolean {
  return getSavedTrainingIds().has(id);
}

export type MicroLearningTopic = 'Writing' | 'Productivity' | 'Data' | 'Prompt Engineering';
export type MicroLearningTool = 'ChatGPT' | 'Copilot' | 'Claude' | 'Any';

export type MicroSkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface MicroLearning {
  id: string;
  topic: MicroLearningTopic;
  tool: MicroLearningTool;
  title: string;
  description: string;
  duration: string;
  points: number;
  hot?: boolean;
  completed?: boolean;
  contentUrl?: string;
  skillLevel?: MicroSkillLevel;
  addedAt?: string;
}

export const microLearnings: MicroLearning[] = [
  { id: 'ml1', topic: 'Writing', tool: 'ChatGPT', title: 'Writing Better Subject Lines', description: 'Craft email subject lines that get opened.', duration: '5 min', points: 25, completed: true, skillLevel: 'Beginner', addedAt: '2024-01-15' },
  { id: 'ml2', topic: 'Productivity', tool: 'ChatGPT', title: 'Meeting Agenda Generator', description: 'Generate clear agendas from a one-line topic.', duration: '4 min', points: 20, hot: true, skillLevel: 'Beginner', addedAt: '2024-02-01' },
  { id: 'ml3', topic: 'Prompt Engineering', tool: 'Any', title: 'Prompt Debugging 101', description: 'Fix vague or low-quality AI outputs.', duration: '7 min', points: 35, hot: true, skillLevel: 'Intermediate', addedAt: '2024-02-10' },
  { id: 'ml4', topic: 'Data', tool: 'ChatGPT', title: 'Quick Chart Generation', description: 'Turn data into charts with a single prompt.', duration: '5 min', points: 25, hot: true, skillLevel: 'Beginner', addedAt: '2024-02-05' },
  { id: 'ml5', topic: 'Prompt Engineering', tool: 'Any', title: 'Persona-Based Prompting', description: 'Get better results by defining a persona.', duration: '8 min', points: 40, hot: true, skillLevel: 'Intermediate', addedAt: '2024-02-12' },
  { id: 'ml6', topic: 'Data', tool: 'Claude', title: 'Data Cleaning with AI', description: 'Clean and normalize messy datasets.', duration: '8 min', points: 40, skillLevel: 'Intermediate', addedAt: '2024-01-20' },
  { id: 'ml7', topic: 'Writing', tool: 'Copilot', title: 'AI-Powered Proofreading', description: 'Catch errors and improve tone.', duration: '6 min', points: 30, skillLevel: 'Beginner', addedAt: '2024-01-25' },
  { id: 'ml8', topic: 'Writing', tool: 'Any', title: 'Tone Shifting Prompts', description: 'Adapt the same content for different audiences.', duration: '6 min', points: 30, skillLevel: 'Intermediate', addedAt: '2024-02-08' },
  { id: 'ml9', topic: 'Productivity', tool: 'Copilot', title: 'Automated Follow-ups', description: 'Draft follow-up emails from meeting notes.', duration: '5 min', points: 25, skillLevel: 'Beginner', addedAt: '2024-02-03' },
  { id: 'ml10', topic: 'Data', tool: 'Claude', title: 'Complex Query Building', description: 'Turn natural language into data queries.', duration: '10 min', points: 50, skillLevel: 'Advanced', addedAt: '2024-01-10' },
  { id: 'ml11', topic: 'Productivity', tool: 'ChatGPT', title: 'Presentation Bullet Points', description: 'Turn long text into slide-ready bullets.', duration: '4 min', points: 20, hot: true, skillLevel: 'Beginner', addedAt: '2024-02-15' },
  { id: 'ml12', topic: 'Prompt Engineering', tool: 'Any', title: 'API Prompt Templates', description: 'Reusable prompts for common API tasks.', duration: '12 min', points: 60, skillLevel: 'Advanced', addedAt: '2024-01-05' },
];

const MICRO_COMPLETED_KEY = 'learn_micro_completed';
export function getMicroById(id: string): MicroLearning | undefined {
  return microLearnings.find(m => m.id === id);
}
export function getCompletedMicroIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(MICRO_COMPLETED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch { return new Set(); }
}
export function setMicroCompleted(id: string): void {
  const set = getCompletedMicroIds();
  set.add(id);
  if (typeof window !== 'undefined') localStorage.setItem(MICRO_COMPLETED_KEY, JSON.stringify([...set]));
}
export function isMicroCompleted(id: string): boolean {
  return getCompletedMicroIds().has(id);
}

export interface OfficeHourSession {
  id: string;
  title: string;
  instructor: string;
  role?: string;
  description?: string;
  attending: string;
  duration: string;
  live?: boolean;
  date?: string;
  time?: string;
}

export const officeHourLive: OfficeHourSession | null = {
  id: 'oh-live',
  title: 'Prompt Engineering Deep Dive',
  instructor: 'Sarah Chen',
  attending: '34/50',
  duration: '45 min',
  live: true,
};

export const officeHourUpcoming: OfficeHourSession[] = [
  { id: 'oh1', title: 'AI for Data Teams', description: 'How data teams can integrate AI into their daily workflows.', instructor: 'Marcus Johnson', role: 'Data Scientist', attending: '18/40', duration: '60 min', date: 'Tomorrow', time: '11:00 AM' },
  { id: 'oh2', title: 'Getting Started with AI Tools', description: 'Beginner-friendly session covering the basics of AI tool usage.', instructor: 'Emily Rodriguez', role: 'Trainer', attending: '0/60', duration: '30 min', date: 'Mar 7', time: '3:00 PM' },
];

export type PromptCategory = 'Communication' | 'Data' | 'Productivity' | 'Development' | 'Project Management' | 'Strategy';

export interface PromptCard {
  id: string;
  category: PromptCategory;
  title: string;
  description: string;
  tags: string[];
  rating: number;
  uses: number;
  author: string;
  saved?: boolean;
  templateText: string;
  useCase?: string;
  examples?: string[];
  tools?: string[];
}

export const promptLibrary: PromptCard[] = [
  { id: 'p1', category: 'Communication', title: 'Professional Email Drafter', description: 'Draft clear, professional emails for any context.', tags: ['Email', 'Communication', 'Professional'], rating: 4.9, uses: 1240, author: 'Sarah C.', templateText: 'You are a professional communicator. Draft a clear, concise email for the following context:\n\n[Context: {{context}}]\n[Tone: {{tone}}]\n[Key points to include: {{points}}]', useCase: 'Draft emails for any business context.', examples: ['Follow-up after meeting', 'Request for feedback'], tools: ['ChatGPT', 'Claude', 'Copilot'] },
  { id: 'p2', category: 'Data', title: 'Data Analysis Assistant', description: 'Summarize datasets and suggest visualizations.', tags: ['Data', 'Analysis', 'Charts'], rating: 4.7, uses: 892, author: 'Marcus J.', templateText: 'Analyze this dataset and provide:\n1. Summary statistics\n2. 3–5 key insights\n3. Recommended chart types and why\n\n[Data or description: {{data}}]', useCase: 'Quick data exploration and visualization ideas.', tools: ['ChatGPT', 'Claude'] },
  { id: 'p3', category: 'Productivity', title: 'Meeting Notes Structurer', description: 'Turn raw notes into structured summaries and action items.', tags: ['Meetings', 'Notes', 'Actions'], rating: 4.8, uses: 2103, author: 'Sarah C.', templateText: 'Convert these raw meeting notes into:\n1. Brief summary (2–3 sentences)\n2. Key decisions\n3. Action items with owners and due dates\n\n[Notes: {{notes}}]', useCase: 'Structure messy meeting notes.', tools: ['ChatGPT', 'Claude', 'Copilot'] },
  { id: 'p4', category: 'Development', title: 'Code Review Helper', description: 'Get constructive feedback on code snippets.', tags: ['Code', 'Review', 'Feedback'], rating: 4.6, uses: 756, author: 'Alex K.', templateText: 'Review this code for clarity, correctness, and best practices. Provide constructive feedback and suggest improvements.\n\n[Code: {{code}}]\n[Language: {{language}}]', useCase: 'Get AI-assisted code review.', tools: ['Claude', 'Copilot'] },
  { id: 'p5', category: 'Productivity', title: 'Presentation Outline Creator', description: 'Build a slide outline from a topic or brief.', tags: ['Presentation', 'Outline', 'Slides'], rating: 4.9, uses: 987, author: 'Emily R.', saved: true, templateText: 'Create a presentation outline for: {{topic}}. Include: title slide, 4–6 content slides with bullet points, and a closing slide. Keep each slide to 3–5 bullets.', useCase: 'Quick presentation outlines.', tools: ['ChatGPT', 'Claude'] },
  { id: 'p6', category: 'Project Management', title: 'Project Status Report', description: 'Generate status updates from project data.', tags: ['Status', 'Report', 'PM'], rating: 4.5, uses: 534, author: 'Marcus J.', saved: true, templateText: 'Generate a project status report from:\n[Completed: {{completed}}]\n[In progress: {{inProgress}}]\n[Blockers: {{blockers}}]\n[Next: {{next}}]\n\nFormat: Summary, Progress, Risks, Next steps.', useCase: 'Weekly or monthly status reports.', tools: ['ChatGPT', 'Claude'] },
  { id: 'p7', category: 'Communication', title: 'Customer FAQ Generator', description: 'Create FAQ content from product docs.', tags: ['FAQ', 'Customer', 'Support'], rating: 4.4, uses: 421, author: 'Sarah C.', templateText: 'Create FAQ entries (question + short answer) from this product documentation:\n\n{{documentation}}', useCase: 'Turn docs into customer FAQs.', tools: ['ChatGPT', 'Claude'] },
  { id: 'p8', category: 'Strategy', title: 'SWOT Analysis Prompt', description: 'Run a structured SWOT from a company or product brief.', tags: ['SWOT', 'Strategy', 'Analysis'], rating: 4.7, uses: 678, author: 'Alex K.', templateText: 'Perform a SWOT analysis based on:\n[Company/Product: {{name}}]\n[Context: {{context}}]\n\nOutput: Strengths, Weaknesses, Opportunities, Threats (2–4 items each with brief rationale).', useCase: 'Strategy and planning.', tools: ['ChatGPT', 'Claude'] },
];

const SAVED_PROMPTS_KEY = 'learn_saved_prompts';
const PROMPT_RATINGS_KEY = 'learn_prompt_ratings';
export function getPromptById(id: string): PromptCard | undefined {
  return promptLibrary.find(p => p.id === id);
}
export function getSavedPromptIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(SAVED_PROMPTS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch { return new Set(); }
}
export function togglePromptSaved(id: string): boolean {
  const set = getSavedPromptIds();
  if (set.has(id)) set.delete(id); else set.add(id);
  if (typeof window !== 'undefined') localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify([...set]));
  return set.has(id);
}
export function isPromptSaved(id: string): boolean {
  return getSavedPromptIds().has(id);
}
export function setPromptRating(id: string, rating: number, comment?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PROMPT_RATINGS_KEY);
    const obj: Record<string, { rating: number; comment?: string }> = raw ? JSON.parse(raw) : {};
    obj[id] = { rating, comment };
    localStorage.setItem(PROMPT_RATINGS_KEY, JSON.stringify(obj));
  } catch { /* ignore */ }
}
export function getPromptUserRating(id: string): { rating: number; comment?: string } | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(PROMPT_RATINGS_KEY);
    const obj = raw ? JSON.parse(raw) : {};
    return obj[id];
  } catch { return undefined; }
}

export type ResourceType = 'guide' | 'video' | 'template' | 'tool' | 'podcast' | 'article';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  desc: string;
  duration: string;
  date?: string;
  saved?: boolean;
  body?: string;
  downloadUrl?: string;
  embedUrl?: string;
}

export const resources: Resource[] = [
  { id: 'r1', type: 'guide', title: 'Beginner\'s Guide to Prompt Engineering', desc: 'A step-by-step walkthrough for crafting effective prompts.', duration: '15 min', date: 'Mar 1', saved: false, body: '## Getting started\n\nEffective prompts include: **role**, **task**, and **format**. Start with a clear instruction and refine based on output.', downloadUrl: '/guides/prompt-eng.pdf' },
  { id: 'r2', type: 'video', title: 'AI for Data Analysis – Tutorial', desc: 'Video walkthrough of using AI to analyze spreadsheets.', duration: '12 min', date: 'Feb 28', saved: true, embedUrl: 'https://example.com/embed/data-tutorial' },
  { id: 'r3', type: 'template', title: 'Email Writing Prompt Template', desc: 'Reusable template for professional email drafting.', duration: '5 min', date: 'Mar 1', saved: false, body: 'Use this template: "Draft a [tone] email to [audience] about [topic]. Include: [key points]."', downloadUrl: '/templates/email-prompt.docx' },
  { id: 'r4', type: 'guide', title: 'Best Practices for AI Ethics', desc: 'A checklist for responsible AI usage in the workplace.', duration: '10 min', date: 'Feb 25', saved: false, body: 'Checklist: verify sources, avoid PII in prompts, document AI-assisted work.', downloadUrl: '/guides/ai-ethics.pdf' },
  { id: 'r5', type: 'video', title: 'Workflow Automation Masterclass', desc: 'Learn to build AI-powered workflows from scratch.', duration: '25 min', date: 'Feb 20', saved: true, embedUrl: 'https://example.com/embed/workflow' },
  { id: 'r6', type: 'template', title: 'Meeting Summary Prompt', desc: 'Auto-generate structured meeting notes and action items.', duration: '3 min', date: 'Mar 2', saved: false, body: 'Paste notes and ask: "Summarize in: Summary, Decisions, Action items with owners."' },
  { id: 'r7', type: 'guide', title: 'Advanced Prompt Chaining Guide', desc: 'Chain multiple prompts for complex tasks.', duration: '20 min', date: 'Feb 22', saved: false, body: 'Chain steps: 1) Extract/outline 2) Expand 3) Polish. Pass prior output into next prompt.' },
  { id: 'r8', type: 'video', title: 'Getting Buy-in for AI Projects', desc: 'How to pitch and secure support for AI initiatives.', duration: '18 min', date: 'Feb 15', saved: false, embedUrl: 'https://example.com/embed/buyin' },
  { id: 'r9', type: 'template', title: 'Project Status Report Template', desc: 'Template for consistent project status updates.', duration: '5 min', date: 'Mar 1', saved: false, body: 'Sections: Summary, Progress, Risks, Next steps. Use our status prompt in Prompt Library.' },
  { id: 'r10', type: 'tool', title: 'AI Tool Comparison Matrix', desc: 'Compare features and use cases for popular AI tools.', duration: '10 min', date: 'Feb 28', saved: false, body: 'Compare ChatGPT, Claude, Copilot by: use case, input types, output format.' },
  { id: 'r11', type: 'podcast', title: 'AI Adoption Stories – Episode 12', desc: 'Leaders share how they rolled out AI in their teams.', duration: '35 min', date: 'Feb 10', saved: false },
  { id: 'r12', type: 'article', title: 'The Future of AI in Our Industry', desc: 'Trends and predictions for the next 2–3 years.', duration: '8 min', date: 'Mar 3', saved: false, body: 'Key trends: embedded AI in tools, more guardrails, focus on ROI.' },
];

const SAVED_RESOURCES_KEY = 'learn_saved_resources';
export function getResourceById(id: string): Resource | undefined {
  return resources.find(r => r.id === id);
}
export function getSavedResourceIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(SAVED_RESOURCES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch { return new Set(); }
}
export function toggleResourceSaved(id: string): boolean {
  const set = getSavedResourceIds();
  if (set.has(id)) set.delete(id); else set.add(id);
  if (typeof window !== 'undefined') localStorage.setItem(SAVED_RESOURCES_KEY, JSON.stringify([...set]));
  return set.has(id);
}
export function isResourceSaved(id: string): boolean {
  return getSavedResourceIds().has(id);
}

// Office Hours: Recordings, Q&A, 1:1 slots
export interface OfficeHourRecording {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  topic: string;
  recordingUrl?: string;
  thumbnail?: string;
}

export const officeHourRecordings: OfficeHourRecording[] = [
  { id: 'rec1', title: 'Prompt Engineering Deep Dive', instructor: 'Sarah Chen', duration: '45 min', topic: 'Prompt Engineering', recordingUrl: 'https://example.com/rec/1' },
  { id: 'rec2', title: 'AI for Data Teams', instructor: 'Marcus Johnson', duration: '60 min', topic: 'Data' },
  { id: 'rec3', title: 'Getting Started with AI Tools', instructor: 'Emily Rodriguez', duration: '30 min', topic: 'Fundamentals' },
];

export interface OfficeHourQAItem {
  id: string;
  question: string;
  author: string;
  date: string;
  topic: string;
  upvotes: number;
  answerCount: number;
  answer?: string;
}

export const officeHourQA: OfficeHourQAItem[] = [
  { id: 'qa1', question: 'How do I get more consistent outputs from ChatGPT?', author: 'Alex K.', date: 'Mar 1', topic: 'Prompt Engineering', upvotes: 12, answerCount: 3, answer: 'Use a clear structure: role + task + format. Add 1–2 examples when possible.' },
  { id: 'qa2', question: 'Best way to clean CSV data with AI?', author: 'Jordan L.', date: 'Feb 28', topic: 'Data', upvotes: 8, answerCount: 2 },
  { id: 'qa3', question: 'Can I use Copilot for code review?', author: 'Sam T.', date: 'Feb 27', topic: 'Development', upvotes: 5, answerCount: 1 },
];

export interface OfficeHourSlot {
  id: string;
  date: string;
  time: string;
  mentorName: string;
  mentorRole?: string;
}

export const officeHourSlots: OfficeHourSlot[] = [
  { id: 'slot1', date: 'Mar 5', time: '10:00 AM', mentorName: 'Sarah Chen', mentorRole: 'Lead Trainer' },
  { id: 'slot2', date: 'Mar 5', time: '2:00 PM', mentorName: 'Marcus Johnson', mentorRole: 'Data Scientist' },
  { id: 'slot3', date: 'Mar 6', time: '11:00 AM', mentorName: 'Emily Rodriguez', mentorRole: 'Trainer' },
];
