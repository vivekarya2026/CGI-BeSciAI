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

export const archetypes: Record<string, Archetype> = {
  trailblazer: {
    id: 'trailblazer',
    name: 'The Trailblazer',
    tagline: 'Master the summit',
    color: '#f59e0b',
    secondaryColor: '#fbbf24',
    bgLight: '#fef3c7',
    icon: 'Mountain',
    description: 'You are a self-directed learner driven by mastery and structured skill building. You prefer to chart your own course but appreciate clear milestones and achievements. Your natural inclination is toward systematic progress and measurable outcomes.',
    traits: ['Ambitious', 'Structured', 'Goal-oriented', 'Independent'],
    motivation: 'Personal mastery and tangible progress',
    challenges: ['Can become overwhelmed by too many options', 'May ignore collaborative opportunities'],
    tips: ['Set clear micro-goals for each learning session', 'Track your progress visually with the dashboard', 'Share your milestones to stay accountable'],
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
    description: 'You are motivated by helping others and making an impact at scale. You learn best when you can teach or share your knowledge with a community. Your leadership style inspires adoption across teams.',
    traits: ['Altruistic', 'Patient', 'Communicative', 'Supportive'],
    motivation: 'Helping others succeed',
    challenges: ['Prioritizing own learning over helping others', 'Burnout from support roles'],
    tips: ['Document your learning journey to teach later', 'Mentor a peer through their adoption path', 'Contribute to the community knowledge base'],
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
    description: 'You thrive in collaborative environments. Learning is a social activity for you, and you get the most value from group discussions, team projects, and shared experiences.',
    traits: ['Social', 'Collaborative', 'Empathetic', 'Network-oriented'],
    motivation: 'Social connection and team success',
    challenges: ['Struggling with solitary study', 'Distraction by social elements'],
    tips: ['Find a study buddy for accountability', 'Participate in forum discussions actively', 'Join group challenges and team events'],
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
    description: 'You value freedom and experimentation. You prefer open-ended tasks and discovering new possibilities over rigid curriculums. Your curiosity drives you to discover unconventional solutions.',
    traits: ['Curious', 'Innovative', 'Flexible', 'Open-minded'],
    motivation: 'Discovery and freedom',
    challenges: ['Lack of focus', 'Difficulty finishing structured courses'],
    tips: ['Allow time for unstructured AI tinkering', 'Explore creative "what if" scenarios', 'Connect diverse ideas into unique workflows'],
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
    description: 'You are driven by competition, rewards, and recognition. Leaderboards, badges, and tangible rewards motivate you to push harder and achieve more than anyone else.',
    traits: ['Competitive', 'Driven', 'Energetic', 'Result-oriented'],
    motivation: 'Winning and recognition',
    challenges: ['Focusing only on points, not learning', 'Discouragement if not top-ranked'],
    tips: ['Participate in competitive challenges weekly', 'Set personal bests as your benchmark', 'Celebrate every milestone achievement'],
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
    description: 'You are a disruptor who loves to find new ways to do things. Standard procedures bore you; you want to experiment, hack, and optimize everything for breakthrough results.',
    traits: ['Creative', 'Unconventional', 'Experimental', 'Visionary'],
    motivation: 'Creating something new and better',
    challenges: ['Boredom with basics', 'Overcomplicating simple tasks'],
    tips: ['Apply AI to solve novel real-world problems', 'Share your unique workflows with the community', 'Challenge the status quo in every process'],
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

export const surveyQuestions: SurveyQuestion[] = [
  // Section 1: Work Style (6 questions)
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
  },
  {
    id: 'q3', section: 1, sectionName: 'Work Style',
    text: 'When you accomplish something at work, what matters most?',
    options: [
      { text: 'Knowing I have built a new skill.', value: 'trailblazer' },
      { text: 'Seeing how my work helped someone else succeed.', value: 'guide' },
      { text: 'Celebrating with my team.', value: 'connector' },
      { text: 'The journey itself was the reward.', value: 'explorer' },
      { text: 'Being recognized as the top performer.', value: 'champion' },
      { text: 'Creating something nobody has done before.', value: 'innovator' },
    ]
  },
  {
    id: 'q4', section: 1, sectionName: 'Work Style',
    text: 'How do you prefer to solve a complex problem?',
    options: [
      { text: 'Break it into steps and follow a systematic plan.', value: 'trailblazer' },
      { text: 'Gather the team and lead a brainstorming session.', value: 'guide' },
      { text: 'Discuss with peers and build on each other\'s ideas.', value: 'connector' },
      { text: 'Experiment with different angles until something clicks.', value: 'explorer' },
      { text: 'Find the fastest path to a winning solution.', value: 'champion' },
      { text: 'Question every assumption and look for a radical approach.', value: 'innovator' },
    ]
  },
  {
    id: 'q5', section: 1, sectionName: 'Work Style',
    text: 'What motivates you to learn something new?',
    options: [
      { text: 'Clear progression paths and certificates.', value: 'trailblazer' },
      { text: 'Knowing it will help me help others.', value: 'guide' },
      { text: 'Learning alongside others.', value: 'connector' },
      { text: 'Pure curiosity and wonder.', value: 'explorer' },
      { text: 'Being the best at it.', value: 'champion' },
      { text: 'Finding a creative new application.', value: 'innovator' },
    ]
  },
  {
    id: 'q6', section: 1, sectionName: 'Work Style',
    text: 'When you receive feedback on your work, you prefer it to be:',
    options: [
      { text: 'Specific metrics showing my improvement.', value: 'trailblazer' },
      { text: 'About the impact my work had on others.', value: 'guide' },
      { text: 'In a group setting with peer input.', value: 'connector' },
      { text: 'Open-ended suggestions for exploration.', value: 'explorer' },
      { text: 'Ranked against peers so I know where I stand.', value: 'champion' },
      { text: 'Focused on how to push boundaries further.', value: 'innovator' },
    ]
  },
  // Section 2: AI Comfort (6 questions)
  {
    id: 'q7', section: 2, sectionName: 'AI Comfort',
    text: 'How do you feel about AI technology generally?',
    options: [
      { text: 'Excited to see how it can boost my personal productivity.', value: 'trailblazer' },
      { text: 'Optimistic about how it can solve big problems for society.', value: 'guide' },
      { text: 'Curious about how it will change how we communicate.', value: 'connector' },
      { text: 'Fascinated by the underlying tech and possibilities.', value: 'explorer' },
      { text: 'Eager to leverage it for a competitive edge.', value: 'champion' },
      { text: 'Inspired to build completely new things with it.', value: 'innovator' },
    ]
  },
  {
    id: 'q8', section: 2, sectionName: 'AI Comfort',
    text: 'If AI could help with one thing in your daily work, what would it be?',
    options: [
      { text: 'Automating repetitive tasks so I can focus on growth.', value: 'trailblazer' },
      { text: 'Creating better resources and documentation for my team.', value: 'guide' },
      { text: 'Improving communication and collaboration tools.', value: 'connector' },
      { text: 'Discovering patterns and insights I would never find.', value: 'explorer' },
      { text: 'Giving me real-time analytics on my performance.', value: 'champion' },
      { text: 'Generating creative ideas and prototypes.', value: 'innovator' },
    ]
  },
  {
    id: 'q9', section: 2, sectionName: 'AI Comfort',
    text: 'How would you describe your current AI usage?',
    options: [
      { text: 'I use it regularly with a structured approach.', value: 'trailblazer' },
      { text: 'I help others learn to use it.', value: 'guide' },
      { text: 'I use it mostly when colleagues recommend tools.', value: 'connector' },
      { text: 'I experiment with many different AI tools.', value: 'explorer' },
      { text: 'I track how much time and effort AI saves me.', value: 'champion' },
      { text: 'I push AI tools to do things they weren\'t designed for.', value: 'innovator' },
    ]
  },
  {
    id: 'q10', section: 2, sectionName: 'AI Comfort',
    text: 'What concerns you most about AI adoption?',
    options: [
      { text: 'Not having a clear path to measure my progress.', value: 'trailblazer' },
      { text: 'People being left behind who need more support.', value: 'guide' },
      { text: 'The loss of human connection in our workflows.', value: 'connector' },
      { text: 'Being limited to predefined use cases.', value: 'explorer' },
      { text: 'Others getting ahead of me.', value: 'champion' },
      { text: 'AI being too rigid and not creative enough.', value: 'innovator' },
    ]
  },
  {
    id: 'q11', section: 2, sectionName: 'AI Comfort',
    text: 'When an AI tool gives you an unexpected result, you typically:',
    options: [
      { text: 'Refine my prompt systematically until I get it right.', value: 'trailblazer' },
      { text: 'Document the issue to help others avoid it.', value: 'guide' },
      { text: 'Ask others if they\'ve experienced the same thing.', value: 'connector' },
      { text: 'Get excited — unexpected results can be interesting.', value: 'explorer' },
      { text: 'Get frustrated — I need accurate results to win.', value: 'champion' },
      { text: 'See it as an opportunity to discover new capabilities.', value: 'innovator' },
    ]
  },
  {
    id: 'q12', section: 2, sectionName: 'AI Comfort',
    text: 'How do you prefer to learn about new AI capabilities?',
    options: [
      { text: 'Step-by-step courses with certifications.', value: 'trailblazer' },
      { text: 'Workshops where I can share with others.', value: 'guide' },
      { text: 'Group learning sessions with discussion.', value: 'connector' },
      { text: 'Self-directed exploration and experimentation.', value: 'explorer' },
      { text: 'Competitive challenges and hackathons.', value: 'champion' },
      { text: 'Reverse-engineering and building custom solutions.', value: 'innovator' },
    ]
  },
  // Section 3: Learning Style (6 questions)
  {
    id: 'q13', section: 3, sectionName: 'Learning Style',
    text: 'When starting a new online course, you prefer:',
    options: [
      { text: 'A clear roadmap with measurable milestones.', value: 'trailblazer' },
      { text: 'Content I can later share or teach to others.', value: 'guide' },
      { text: 'A cohort or study group to go through it together.', value: 'connector' },
      { text: 'Freedom to jump between topics that interest me.', value: 'explorer' },
      { text: 'Quizzes and scores to benchmark my progress.', value: 'champion' },
      { text: 'Hands-on projects where I build something new.', value: 'innovator' },
    ]
  },
  {
    id: 'q14', section: 3, sectionName: 'Learning Style',
    text: 'How much time can you commit to learning AI skills daily?',
    options: [
      { text: '30+ minutes — I\'m disciplined about learning time.', value: 'trailblazer' },
      { text: '20 minutes, plus time helping colleagues.', value: 'guide' },
      { text: '15-20 minutes, ideally with others.', value: 'connector' },
      { text: 'It varies — I follow my curiosity.', value: 'explorer' },
      { text: 'As much as it takes to stay ahead.', value: 'champion' },
      { text: 'I learn by doing, so it blends with work.', value: 'innovator' },
    ]
  },
  {
    id: 'q15', section: 3, sectionName: 'Learning Style',
    text: 'What type of content do you find most engaging?',
    options: [
      { text: 'Structured tutorials with progressive difficulty.', value: 'trailblazer' },
      { text: 'Case studies showing real-world impact.', value: 'guide' },
      { text: 'Discussion forums and community stories.', value: 'connector' },
      { text: 'Interactive sandboxes and playgrounds.', value: 'explorer' },
      { text: 'Timed challenges with leaderboards.', value: 'champion' },
      { text: 'Experimental labs and innovation challenges.', value: 'innovator' },
    ]
  },
  {
    id: 'q16', section: 3, sectionName: 'Learning Style',
    text: 'When you hit a roadblock while learning, you:',
    options: [
      { text: 'Review the material methodically until it clicks.', value: 'trailblazer' },
      { text: 'Look for ways to explain it to someone else.', value: 'guide' },
      { text: 'Reach out to a friend or community for help.', value: 'connector' },
      { text: 'Take a different angle and explore alternative approaches.', value: 'explorer' },
      { text: 'Push through — giving up is not an option.', value: 'champion' },
      { text: 'Find a hack or shortcut around the problem.', value: 'innovator' },
    ]
  },
  {
    id: 'q17', section: 3, sectionName: 'Learning Style',
    text: 'Your ideal achievement notification would say:',
    options: [
      { text: '"New skill unlocked: Advanced Prompt Engineering"', value: 'trailblazer' },
      { text: '"5 people learned from your shared resource"', value: 'guide' },
      { text: '"Your team completed the challenge together!"', value: 'connector' },
      { text: '"You discovered a new feature before 95% of users"', value: 'explorer' },
      { text: '"You\'re #1 on this week\'s leaderboard!"', value: 'champion' },
      { text: '"Your workflow was featured as an innovation"', value: 'innovator' },
    ]
  },
  {
    id: 'q18', section: 3, sectionName: 'Learning Style',
    text: 'What would make you most likely to return to this platform daily?',
    options: [
      { text: 'A clear streak counter and progress tracker.', value: 'trailblazer' },
      { text: 'Seeing the impact I\'m having on others.', value: 'guide' },
      { text: 'Active community discussions and peer activity.', value: 'connector' },
      { text: 'New features and content to explore every day.', value: 'explorer' },
      { text: 'Daily challenges with competitive rankings.', value: 'champion' },
      { text: 'New experimental tools and beta features.', value: 'innovator' },
    ]
  },
];

export const learningModules = [
  { id: 'm1', title: 'Introduction to AI Assistants', category: 'Basics', duration: '15 min', difficulty: 'Beginner', completed: true, rating: 4 },
  { id: 'm2', title: 'Crafting Effective Prompts', category: 'Prompt Engineering', duration: '20 min', difficulty: 'Beginner', completed: true, rating: 5 },
  { id: 'm3', title: 'AI for Email & Communication', category: 'Productivity', duration: '25 min', difficulty: 'Beginner', completed: true, rating: 4 },
  { id: 'm4', title: 'Advanced Prompt Techniques', category: 'Prompt Engineering', duration: '30 min', difficulty: 'Intermediate', completed: false, progress: 60 },
  { id: 'm5', title: 'AI-Powered Data Analysis', category: 'Data', duration: '35 min', difficulty: 'Intermediate', completed: false, locked: false },
  { id: 'm6', title: 'Workflow Automation with AI', category: 'Automation', duration: '40 min', difficulty: 'Intermediate', completed: false, locked: false },
  { id: 'm7', title: 'AI Ethics & Responsible Use', category: 'Ethics', duration: '20 min', difficulty: 'Beginner', completed: false, locked: true },
  { id: 'm8', title: 'Custom AI Solutions', category: 'Advanced', duration: '45 min', difficulty: 'Advanced', completed: false, locked: true },
  { id: 'm9', title: 'AI for Team Collaboration', category: 'Teamwork', duration: '30 min', difficulty: 'Intermediate', completed: false, locked: true },
  { id: 'm10', title: 'Building AI Workflows', category: 'Advanced', duration: '50 min', difficulty: 'Advanced', completed: false, locked: true },
  { id: 'm11', title: 'AI Strategy & Leadership', category: 'Leadership', duration: '35 min', difficulty: 'Advanced', completed: false, locked: true },
  { id: 'm12', title: 'AI Mastery Capstone', category: 'Capstone', duration: '60 min', difficulty: 'Expert', completed: false, locked: true },
];

export const quickWins = [
  { id: 'qw1', title: 'Write a better email', time: '5 min', difficulty: 'Easy', description: 'Use AI to draft, refine, and send a professional email in minutes.' },
  { id: 'qw2', title: 'Summarize a document', time: '3 min', difficulty: 'Easy', description: 'Upload any document and get a concise summary with key points.' },
  { id: 'qw3', title: 'Generate meeting notes', time: '5 min', difficulty: 'Easy', description: 'Turn raw meeting transcripts into organized action items.' },
  { id: 'qw4', title: 'Create a presentation outline', time: '7 min', difficulty: 'Medium', description: 'Generate a structured presentation outline from a topic brief.' },
  { id: 'qw5', title: 'Automate a data report', time: '10 min', difficulty: 'Medium', description: 'Set up an AI-powered report that generates insights automatically.' },
  { id: 'qw6', title: 'Build a custom prompt template', time: '8 min', difficulty: 'Medium', description: 'Create reusable prompt templates for your most common tasks.' },
];
