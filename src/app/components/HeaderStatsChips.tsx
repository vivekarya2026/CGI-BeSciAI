/**
 * Header stats chips: XP, Modules, Streak — pill-style, icon + text.
 * Colors and icons match Dashboard (Star+pink=XP, Trophy+blue=Modules, Flame+streak).
 */

import React from 'react';
import { Star, Trophy, Flame } from 'lucide-react';

export interface ProgressForChips {
  xp: number;
  modulesCompleted: number;
  totalModules: number;
  streak: number;
}

const chipBase = 'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium';

export function HeaderStatsChips({ progress }: { progress: ProgressForChips }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${chipBase} bg-[#fce7f3] text-[#db2777]`} aria-label={`${progress.xp?.toLocaleString() ?? 0} XP`}>
        <Star size={16} className="shrink-0" />
        <span>{(progress.xp ?? 0).toLocaleString()} XP</span>
      </span>
      <span className={`${chipBase} bg-white border border-[#e5e7eb] text-app-primary`} aria-label={`${progress.modulesCompleted}/${progress.totalModules} Modules`}>
        <Trophy size={16} className="shrink-0 text-[#3b82f6]" />
        <span>{progress.modulesCompleted ?? 0}/{progress.totalModules ?? 12} Modules</span>
      </span>
      <span className={`${chipBase} bg-[#f3f4f6] text-app-primary`} aria-label={`${progress.streak ?? 0} Streak`}>
        <Flame size={16} className="shrink-0 text-[#ef4444]" />
        <span>{progress.streak ?? 0} Streak</span>
      </span>
    </div>
  );
}
