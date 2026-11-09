import React, { useMemo } from "react";

/**
 * ClassificationStats Component
 * Season summary shown under the standings table, at every width.
 *
 * Everything here is derived from data the page already has: the standings
 * rows and the completed league matches of the selected season. No extra
 * query, and nothing spans seasons — `matches` arrives already filtered to
 * the selected one.
 *
 * @param {Array} classification - Standings rows (league_standings + teams)
 * @param {Array} matches - Completed league matches of the selected season
 * @param {boolean} isCurrentSeason - Whether the selected season is running
 * @param {Object} theme - Theme object
 */

const RESULT = { WIN: "W", DRAW: "D", LOSS: "L" };

// Portuguese decimals use a comma.
const formatDecimal = (value, digits = 2) =>
  value.toFixed(digits).replace(".", ",");

const formatGames = (count) => `${count} ${count === 1 ? "jogo" : "jogos"}`;

const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0);

/**
 * Result of every completed match, per team, oldest first — the basis for
 * every run below.
 */
const buildResultsByTeam = (matches) => {
  const byTeam = {};
  const chronological = [...matches].sort(
    (a, b) => new Date(a.match_date) - new Date(b.match_date)
  );

  chronological.forEach((match) => {
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

/** How many of the most recent results match — the run still open. */
const openRun = (results, predicate) => {
  let run = 0;
  for (let i = results.length - 1; i >= 0; i -= 1) {
    if (!predicate(results[i])) break;
    run += 1;
  }
  return run;
};

/** The longest run of matching results anywhere in the season. */
const longestRun = (results, predicate) => {
  let best = 0;
  let run = 0;
  results.forEach((result) => {
    run = predicate(result) ? run + 1 : 0;
    if (run > best) best = run;
  });
  return best;
};

/**
 * The teams with the highest value, every one of them named. Ties are common
 * early in a season, and a "+2" would hide the rest behind a tooltip that a
 * phone cannot open, so the list wraps onto another line instead.
 */
const buildLeader = (entries) => {
  if (!entries.length) return null;

  const best = Math.max(...entries.map((entry) => entry.value));
  const names = entries
    .filter((entry) => entry.value === best)
    .map((entry) => entry.name);

  const label =
    names.length > 1
      ? `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`
      : names[0];

  return { value: best, label };
};

const RUNS = [
  { key: "wins", label: "Vitórias", test: (r) => r === RESULT.WIN },
  { key: "unbeaten", label: "Sem perder", test: (r) => r !== RESULT.LOSS },
  { key: "winless", label: "Sem ganhar", test: (r) => r !== RESULT.WIN },
  { key: "losses", label: "Derrotas", test: (r) => r === RESULT.LOSS },
];

const ClassificationStats = ({
  classification,
  matches = [],
  isCurrentSeason = false,
  theme,
}) => {
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
    const homeWins = played.filter((m) => m.home_goals > m.away_goals).length;
    const draws = played.filter((m) => m.home_goals === m.away_goals).length;
    const awayWins = played.length - homeWins - draws;

    const resultsByTeam = buildResultsByTeam(played);
    const entries = teams.map((row) => ({
      name: row.teams?.short_name || "—",
      results: resultsByTeam[row.team_id] || [],
    }));

    const open = {};
    const longest = {};
    RUNS.forEach(({ key, test }) => {
      open[key] = buildLeader(
        entries.map((e) => ({ name: e.name, value: openRun(e.results, test) }))
      );
      longest[key] = buildLeader(
        entries.map((e) => ({
          name: e.name,
          value: longestRun(e.results, test),
        }))
      );
    });

    const attack = buildLeader(
      teams.map((row) => ({
        name: row.teams?.short_name || "—",
        value: row.goals_for,
      }))
    );
    // Fewest conceded, so the values are negated before taking the maximum.
    const defence = buildLeader(
      teams.map((row) => ({
        name: row.teams?.short_name || "—",
        value: -row.goals_against,
      }))
    );

    const homeWon = (match) => match.home_goals > match.away_goals;

    const describe = (match) =>
      `${match.home_team?.short_name || "—"} ${match.home_goals}–${
        match.away_goals
      } ${match.away_team?.short_name || "—"}`;

    const biggestWin = played.reduce((best, match) => {
      const margin = Math.abs(match.home_goals - match.away_goals);
      if (!margin) return best;
      const total = match.home_goals + match.away_goals;
      const better =
        !best ||
        margin > best.margin ||
        (margin === best.margin && total > best.total);
      return better ? { margin, total, match } : best;
    }, null);

    const highestScoring = played.reduce((best, match) => {
      const total = match.home_goals + match.away_goals;
      return !best || total > best.total ? { total, match } : best;
    }, null);

    return {
      played: played.length,
      totalGoals,
      average: played.length ? totalGoals / played.length : 0,
      homeWins,
      draws,
      awayWins,
      attack,
      defence,
      biggestWin: biggestWin && {
        // Winner first, so the headline score and the names below it read in
        // the same order — "9–0" over "Alto da Guerra 0–9 ADRA Azeda" does
        // not.
        value: `${Math.max(
          biggestWin.match.home_goals,
          biggestWin.match.away_goals
        )}–${Math.min(
          biggestWin.match.home_goals,
          biggestWin.match.away_goals
        )}`,
        note: homeWon(biggestWin.match)
          ? `${biggestWin.match.home_team?.short_name || "—"} v ${
              biggestWin.match.away_team?.short_name || "—"
            }`
          : `${biggestWin.match.away_team?.short_name || "—"} v ${
              biggestWin.match.home_team?.short_name || "—"
            }`,
      },
      highestScoring: highestScoring && {
        value: `${highestScoring.total} golos`,
        note: describe(highestScoring.match),
      },
      open,
      longest,
    };
  }, [classification, matches]);

  if (!stats.played) return null;

  const colors = {
    good: theme.colors.sports.win,
    bad: theme.colors.sports.loss,
    // The crest gold reads brown at this size next to the win green and the
    // loss red (same reason as the form dots, #180), so this one is amber.
    warn: theme.colors.sports.cards,
    goals: theme.colors.sports.goals,
    neutral: theme.colors.text.primary,
    accent: theme.colors.accent[600],
    navy: theme.colors.primary[500],
  };

  // A run worth zero games is dropped rather than printed: "0 jogos sem
  // perder" is noise, and it happens whenever every team lost its last match.
  const runRows = (source) =>
    RUNS.map(({ key, label }) => {
      const leader = source[key];
      if (!leader?.value) return null;
      return {
        label,
        value: formatGames(leader.value),
        note: leader.label,
        color:
          key === "wins" || key === "unbeaten"
            ? colors.good
            : key === "losses"
              ? colors.bad
              : colors.warn,
      };
    }).filter(Boolean);

  const cards = [
    {
      title: "Jogos",
      rows: [
        { label: "Disputados", value: stats.played, color: colors.neutral },
        { label: "Golos", value: stats.totalGoals, color: colors.goals },
        {
          label: "Média por jogo",
          value: formatDecimal(stats.average),
          color: colors.neutral,
        },
        {
          // Rounded percentages do not always add up to 100, so the counts
          // they come from are on the line below.
          label: "Casa · Empate · Fora",
          value: `${percent(stats.homeWins, stats.played)}% · ${percent(
            stats.draws,
            stats.played
          )}% · ${percent(stats.awayWins, stats.played)}%`,
          note: `${stats.homeWins} · ${stats.draws} · ${stats.awayWins} jogos`,
          color: colors.navy,
        },
      ],
    },
    {
      title: "Golos",
      rows: [
        stats.attack && {
          label: "Melhor ataque",
          value: stats.attack.value,
          note: stats.attack.label,
          color: colors.goals,
        },
        stats.defence && {
          label: "Melhor defesa",
          value: -stats.defence.value,
          note: stats.defence.label,
          color: colors.navy,
        },
        stats.biggestWin && {
          label: "Maior goleada",
          value: stats.biggestWin.value,
          note: stats.biggestWin.note,
          color: colors.accent,
        },
        stats.highestScoring && {
          label: "Jogo com mais golos",
          value: stats.highestScoring.value,
          note: stats.highestScoring.note,
          color: colors.accent,
        },
      ].filter(Boolean),
    },
    {
      title: "Sequências",
      // The same four runs twice over, so they are told apart by a subheading
      // rather than by colour: on top the run each team is still on, below
      // the longest it reached at any point of the season.
      groups: [
        {
          // "Em curso" would be a lie on a season that has already finished.
          heading: isCurrentSeason ? "Em curso" : "No fim da época",
          rows: runRows(stats.open),
        },
        { heading: "Maior da época", rows: runRows(stats.longest) },
      ].filter((group) => group.rows.length),
    },
  ].filter((card) => card.rows?.length || card.groups?.length);

  const labelStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: 1.3,
  };

  const headingStyle = {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  // The value shrinks with the viewport instead of switching at a breakpoint,
  // so the same markup serves a 360px phone and a wide desktop.
  const valueStyle = {
    fontSize: "clamp(0.9375rem, 3vw, 1.0625rem)",
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: 1.25,
  };

  const renderRow = (row, index) => (
    <div
      key={row.label}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
        gap: theme.spacing.sm,
        alignItems: "baseline",
        padding: `${theme.spacing.xs} 0`,
        borderTop: index
          ? `1px solid ${theme.colors.background.secondary}`
          : "none",
      }}
    >
      <span style={labelStyle}>{row.label}</span>
      <span style={{ textAlign: "right" }}>
        <span style={{ ...valueStyle, color: row.color }}>{row.value}</span>
        {row.note && (
          <span
            style={{
              ...labelStyle,
              display: "block",
              color: theme.colors.text.tertiary,
            }}
          >
            {row.note}
          </span>
        )}
      </span>
    </div>
  );

  const renderCard = (card) => (
    <div
      key={card.title}
      style={{
        backgroundColor: theme.colors.background.card,
        border: `1px solid ${theme.colors.border.primary}`,
        borderRadius: theme.borderRadius.lg,
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      }}
    >
      <div
        style={{
          ...headingStyle,
          color: theme.colors.text.accent,
          marginBottom: theme.spacing.xs,
        }}
      >
        {card.title}
      </div>

      {card.rows?.map(renderRow)}

      {card.groups?.map((group, groupIndex) => (
        <div
          key={group.heading}
          style={{ marginTop: groupIndex ? theme.spacing.sm : 0 }}
        >
          <div style={headingStyle}>{group.heading}</div>
          {group.rows.map(renderRow)}
        </div>
      ))}
    </div>
  );

  // Sequências carries both groups and is about twice as tall as the other
  // two, so it gets a column of its own and they share the next one. Side by
  // side as three equal cards it left a block of empty space under them on a
  // desktop; stacked in one column the two heights come out close. On a
  // narrow screen the grid collapses to one column and all three stack, as
  // they did before.
  const columns = [
    cards.filter((card) => !card.groups),
    cards.filter((card) => card.groups),
  ].filter((column) => column.length);

  return (
    <div style={{ marginTop: theme.spacing.lg }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: theme.spacing.sm,
          alignItems: "start",
        }}
      >
        {columns.map((column) => (
          <div
            key={column[0].title}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.sm,
            }}
          >
            {column.map(renderCard)}
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
        Apenas jogos da Liga desta época. Equipas excluídas e equipas sem jogos
        ficam de fora dos recordes.
      </p>
    </div>
  );
};

export default ClassificationStats;
