# BeSciAI — Behavioral Science AI Learning Platform

BeSciAI is a gamified AI literacy training platform built for CGI employees. It personalizes the
learning journey through six behavioral archetypes and delivers micro-learnings, challenges, and
community features in a modern web interface.

> **Figma Source:** [Capstone V2 Opus](https://www.figma.com/design/AUCxhBHGCYvEXZagBiwnHJ/Capstone-V2-Opus)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Archetype System](#archetype-system)
- [Design System](#design-system)
- [Contributing](#contributing)

---

## Tech Stack

| Category       | Technology                                   |
| -------------- | -------------------------------------------- |
| Framework      | React 18 + TypeScript                        |
| Build Tool     | Vite 6                                       |
| Styling        | Tailwind CSS 4 + CSS custom properties       |
| UI Components  | shadcn/ui + Radix UI primitives              |
| Routing        | React Router 7                               |
| Animations     | Motion (Framer Motion)                       |
| Charts         | Recharts                                     |
| Rich Text      | Quill + react-quill                          |
| Backend        | Supabase (KV store via Edge Functions)       |
| Deployment     | Vercel (auto-deploy on push to `main`)       |
| Analytics      | Microsoft Clarity                            |

---

## Project Structure

```
src/
├── main.tsx                   # App entry point — mounts React into index.html
├── styles/                    # Global CSS
│   ├── index.css              # Imports all style files
│   ├── fonts.css              # Font face declarations
│   ├── tailwind.css           # Tailwind base/utilities import
│   ├── theme.css              # Light/dark mode CSS variables (OKLCH)
│   ├── design-tokens.css      # CGI brand color scales and semantic tokens
│   └── components.css         # Global component styles (cards, badges, etc.)
├── imports/                   # AI context files for Figma Make (NOT runtime imports)
│   ├── design-system-guidelines.md
│   ├── technical-specs-archetypes.md
│   └── color-palette.css
└── app/
    ├── App.tsx                # Root component — wraps all providers
    ├── routes.tsx             # React Router route definitions (22 routes)
    ├── context/               # Global state via React Context
    │   ├── UserContext.tsx    # User profile, XP, progress (addXp, updateUser)
    │   ├── ThemeContext.tsx   # System/Light/Dark theme switching
    │   ├── AppContext.tsx     # Shared app-level state
    │   └── ChallengeTourContext.tsx  # Guided tour state for challenges
    ├── layouts/
    │   ├── RootLayout.tsx     # Bare wrapper for public (unauthenticated) pages
    │   └── AppLayout.tsx      # Sidebar + header shell for authenticated pages
    ├── pages/
    │   ├── public/            # Unauthenticated pages
    │   │   ├── LandingPage.tsx
    │   │   ├── SurveyPage.tsx       # Archetype quiz
    │   │   ├── RevealPage.tsx       # Archetype result reveal
    │   │   └── OnboardingPage.tsx
    │   └── app/               # Authenticated pages (require sidebar layout)
    │       ├── DashboardPage.tsx
    │       ├── LearnPage.tsx
    │       ├── ChallengesPage.tsx
    │       ├── ChallengeWorkspacePage.tsx
    │       ├── ChallengeDetailPage.tsx
    │       ├── ChallengeSubmitPage.tsx
    │       ├── ChallengeResultsPage.tsx
    │       ├── TrainingDetailPage.tsx
    │       ├── TrainingStartPage.tsx
    │       ├── MicroLearningViewerPage.tsx
    │       ├── PromptLibraryPage.tsx
    │       ├── PromptDetailPage.tsx
    │       ├── ResourcesPage.tsx
    │       ├── ResourceDetailPage.tsx
    │       ├── CommunityPage.tsx
    │       ├── MessagesPage.tsx
    │       ├── OfficeHoursPage.tsx
    │       └── ProfilePage.tsx
    ├── components/
    │   ├── Sidebar.tsx             # Main navigation sidebar (mobile + desktop)
    │   ├── ByteBot.tsx             # AI assistant chat widget
    │   ├── ChallengeGuidedTour.tsx # Step-by-step challenge onboarding tour
    │   ├── DashboardMiniMessages.tsx
    │   ├── DiscussionForum.tsx
    │   ├── HeaderStatsChips.tsx    # XP / streak / modules chips in header
    │   ├── LearnTour.tsx
    │   ├── NotificationsPanel.tsx
    │   ├── PasswordGate.tsx        # Demo password protection wrapper
    │   ├── figma/
    │   │   └── ImageWithFallback.tsx
    │   └── ui/                     # shadcn/ui component library (48 components)
    ├── data/
    │   ├── archetypes.ts      # Archetype definitions (colors, traits, motivations)
    │   ├── learnData.ts       # All trainings, challenges, micro-learnings, prompts
    │   └── statsConfig.ts     # Stat tile/chip styles (colors, icons, labels)
    ├── lib/
    │   ├── utils.ts           # cn() — Tailwind class merging utility
    │   ├── types.ts           # Shared TypeScript types (Archetype, UserProfile, etc.)
    │   ├── colors.ts          # Color constants and archetype color map
    │   └── supabase.ts        # Supabase project credentials (autogenerated)
    └── utils/
        └── colors.ts          # Extended color palette utilities
```

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

See [.env.example](.env.example) for all required variables. Never commit `.env.local`.

---

## Available Scripts

| Script            | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start Vite development server (HMR)          |
| `npm run build`   | Production build to `dist/`                  |
| `npm run preview` | Serve the production build locally           |
| `npm run lint`    | Run ESLint on all `.ts` / `.tsx` files       |
| `npm run format`  | Run Prettier formatter on `src/`             |

---

## Architecture

### Provider Stack

`App.tsx` wraps the entire application in this order (outermost to innermost):

```
PasswordGate            — blocks access behind a demo password
  └── ThemeProvider     — manages System / Light / Dark theme
        └── UserProvider    — shares user profile, XP, and progress app-wide
              └── RouterProvider  — React Router (all 22 routes)
```

### Route Structure

| Path | Component | Layout |
|------|-----------|--------|
| `/` | LandingPage | RootLayout (no sidebar) |
| `/survey` | SurveyPage | RootLayout |
| `/reveal` | RevealPage | RootLayout |
| `/onboarding` | OnboardingPage | RootLayout |
| `/app/dashboard` | DashboardPage | AppLayout (with sidebar) |
| `/app/learn` | LearnPage | AppLayout |
| `/app/challenges` | ChallengesPage | AppLayout |
| `/app/learn/challenges/:id/workspace` | ChallengeWorkspacePage | AppLayout |
| `/app/community` | CommunityPage | AppLayout |
| `/app/messages` | MessagesPage | AppLayout |
| `/app/profile` | ProfilePage | AppLayout |
| `/app/resources` | ResourcesPage | AppLayout |
| `/app/prompt-library` | PromptLibraryPage | AppLayout |
| `/app/office-hours` | OfficeHoursPage | AppLayout |
| `*` | NotFoundPage | — |

### Data Flow

- All user state lives in `UserContext` (`src/app/context/UserContext.tsx`).
- Call `addXp(amount)` from `useUser()` to award XP. See [`docs/POINTS_SPEC.md`](docs/POINTS_SPEC.md) for the full spec.
- All learning content (trainings, challenges, micro-learnings, prompts) is defined in `src/app/data/learnData.ts`.
- The Supabase Edge Function at `supabase/functions/server/` provides a persistent KV store for demo state.

---

## Archetype System

Users are assigned one of six behavioral archetypes after completing the onboarding survey.
Archetypes personalize the UI color theme, recommended content, and motivational messaging.

| Archetype    | Color           | Traits                            |
| ------------ | --------------- | --------------------------------- |
| Trailblazer  | Amber / Gold    | Bold, fast-moving, risk-tolerant  |
| Guide        | Teal / Cyan     | Methodical, teaching-oriented     |
| Connector    | Purple / Violet | Relationship-driven, collaborative|
| Explorer     | Sky Blue        | Curious, breadth-seeking          |
| Champion     | Red / Crimson   | Competitive, goal-driven          |
| Innovator    | Electric Green  | Creative, systems-thinker         |

Archetype definitions live in [`src/app/data/archetypes.ts`](src/app/data/archetypes.ts).

---

## Design System

- **CSS variables** for light/dark mode: [`src/styles/theme.css`](src/styles/theme.css)
- **CGI brand tokens** (Purple `#5236ab`, Red `#e31937`): [`src/styles/design-tokens.css`](src/styles/design-tokens.css)
- **Tailwind theme extensions** (brand colors, shadows, gradients): [`tailwind.config.ts`](tailwind.config.ts)
- **Full guidelines** (colors, typography, spacing, components): [`src/imports/design-system-guidelines.md`](src/imports/design-system-guidelines.md)

---

## Contributing

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
  (e.g., `feat: add XP badge`, `fix: sidebar collapse on mobile`, `docs: update README`)
- Run `npm run lint` and `npm run build` before opening a pull request
- The project auto-deploys to Vercel on every push to `main`
