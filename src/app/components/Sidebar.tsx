import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import {
  Home,
  BookOpen,
  Users,
  User,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Menu,
  MessageCircle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { useUser } from '../context/UserContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/app/dashboard' },
    { icon: BookOpen, label: 'Learn', path: '/app/learn' },
    { icon: Users, label: 'Community', path: '/app/community' },
    { icon: MessageCircle, label: 'Messages', path: '/app/messages' },
    { icon: User, label: 'Profile', path: '/app/profile' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    // Close mobile drawer on nav
    setMobileOpen(false);
  };

  const sidebarContent = (isMobile: boolean) => (
    <div className={clsx(
      "bg-white h-screen flex flex-col",
      isMobile ? "w-[260px]" : ""
    )}>
      {/* Header / Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-[#5236ab] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {(isMobile || !collapsed) && (
            <span className="font-bold text-gray-800 text-lg whitespace-nowrap">
              AI Adoption
            </span>
          )}
        </div>
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

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group relative w-full text-left",
                isActive
                  ? "bg-[#f2f1f9] text-[#5236ab]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon size={20} className={clsx("shrink-0", isActive ? "text-[#5236ab]" : "text-gray-500 group-hover:text-gray-700")} />

              {(isMobile || !collapsed) && (
                <span className="whitespace-nowrap overflow-hidden text-sm font-medium">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state (desktop only) */}
              {!isMobile && collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}

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

      {/* Footer Actions */}
      <div className="p-2 border-t border-gray-100 flex flex-col gap-2">
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

  return (
    <>
      {/* Desktop sidebar */}
      <motion.div
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex bg-white border-r border-gray-200 h-screen flex-col fixed left-0 top-0 z-50 shadow-sm"
      >
        {sidebarContent(false)}
      </motion.div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
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