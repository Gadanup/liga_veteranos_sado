import React, { useMemo } from "react";

/**
 * ClassificationStats Component
 * Season summary shown under the standings table (desktop only).
 *
 * Everything here is derived from data the page already has: the standings
 * rows and the completed league matches of the selected season. No extra
 * query, and nothing spans seasons — `matches` arrives already filtered to
 * the selected one.
 *
 * @param {Array} classification - Standings rows (league_standings + teams)
 * @param {Array} matches - Completed league matches of the selected season
 * @param {Object} theme - Theme object
 */

const RESULT = { WIN: "W", DRAW: "D", LOSS: "L" };

// Portuguese decimals use a comma.
const formatDecimal = (value, digits = 2) =>
  value.toFixed(digits).replace(".", ",");

const formatGames = (count) => `${count} ${count === 1 ? "jogo" : "jogos"}`;

/**
 * Result of every completed match, per team, oldest first — the basis for
 * every streak below.
 */
const buildResultsByTeam = (matches) => {
  const byTeam = {};
  const chronological = [...matches].sort(
    (a, b) => new Date(a.match_date) - new Date(b.match_date)
  );

  chronological.forEach((match) => {
    if (match.home_goals == null || match.away_goals == null) return;

    const homeResult =
      match.home_goals > match.away_goals
        ? RESULT.WIN
        : match.home_goals < match.away_goals
          ? RESULT.LOSS
          : RESULT.DRAW;
    const awayResult =
      homeResult === RESULT.WIN
        ? RESULT.LOSS
        : homeResult === RESULT.LOSS
          ? RESULT.WIN
          : RESULT.DRAW;

    if (!byTeam[match.home_team_id]) byTeam[match.home_team_id] = [];
    if (!byTeam[match.away_team_id]) byTeam[match.away_team_id] = [];
    byTeam[match.home_team_id].push(homeResult);
    byTeam[match.away_team_id].push(awayResult);
  });

  return byTeam;
};

/** How many of the most recent results satisfy `matches` — the run still open. */
const currentRun = (results = [], predicate) => {
  let run = 0;
  for (let i = results.length - 1; i >= 0; i -= 1) {
    if (!predicate(results[i])) break;
    run += 1;
  }
  return run;
};

/**
 * The teams with the highest value, as "Name" / "A e B" / "A +3". Ties are
 * shown rather than silently resolved — early in a season they are common.
 */
const buildLeader = (entries) => {
  const best = Math.max(...entries.map((entry) => entry.value));
  const leaders = entries.filter((entry) => entry.value === best);
  const names = leaders.map((entry) => entry.name);

  let label = names[0];
  if (names.length === 2) label = `${names[0]} e ${names[1]}`;
  else if (names.length > 2) label = `${names[0]} +${names.length - 1}`;

  return { value: best, label, title: names.join(", ") };
};

const ClassificationStats = ({ classification, matches = [], theme }) => {
  const stats = useMemo(() => {
    const played = matches.filter(
      (match) => match.home_goals != null && match.away_goals != null
    );

    // Excluded teams and teams that have not played keep their rows in the
    // standings but cannot hold a record: a team with no games has conceded
    // nothing, which would win "melhor defesa" outright.
    const teams = classification.filter(
      (row) => !row.teams?.excluded && row.matches_played > 0
    );

    const totalGoals = played.reduce(
      (sum, match) => sum + match.home_goals + match.away_goals,
      0
    );
    const homeWins = played.filter(
      (match) => match.home_goals > match.away_goals
    ).length;

    const resultsByTeam = buildResultsByTeam(played);
    const runs = teams.map((row) => {
      const results = resultsByTeam[row.team_id] || [];
      return {
        name: row.teams?.short_name || "—",
        wins: currentRun(results, (r) => r === RESULT.WIN),
        unbeaten: currentRun(results, (r) => r !== RESULT.LOSS),
        winless: currentRun(results, (r) => r !== RESULT.WIN),
        losses: currentRun(results, (r) => r === RESULT.LOSS),
      };
    });

    const leaderOf = (key) =>
      runs.length
        ? buildLeader(runs.map((run) => ({ name: run.name, value: run[key] })))
        : null;

    const attack = teams.length
      ? buildLeader(
          teams.map((row) => ({
            name: row.teams?.short_name || "—",
            value: row.goals_for,
          }))
        )
      : null;
    // Fewest conceded, so the comparison is inverted before picking the max.
    const defence = teams.length
      ? buildLeader(
          teams.map((row) => ({
            name: row.teams?.short_name || "—",
            value: -row.goals_against,
          }))
        )
      : null;

    const biggestWin = played.reduce((best, match) => {
      const margin = Math.abs(match.home_goals - match.away_goals);
      if (margin === 0) return best;
      const total = match.home_goals + match.away_goals;
      if (!best || margin > best.margin || (margin === best.margin && total > best.total)) {
        const homeWon = match.home_goals > match.away_goals;
        return {
          margin,
          total,
          score: `${Math.max(match.home_goals, match.away_goals)}–${Math.min(
            match.home_goals,
            match.away_goals
          )}`,
          label: `${
            (homeWon ? match.home_team : match.away_team)?.short_name || "—"
          } v ${(homeWon ? match.away_team : match.home_team)?.short_name || "—"}`,
        };
      }
      return best;
    }, null);

    return {
      played: played.length,
      totalGoals,
      average: played.length ? totalGoals / played.length : 0,
      homeWinShare: played.length ? (homeWins / played.length) * 100 : 0,
      homeWins,
      attack,
      defence,
      winStreak: leaderOf("wins"),
      unbeaten: leaderOf("unbeaten"),
      winless: leaderOf("winless"),
      lossStreak: leaderOf("losses"),
      biggestWin,
    };
  }, [classification, matches]);

  if (!stats.played) return null;

  const totals = [
    { label: "Jogos disputados", value: stats.played },
    { label: "Golos marcados", value: stats.totalGoals },
    { label: "Média por jogo", value: formatDecimal(stats.average) },
    {
      label: "Vitórias em casa",
      value: `${Math.round(stats.homeWinShare)}%`,
      note: `${stats.homeWins} de ${stats.played}`,
    },
  ];

  // A record is dropped rather than shown as a zero: "0 jogos sem perder" is
  // noise, and it happens whenever every team lost its last match.
  const records = [
    stats.attack && {
      label: "Melhor ataque",
      value: stats.attack.value,
      note: "golos marcados",
      team: stats.attack,
      color: theme.colors.sports.goals,
    },
    stats.defence && {
      label: "Melhor defesa",
      value: -stats.defence.value,
      note: "golos sofridos",
      team: stats.defence,
      color: theme.colors.primary[500],
    },
    stats.biggestWin && {
      label: "Maior goleada",
      value: stats.biggestWin.score,
      note: stats.biggestWin.label,
      color: theme.colors.accent[600],
    },
    stats.winStreak?.value > 0 && {
      label: "Vitórias seguidas",
      value: formatGames(stats.winStreak.value),
      team: stats.winStreak,
      color: theme.colors.sports.win,
    },
    stats.unbeaten?.value > 0 && {
      label: "Sem perder",
      value: formatGames(stats.unbeaten.value),
      team: stats.unbeaten,
      color: theme.colors.sports.win,
    },
    stats.winless?.value > 0 && {
      label: "Sem ganhar",
      value: formatGames(stats.winless.value),
      team: stats.winless,
      // The crest gold reads brown at this size next to the win green and the
      // loss red (same reason as the form dots, #180), so this one is amber.
      color: theme.colors.sports.cards,
    },
    stats.lossStreak?.value > 0 && {
      label: "Derrotas seguidas",
      value: formatGames(stats.lossStreak.value),
      team: stats.lossStreak,
      color: theme.colors.sports.loss,
    },
  ].filter(Boolean);

  const cardStyle = {
    backgroundColor: theme.colors.background.card,
    border: `1px solid ${theme.colors.border.primary}`,
    borderRadius: theme.borderRadius.lg,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  };

  const labelStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    <div style={{ marginTop: theme.spacing.lg }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: theme.spacing.sm,
        }}
      >
        {totals.map((total) => (
          <div
            key={total.label}
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: theme.spacing.sm,
            }}
          >
            <span style={labelStyle}>{total.label}</span>
            <span
              style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                whiteSpace: "nowrap",
              }}
              title={total.note}
            >
              {total.value}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: theme.spacing.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: theme.spacing.sm,
        }}
      >
        {records.map((record) => (
          <div key={record.label} style={cardStyle}>
            <div style={labelStyle}>{record.label}</div>
            <div
              style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.bold,
                color: record.color,
                lineHeight: 1.3,
              }}
            >
              {record.value}
            </div>
            <div
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={record.team?.title || record.note}
            >
              {record.team ? record.team.label : record.note}
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop: theme.spacing.sm,
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.tertiary,
        }}
      >
        Apenas jogos da Liga desta época. As sequências são contadas a partir do
        último jogo de cada equipa; equipas excluídas ficam de fora.
      </p>
    </div>
  );
};

export default ClassificationStats;
