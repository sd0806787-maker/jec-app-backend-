/**
 * Roll numbers that can moderate campus posts (delete any issue / lost item).
 * Keep this list in sync with `jec-backend/utils/admin.js`.
 */
export const ADMIN_ROLLS = ['2581201172'];

export const isAdminRoll = (roll?: string | null): boolean =>
  ADMIN_ROLLS.includes(String(roll ?? '').trim());
