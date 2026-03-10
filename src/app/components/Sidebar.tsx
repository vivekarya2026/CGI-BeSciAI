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

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Home,
  BookOpen,
  Users,
  Target,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  LogOut,
  X,
  Library,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { useUser } from '../context/UserContext';
import { secondaryButtonMotion, iconButtonMotion } from './ui/motionPresets';

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
  const location = useLocation();
  const { logout, user } = useUser();
  const [learnExpanded, setLearnExpanded] = useState(true);

  // ---- Navigation Items with Sub-items ----
  type SubItem = { label: string; path: string };
  type NavItem = { 
    icon: React.ComponentType<{ size?: number; className?: string }>; 
    label: string; 
    path: string;
    subItems?: SubItem[];
  };
  
  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/app/dashboard' },
    { 
      icon: BookOpen, 
      label: 'Learn', 
      path: '/app/learn',
      subItems: [
        { label: 'Trainings', path: '/app/learn?tab=trainings' },
        { label: 'Micro-learnings', path: '/app/learn?tab=micro' },
      ]
    },
    { icon: Target, label: 'Challenges', path: '/app/challenges' },
    { icon: Library, label: 'Resources', path: '/app/resources' },
    { icon: Users, label: 'Community', path: '/app/community' },
  ];

  // ---- Handle Navigation Click ----
  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // ---- Handle Learn Toggle ----
  const handleLearnToggle = () => {
    if (collapsed) {
      setCollapsed(false);
    }
    setLearnExpanded(!learnExpanded);
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
          <motion.button
            {...iconButtonMotion()}
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg cursor-pointer"
            aria-label="Close menu"
            style={{ color: 'var(--app-text-muted)' }}
          >
            <X size={20} />
          </motion.button>
        )}
      </div>

      {/* ---- Navigation Links ---- */}
      <nav className="flex-1 py-6 flex flex-col gap-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.path === '/app/learn' 
            ? location.pathname.startsWith('/app/learn') 
            : (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isLearnItem = item.label === 'Learn';

          return (
            <div key={item.path}>
              {/* Main Nav Item */}
              <motion.button
                {...secondaryButtonMotion()}
                onClick={() => {
                  if (isLearnItem) {
                    handleLearnToggle();
                  } else {
                    handleNavClick(item.path);
                  }
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group relative w-full text-left cursor-pointer min-h-[44px]"
                style={{
                  backgroundColor: (isActive && !isLearnItem) ? 'var(--app-brand-light)' : 'transparent',
                  color: isActive ? '#8b5cf6' : 'var(--app-text-secondary)',
                }}
              >
                <item.icon
                  size={20}
                  className="shrink-0"
                  style={{ color: isActive ? '#8b5cf6' : 'var(--app-text-muted)' }}
                />

                {(isMobile || !collapsed) && (
                  <>
                    <span className="whitespace-nowrap overflow-hidden text-sm flex-1" style={{ fontWeight: isActive ? 600 : 500 }}>
                      {item.label}
                    </span>
                    {hasSubItems && (
                      <motion.div
                        animate={{ rotate: learnExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} style={{ color: 'var(--app-text-muted)' }} />
                      </motion.div>
                    )}
                  </>
                )}

                {!isMobile && collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </motion.button>

              {/* Sub-items (only for Learn) */}
              {hasSubItems && learnExpanded && (isMobile || !collapsed) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {item.subItems!.map((subItem) => {
                    const isSubActive = location.pathname.startsWith('/app/learn') && 
                      (location.search.includes(subItem.path.split('?')[1]) || 
                       (subItem.label === 'Trainings' && !location.search));
                    
                    return (
                      <motion.button
                        key={subItem.path}
                        {...secondaryButtonMotion()}
                        onClick={() => handleNavClick(subItem.path)}
                        className="flex items-center gap-3 pl-12 pr-3 py-2.5 rounded-lg transition-colors w-full text-left cursor-pointer"
                        style={{
                          backgroundColor: isSubActive ? '#f3f4f6' : 'transparent',
                          color: isSubActive ? '#8b5cf6' : 'var(--app-text-secondary)',
                        }}
                      >
                        <span className="text-sm" style={{ fontWeight: isSubActive ? 600 : 400 }}>
                          {subItem.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ---- Footer: User Profile + Actions ---- */}
      <div className="p-2 flex flex-col gap-2" style={{ borderTop: '1px solid var(--app-border)' }}>
        {/* User Profile */}
        {(isMobile || !collapsed) && (
          <div className="px-3 py-2 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white"
              style={{ backgroundColor: '#8b5cf6' }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'JD'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--app-text-primary)' }}>
                {user?.name || 'Jane Doe'}
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--app-text-muted)' }}>
                {user?.email || 'jane@example.com'}
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <motion.button
            {...secondaryButtonMotion()}
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full cursor-pointer"
            style={{ color: 'var(--app-text-muted)' }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden text-xs font-medium">
                Collapse
              </span>
            )}
          </motion.button>
        )}

        {/* Logout button */}
        <motion.button
          {...secondaryButtonMotion()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full cursor-pointer"
          style={{ color: 'var(--app-text-muted)' }}
          onClick={() => {
            logout();
            navigate('/');
            setMobileOpen(false);
          }}
        >
          <LogOut size={18} />
          {(isMobile || !collapsed) && (
            <span className="whitespace-nowrap overflow-hidden text-xs font-medium">
              Logout
            </span>
          )}
        </motion.button>
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