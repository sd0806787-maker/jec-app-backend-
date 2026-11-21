/**
 * Roll numbers that can moderate campus posts (delete any issue / lost item).
 * Keep this list in sync with `src/config/roles.ts` in the app.
 */
const ADMIN_ROLLS = ['2581201172'];

function isAdminRoll(roll) {
  return ADMIN_ROLLS.includes(String(roll || '').trim());
}

module.exports = { ADMIN_ROLLS, isAdminRoll };
