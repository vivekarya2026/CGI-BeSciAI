/**
 * PageHeader — shared page header used across all main app pages.
 * Renders title + subtitle on the left; HeaderStatsChips, messages bell,
 * NotificationsPanel, and optional extra actions on the right.
 */

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { HeaderStatsChips, type ProgressForChips } from './HeaderStatsChips';
import { NotificationsPanel } from './NotificationsPanel';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  /** When provided, renders HeaderStatsChips with these values. */
  progress?: ProgressForChips;
  /** When provided, renders the messages bell button. */
  onMessagesClick?: () => void;
  /** Passed to NotificationsPanel for in-app navigation. */
  onNavigate: (path: string) => void;
  /** Slot for extra action buttons (e.g. "Find Peers" in Messages). */
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  progress,
  onMessagesClick,
  onNavigate,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold mb-1 text-app-primary">{title}</h1>
        <p className="text-sm sm:text-base text-app-secondary">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {progress && <HeaderStatsChips progress={progress} />}
        {onMessagesClick && (
          <button
            type="button"
            className="notifications-bell"
            onClick={onMessagesClick}
            aria-label="Open messages"
          >
            <MessageSquare size={18} className="text-app-muted" />
            <span className="notifications-badge" aria-label="3 unread notifications">3</span>
          </button>
        )}
        <div className="relative">
          <NotificationsPanel onNavigate={onNavigate} />
        </div>
        {children}
      </div>
    </div>
  );
}
