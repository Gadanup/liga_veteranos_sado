"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Box,
  Typography,
  Table,
  Avatar,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Tab,
  Tabs,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
  Container,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Stadium,
  CalendarToday,
  Groups,
  SportsSoccer,
  EmojiEvents,
  Person,
  Schedule,
  Info,
  AccessTime,
} from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

const TeamPage = ({ params }) => {
  const { teamname } = params;
  const searchParams = useSearchParams();
  const [teamData, setTeamData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [teamFixtures, setTeamFixtures] = useState([]);
  const [nextGame, setNextGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);

      // Get season from URL or default to current season
      let targetSeason = searchParams.get("season");

      if (!targetSeason) {
        const { data: currentSeasonData } = await supabase
          .from("seasons")
          .select("id")
          .eq("is_current", true)
          .single();

        targetSeason = currentSeasonData?.id;
      }

      setSelectedSeason(targetSeason);

      const { data: team, error } = await supabase
        .from("teams")
        .select("*")
        .eq("short_name", decodeURIComponent(teamname))
        .eq("season", targetSeason)
        .single();

      if (error) {
        console.error("Error fetching team data:", error);
      } else {
        setTeamData(team);

        const { data: playersData, error: playersError } = await supabase
          .from("players")
          .select("*")
          .order("name", { ascending: true })
          .eq("team_id", team.id);

        if (playersError) {
          console.error("Error fetching players data:", playersError);
        } else {
          setPlayers(playersData);
        }

        const { data: fixtures, error: fixturesError } = await supabase
          .from("matches")
          .select(
            `
            id,
            match_date,
            match_time,
            home_goals,
            away_goals,
            competition_type,
            round,
            week,
            home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
            away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
          `
          )
          .eq("season", targetSeason)
          .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
          .order("match_date", { ascending: true });

        if (fixturesError) {
          console.error("Error fetching fixtures:", fixturesError);
        } else {
          setTeamFixtures(fixtures);
          const now = dayjs();
          const nextGame = fixtures.find((fixture) =>
            dayjs(fixture.match_date).isAfter(now)
          );
          setNextGame(nextGame);
        }
      }
      setLoading(false);
    };

    fetchTeamData();
  }, [teamname]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const determineMatchResult = (home_goals, away_goals, isHomeTeam) => {
    if (home_goals === null || away_goals === null) return "pending";

    if (home_goals > away_goals) {
      return isHomeTeam ? "win" : "loss";
    } else if (home_goals < away_goals) {
      return isHomeTeam ? "loss" : "win";
    } else {
      return "draw";
    }
  };

  const translateCompetitionType = (competitionType) => {
    const translations = {
      Supercup: "Supertaça",
      Cup: "Taça",
      League: "Liga",
    };
    return translations[competitionType] || competitionType;
  };

  const renderCompetitionDetails = (match) => {
    const competitionType = translateCompetitionType(match.competition_type);

    if (match.competition_type === "Supercup") {
      return competitionType;
    } else if (match.competition_type === "Cup") {
      return `${competitionType} - Ronda ${match.round}`;
    } else if (match.competition_type === "League") {
      return `Jornada ${match.week}`;
    } else {
      return competitionType;
    }
  };

  const getResultColor = (result) => {
    switch (result) {
      case "win":
        return theme.colors.success[600];
      case "loss":
        return theme.colors.error[600];
      case "draw":
        return theme.colors.warning[600];
      default:
        return theme.colors.text.secondary;
    }
  };

  const getResultBadge = (result) => {
    switch (result) {
      case "win":
        return "V";
      case "loss":
        return "D";
      case "draw":
        return "E";
      default:
        return "-";
    }
  };

  const LoadingSkeleton = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
      flexDirection="column"
      gap={3}
      sx={{ backgroundColor: theme.colors.background.secondary }}
    >
      <SportsSoccer
        sx={{
          fontSize: 60,
          color: theme.colors.primary[600],
          animation: "spin 2s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
        A carregar informações da equipa...
      </Typography>
    </Box>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!teamData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          Equipa não encontrada
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: theme.spacing.lg,
      }}
    >
      <Container maxWidth="lg">
        {/* Team Header Card */}
        <Card
          sx={{
            background: theme.colors.themed.purpleGradient,
            color: "white",
            mb: 4,
            borderRadius: theme.borderRadius.xl,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              {/* Team Logo and Info */}
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                  <Box
                    sx={{
                      width: { xs: 80, md: 120 },
                      height: { xs: 80, md: 120 },
                      borderRadius: "50%",
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 8px 32px ${theme.colors.neutral[900]}50`,
                      border: `4px solid ${theme.colors.accent[500]}`,
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={teamData.logo_url}
                      alt={`${teamData.name} Logo`}
                      width={80}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>

                  <Box flex={1} minWidth={0}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: theme.typography.fontWeight.bold,
                        mb: 1,
                        fontSize: { xs: "1.75rem", md: "2.125rem" },
                      }}
                    >
                      {teamData.name}
                    </Typography>
                    {/* Season Chip */}
                    <Chip
                      icon={<CalendarToday sx={{ fontSize: 14 }} />}
                      label={`Época ${teamData.season || selectedSeason}`}
                      sx={{
                        backgroundColor: theme.colors.accent[500],
                        color: theme.colors.neutral[900],
                        fontWeight: theme.typography.fontWeight.bold,
                        fontSize: "0.875rem",
                        height: "32px",
                      }}
                    />

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Stadium sx={{ fontSize: 20 }} />
                      <Typography variant="body1">
                        {teamData.stadium_name}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday sx={{ fontSize: 20 }} />
                      <Typography variant="body1">
                        Fundado:{" "}
                        {new Date(teamData.founded).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Team Roster Image */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: theme.borderRadius.xl,
                    overflow: "hidden",
                    boxShadow: theme.shadows.xl,
                  }}
                >
                  <Image
                    src={teamData.roster_url}
                    alt={`${teamData.name} Roster`}
                    width={300}
                    height={200}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Team Info Cards */}
        <Grid container spacing={3} mb={4}>
          {/* Jersey Info */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: theme.borderRadius.xl,
                border: `2px solid ${theme.colors.primary[100]}`,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: theme.borderRadius.lg,
                      backgroundColor: theme.colors.primary[50],
                    }}
                  >
                    <SportsSoccer
                      sx={{
                        fontSize: 28,
                        color: theme.colors.primary[600],
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: theme.typography.fontWeight.bold,
                      color: theme.colors.primary[600],
                    }}
                  >
                    Equipamentos
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: theme.typography.fontWeight.semibold,
                      mb: 1,
                    }}
                  >
                    Principal
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.text.secondary }}
                  >
                    {teamData.main_jersey}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: theme.typography.fontWeight.semibold,
                      mb: 1,
                    }}
                  >
                    Alternativo
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.colors.text.secondary }}
                  >
                    {teamData.alternative_jersey}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Next Game */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: theme.borderRadius.xl,
                border: `2px solid ${theme.colors.accent[100]}`,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: theme.borderRadius.lg,
                      backgroundColor: theme.colors.accent[50],
                    }}
                  >
                    <Schedule
                      sx={{
                        fontSize: 28,
                        color: theme.colors.accent[600],
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: theme.typography.fontWeight.bold,
                      color: theme.colors.accent[600],
                    }}
                  >
                    Próximo Jogo
                  </Typography>
                </Box>

                {nextGame ? (
                  <Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <img
                          src={nextGame.home_team.logo_url}
                          alt={nextGame.home_team.short_name}
                          style={{
                            width: "32px",
                            height: "32px",
                            objectFit: "contain",
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: theme.typography.fontWeight.semibold,
                          }}
                        >
                          {nextGame.home_team.short_name}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.colors.text.secondary,
                          fontWeight: theme.typography.fontWeight.bold,
                        }}
                      >
                        VS
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1}>
                        <img
                          src={nextGame.away_team.logo_url}
                          alt={nextGame.away_team.short_name}
                          style={{
                            width: "32px",
                            height: "32px",
                            objectFit: "contain",
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: theme.typography.fontWeight.semibold,
                          }}
                        >
                          {nextGame.away_team.short_name}
                        </Typography>
                      </Box>
                    </Box>

                    <Box textAlign="center">
                      <Typography
                        variant="body2"
                        sx={{ color: theme.colors.text.secondary }}
                      >
                        {nextGame.match_date
                          ? dayjs(nextGame.match_date).format("DD/MM/YYYY")
                          : "Data a definir"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.colors.text.secondary }}
                      >
                        {nextGame.home_team.stadium_name}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.colors.text.secondary,
                      textAlign: "center",
                      py: 2,
                    }}
                  >
                    Nenhum jogo agendado
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Card
          sx={{
            borderRadius: theme.borderRadius.xl,
            overflow: "hidden",
            border: `2px solid ${theme.colors.border.primary}`,
          }}
        >
          <Box
            sx={{
              borderBottom: `1px solid ${theme.colors.border.primary}`,
              backgroundColor: theme.colors.background.tertiary,
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  fontWeight: theme.typography.fontWeight.semibold,
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary,
                  "&.Mui-selected": {
                    color: theme.colors.primary[600],
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.colors.primary[600],
                  height: 3,
                },
              }}
            >
              <Tab
                icon={<CalendarToday />}
                iconPosition="start"
                label="Calendário"
              />
              <Tab icon={<Groups />} iconPosition="start" label="Plantel" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 0 }}>
            {/* Calendar Tab */}
            {tabIndex === 0 && (
              <Box>
                <TableContainer>
                  <Table>
                    <TableBody>
                      {teamFixtures.map((match, index) => {
                        const isHomeTeam =
                          match.home_team.short_name === teamData.short_name;
                        const result = determineMatchResult(
                          match.home_goals,
                          match.away_goals,
                          isHomeTeam
                        );

                        return (
                          <TableRow
                            onClick={() => router.push(`/Jogos/${match.id}`)}
                            key={match.id}
                            sx={{
                              cursor: "pointer",
                              backgroundColor:
                                index % 2 === 0
                                  ? theme.colors.background.card
                                  : theme.colors.background.tertiary,
                              "&:hover": {
                                backgroundColor: theme.colors.primary[50],
                              },
                              transition: theme.transitions.normal,
                            }}
                          >
                            {/* Date & Time */}
                            <TableCell sx={{ py: 2 }}>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight:
                                      theme.typography.fontWeight.semibold,
                                  }}
                                >
                                  {match.match_date
                                    ? dayjs(match.match_date).format(
                                        "DD/MM/YYYY"
                                      )
                                    : "Data a definir"}
                                </Typography>
                                {match.match_time && (
                                  <Typography
                                    variant="caption"
                                    sx={{ color: theme.colors.text.secondary }}
                                  >
                                    {match.match_time}
                                  </Typography>
                                )}
                              </Box>
                            </TableCell>

                            {/* Home Team */}
                            <TableCell sx={{ py: 2 }}>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="flex-end"
                                gap={1}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight:
                                      isHomeTeam && result === "win"
                                        ? theme.typography.fontWeight.bold
                                        : theme.typography.fontWeight.medium,
                                  }}
                                >
                                  {match.home_team.short_name}
                                </Typography>
                                <img
                                  src={match.home_team.logo_url}
                                  alt={match.home_team.short_name}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    objectFit: "contain",
                                  }}
                                />
                              </Box>
                            </TableCell>

                            {/* Score */}
                            <TableCell sx={{ py: 2, textAlign: "center" }}>
                              {match.home_goals !== null &&
                              match.away_goals !== null ? (
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  justifyContent="center"
                                >
                                  <Chip
                                    label={getResultBadge(result)}
                                    size="small"
                                    sx={{
                                      backgroundColor: getResultColor(result),
                                      color: "white",
                                      fontWeight:
                                        theme.typography.fontWeight.bold,
                                      minWidth: "24px",
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight:
                                        theme.typography.fontWeight.bold,
                                    }}
                                  >
                                    {match.home_goals} - {match.away_goals}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight:
                                      theme.typography.fontWeight.bold,
                                    color: theme.colors.text.secondary,
                                  }}
                                >
                                  VS
                                </Typography>
                              )}
                            </TableCell>

                            {/* Away Team */}
                            <TableCell sx={{ py: 2 }}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <img
                                  src={match.away_team.logo_url}
                                  alt={match.away_team.short_name}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    objectFit: "contain",
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight:
                                      !isHomeTeam && result === "win"
                                        ? theme.typography.fontWeight.bold
                                        : theme.typography.fontWeight.medium,
                                  }}
                                >
                                  {match.away_team.short_name}
                                </Typography>
                              </Box>
                            </TableCell>

                            {/* Stadium */}
                            <TableCell
                              sx={{
                                py: 2,
                                display: { xs: "none", md: "table-cell" },
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: theme.colors.text.secondary }}
                              >
                                {match.home_team.stadium_name}
                              </Typography>
                            </TableCell>

                            {/* Competition */}
                            <TableCell
                              sx={{
                                py: 2,
                                display: { xs: "none", sm: "table-cell" },
                              }}
                            >
                              <Chip
                                label={renderCompetitionDetails(match)}
                                size="small"
                                sx={{
                                  backgroundColor: theme.colors.secondary[100],
                                  color: theme.colors.secondary[700],
                                  fontSize: "0.75rem",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Squad Tab */}
            {tabIndex === 1 && (
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                {/* Manager Section */}
                {teamData.manager_name && (
                  <Box mb={4}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.colors.primary[600],
                        fontWeight: theme.typography.fontWeight.bold,
                        mb: 3,
                      }}
                    >
                      Treinador
                    </Typography>

                    <Card
                      sx={{
                        borderRadius: theme.borderRadius.lg,
                        border: `2px solid ${theme.colors.accent[200]}`,
                        backgroundColor: theme.colors.accent[50],
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={3}>
                          <Avatar
                            alt={teamData.manager_name}
                            src={teamData.manager_photo_url}
                            sx={{
                              width: 80,
                              height: 80,
                              border: `3px solid ${theme.colors.accent[500]}`,
                              boxShadow: theme.shadows.md,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: theme.typography.fontWeight.bold,
                                color: theme.colors.text.primary,
                              }}
                            >
                              {teamData.manager_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.colors.text.secondary }}
                            >
                              Treinador Principal
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                )}

                {/* Players Section */}
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.colors.primary[600],
                    fontWeight: theme.typography.fontWeight.bold,
                    mb: 3,
                  }}
                >
                  Jogadores ({players.length})
                </Typography>

                <Grid container spacing={2}>
                  {players.map((player) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={player.id}>
                      <Card
                        sx={{
                          borderRadius: theme.borderRadius.lg,
                          border: `1px solid ${theme.colors.border.primary}`,
                          transition: theme.transitions.normal,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: theme.shadows.md,
                            borderColor: theme.colors.primary[300],
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2, textAlign: "center" }}>
                          <Avatar
                            alt={player.name}
                            src={player.photo_url}
                            sx={{
                              width: 60,
                              height: 60,
                              margin: "0 auto",
                              mb: 2,
                              border: `2px solid ${theme.colors.primary[200]}`,
                            }}
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: theme.typography.fontWeight.semibold,
                              color: theme.colors.text.primary,
                              fontSize: "0.9rem",
                              lineHeight: 1.3,
                            }}
                          >
                            {player.name}
                            {player.joker && (
                              <Chip
                                label="JK"
                                size="small"
                                sx={{
                                  ml: 1,
                                  backgroundColor: theme.colors.accent[500],
                                  color: "white",
                                  fontSize: "0.7rem",
                                  height: "20px",
                                }}
                              />
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TeamPage;
