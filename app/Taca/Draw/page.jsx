"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Box,
  Typography,
  Avatar,
  Container,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  EmojiEvents,
  ExpandMore,
  SportsSoccer,
  Stadium,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { Bracket } from "react-brackets";
import { useRouter } from "next/navigation";
import { theme } from "../../../styles/theme.js"; // Adjust the import path

const Cup = () => {
  const [matches, setMatches] = useState({
    round8: [],
    round4: [],
    round2: [],
    final: [],
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const placeholderRounds = {
    round8: Array(8).fill({
      id: "TBD",
      stadium: "TBD",
      sides: [
        { team: { name: "TBD", logo: null }, score: null },
        { team: { name: "TBD", logo: null }, score: null },
      ],
    }),
    round4: Array(4).fill({
      id: "TBD",
      stadium: "TBD",
      sides: [
        { team: { name: "TBD", logo: null }, score: null },
        { team: { name: "TBD", logo: null }, score: null },
      ],
    }),
    round2: Array(2).fill({
      id: "TBD",
      stadium: "TBD",
      sides: [
        { team: { name: "TBD", logo: null }, score: null },
        { team: { name: "TBD", logo: null }, score: null },
      ],
    }),
    final: [
      {
        id: "TBD",
        stadium: "TBD",
        sides: [
          { team: { name: "TBD", logo: null }, score: null },
          { team: { name: "TBD", logo: null }, score: null },
        ],
      },
    ],
  };

  const fetchMatchesByRound = async (round) => {
    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        id,
        home_goals,
        away_goals,
        home_penalties,
        away_penalties,
        match_date,
        match_time,
        home_team:teams!matches_home_team_id_fkey (short_name, logo_url, stadium_name),
        away_team:teams!matches_away_team_id_fkey (short_name, logo_url)
      `
      )
      .eq("competition_type", "Cup")
      .eq("season", "2024")
      .eq("round", round)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    }
    return data;
  };

  const fetchAllRounds = async () => {
    setLoading(true);
    const [round8, round4, round2, final] = await Promise.all([
      fetchMatchesByRound("8"),
      fetchMatchesByRound("4"),
      fetchMatchesByRound("2"),
      fetchMatchesByRound("1"),
    ]);

    setMatches({
      round8: round8.length ? round8 : placeholderRounds.round8,
      round4: round4.length ? round4 : placeholderRounds.round4,
      round2: round2.length ? round2 : placeholderRounds.round2,
      final: final.length ? final : placeholderRounds.final,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchAllRounds();
  }, []);

  const formatMatches = (matches) => {
    return matches.map((match) => ({
      id: match.id,
      date: match.match_date
        ? dayjs(match.match_date).format("DD/MM/YYYY")
        : "TBD",
      time: match.match_time,
      stadium: match.home_team?.stadium_name || "TBD",
      sides: [
        {
          team: {
            name: match.home_team ? match.home_team.short_name : "TBD",
            logo: match.home_team ? match.home_team.logo_url : null,
          },
          score:
            match.home_goals !== null && match.home_goals !== undefined
              ? `${match.home_goals}${match.home_penalties ? ` (${match.home_penalties})` : ""}`
              : "---",
          winner:
            match.home_goals > match.away_goals ||
            (match.home_goals === match.away_goals &&
              match.home_penalties > match.away_penalties),
        },
        {
          team: {
            name:
              match.id === 248 && !match.away_team
                ? "------------"
                : match.away_team
                  ? match.away_team.short_name
                  : "TBD",
            logo: match.away_team ? match.away_team.logo_url : null,
          },
          score:
            match.away_goals !== null && match.away_goals !== undefined
              ? `${match.away_goals}${match.away_penalties ? ` (${match.away_penalties})` : ""}`
              : "---",
          winner:
            match.away_goals > match.home_goals ||
            (match.away_goals === match.home_goals &&
              match.away_penalties > match.home_penalties),
        },
      ],
    }));
  };

  const createCustomTeamDisplay = (side, matchId) => {
    const isWinner = side.winner;
    const hasScore = side.score !== "---" && side.score !== null;

    return (
      <Box
        onClick={() => router.push(`/Jogos/${matchId}`)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: isMobile ? "250px" : "300px",
          cursor: "pointer",
          padding: "10px 14px",
          borderRadius: "10px",
          backgroundColor:
            isWinner && hasScore
              ? theme.colors.accent[500] + "15" // Very subtle gold tint
              : "rgba(255, 255, 255, 0.95)", // Clean white with slight transparency
          border: `2px solid ${
            isWinner && hasScore
              ? theme.colors.accent[500]
              : "rgba(107, 75, 161, 0.2)"
          }`, // Gold border for winners, subtle purple for others
          transition: "all 0.3s ease",
          boxShadow:
            isWinner && hasScore
              ? `0 4px 12px ${theme.colors.accent[500]}30` // Subtle gold glow for winners
              : "0 2px 8px rgba(0,0,0,0.1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.98)", // Keep white background on hover
            borderColor: theme.colors.accent[500],
            transform: "translateY(-2px)",
            boxShadow: `0 6px 20px ${theme.colors.accent[500]}40`,
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={2} flex={1} minWidth={0}>
          {side.team.logo && (
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${theme.colors.border.primary}`,
                flexShrink: 0,
              }}
            >
              <img
                src={side.team.logo}
                alt={`${side.team.name} logo`}
                style={{
                  width: "24px",
                  height: "24px",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: isWinner && hasScore ? "bold" : "600",
              color:
                isWinner && hasScore
                  ? theme.colors.accent[700] // Darker gold for winners
                  : theme.colors.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: isMobile ? "13px" : "15px",
            }}
          >
            {side.team.name}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor:
              isWinner && hasScore
                ? theme.colors.accent[500] // Gold background for winner scores
                : theme.colors.neutral[200], // Light gray for others
            color: isWinner && hasScore ? "white" : theme.colors.text.primary,
            padding: "4px 10px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: isMobile ? "12px" : "14px",
            minWidth: "45px",
            textAlign: "center",
            border:
              isWinner && hasScore
                ? `1px solid ${theme.colors.accent[600]}`
                : `1px solid ${theme.colors.neutral[300]}`,
          }}
        >
          {side.score !== null ? side.score : "---"}
        </Box>
      </Box>
    );
  };

  const bracketData = {
    round8: formatMatches(matches.round8),
    round4: formatMatches(matches.round4),
    round2: formatMatches(matches.round2),
    final: formatMatches(matches.final),
  };

  // Mobile view component
  const MobileRoundView = ({ title, matches, roundKey }) => {
    return (
      <Accordion
        sx={{
          backgroundColor: theme.colors.background.card,
          border: `1px solid ${theme.colors.border.primary}`,
          borderRadius: "12px !important",
          marginBottom: 2,
          "&:before": { display: "none" },
          boxShadow: theme.components.card.shadow,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: theme.colors.primary[600] }} />}
          sx={{
            backgroundColor: theme.colors.primary[600],
            color: "white",
            borderRadius: "12px 12px 0 0",
            "&.Mui-expanded": {
              borderRadius: "12px 12px 0 0",
            },
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <EmojiEvents />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {title}
            </Typography>
            <Chip
              label={`${matches.length} jogos`}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "10px",
              }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {matches.map((match, index) => (
              <Grid item xs={12} key={match.id || index}>
                <Card
                  onClick={() => router.push(`/Jogos/${match.id}`)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: theme.colors.background.tertiary,
                    border: `1px solid ${theme.colors.border.primary}`,
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: theme.colors.primary[50],
                      borderColor: theme.colors.accent[500],
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ padding: "12px !important" }}>
                    {/* Date and Time at top corners */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday
                          sx={{
                            fontSize: 14,
                            color: theme.colors.text.secondary,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.colors.text.secondary,
                            fontSize: "11px",
                          }}
                        >
                          {match.date}
                        </Typography>
                      </Box>
                      {match.time && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <AccessTime
                            sx={{
                              fontSize: 14,
                              color: theme.colors.text.secondary,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.colors.text.secondary,
                              fontSize: "11px",
                            }}
                          >
                            {match.time.slice(0, 5)}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Teams */}
                    {match.sides.map((side, sideIndex) => (
                      <Box
                        key={sideIndex}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          padding: "6px 8px",
                          backgroundColor:
                            side.winner && side.score !== "---"
                              ? theme.colors.sports.win + "20"
                              : "transparent",
                          borderRadius: "6px",
                          marginBottom: sideIndex === 0 ? 1 : 0,
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          flex={1}
                        >
                          {side.team.logo && (
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "4px",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  theme.colors.background.secondary,
                              }}
                            >
                              <img
                                src={side.team.logo}
                                alt={`${side.team.name} logo`}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  objectFit: "contain",
                                }}
                              />
                            </Box>
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight:
                                side.winner && side.score !== "---"
                                  ? "bold"
                                  : "medium",
                              color:
                                side.winner && side.score !== "---"
                                  ? theme.colors.sports.win
                                  : theme.colors.text.primary,
                              fontSize: "13px",
                            }}
                          >
                            {side.team.name}
                          </Typography>
                        </Box>
                        <Chip
                          label={side.score}
                          size="small"
                          sx={{
                            backgroundColor:
                              side.winner && side.score !== "---"
                                ? theme.colors.sports.win
                                : theme.colors.neutral[200],
                            color:
                              side.winner && side.score !== "---"
                                ? "white"
                                : theme.colors.text.secondary,
                            fontWeight: "bold",
                            fontSize: "11px",
                            height: "24px",
                          }}
                        />
                      </Box>
                    ))}

                    {/* Stadium at bottom center */}
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={1}
                      mt={2}
                    >
                      <Stadium
                        sx={{
                          fontSize: 14,
                          color: theme.colors.text.secondary,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.colors.text.secondary,
                          fontSize: "11px",
                          textAlign: "center",
                        }}
                      >
                        {match.stadium}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

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
        <EmojiEvents
          sx={{
            fontSize: 60,
            color: theme.colors.primary[600],
            animation: "bounce 2s infinite",
            "@keyframes bounce": {
              "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
              "40%": { transform: "translateY(-10px)" },
              "60%": { transform: "translateY(-5px)" },
            },
          }}
        />
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          A carregar eliminatórias da taça...
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
      <Container maxWidth="xl">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            mb={2}
          >
            <EmojiEvents
              sx={{ fontSize: 32, color: theme.colors.accent[500] }}
            />
            <Typography
              variant="h4"
              sx={{
                color: theme.colors.primary[600],
                fontWeight: "bold",
                fontSize: { xs: "28px", sm: "32px" },
              }}
            >
              Taça
            </Typography>
          </Box>

          {/* Yellow underline */}
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

        {isMobile ? (
          /* Mobile Accordion View */
          <Box>
            <MobileRoundView
              title="Oitavos de Final"
              matches={bracketData.round8}
              roundKey="round8"
            />
            <MobileRoundView
              title="Quartos de Final"
              matches={bracketData.round4}
              roundKey="round4"
            />
            <MobileRoundView
              title="Semifinais"
              matches={bracketData.round2}
              roundKey="round2"
            />
            <MobileRoundView
              title="Final"
              matches={bracketData.final}
              roundKey="final"
            />
          </Box>
        ) : (
          /* Desktop Bracket View */
          <Box
            sx={{
              backgroundColor: theme.colors.background.card,
              borderRadius: "20px",
              padding: 3,
              boxShadow: theme.components.card.shadow,
              border: `2px solid ${theme.colors.border.purple}`,
              overflow: "auto",
              /* Custom CSS to style react-brackets with theme colors */
              "& .react-brackets__bracket": {
                backgroundColor: "transparent !important",
              },
              "& .react-brackets__match": {
                backgroundColor: `${theme.colors.primary[600]} !important`, // Purple background for match containers
                border: `2px solid ${theme.colors.primary[700]} !important`,
                borderRadius: "12px !important",
                boxShadow: `0 4px 12px ${theme.colors.primary[600]}30 !important`,
                padding: "8px !important",
              },
              "& .react-brackets__team": {
                backgroundColor: "transparent !important",
                border: "none !important",
                margin: "2px 0 !important",
              },
              "& .react-brackets__team--winner": {
                backgroundColor: "transparent !important",
              },
              "& .react-brackets__seed": {
                backgroundColor: "transparent !important",
                border: "none !important",
                borderRadius: "12px !important",
                padding: "8px !important",
              },
              "& .react-brackets__seed-item": {
                backgroundColor: "transparent !important",
                padding: "4px 0 !important",
              },
              "& .react-brackets__round-title": {
                color: `${theme.colors.primary[600]} !important`,
                fontWeight: "bold !important",
                fontSize: "18px !important",
                marginBottom: "20px !important",
                textAlign: "center !important",
                textShadow: `1px 1px 2px ${theme.colors.accent[500]}50 !important`,
              },
              "& .react-brackets__connectors": {
                "& .react-brackets__connector": {
                  borderColor: `${theme.colors.primary[400]} !important`,
                  borderWidth: "2px !important",
                },
                "& .react-brackets__connector-horizontal": {
                  borderTopColor: `${theme.colors.primary[400]} !important`,
                  borderBottomColor: `${theme.colors.primary[400]} !important`,
                },
                "& .react-brackets__connector-vertical": {
                  borderLeftColor: `${theme.colors.primary[400]} !important`,
                  borderRightColor: `${theme.colors.primary[400]} !important`,
                },
              },
              /* Add gradient effect to the entire bracket */
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${theme.colors.primary[600]}08, ${theme.colors.accent[500]}08)`,
                borderRadius: "20px",
                pointerEvents: "none",
                zIndex: 0,
              },
              "& > *": {
                position: "relative",
                zIndex: 1,
              },
            }}
          >
            <Bracket
              rounds={[
                {
                  title: "Oitavos de Final",
                  seeds: bracketData.round8.map((match) => ({
                    id: match.id,
                    date: `${match.date || "TBD"} - ${match.time ? match.time.slice(0, 5) + " -" : ""} ${match.stadium || "TBD"}`,
                    teams: [
                      {
                        name: createCustomTeamDisplay(match.sides[0], match.id),
                        isWinner: match.sides[0].winner,
                      },
                      {
                        name: createCustomTeamDisplay(match.sides[1], match.id),
                        isWinner: match.sides[1].winner,
                      },
                    ],
                  })),
                },
                {
                  title: "Quartos de Final",
                  seeds: bracketData.round4.map((match) => ({
                    id: match.id,
                    date: `${match.date || "TBD"} - ${match.time ? match.time.slice(0, 5) + " -" : ""} ${match.stadium || "TBD"}`,
                    teams: match.sides.map((side) => ({
                      name: createCustomTeamDisplay(side, match.id),
                      isWinner: side.winner,
                    })),
                  })),
                },
                {
                  title: "Semifinais",
                  seeds: bracketData.round2.map((match) => ({
                    id: match.id,
                    date: `${match.date || "TBD"} - ${match.time ? match.time.slice(0, 5) + " -" : ""} ${match.stadium || "TBD"}`,
                    teams: [
                      {
                        name: createCustomTeamDisplay(match.sides[0], match.id),
                        isWinner: match.sides[0].winner,
                      },
                      {
                        name: createCustomTeamDisplay(match.sides[1], match.id),
                        isWinner: match.sides[1].winner,
                      },
                    ],
                  })),
                },
                {
                  title: "Final",
                  seeds: bracketData.final.map((match) => ({
                    id: match.id,
                    date: `${match.date || "TBD"} - ${match.time ? match.time.slice(0, 5) + " -" : ""} ${match.stadium || "TBD"}`,
                    teams: [
                      {
                        name: createCustomTeamDisplay(match.sides[0], match.id),
                        isWinner: match.sides[0].winner,
                      },
                      {
                        name: createCustomTeamDisplay(match.sides[1], match.id),
                        isWinner: match.sides[1].winner,
                      },
                    ],
                  })),
                },
              ]}
            />
          </Box>
        )}

        {/* Note */}
        <Box
          sx={{
            backgroundColor: theme.colors.background.card,
            borderRadius: "12px",
            padding: 2,
            marginTop: 3,
            border: `1px solid ${theme.colors.border.primary}`,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <SportsSoccer sx={{ color: theme.colors.accent[500] }} />
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              fontStyle: "italic",
            }}
          >
            * Bairro Santos Nicolau qualificou-se automaticamente para os
            Oitavos de Final.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Cup;
