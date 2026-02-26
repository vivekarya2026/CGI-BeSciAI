🏗️ Technical Specifications
Layout Structure

Type: Webapp with collapsible sidebar navigation
Responsive: Desktop-first, tablet and mobile adaptive
Sidebar:

Collapsed: 64px width (icons only)
Expanded: 240px width (icons + labels)
Smooth toggle animation (300ms ease-in-out)
Persistent state across sessions
Hover states trigger tooltip labels when collapsed



Design System Reference

Use existing design system guidelines for:

Color palette
Typography scale
Spacing system
Component library
Icon set
Shadow styles




🎭 Archetype System Integration
Six User Archetypes (HEXAD to User-Facing)

The Trailblazer (Achiever) - "Master the summit"

Primary color: Amber/Gold
Icon: Mountain peak
Motivation: Self-directed mastery, structured skill building


The Guide (Philanthropist) - "Light the way"

Primary color: Teal/Cyan
Icon: Lantern/Lighthouse
Motivation: Impact at scale, help others


The Connector (Socializer) - "Stronger together"

Primary color: Purple/Violet
Icon: Network nodes
Motivation: Team activities, collaboration


The Explorer (Free Spirit) - "Chart your course"

Primary color: Sky Blue
Icon: Compass
Motivation: Freedom, experimentation


The Champion (Player) - "Claim the prize"

Primary color: Red/Crimson
Icon: Trophy
Motivation: Competition, rewards


The Innovator (Disruptor) - "Break the mold"

Primary color: Electric Green
Icon: Lightbulb/Spark
Motivation: Innovation, experimentation



Fogg Behavior Model Quadrants
Display subtly as secondary classification:

Self-Directed Learner (ENABLE) - "Freedom to explore"
Skill Builder (TRAIN) - "Structured support"
Untapped Potential (NUDGE) - "Show the value"
Supported Starter (START_TINY) - "One step at a time"


📋 Complete Page Structure & Components
1. PRE-AUTHENTICATION FLOW
1.1 Email: Survey Invitation

Email template preview mockup
Clear CTA button: "Take the Assessment"
Preview text highlighting benefits

1.2 Survey Landing Page
Components:

Hero section with value proposition
"Why Take This Survey" - 3 benefit cards with icons
"What You'll Get" - Preview of archetype reveal
Time estimate badge: "8-10 minutes"
Survey Type Selection (prominent):

Option A: Adaptive Survey (25-30 questions) - Recommended badge
Option B: Full Survey (60 questions) - "Most accurate" badge


Primary CTA: "Start Assessment"

1.3 Survey Flow (Adaptive/Full)
Progressive UI with sections:
Global Elements:

Fixed header with:

Progress bar (fills left to right)
Section indicator: "1/3" or "2/3" or "3/3"
Save & Exit button (right corner, secondary style)
Skip to Dashboard link (for returning users)


Question counter per section
Navigation: Back/Next buttons
Save indicator: Auto-save status with timestamp

Section 1: Work Style (Progress: 1/3)

Title card with transition animation
6-10 MCQ questions (radio buttons)
Visual question cards with:

Question text (clear typography)
4-5 answer options
Optional question helper tooltip


Transition screen: "Quick Insight" with animated icon

Section 2: AI Comfort (Progress: 2/3)

8-12 MCQ questions
Mix of multiple choice and rating scales (1-5 stars)
Transition screen: "Archetype Hint" - teaser animation showing partial archetype reveal

Section 3: Learning Style (Progress: 3/3)

6-10 MCQ questions
Some questions may have image-based options
Completion celebration micro-animation
"Analyzing your responses..." loading state

1.4 Survey Analysis & AI Processing
Loading Experience:

Animated visualization showing:

"Analyzing your responses..."
"Identifying your archetype..."
"Personalizing your path..."


Progress indicators (60% → 80% → 100%)
Duration: 3-5 seconds

1.5 Archetype Reveal Page
Dramatic Reveal Sequence:

Fade in archetype icon (large, animated)
Archetype name reveal: "You are... The Trailblazer"
Tagline appears: "Master the summit"
Primary/secondary color scheme applied

Content Sections:

Your Archetype Card

Large hero illustration
Archetype name + tagline
Fogg quadrant badge (subtle)


Archetype Explanation

2-3 paragraph description
Key characteristics (4-5 traits with icons)
Motivational drivers


Personalized Insights

"What this means for you" section
Strengths breakdown
Potential challenges
3 quick tips cards


Recommended Path Preview

Suggested learning modules (3-4 cards)
Tailored quick wins
CTA: "Build Your Adoption Plan"



1.6 Platform Login/Signup
Quick Registration:

Email/password or SSO options
"Continue as [Archetype]" context
Terms acceptance checkbox
CTA: "Create My Account"

1.7 Adoption Goal Setting
Onboarding Flow (3 steps):
Step 1: Select Primary Goal

Card-based selection (3-4 large goal cards):

"Increase Productivity"
"Enhance Creativity"
"Improve Decision Making"
"Streamline Workflows"


Each card shows expected outcomes

Step 2: Choose Focus Areas

Multi-select chips/tags:

Writing & Communication
Data Analysis
Code & Development
Research & Learning
Design & Creativity
Project Management


Minimum 2, maximum 4 selections

Step 3: Set Timeline & Commitment

Slider for timeline: 2 weeks → 3 months
Commitment level:

Light (10 min/day)
Moderate (20 min/day)
Intensive (30+ min/day)


CTA: "Launch My Dashboard"


2. MAIN APPLICATION INTERFACE
Global Navigation: Collapsible Sidebar
Collapsed State (64px):

Logo icon (top)
Navigation icons (vertical stack):

Home/Dashboard
Learn
Community
My Profile


Settings icon (bottom)
Expand toggle (arrow icon, bottom)
Hover tooltips for each icon

Expanded State (240px):

Logo + wordmark (top)
Navigation with icons + labels:

Dashboard
Learn
Community
My Profile


Active state indicator (vertical bar + background highlight)
Settings (bottom)
Collapse toggle
User avatar + name (bottom)

Animation Specifications:

Sidebar transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
Icon rotation: 200ms ease-in-out
Label fade in/out: 150ms
Hover state: 100ms ease


3. DASHBOARD/HOME TAB
3.1 Dashboard Header

Welcome message: "Welcome back, [Name]"
Archetype badge with icon (clickable → profile)
Current streak counter with flame icon
Quick stats row:

Modules completed
Skills earned
Time saved



3.2 Your Progress Overview (Hero Section)
Large Card with Tabs:

Tab 1: Complete Path

Visual journey map (timeline style)
Milestones with progress indicators
Next major milestone highlighted


Tab 2: Quick Path

Condensed view with percentage complete
Key checkpoints only
"Jump to next step" CTA



Progress Visualizations:

Circular progress ring for overall completion
Mini progress bars for each learning track
XP/Points counter (for Champion archetype)
Badges earned display

3.3 Recommended Next Steps
Personalized Card Stack (3-4 cards):

Each card shows:

Module/lesson title
Estimated time
Difficulty badge
Archetype-specific relevance indicator
"Start Now" CTA


Cards have subtle hover lift animation

3.4 Upcoming Milestones
Timeline Widget:

Horizontal timeline with markers
Next 3-5 milestones
Countdown to next achievement
Reward preview icons

3.5 Personalized Dashboard Widget
Based on Archetype:

Trailblazer: Skill mastery tracker
Guide: Impact metrics (people helped)
Connector: Team activity feed
Explorer: New features to try
Champion: Leaderboard position
Innovator: Experimental features

3.6 Peer Activity Feed
Real-time Updates:

Avatar + name + activity
"[User] completed [Module]"
"[User] earned [Badge]"
"[User] shared a workflow"
Engagement options: Like, Comment
Load more/infinite scroll


4. LEARN TAB
4.1 Learn Tab Navigation (Sub-tabs)

My Adoption Path
Quick Wins
Resources Library
Skill Assessments


4.2 My Adoption Path
Main View:
Completed Modules Section:

Grid/list of completed modules
Each card shows:

Module thumbnail
Title
Completion date
Star rating
"Review" CTA


Filter: By category, date, rating

Current Module (Highlighted):

Large featured card
Progress bar within module
Current lesson highlighted
"Continue Learning" CTA
Estimated time to complete

Upcoming Modules:

Queue of next 5-6 modules
Locked/unlocked state indicators
Prerequisites shown with connecting lines
"Preview" hover state

Visual Design:

Timeline/path visualization connecting modules
Progress checkpoints with animations
Achievement badges appear on completion
Archetype-colored progress indicators


4.3 Quick Wins
Three Sub-sections:
Task-Based Solutions:

Card grid (6-8 cards)
Each card:

Task title: "Write a better email"
Time badge: "5 min"
Try it now CTA
Difficulty indicator


Modal/slide-out with step-by-step guide

5-Min Challenges:

Daily challenge card (prominent)
"Today's Challenge" header
Challenge description
Timer component
"Start Challenge" CTA
Past challenges archive

Daily Prompts:

Rotating prompt card
Creative prompt for practice
Example showcase
"Try this prompt" copy button
Share results option


4.4 Resources Library
Filterable Grid Layout:
Filter Sidebar:

Content type: All, Guides, Videos, Templates
Topic tags
Difficulty level
Duration range
Archetype relevance toggle

Resource Cards:
Workflow Guides:

Document icon
Title + description
Duration estimate
Bookmark icon
Download/View CTA

Best Practices:

Checklist icon
Title + preview
Author/source
Save for later

Prompt Templates:

Template icon
Template name
Use case description
"Copy Template" CTA
Customization options

Video Tutorials:

Video thumbnail
Duration overlay
Title
View count
Play button overlay

Search & Sort:

Search bar (top right)
Sort dropdown: Newest, Popular, Recommended, Duration
Results count


4.5 Skill Assessments
Assessment Dashboard:
Check Your Progress Section:

Skill meter visualization (radar chart or bars)
6-8 skill categories:

Prompt Engineering
Workflow Automation
AI Ethics & Best Practices
Advanced Techniques
Domain-Specific Skills


Color-coded proficiency levels
"Test Skill" buttons

Assessment Card Layout:

Assessment name
Skill area covered
Questions count
Estimated time
Current level indicator
"Start Assessment" CTA

Earn Certifications Section:

Certificate showcase
Requirements checklist
Progress toward certification
"Claim Certificate" CTA when complete


5. COMMUNITY TAB
5.1 Community Navigation (Sub-tabs)

Peer Progress
Success Stories
Discussion Forums
Champions Network


5.2 Peer Progress
Social Dashboard:
Trending Workflows:

Card carousel/grid
Each workflow card:

Workflow title
Creator name + avatar
Popularity metrics (likes, saves)
Preview description
"Try This Workflow" CTA


Filter: This week, This month, All time

Similar Archetypes:

Filter to show users with same archetype
User cards with:

Avatar + name
Archetype badge
Recent achievements
"Connect" button


Activity stream of similar users

Team Leaderboard:

Ranked list view
User row: Rank, Avatar, Name, Points/Score
Current user highlighted
Time period selector (Week/Month/All)
XP/contribution metrics
Archetype distribution chart


5.3 Success Stories
Inspiration Gallery:
Case Studies by Role:

Role filter chips (Marketing, Engineering, HR, etc.)
Story cards with:

Hero image
Role + company size
"How [Name] achieved [Outcome]"
Key metrics highlight (time saved, productivity increase)
"Read Full Story" CTA


Story detail view with before/after

Video Testimonials:

Video grid
Thumbnail with play icon
Name + title + archetype
Duration
Video modal player

Impact Metrics:

Aggregate statistics dashboard
Key metrics:

Total time saved across users
Adoption rate improvements
Productivity gains
User satisfaction scores


Filterable by industry, team size, archetype


5.4 Discussion Forums
Forum Interface:
Forum Categories:

Category list with:

Category name + description
Topic count
Latest activity timestamp
"Browse" CTA



Thread List View:

Sort by: Latest, Popular, Unanswered
Thread row:

Title
Author avatar + name + archetype badge
Reply count
Last activity
Tags


"New Discussion" CTA (prominent)

Thread Detail View:

Original post with:

Author info
Timestamp
Content
Attachments
Like/bookmark actions


Reply thread (nested)
Reply composer with rich text editor
"Mark as Solved" (for questions)

Get Feedback / Ask Questions / Share Workflows:

Separate sections or categories
Template-based post creation
File/workflow attachment support


5.5 Champions Network
Expert Connection Hub:
Connect with Experts:

Expert profiles grid
Profile card:

Avatar + name
Expertise areas (tags)
Archetype
Availability status
"Request Connection" CTA


Filter by expertise, availability, archetype

Join Office Hours:

Upcoming sessions calendar
Session card:

Date/time
Host name + avatar
Topic
Capacity (X/20 spots)
"Register" CTA


Past sessions: Recordings + transcripts

Find a Mentor:

Mentor matching interface
Interest/goal selection
Matched mentor suggestions
Profile detail view
"Request Mentorship" workflow
Mentorship dashboard (if active)


6. MY PROFILE TAB
6.1 Profile Navigation (Sub-sections)

Personal Info
My Archetype
My Goals
My Progress
My Workflows
Settings


6.2 Personal Info
Edit Profile Form:

Avatar upload (with crop tool)
Full name
Email (read-only/verified)
Job title
Department
Company
Bio (textarea, 200 char limit)
Social links (optional)
Preferences Section:

Email notifications toggles
Digest frequency
Learning reminders
Community updates


Notifications Settings:

Push notification toggles
In-app notifications
Notification sound


Save/Cancel buttons


6.3 My Archetype
Archetype Deep Dive:
Behavioral Insights:

Your archetype card (visual summary)
Strengths list with icons
Growth areas
Learning style preferences
Motivation drivers chart

Archetype Details:

Full description
How you learn best
Recommended learning paths
Ideal team roles
Communication preferences

Retake Survey:

"Your archetype may change over time"
Last taken date
"Retake Assessment" CTA
Note: This will update your entire profile


6.4 My Goals
Goal Management:
Current Goals Display:

Primary goal card (large)
Focus areas chips
Timeline progress bar
Commitment level indicator
Goal metrics/progress

Update Goals:

Edit current goals
Add new goals
Archive completed goals
Change timeline/commitment

Goal Progress:

Milestones toward goal
Completion percentage
Related modules completed
Suggested next actions


6.5 My Progress
Achievements Dashboard:
Time Saved Calculator:

Interactive calculator widget
Input: Tasks automated, time per task
Output: Total time saved
Visualization: Hours → Days → Weeks
Share achievement button

Adoption/Learning Stats:

Total learning hours
Modules completed
Streaks maintained
Login frequency chart
Activity heatmap (calendar view)

Skills/Milestone Earned:

Badge collection grid
Skill certifications
Achievement trophies
Hover for badge details
Share to community option

Completion Certificates:

Certificate showcase
Download/print options
Share on LinkedIn
Verified badge


6.6 My Workflows
Personal Workflow Library:
Bookmarked Resources:

Saved guides, videos, templates
Organized by tags/collections
Quick access
Notes/annotations

Custom Prompts:

Prompts you've created/modified
Edit/duplicate/delete
Share to community
Usage analytics

Saved Templates:

Your template collection
Last modified date
Use count
Quick copy buttons


6.7 Settings
System Settings:
Privacy Controls:

Profile visibility (Public/Connections only/Private)
Activity sharing toggles
Data export option
Account deletion

Feedback & Support:

Submit feedback form
Contact support
FAQ link
Feature requests

Integration Settings:

Connected apps/tools
API access (if applicable)
Slack/Teams integration
Calendar sync


🎨 Microinteractions & Animations
Button & Interactive Elements

Hover states:

Scale: 1.02
Shadow elevation increase
Color brightness +5%
Transition: 150ms ease-out


Click/Active states:

Scale: 0.98
Haptic feedback suggestion
Transition: 100ms ease-in


Loading states:

Spinner or skeleton loader
Progressive disclosure
Optimistic updates



Card Animations

Hover lift:

Transform: translateY(-4px)
Shadow: 0 8px 16px rgba(0,0,0,0.1)
Transition: 250ms cubic-bezier(0.4, 0, 0.2, 1)


Card reveal:

Fade in from opacity 0.7 to 1
Scale from 0.95 to 1
Stagger delay: 50ms per card



Progress Animations

Progress bars:

Fill animation: 800ms ease-out
Pulse effect on milestone reached
Color gradient shift


Circular progress:

Stroke dash animation
Clockwise fill
Number counter animation


Achievement unlock:

Badge scale in: 0 → 1.1 → 1
Glow/particle effect
Confetti animation (for major achievements)
Sound effect recommendation



Navigation Transitions

Page transitions:

Fade out/in: 300ms
Slide content: 400ms ease-in-out
Preserve scroll position where appropriate


Tab switching:

Content fade: 200ms
Indicator slide: 300ms ease-in-out


Modal/Dialog:

Backdrop fade in: 200ms
Modal scale in: 300ms cubic-bezier(0.34, 1.56, 0.64, 1)
Focus trap on open



Feedback Animations

Success actions:

Checkmark animation (draw SVG path)
Green flash/highlight
Toast notification slide in


Error states:

Shake animation (3 iterations, 10px amplitude)
Red border pulse
Error icon bounce


Loading states:

Skeleton screen for content
Shimmer effect
Spinner with brand color



Survey-Specific Animations

Question transitions:

Slide out left (old question)
Slide in right (new question)
Duration: 400ms ease-in-out


Progress bar:

Smooth fill animation
Celebration particle burst at section completion


Save indicator:

"Saved" checkmark fade in
Auto-hide after 2s



Gamification Animations

XP/Points gain:

Counter animation (rapid increment)
+50 XP flyup animation
Level up celebration


Streak counter:

Flame flicker animation
Number flip animation
Breaking streak warning shake


Leaderboard updates:

Rank change: smooth position swap
Highlight flash for current user
Trophy icon wiggle




📱 Responsive Behavior
Desktop (1440px+)

Sidebar expanded by default
3-column layouts where applicable
Larger cards and imagery
More white space

Tablet (768px - 1439px)

Sidebar collapsed by default
2-column layouts
Slightly condensed spacing
Touch-friendly targets (44px min)

Mobile (< 768px)

Bottom navigation bar replaces sidebar
Single column layouts
Full-width cards
Collapsible sections
Swipe gestures for navigation


🎯 Priority Features for Initial Design
Phase 1 (High Priority)

Survey flow (all 3 sections + reveal)
Dashboard/Home with progress overview
Learn Tab → My Adoption Path
Collapsible sidebar navigation
Basic profile page

Phase 2 (Medium Priority)

Quick Wins section
Resources Library
Community → Peer Progress
Goal setting flow

Phase 3 (Lower Priority)

Discussion Forums
Champions Network
Advanced profile settings
Success Stories


💡 Design Considerations
Accessibility

WCAG 2.1 AA compliance
Color contrast ratios: 4.5:1 minimum
Focus indicators visible
Screen reader friendly
Keyboard navigation support

Performance

Lazy load images and heavy components
Virtualized lists for long content
Optimistic UI updates
Skeleton screens during load

Personalization Hooks

Archetype-specific color accents
Custom greetings based on archetype
Tailored recommendations
Adaptive UI based on Fogg quadrant

Empty States

Illustrative empty state graphics
Clear CTAs to populate content
Helpful onboarding prompts

Error States

Clear error messages
Recovery suggestions
Support links


🔧 Component Library Needs
Core Components to Design

Navigation (sidebar, bottom nav, breadcrumbs)
Cards (content, profile, workflow, achievement)
Buttons (primary, secondary, tertiary, icon)
Form inputs (text, select, radio, checkbox, slider)
Progress indicators (bar, circular, timeline)
Modals and dialogs
Toast notifications
Badges and labels
Avatars and profile pics
Tabs and segmented controls
Empty states
Loading states
Error states

Archetype-Specific Components

Archetype badge (6 variants)
Personalized dashboard widgets (6 variants)
Progress visualizations (tailored to archetype)
Achievement cards (archetype-themed)


📐 Layout Grid System

Desktop: 12-column grid, 24px gutters
Tablet: 8-column grid, 20px gutters
Mobile: 4-column grid, 16px gutters
Max content width: 1280px
Container padding: 24px (desktop), 16px (mobile)


🎨 Design Tokens to Define
Based on your existing design system:
Colors

Primary palette (per archetype - 6 variants)
Neutral grays
Semantic colors (success, warning, error, info)
Background colors
Border colors

Typography

Font families (heading, body)
Font sizes (H1-H6, body, small, caption)
Font weights (light, regular, medium, bold)
Line heights
Letter spacing

Spacing

Spacing scale (4px base: 4, 8, 12, 16, 24, 32, 48, 64)

Borders & Radius

Border widths (1px, 2px)
Border radius (4px, 8px, 12px, 16px, 24px, full)

Shadows

Elevation levels (0-4)
Shadow values for each level

Transitions

Duration tokens (fast: 150ms, normal: 300ms, slow: 500ms)
Easing functions

