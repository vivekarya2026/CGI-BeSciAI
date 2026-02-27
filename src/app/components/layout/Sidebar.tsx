import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  BookOpen,
  Users,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Target,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUser } from '../../context/UserContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Learn', path: '/learn' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: User, label: 'My Profile', path: '/profile' },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const getArchetypeColor = () => {
    switch (user.archetype) {
      case 'Trailblazer': return 'text-amber-500';
      case 'Guide': return 'text-teal-500';
      case 'Connector': return 'text-purple-500';
      case 'Explorer': return 'text-sky-500';
      case 'Champion': return 'text-red-500';
      case 'Innovator': return 'text-green-500';
      default: return 'text-purple-600'; // Default CGI Purple
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40 flex flex-col shadow-sm"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-1.5 rounded-lg bg-purple-50 ${isCollapsed ? 'mx-auto' : ''}`}>
            <Sparkles className="w-5 h-5 text-[#5236ab]" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-[#5236ab] text-lg whitespace-nowrap"
            >
              BeSciAI
            </motion.span>
          )}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <TooltipProvider key={item.path} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                      isActive
                        ? "bg-purple-50 text-[#5236ab]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-6 bg-[#5236ab] rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#5236ab]" : "text-gray-500 group-hover:text-gray-700")} />

                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-medium text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </NavLink>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="ml-2">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 mt-auto">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {!isCollapsed && (
          <div className="flex items-center gap-3 px-2 py-3 mt-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className={cn("text-xs truncate", getArchetypeColor())}>
                {user.archetype || 'New User'}
              </p>
            </div>
            <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>
        )}

        {isCollapsed && (
          <div className="mt-2 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-300 transition-colors">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};
