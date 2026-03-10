/**
 * ============================================
 * 📐 APP LAYOUT — AppLayout.tsx
 * ============================================
 *
 * This layout wraps all "/app/*" pages (Dashboard, Learn, etc.).
 * It provides the consistent structure users see after onboarding:
 *
 *   ┌──────────┬───────────────────────────┐
 *   │          │  Mobile Top Bar (≡ menu)  │  ← Only on mobile
 *   │ Sidebar  ├───────────────────────────┤
 *   │ (fixed)  │                           │
 *   │          │  Page Content (<Outlet/>) │
 *   │          │                           │
 *   └──────────┴───────────────────────────┘
 *                              ByteBot FAB ↗  ← AI chat button
 *
 * KEY CONCEPTS:
 * - Desktop (≥1024px): Fixed sidebar on the left
 * - Mobile (<1024px): Hidden sidebar + hamburger menu top bar
 * - <Outlet /> renders the current page (Dashboard, Learn, etc.)
 * - <ByteBot /> is the floating AI assistant button
 *
 * HINT: The sidebar width dynamically changes (64px collapsed,
 * 240px expanded), so we use a <style> tag to match padding.
 */

import React, { useState } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar } from '../components/Sidebar';
import { ByteBot } from '../components/ByteBot';
import { Menu } from 'lucide-react';
import ChallengeGuidedTour from '../components/ChallengeGuidedTour';
import { ChallengeTourProvider } from '../context/ChallengeTourContext';

export default function AppLayout() {
  // ---- State ----
  const [collapsed, setCollapsed] = useState(false);     // Desktop: is sidebar collapsed?
  const [mobileOpen, setMobileOpen] = useState(false);   // Mobile: is drawer open?
  const location = useLocation();
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';

  return (
    <ChallengeTourProvider>
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--app-bg)', fontFamily: "var(--font-primary)" }}>

      {/* ============================================ */}
      {/* SECTION 1: SIDEBAR                          */}
      {/* Desktop: fixed left sidebar                 */}
      {/* Mobile: off-canvas drawer (controlled by mobileOpen) */}
      {/* ============================================ */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ============================================ */}
      {/* GLOBAL LOADING INDICATOR                    */}
      {/* ============================================ */}
      {isNavigating && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
          style={{
            background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
            boxShadow: '0 0 10px rgba(79,70,229,0.6)',
          }}
        />
      )}

      {/* ============================================ */}
      {/* SECTION 2: MOBILE TOP BAR                   */}
      {/* Only visible on screens smaller than 1024px */}
      {/* Contains hamburger menu + app logo          */}
      {/* ============================================ */}
      <div
        className="sticky top-0 z-40 flex lg:hidden items-center gap-3 px-4 py-3 transition-colors duration-300"
        style={{ backgroundColor: 'var(--app-surface)', borderBottom: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
      >
        {/* Hamburger menu button */}
        <motion.button
          onClick={() => setMobileOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="p-2 -ml-1 rounded-lg cursor-pointer"
          style={{ color: 'var(--app-text-primary)' }}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </motion.button>

        {/* App logo + name */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#5236ab] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-base" style={{ color: 'var(--app-text-primary)' }}>BeSciAI</span>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECTION 3: MAIN PAGE CONTENT                */}
      {/* <Outlet /> renders the current child route  */}
      {/* (DashboardPage, LearnPage, etc.)            */}
      {/* ============================================ */}
      <main className="transition-all duration-300 ease-in-out">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1280px] mx-auto">
          {/* Dynamic padding to offset the fixed sidebar on desktop */}
          <style>{`
            @media (min-width: 1024px) {
              main { padding-left: ${collapsed ? 64 : 240}px !important; }
            }
          `}</style>

          {/* This renders the current page based on the URL with a smooth transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ============================================ */}
      {/* SECTION 4: BYTEBOT (AI CHAT ASSISTANT)      */}
      {/* Floating action button in the bottom-right  */}
      {/* ============================================ */}
      <ByteBot />

      {/* Challenge walkthrough — start from "Show me around", skip anytime */}
      <ChallengeGuidedTour />
    </div>
    </ChallengeTourProvider>
  );
}