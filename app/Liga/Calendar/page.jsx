"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Box,
  Typography,
  useMediaQuery,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  LocationOn,
  AccessTime,
  SportsSoccer,
  EventAvailable,
  Visibility,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { theme } from "../../../styles/theme.js"; // Adjust the import path

const LeagueFixtures = () => {
  const [fixturesByWeek, setFixturesByWeek] = useState({});
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const readAllMatches = async () => {
    setLoading(true);
    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        id,
        match_date,
        match_time,
        week,
        home_goals,
        away_goals,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `
      )
      .eq("competition_type", "League")
      .eq("season", "2024")
      .order("week", { ascending: true })
      .order("match_date", { ascending: true });

    if (!error) {
      const groupedByWeek = matches.reduce((acc, match) => {
        const week = match.week;
        if (!acc[week]) acc[week] = [];
        acc[week].push(match);
        return acc;
      }, {});

      setFixturesByWeek(groupedByWeek);
      setCurrentWeek(findClosestWeek(groupedByWeek));
    }
    setLoading(false);
  };

  const findClosestWeek = (groupedMatches) => {
    const today = dayjs();
    let closestWeek = null;
    let minDateDifference = Infinity;

    Object.keys(groupedMatches).forEach((week) => {
      groupedMatches[week].forEach((match) => {
        const matchDate = dayjs(match.match_date);
        const diff = Math.abs(matchDate.diff(today, "day"));
        if (diff < minDateDifference) {
          minDateDifference = diff;
          closestWeek = week;
        }
      });
    });
    return closestWeek;
  };

  useEffect(() => {
    readAllMatches();
  }, []);

  const determineMatchResult = (home_goals, away_goals) => {
    if (home_goals === null || away_goals === null) return null;
    if (home_goals > away_goals) return "home_win";
    if (home_goals < away_goals) return "away_win";
    return "draw";
  };

  const getResultStyles = (result, team) => {
    if (!result)
      return { color: theme.colors.text.secondary, fontWeight: "normal" };

    const isWinner =
      (result === "home_win" && team === "home") ||
      (result === "away_win" && team === "away");

    if (result === "draw") {
      return {
        color: theme.colors.sports.draw,
        fontWeight: "bold",
      };
    }

    return {
      color: isWinner ? theme.colors.sports.win : theme.colors.sports.loss,
      fontWeight: isWinner ? "bold" : "normal",
    };
  };

  // Calculate previous and next week
  const weekList = Object.keys(fixturesByWeek);
  const currentWeekIndex = weekList.indexOf(currentWeek);
  const previousWeek = weekList[currentWeekIndex - 1] || null;
  const nextWeek = weekList[currentWeekIndex + 1] || null;

  const MatchCard = ({ match }) => {
    const result = determineMatchResult(match.home_goals, match.away_goals);
    const isPlayed = result !== null;

    return (
      <Card
        onClick={() => router.push(`/Jogos/${match.id}`)}
        sx={{
          cursor: "pointer",
          backgroundColor: theme.colors.background.card,
          borderRadius: "16px",
          border: `2px solid transparent`,
          boxShadow: theme.components.card.shadow,
          height: "100%",
          minHeight: "200px",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: theme.components.card.hoverShadow,
            border: `2px solid ${theme.colors.accent[500]}`,
            "&::before": {
              opacity: 1,
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: theme.colors.themed.goldGradient,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
        }}
      >
        <CardContent
          sx={{
            padding: "20px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Status Chip */}
          <Box display="flex" justifyContent="center" mb={1}>
            <Chip
              label={isPlayed ? "Finalizado" : "Agendado"}
              size="small"
              sx={{
                backgroundColor: isPlayed
                  ? theme.colors.sports.win
                  : theme.colors.sports.draw,
                color: "white",
                fontWeight: "bold",
                fontSize: "11px",
                height: "24px",
              }}
            />
          </Box>

          {/* Date and Time */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mb={2}
          >
            <CalendarToday
              sx={{ fontSize: 14, color: theme.colors.text.secondary }}
            />
            <Typography
              variant="body2"
              sx={{ color: theme.colors.text.secondary, fontSize: "12px" }}
            >
              {match.match_date
                ? dayjs(match.match_date).format("DD/MM/YYYY")
                : "Data a definir"}
            </Typography>
            <AccessTime
              sx={{ fontSize: 14, color: theme.colors.text.secondary }}
            />
            <Typography
              variant="body2"
              sx={{ color: theme.colors.text.secondary, fontSize: "12px" }}
            >
              {match.match_time || "Hora a definir"}
            </Typography>
          </Box>

          {/* Teams Section */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            {/* Home Team */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              flex={1}
              gap={1}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.background.secondary,
                  border: `2px solid ${theme.colors.border.primary}`,
                }}
              >
                <img
                  src={match.home_team.logo_url}
                  alt={match.home_team.short_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  ...getResultStyles(result, "home"),
                  fontSize: "13px",
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {match.home_team.short_name}
              </Typography>
            </Box>

            {/* Score/VS */}
            <Box
              sx={{
                backgroundColor: isPlayed
                  ? theme.colors.primary[600]
                  : theme.colors.neutral[400],
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "16px",
                minWidth: "60px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: 1,
              }}
            >
              {isPlayed ? `${match.home_goals} - ${match.away_goals}` : "VS"}
            </Box>

            {/* Away Team */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              flex={1}
              gap={1}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.background.secondary,
                  border: `2px solid ${theme.colors.border.primary}`,
                }}
              >
                <img
                  src={match.away_team.logo_url}
                  alt={match.away_team.short_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  ...getResultStyles(result, "away"),
                  fontSize: "13px",
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {match.away_team.short_name}
              </Typography>
            </Box>
          </Box>

          {/* Stadium Info */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            sx={{
              backgroundColor: theme.colors.background.secondary,
              padding: "8px 12px",
              borderRadius: "8px",
              border: `1px solid ${theme.colors.border.primary}`,
            }}
          >
            <LocationOn
              sx={{ fontSize: 14, color: theme.colors.text.secondary }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.colors.text.secondary,
                fontSize: "11px",
                textAlign: "center",
              }}
            >
              {match.home_team.stadium_name}
            </Typography>
            <Visibility
              sx={{ fontSize: 14, color: theme.colors.text.tertiary, ml: 1 }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const WeekNavigator = () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mb={4}
      sx={{
        backgroundColor: theme.colors.background.card,
        padding: "16px",
        borderRadius: "12px",
        boxShadow: theme.components.card.shadow,
      }}
    >
      {isMobile ? (
        // Mobile Navigation
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={() => previousWeek && setCurrentWeek(previousWeek)}
            disabled={!previousWeek}
            sx={{
              backgroundColor: previousWeek
                ? theme.colors.primary[600]
                : theme.colors.neutral[200],
              color: previousWeek ? "white" : theme.colors.neutral[600],
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: previousWeek
                  ? theme.colors.primary[700]
                  : theme.colors.neutral[200],
              },
              "&:disabled": {
                backgroundColor: theme.colors.neutral[200],
                color: theme.colors.neutral[600],
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <Box
            sx={{
              backgroundColor: theme.colors.primary[600],
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Jornada {currentWeek}
          </Box>

          <IconButton
            onClick={() => nextWeek && setCurrentWeek(nextWeek)}
            disabled={!nextWeek}
            sx={{
              backgroundColor: nextWeek
                ? theme.colors.primary[600]
                : theme.colors.neutral[200],
              color: nextWeek ? "white" : theme.colors.neutral[600],
              width: 40,
              height: 40,
              "&:hover": {
                backgroundColor: nextWeek
                  ? theme.colors.primary[700]
                  : theme.colors.neutral[200],
              },
              "&:disabled": {
                backgroundColor: theme.colors.neutral[200],
                color: theme.colors.neutral[600],
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      ) : (
        // Desktop Navigation
        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
          {weekList.map((week) => (
            <Box
              key={week}
              onClick={() => setCurrentWeek(week)}
              sx={{
                backgroundColor:
                  currentWeek === week
                    ? theme.colors.primary[600]
                    : theme.colors.background.card,
                color:
                  currentWeek === week ? "white" : theme.colors.primary[600],
                border: `2px solid ${theme.colors.primary[600]}`,
                borderRadius: "8px",
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s ease",
                minWidth: "50px",
                textAlign: "center",
                "&:hover": {
                  backgroundColor:
                    currentWeek === week
                      ? theme.colors.primary[600]
                      : theme.colors.background.secondary,
                },
              }}
            >
              {week}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        flexDirection="column"
        gap={2}
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
          A carregar jogos...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        paddingY: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header - Matching Classification page style */}
        <Box textAlign="center" mb={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mb={2}
          >
            <EventAvailable
              sx={{ fontSize: 32, color: theme.colors.accent[500] }}
            />
            <Typography
              variant="h4"
              sx={{
                color: theme.colors.primary[600],
                fontWeight: "bold",
                fontSize: "32px",
              }}
            >
              Calendário
            </Typography>
          </Box>

          {/* Yellow underline like in Classification */}
          <Box
            sx={{
              width: "60px",
              height: "4px",
              backgroundColor: theme.colors.accent[500],
              margin: "0 auto 20px auto",
              borderRadius: "2px",
            }}
          />
        </Box>

        {/* Week Navigator */}
        <WeekNavigator />

        {/* Current Week Title */}
        {currentWeek && (
          <Typography
            variant="h3"
            align="center"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: "bold",
              fontSize: "48px",
              marginBottom: 4,
              opacity: 0.3,
            }}
          >
            Jornada {currentWeek}
          </Typography>
        )}

        {/* Current Week Matches */}
        {currentWeek && fixturesByWeek[currentWeek] && (
          <Grid container spacing={3}>
            {fixturesByWeek[currentWeek].map((match, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={match.id}
                sx={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(20px)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                <MatchCard match={match} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* No matches message */}
        {currentWeek &&
          (!fixturesByWeek[currentWeek] ||
            fixturesByWeek[currentWeek].length === 0) && (
            <Box
              textAlign="center"
              py={8}
              sx={{
                backgroundColor: theme.colors.background.card,
                borderRadius: "16px",
                boxShadow: theme.components.card.shadow,
              }}
            >
              <SportsSoccer
                sx={{ fontSize: 80, color: theme.colors.neutral[300], mb: 2 }}
              />
              <Typography
                variant="h5"
                sx={{
                  color: theme.colors.text.secondary,
                  fontWeight: "medium",
                }}
              >
                Nenhum jogo agendado para esta jornada
              </Typography>
            </Box>
          )}
      </Container>
    </Box>
  );
};

export default LeagueFixtures;
