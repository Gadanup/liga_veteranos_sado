import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Avatar,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Close,
  SportsSoccer,
  EmojiEvents,
  LocalFireDepartment,
  Timeline,
  CalendarToday,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme";
import { supabase } from "../../../../lib/supabase";
import dayjs from "dayjs";

/**
 * PlayerDetailsModal Component
 * Shows comprehensive player statistics including:
 * - Goals per game
 * - Hat-tricks & braces (dobraduras)
 * - Competition breakdown (League/Cup/Supercup)
 * - Recent goal history
 * - Current scoring streak
 */
const PlayerDetailsModal = ({ open, onClose, player, seasonId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Translation map for competitions
  const competitionTranslation = {
    League: "Liga",
    Cup: "Taça",
    Supercup: "Supertaça",
  };

  useEffect(() => {
    if (open && player && seasonId) {
      fetchPlayerStats();
    }
  }, [open, player, seasonId]);

  const fetchPlayerStats = async () => {
    setLoading(true);

    try {
      // Fetch all matches for the season
      const { data: matches } = await supabase
        .from("matches")
        .select(
          "id, competition_type, match_date, home_team_id, away_team_id, home_team:teams!matches_home_team_id_fkey(short_name, logo_url), away_team:teams!matches_away_team_id_fkey(short_name, logo_url)"
        )
        .in("competition_type", ["League", "Cup", "Supercup"])
        .eq("season", seasonId);

      const matchIds = matches.map((m) => m.id);

      // Fetch all goals by this player
      const { data: goals } = await supabase
        .from("match_events")
        .select("match_id, minute")
        .eq("player_id", player.id)
        .eq("event_type", 1)
        .in("match_id", matchIds)
        .order("match_id");

      // Group goals by match
      const goalsByMatch = goals.reduce((acc, goal) => {
        if (!acc[goal.match_id]) acc[goal.match_id] = [];
        acc[goal.match_id].push(goal);
        return acc;
      }, {});

      // Calculate stats
      const matchesPlayed = Object.keys(goalsByMatch).length;
      const totalGoals = goals.length;

      // Competition breakdown
      const competitionBreakdown = {
        Liga: 0,
        Taça: 0,
        Supertaça: 0,
      };

      // Hat-tricks and braces
      let hatTricks = 0;
      let braces = 0;
      const goalsByMatchArray = [];

      Object.entries(goalsByMatch).forEach(([matchId, matchGoals]) => {
        const match = matches.find((m) => m.id === parseInt(matchId));
        const goalsCount = matchGoals.length;

        if (goalsCount >= 3) hatTricks++;
        else if (goalsCount === 2) braces++;

        // Competition breakdown
        if (match) {
          const translatedComp =
            competitionTranslation[match.competition_type] ||
            match.competition_type;
          competitionBreakdown[translatedComp] += goalsCount;

          // Determine opponent
          const isHomeTeam = match.home_team_id === player.team_id;
          const opponent = isHomeTeam
            ? match.away_team.short_name
            : match.home_team.short_name;
          const opponentLogo = isHomeTeam
            ? match.away_team.logo_url
            : match.home_team.logo_url;

          goalsByMatchArray.push({
            date: match.match_date,
            opponent,
            opponentLogo,
            goals: goalsCount,
            competition: translatedComp,
            isHomeTeam,
          });
        }
      });

      // Sort by date descending
      goalsByMatchArray.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

      // Goals per game
      const goalsPerGame =
        matchesPlayed > 0 ? (totalGoals / matchesPlayed).toFixed(2) : 0;

      // Current streak
      let currentStreak = 0;
      for (let i = 0; i < goalsByMatchArray.length; i++) {
        if (goalsByMatchArray[i].goals > 0) {
          currentStreak++;
        } else {
          break;
        }
      }

      setStats({
        totalGoals,
        matchesPlayed,
        goalsPerGame,
        hatTricks,
        braces,
        competitionBreakdown,
        recentGoals: goalsByMatchArray.slice(0, 10),
        currentStreak,
      });
    } catch (error) {
      console.error("Error fetching player stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    icon,
    label,
    value,
    color = theme.colors.primary[600],
  }) => (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: "12px",
        border: `2px solid ${theme.colors.border.primary}`,
      }}
    >
      <Box sx={{ color, fontSize: 32, mb: 1 }}>{icon}</Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", color, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
        {label}
      </Typography>
    </Box>
  );

  const CompetitionChip = ({ competition, goals }) => {
    const colors = {
      Liga: theme.colors.primary[600],
      Taça: theme.colors.accent[600],
      Supertaça: theme.colors.sports.goals,
    };

    return (
      <Chip
        label={`${competition}: ${goals}`}
        sx={{
          backgroundColor: colors[competition] + "20",
          color: colors[competition],
          fontWeight: 600,
          border: `2px solid ${colors[competition]}`,
        }}
      />
    );
  };

  if (!player) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: theme.colors.themed.purpleGradient,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          mb: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={player.photo_url}
            alt={player.name}
            sx={{
              width: 60,
              height: 60,
              border: "3px solid white",
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {player.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              {player.team_logo_url && (
                <Avatar
                  src={player.team_logo_url}
                  sx={{ width: 20, height: 20 }}
                />
              )}
              <Typography variant="body2">{player.team_name}</Typography>
            </Box>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : stats ? (
          <>
            {/* Main Stats Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <StatCard
                  icon={<SportsSoccer />}
                  label="Total de Golos"
                  value={stats.totalGoals}
                  color={theme.colors.sports.goals}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard
                  icon={<Timeline />}
                  label="Golos p/Jogo"
                  value={stats.goalsPerGame}
                  color={theme.colors.primary[600]}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard
                  icon={<EmojiEvents />}
                  label="Hat-tricks"
                  value={stats.hatTricks}
                  color={theme.colors.accent[500]}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard
                  icon={<LocalFireDepartment />}
                  label="Dobradinhas"
                  value={stats.braces}
                  color={theme.colors.warning[600]}
                />
              </Grid>
            </Grid>

            {/* Additional Stats */}
            <Box
              sx={{
                p: 2,
                backgroundColor: theme.colors.background.tertiary,
                borderRadius: "12px",
                mb: 3,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color={theme.colors.text.secondary}
                  >
                    Jogos Disputados
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {stats.matchesPlayed}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    color={theme.colors.text.secondary}
                  >
                    Sequência Atual
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {stats.currentStreak}{" "}
                    {stats.currentStreak === 1 ? "jogo" : "jogos"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
            >
              <Tab label="Por Competição" />
              <Tab label="Histórico" />
            </Tabs>

            {/* Tab 1: Competition Breakdown */}
            {activeTab === 0 && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: theme.colors.primary[600],
                  }}
                >
                  Golos por Competição
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  {Object.entries(stats.competitionBreakdown).map(
                    ([comp, goals]) =>
                      goals > 0 && (
                        <CompetitionChip
                          key={comp}
                          competition={comp}
                          goals={goals}
                        />
                      )
                  )}
                </Box>

                {/* Competition Percentages */}
                <Box sx={{ mt: 2 }}>
                  {Object.entries(stats.competitionBreakdown).map(
                    ([comp, goals]) => {
                      if (goals === 0) return null;
                      const percentage = (
                        (goals / stats.totalGoals) *
                        100
                      ).toFixed(0);

                      return (
                        <Box key={comp} sx={{ mb: 2 }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mb={0.5}
                          >
                            <Typography variant="body2">{comp}</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {goals} ({percentage}%)
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              height: 8,
                              backgroundColor: theme.colors.neutral[200],
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                width: `${percentage}%`,
                                height: "100%",
                                backgroundColor: theme.colors.primary[600],
                                transition: "width 0.3s ease",
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    }
                  )}
                </Box>
              </Box>
            )}

            {/* Tab 2: Recent Goals */}
            {activeTab === 1 && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: theme.colors.primary[600],
                  }}
                >
                  Últimos 10 Jogos com Golos
                </Typography>
                {stats.recentGoals.length === 0 ? (
                  <Typography
                    variant="body2"
                    color={theme.colors.text.secondary}
                    textAlign="center"
                    py={4}
                  >
                    Nenhum golo registado
                  </Typography>
                ) : (
                  <Box>
                    {stats.recentGoals.map((game, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          mb: 1,
                          backgroundColor: theme.colors.background.tertiary,
                          borderRadius: "8px",
                          border: `1px solid ${theme.colors.border.primary}`,
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box flex={1}>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={0.5}
                            >
                              <Typography variant="body1" fontWeight="600">
                                vs {game.opponent}
                              </Typography>
                            </Box>
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mt={0.5}
                            >
                              <CalendarToday
                                sx={{
                                  fontSize: 14,
                                  color: theme.colors.text.secondary,
                                }}
                              />
                              <Typography
                                variant="caption"
                                color={theme.colors.text.secondary}
                              >
                                {dayjs(game.date).format("DD/MM/YYYY")}
                              </Typography>
                              <Chip
                                label={game.competition}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: "10px",
                                  backgroundColor: theme.colors.primary[100],
                                  color: theme.colors.primary[700],
                                }}
                              />
                            </Box>
                          </Box>
                          <Chip
                            icon={<SportsSoccer />}
                            label={
                              game.goals === 1
                                ? "1 golo"
                                : `${game.goals} golos`
                            }
                            sx={{
                              backgroundColor:
                                game.goals >= 3
                                  ? theme.colors.accent[500]
                                  : game.goals === 2
                                    ? theme.colors.warning[500]
                                    : theme.colors.primary[600],
                              color: "white",
                              fontWeight: "bold",
                              "& .MuiChip-icon": {
                                color: "white",
                                fontSize: "16px",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </>
        ) : (
          <Typography
            textAlign="center"
            color={theme.colors.text.secondary}
            py={4}
          >
            Erro ao carregar estatísticas
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDetailsModal;
