/**
 * Single source of truth for stat styles and icons used on Dashboard tiles
 * and HeaderStatsChips. Icons are mapped in consumers (Lucide components).
 */

export const STAT_ICON_KEYS = ['flame', 'trophy', 'target', 'clock', 'star'] as const;
export type StatIconKey = (typeof STAT_ICON_KEYS)[number];

export interface StatStyle {
  id: string;
  label: string;
  iconKey: StatIconKey;
  iconColor: string;
  /** Darker shade for text (number + label) in tile */
  textColor: string;
  badgeClass: string;
  borderClass: string;
  borderColor: string;
  /** Background for header chip (optional) */
  chipBg?: string;
  /** Background for dashboard tile (optional, for inline style) */
  tileBg?: string;
}

export const STATS_TILES_CONFIG: StatStyle[] = [
  { id: 'streak', label: 'Day Streak', iconKey: 'flame', iconColor: '#f59e0b', textColor: '#b45309', badgeClass: 'badge-yellow', borderClass: 'border-warning-100', borderColor: '#fde68a', tileBg: '#fef3c7', chipBg: '#fef3c7' },
  { id: 'trainings', label: 'Trainings Done', iconKey: 'trophy', iconColor: '#3b82f6', textColor: '#1d4ed8', badgeClass: 'badge-blue', borderClass: 'border-[#bfdbfe]', borderColor: '#bfdbfe', tileBg: '#dbeafe', chipBg: '#dbeafe' },
  { id: 'challenges', label: 'Challenges', iconKey: 'target', iconColor: '#22c55e', textColor: '#15803d', badgeClass: 'badge-green', borderClass: 'border-success-100', borderColor: '#bbf7d0', tileBg: '#dcfce7' },
  { id: 'hours', label: 'Hours Learned', iconKey: 'clock', iconColor: '#8b5cf6', textColor: '#6d28d9', badgeClass: 'badge-purple', borderClass: 'border-purple-200', borderColor: '#ddd6fe', tileBg: '#ede9fe' },
  { id: 'xp', label: 'XP', iconKey: 'star', iconColor: '#db2777', textColor: '#9d174d', badgeClass: 'badge-pink', borderClass: 'border-magenta-200', borderColor: '#fbcfe8', tileBg: '#fce7f3', chipBg: '#fce7f3' },
];

/** Styles for the three header chips (XP, Modules, Streak) */
export const CHIP_XP = STATS_TILES_CONFIG.find(s => s.id === 'xp')!;
export const CHIP_MODULES = STATS_TILES_CONFIG.find(s => s.id === 'trainings')!;
export const CHIP_STREAK = STATS_TILES_CONFIG.find(s => s.id === 'streak')!;
