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
  Clock,
  Lightbulb,
  Library,
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
  type NavItem = { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; path: string };
  const navItems: NavItem[] = [
    { icon: Home, label: 'Dashboard', path: '/app/dashboard' },
    { icon: BookOpen, label: 'Learn', path: '/app/learn' },
    { icon: Clock, label: 'Office Hours', path: '/app/office-hours' },
    { icon: Lightbulb, label: 'Prompt Library', path: '/app/prompt-library' },
    { icon: Library, label: 'Resources', path: '/app/resources' },
    { icon: Users, label: 'Community', path: '/app/community' },
    { icon: MessageCircle, label: 'Messages', path: '/app/messages' },
    { icon: User, label: 'Profile', path: '/app/profile' },
  ];

  // ---- Handle Navigation Click ----
  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // ============================================
  // SECTION 3: SIDEBAR CONTENT (shared by desktop & mobile)
  // ============================================
  // This function generates the sidebar content.
  // `isMobile` flag controls small layout differences.

  const sidebarContent = (isMobile: boolean) => (
    <div className={clsx(
      "h-screen flex flex-col transition-colors duration-300",
      isMobile ? "w-[260px]" : ""
    )} style={{ backgroundColor: 'var(--app-surface)' }}>

      {/* ---- Header / Logo ---- */}
      <div className="h-16 flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--app-border)' }}>
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Purple "A" logo */}
          <div className="w-8 h-8 bg-[#5236ab] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {/* App name (hidden when desktop sidebar is collapsed) */}
          {(isMobile || !collapsed) && (
            <span className="font-bold text-lg whitespace-nowrap" style={{ color: 'var(--app-text-primary)' }}>
              BeSciAI
            </span>
          )}
        </div>
        {/* Close button (mobile only) */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg cursor-pointer"
            aria-label="Close menu"
            style={{ color: 'var(--app-text-muted)' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* ---- Navigation Links ---- */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
        {navItems.map((item) => {
          const isActive = item.path === '/app/learn' ? location.pathname.startsWith('/app/learn') : (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group relative w-full text-left cursor-pointer min-h-[44px]"
              style={{
                backgroundColor: isActive ? 'var(--app-brand-light)' : 'transparent',
                color: isActive ? '#5236ab' : 'var(--app-text-secondary)',
              }}
            >
              {/* Nav icon */}
              <item.icon
                size={20}
                className="shrink-0"
                style={{ color: isActive ? '#5236ab' : 'var(--app-text-muted)' }}
              />

              {/* Nav label (hidden when collapsed on desktop); bold when active per CGI guidelines */}
              {(isMobile || !collapsed) && (
                <span className="whitespace-nowrap overflow-hidden text-sm" style={{ fontWeight: isActive ? 700 : 500 }}>
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
      <div className="p-2 flex flex-col gap-2" style={{ borderTop: '1px solid var(--app-border)' }}>
        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full cursor-pointer"
            style={{ color: 'var(--app-text-muted)' }}
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
          className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full cursor-pointer"
          style={{ color: 'var(--app-text-muted)' }}
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
        className="hidden lg:flex h-screen flex-col fixed left-0 top-0 z-50 transition-colors duration-300"
        style={{ backgroundColor: 'var(--app-surface)', borderRight: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow)' }}
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