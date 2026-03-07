/**
 * ============================================
 * 🗺️ ROUTES — routes.tsx
 * ============================================
 * 
 * This file is the "map" of the entire app.
 * It tells React which component to show for each URL.
 * 
 * Route Structure:
 * 
 *   /                → Landing Page (home/marketing page)
 *   /survey          → Archetype Assessment Survey
 *   /reveal          → Shows your archetype result
 *   /onboarding      → Set your goals & preferences
 *   /app/dashboard   → Main dashboard (requires sidebar layout)
 *   /app/learn       → Learning modules
 *   /app/community   → Community & peers
 *   /app/messages    → Chat with peers
 *   /app/profile     → Your profile & settings
 *   /*               → 404 Not Found page
 * 
 * HINT: To add a new page:
 * 1. Create a new component in pages/
 * 2. Import it at the top of this file
 * 3. Add a new { path: "...", element: <YourPage /> } entry below
 */

import { createBrowserRouter, redirect } from "react-router";

/* ---- Layout Components ---- */
import RootLayout from "./layouts/RootLayout";       // Bare wrapper for public pages
import AppLayout from "./layouts/AppLayout";         // Layout with sidebar for app pages

/* ---- Public Pages (no login needed) ---- */
import LandingPage from "./pages/public/LandingPage";
import SurveyPage from "./pages/public/SurveyPage";
import RevealPage from "./pages/public/RevealPage";
import OnboardingPage from "./pages/public/OnboardingPage";

/* ---- App Pages (inside the dashboard with sidebar) ---- */
import DashboardPage from "./pages/app/DashboardPage";
import LearnPage from "./pages/app/LearnPage";
import CommunityPage from "./pages/app/CommunityPage";
import ProfilePage from "./pages/app/ProfilePage";
import MessagesPage from "./pages/app/MessagesPage";
import ChallengeDetailPage from "./pages/app/ChallengeDetailPage";
import ChallengeWorkspacePage from "./pages/app/ChallengeWorkspacePage";
import ChallengeSubmitPage from "./pages/app/ChallengeSubmitPage";
import ChallengeResultsPage from "./pages/app/ChallengeResultsPage";
import TrainingDetailPage from "./pages/app/TrainingDetailPage";
import TrainingStartPage from "./pages/app/TrainingStartPage";
import MicroLearningViewerPage from "./pages/app/MicroLearningViewerPage";
import PromptDetailPage from "./pages/app/PromptDetailPage";
import ResourceDetailPage from "./pages/app/ResourceDetailPage";
import OfficeHoursPage from "./pages/app/OfficeHoursPage";
import PromptLibraryPage from "./pages/app/PromptLibraryPage";
import ResourcesPage from "./pages/app/ResourcesPage";

/* ---- Error/Fallback Pages ---- */
import NotFoundPage from "./pages/NotFoundPage";

// ============================================
// ROUTER CONFIGURATION
// ============================================
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,  // All pages are wrapped in RootLayout
    children: [

      /* ---- PUBLIC ROUTES ---- */
      /* These pages don't have a sidebar — they're the "onboarding flow" */
      {
        index: true,                    // "/" → Landing Page
        element: <LandingPage />,
      },
      {
        path: "survey",                 // "/survey" → Assessment Quiz
        element: <SurveyPage />,
      },
      {
        path: "reveal",                 // "/reveal" → Archetype Result
        element: <RevealPage />,
      },
      {
        path: "onboarding",            // "/onboarding" → Goal Setting
        element: <OnboardingPage />,
      },

      /* ---- APP ROUTES (with sidebar) ---- */
      /* These pages share the AppLayout which includes sidebar + ByteBot */
      {
        path: "app",
        element: <AppLayout />,         // Wraps children with Sidebar + header
        children: [
          {
            index: true,
            loader: () => redirect("/app/dashboard"),  // "/app" → redirects to dashboard
          },
          {
            path: "dashboard",          // "/app/dashboard"
            element: <DashboardPage />,
          },
          {
            path: "office-hours",       // "/app/office-hours"
            element: <OfficeHoursPage />,
          },
          {
            path: "prompt-library",     // "/app/prompt-library"
            element: <PromptLibraryPage />,
          },
          {
            path: "resources",          // "/app/resources"
            element: <ResourcesPage />,
          },
          {
            path: "learn",              // "/app/learn"
            element: <LearnPage />,
          },
          {
            path: "learn/challenges/:challengeId",                    // "/app/learn/challenges/:id"
            element: <ChallengeDetailPage />,
          },
          {
            path: "learn/challenges/:challengeId/workspace",           // "/app/learn/challenges/:id/workspace"
            element: <ChallengeWorkspacePage />,
          },
          {
            path: "learn/challenges/:challengeId/submit",             // "/app/learn/challenges/:id/submit"
            element: <ChallengeSubmitPage />,
          },
          {
            path: "learn/challenges/:challengeId/results",             // "/app/learn/challenges/:id/results"
            element: <ChallengeResultsPage />,
          },
          {
            path: "learn/trainings/:trainingId",
            element: <TrainingDetailPage />,
          },
          {
            path: "learn/trainings/:trainingId/start",
            element: <TrainingStartPage />,
          },
          {
            path: "learn/micro/:microId",
            element: <MicroLearningViewerPage />,
          },
          {
            path: "learn/prompts/:promptId",
            element: <PromptDetailPage />,
          },
          {
            path: "learn/resources/:resourceId",
            element: <ResourceDetailPage />,
          },
          {
            path: "community",          // "/app/community"
            element: <CommunityPage />,
          },
          {
            path: "profile",            // "/app/profile"
            element: <ProfilePage />,
          },
          {
            path: "messages",           // "/app/messages"
            element: <MessagesPage />,
          },
        ],
      },

      /* ---- 404 FALLBACK ---- */
      {
        path: "*",                      // Any unmatched URL → Not Found
        element: <NotFoundPage />,
      },
    ],
  },
]);