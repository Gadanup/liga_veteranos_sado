/**
 * matches.match_time is a Postgres `time`, so it arrives as "18:00:00".
 * Showing the seconds is noise, and on a phone it also costs three characters
 * next to the date.
 *
 * Returns "" for a missing value so callers can decide what to render.
 */
export const formatMatchTime = (matchTime) => {
  if (!matchTime) return "";
  const match = String(matchTime).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return String(matchTime);
  return `${match[1].padStart(2, "0")}:${match[2]}`;
};
