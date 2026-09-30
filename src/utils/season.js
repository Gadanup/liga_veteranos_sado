// seasons.id is the year the season starts: 2025 -> "2025/26"
export const formatSeasonShort = (seasonId) =>
  `${seasonId}/${String(Number(seasonId) + 1).slice(-2)}`;

/**
 * Picks which season a page should open on.
 *
 * The URL wins, so going back from a match — or opening a link someone
 * shared — keeps the season you were looking at. Without a usable value in
 * the URL it falls back to the current season, then to the most recent one.
 *
 * @param {Array} seasons - seasons as fetched, each with { id, is_current }
 * @param {string|null} seasonParam - the raw ?season= value
 * @returns {Object|null} the season to select, or null if there are none
 */
export const resolveSeasonFromUrl = (seasons, seasonParam) => {
  if (!seasons || seasons.length === 0) return null;

  const requestedId = Number(seasonParam);
  const requested = Number.isFinite(requestedId)
    ? seasons.find((season) => season.id === requestedId)
    : undefined;

  return requested || seasons.find((season) => season.is_current) || seasons[0];
};
