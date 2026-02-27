/**
 * ============================================
 * 📱 SIDEBAR — Sidebar.tsx
 * ============================================
 *
 * The main navigation sidebar for the app.
 * It has TWO modes:
 *
 * 🖥️ DESKTOP (≥1024px):
 *   - Fixed sidebar on the left side of the screen
 *   - Can be collapsed (icons only) or expanded (icons + labels)
 *   - Animated width change using Framer Motion
 *
 * 📱 MOBILE (<1024px):
 *   - Hidden by default
 *   - Opens as a slide-in drawer from the left
 *   - Dark backdrop overlay behind it
 *   - Close by tapping X or clicking the backdrop
 *
 * NAVIGATION ITEMS:
 *   🏠 Dashboard  →  /app/dashboard
 *   📖 Learn      →  /app/learn
 *   👥 Community   →  /app/community
 *   💬 Messages   →  /app/messages
 *   👤 Profile    →  /app/profile
 *
 * HINT: To add a new nav item, just add an entry to the
 * `navItems` array below with an icon, label, and path.
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Home,
  BookOpen,
  Users,
  User,
  ChevronRight,
  ChevronLeft,
  LogOut,
  MessageCircle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';       // Utility for combining CSS class names
import { useUser } from '../context/UserContext';

// ============================================
// SECTION 1: PROPS TYPE
// ============================================
// These are the values passed from AppLayout → Sidebar

interface SidebarProps {
  collapsed: boolean;                          // Is the desktop sidebar collapsed?
  setCollapsed: (collapsed: boolean) => void;  // Toggle collapsed state
  mobileOpen: boolean;                         // Is the mobile drawer open?
  setMobileOpen: (open: boolean) => void;      // Toggle mobile drawer
}

// ============================================
// SECTION 2: MAIN COMPONENT
// ============================================

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();   // Tells us the current URL path
  const { logout } = useUser();

  // ---- Navigation Items ----
  // HINT: Add new pages here! Just add { icon, label, path }
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/app/dashboard' },
    { icon: BookOpen, label: 'Learn', path: '/app/learn' },
    { icon: Users, label: 'Community', path: '/app/community' },
    { icon: MessageCircle, label: 'Messages', path: '/app/messages' },
    { icon: User, label: 'Profile', path: '/app/profile' },
  ];

  // ---- Handle Navigation Click ----
  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);   // Close mobile drawer after navigating
  };

  // ============================================
  // SECTION 3: SIDEBAR CONTENT (shared by desktop & mobile)
  // ============================================
  // This function generates the sidebar content.
  // `isMobile` flag controls small layout differences.

  const sidebarContent = (isMobile: boolean) => (
    <div className={clsx(
      "bg-white h-screen flex flex-col",
      isMobile ? "w-[260px]" : ""
    )}>

      {/* ---- Header / Logo ---- */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Purple "A" logo */}
          <div className="w-8 h-8 bg-[#5236ab] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {/* App name (hidden when desktop sidebar is collapsed) */}
          {(isMobile || !collapsed) && (
            <span className="font-bold text-gray-800 text-lg whitespace-nowrap">
              BeSciAI
            </span>
          )}
        </div>
        {/* Close button (mobile only) */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* ---- Navigation Links ---- */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
        {navItems.map((item) => {
          // Check if this nav item matches the current URL
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group relative w-full text-left",
                isActive
                  ? "bg-[#f2f1f9] text-[#5236ab]"          // Active: purple tint
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"  // Inactive
              )}
            >
              {/* Nav icon */}
              <item.icon
                size={20}
                className={clsx("shrink-0", isActive ? "text-[#5236ab]" : "text-gray-500 group-hover:text-gray-700")}
              />

              {/* Nav label (hidden when collapsed on desktop) */}
              {(isMobile || !collapsed) && (
                <span className="whitespace-nowrap overflow-hidden text-sm font-medium">
                  {item.label}
                </span>
              )}

              {/* Tooltip popup (only when desktop sidebar is collapsed) */}
              {!isMobile && collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}

              {/* Purple active indicator bar on the left */}
              {isActive && (isMobile || !collapsed) && (
                <motion.div
                  layoutId={isMobile ? "mobileActiveIndicator" : "activeIndicator"}
                  className="absolute left-0 w-1 h-6 bg-[#5236ab] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ---- Footer Actions ---- */}
      <div className="p-2 border-t border-gray-100 flex flex-col gap-2">
        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden text-sm font-medium">
                Collapse
              </span>
            )}
          </button>
        )}

        {/* Sign Out button */}
        <button
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-colors w-full"
          onClick={() => {
            logout();
            navigate('/');
            setMobileOpen(false);
          }}
        >
          <LogOut size={20} />
          {(isMobile || !collapsed) && (
            <span className="whitespace-nowrap overflow-hidden text-sm font-medium">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // ============================================
  // SECTION 4: RENDER — Desktop + Mobile
  // ============================================

  return (
    <>
      {/* DESKTOP SIDEBAR — Fixed on the left, hidden on mobile */}
      <motion.div
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex bg-white border-r border-gray-200 h-screen flex-col fixed left-0 top-0 z-50 shadow-sm"
      >
        {sidebarContent(false)}
      </motion.div>

      {/* MOBILE DRAWER — Slides in from the left with backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
              onClick={() => setMobileOpen(false)}   // Tap backdrop to close
            />
            {/* Slide-in drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 h-screen z-[70] lg:hidden shadow-xl"
            >
              {sidebarContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}