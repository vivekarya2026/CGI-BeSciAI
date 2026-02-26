import { createBrowserRouter, redirect } from "react-router";
import RootLayout from "./layouts/RootLayout";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/public/LandingPage";
import SurveyPage from "./pages/public/SurveyPage";
import RevealPage from "./pages/public/RevealPage";
import OnboardingPage from "./pages/public/OnboardingPage";
import DashboardPage from "./pages/app/DashboardPage";
import LearnPage from "./pages/app/LearnPage";
import CommunityPage from "./pages/app/CommunityPage";
import ProfilePage from "./pages/app/ProfilePage";
import MessagesPage from "./pages/app/MessagesPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "survey",
        element: <SurveyPage />,
      },
      {
        path: "reveal",
        element: <RevealPage />,
      },
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "app",
        element: <AppLayout />,
        children: [
          {
            index: true,
            loader: () => redirect("/app/dashboard"),
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "learn",
            element: <LearnPage />,
          },
          {
            path: "community",
            element: <CommunityPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "messages",
            element: <MessagesPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);