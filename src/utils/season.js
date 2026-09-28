// seasons.id is the year the season starts: 2025 -> "2025/26"
export const formatSeasonShort = (seasonId) =>
  `${seasonId}/${String(Number(seasonId) + 1).slice(-2)}`;
