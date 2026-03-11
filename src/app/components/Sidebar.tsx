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
  GraduationCap,
  Zap,
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
  type SubItem = { 
    label: string; 
    path: string;
    icon?: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  };
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
        { label: 'Trainings', path: '/app/learn?tab=trainings', icon: GraduationCap },
        { label: 'Micro-learnings', path: '/app/learn?tab=micro', icon: Zap },
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
      "h-screen flex flex-col transition-colors duration-300 bg-app-surface",
      isMobile ? "w-[260px]" : ""
    )}>

      {/* ---- Header / Logo ---- */}
      <div className="sidebar-header">
        <div className="flex items-center gap-3">
          {/* Logo — reuse landing page star icon styling */}
          <div className="sidebar-logo">
            <span className="landing2-logo-icon" aria-hidden="true">✦</span>
          </div>
          {/* App name (hidden when desktop sidebar is collapsed) */}
          {(isMobile || !collapsed) && (
            <span className="font-bold text-lg whitespace-nowrap text-app-primary">
              BeSciAI
            </span>
          )}
        </div>
        {/* Close button (mobile only) */}
        {isMobile && (
          <motion.button
            {...iconButtonMotion()}
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg cursor-pointer text-app-muted"
            aria-label="Close menu"
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
                className={clsx(
                  "nav-item nav-item-hover group",
                  (isActive && !isLearnItem) && "nav-item-active"
                )}
              >
                <item.icon
                  size={20}
                  className={clsx(
                    "shrink-0",
                    (isActive && !isLearnItem) ? "text-[#8b5cf6]" : "text-app-muted"
                  )}
                />

                {(isMobile || !collapsed) && (
                  <>
                    <span className={clsx(
                      "whitespace-nowrap overflow-hidden text-sm flex-1",
                      isActive ? "font-semibold" : "font-medium"
                    )}>
                      {item.label}
                    </span>
                    {hasSubItems && (
                      <motion.div
                        animate={{ rotate: learnExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} className="text-app-muted" />
                      </motion.div>
                    )}
                  </>
                )}

                {!isMobile && collapsed && (
                  <div className="nav-tooltip">
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
                        className={clsx(
                          "nav-subitem nav-item-hover",
                          isSubActive && "nav-subitem-active"
                        )}
                      >
                        {subItem.icon && (
                          <subItem.icon
                            size={16}
                            className={clsx(
                              "shrink-0",
                              isSubActive ? "text-[#8b5cf6]" : "text-app-muted"
                            )}
                          />
                        )}
                        <span className={clsx(
                          "text-sm",
                          isSubActive ? "font-semibold" : "font-normal"
                        )}>
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
      <div className="sidebar-footer">
        {/* User Profile */}
        {(isMobile || !collapsed) && (
          <div className="px-3 py-2 flex items-center gap-3">
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'JD'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate text-app-primary">
                {user?.name || 'Jane Doe'}
              </div>
              <div className="text-xs truncate text-app-muted">
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full cursor-pointer text-app-muted"
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full cursor-pointer text-app-muted"
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
        className="hidden lg:flex h-screen flex-col fixed left-0 top-0 z-50 transition-colors duration-300 sidebar-container"
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