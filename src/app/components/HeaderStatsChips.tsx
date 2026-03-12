/**
 * Header stats chips: XP, Modules, Streak — pill-style, icon + text.
 * Styles and icons from shared statsConfig (Star+pink=XP, Trophy+blue=Modules, Flame=Streak).
 */

import React from 'react';
import { Star, Trophy, Flame } from 'lucide-react';
import { CHIP_XP, CHIP_MODULES, CHIP_STREAK } from '../data/statsConfig';

export interface ProgressForChips {
  xp: number;
  modulesCompleted: number;
  totalModules: number;
  streak: number;
}

const chipBase = 'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs-semibold';

export function HeaderStatsChips({ progress }: { progress: ProgressForChips }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={chipBase}
        style={{
          backgroundColor: CHIP_XP.chipBg,
          color: CHIP_XP.textColor,
          border: `1px solid ${CHIP_XP.borderColor}`,
        }}
        aria-label={`${progress.xp?.toLocaleString() ?? 0} XP`}
      >
        <Star size={16} className="shrink-0" style={{ color: CHIP_XP.iconColor }} />
        <span>{(progress.xp ?? 0).toLocaleString()} XP</span>
      </span>
      <span
        className={chipBase}
        style={{
          backgroundColor: CHIP_MODULES.chipBg ?? CHIP_MODULES.tileBg ?? '#ffffff',
          color: CHIP_MODULES.textColor,
          border: `1px solid ${CHIP_MODULES.borderColor}`,
        }}
        aria-label={`${progress.modulesCompleted}/${progress.totalModules} Modules`}
      >
        <Trophy size={16} className="shrink-0" style={{ color: CHIP_MODULES.iconColor }} />
        <span>{progress.modulesCompleted ?? 0}/{progress.totalModules ?? 12} Modules</span>
      </span>
      <span
        className={chipBase}
        style={{
          backgroundColor: CHIP_STREAK.chipBg,
          color: CHIP_STREAK.textColor,
          border: `1px solid ${CHIP_STREAK.borderColor}`,
        }}
        aria-label={`${progress.streak ?? 0} Streak`}
      >
        <Flame size={16} className="shrink-0" style={{ color: CHIP_STREAK.iconColor }} />
        <span>{progress.streak ?? 0} Streak</span>
      </span>
    </div>
  );
}
