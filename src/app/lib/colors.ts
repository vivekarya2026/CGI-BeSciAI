/**
 * Shared color constants for archetype and status indicators.
 * Import from here instead of defining locally in each component.
 */

/** Maps archetype name → brand hex color. */
export const ARCHETYPE_COLORS: Record<string, string> = {
  Trailblazer: '#f59e0b',
  Guide: '#14b8a6',
  Connector: '#8b5cf6',
  Explorer: '#0ea5e9',
  Champion: '#e31937',
  Innovator: '#84cc16',
};

/** Maps peer status → indicator hex color. */
export const STATUS_COLORS: Record<string, string> = {
  online: '#1ab977',
  away: '#f1a425',
  offline: '#a8a8a8',
};
