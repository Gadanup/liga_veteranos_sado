"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Box, Typography, Avatar } from "@mui/material";
import dayjs from "dayjs";
import { Bracket } from "react-brackets";

const Cup = () => {
  const [matches, setMatches] = useState({
    round8: [],
    round4: [],
    round2: [],
    final: [],
  });

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
          score: match.home_goals,
          winner: match.home_goals > match.away_goals,
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

          score: match.away_goals,
          winner: match.away_goals > match.home_goals,
        },
      ],
    }));
  };

  const bracketData = {
    round8: formatMatches(matches.round8),
    round4: formatMatches(matches.round4),
    round2: formatMatches(matches.round2),
    final: formatMatches(matches.final),
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography
        sx={{ color: "#6B4BA1" }}
        variant="h4"
        gutterBottom
        align="center"
      >
        Taça
      </Typography>

      <Bracket
        rounds={[
          {
            title: "Oitavos de Final",
            seeds: bracketData.round8.map((match) => ({
              id: match.id,
              date: `${match.date || "TBD"} - ${match.time || ""}  ${match.stadium || "TBD"}`, // Format date with stadium
              teams: [
                {
                  name: (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "300px",
                      }}
                    >
                      {match.sides[0].team.logo && (
                        <Avatar
                          src={match.sides[0].team.logo}
                          alt={`${match.sides[0].team.name} logo`}
                          sx={{ width: 24, height: 24, marginRight: 1 }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{ flexGrow: 1, textAlign: "left" }}
                      >
                        {match.sides[0].team.name}
                      </Typography>
                      <Typography variant="body2">
                        {match.sides[0].score !== null
                          ? match.sides[0].score
                          : "---"}
                      </Typography>
                    </Box>
                  ),
                  isWinner: match.sides[0].winner,
                },
                {
                  name: (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "300px",
                      }}
                    >
                      {match.sides[1].team.logo && (
                        <Avatar
                          src={match.sides[1].team.logo}
                          alt={`${match.sides[1].team.name} logo`}
                          sx={{ width: 24, height: 24, marginRight: 1 }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{ flexGrow: 1, textAlign: "left" }}
                      >
                        {match.id === "248" && !match.sides[1].team.name
                          ? "---"
                          : match.sides[1].team.name || "---"}
                      </Typography>
                      <Typography variant="body2">
                        {match.sides[1].score !== null
                          ? match.sides[1].score
                          : "---"}
                      </Typography>
                    </Box>
                  ),
                  isWinner: match.sides[1].winner,
                },
              ],
            })),
          },
          {
            title: "Quartos de Final",
            seeds: bracketData.round4.map((match) => ({
              id: match.id,
              date: `${match.date || "TBD"} - ${match.match_time || ""} - ${match.stadium || "TBD"}`, // Format date with stadium
              teams: match.sides.map((side) => ({
                name: (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "300px",
                    }}
                  >
                    {side.team.logo && (
                      <Avatar
                        src={side.team.logo}
                        alt={`${side.team.name} logo`}
                        sx={{ width: 24, height: 24, marginRight: 1 }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{ flexGrow: 1, textAlign: "left" }}
                    >
                      {side.team.name}
                    </Typography>
                    <Typography variant="body2">
                      {side.score !== null ? side.score : "---"}
                    </Typography>
                  </Box>
                ),
                isWinner: side.winner,
              })),
            })),
          },
          {
            title: "Semifinais",
            seeds: bracketData.round2.map((match) => ({
              id: match.id,
              date: `${match.date || "TBD"} - ${match.match_time || ""} - ${match.stadium || "TBD"}`, // Format date with stadium
              stadium: match.stadium,
              teams: [
                {
                  name: (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "300px",
                      }}
                    >
                      {match.sides[0].team.logo && (
                        <Avatar
                          src={match.sides[0].team.logo}
                          alt={`${match.sides[0].team.name} logo`}
                          sx={{ width: 24, height: 24, marginRight: 1 }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{ flexGrow: 1, textAlign: "left" }}
                      >
                        {match.sides[0].team.name}
                      </Typography>
                      <Typography variant="body2">
                        {match.sides[0].score !== null
                          ? match.sides[0].score
                          : "---"}
                      </Typography>
                    </Box>
                  ),
                  isWinner: match.sides[0].winner,
                },
                {
                  name: (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "300px",
                      }}
                    >
                      {match.sides[1].team.logo && (
                        <Avatar
                          src={match.sides[1].team.logo}
                          alt={`${match.sides[1].team.name} logo`}
                          sx={{ width: 24, height: 24, marginRight: 1 }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{ flexGrow: 1, textAlign: "left" }}
                      >
                        {match.sides[1].team.name}
                      </Typography>
                      <Typography variant="body2">
                        {match.sides[1].score !== null
                          ? match.sides[1].score
                          : "---"}
                      </Typography>
                    </Box>
                  ),
                  isWinner: match.sides[1].winner,
                },
              ],
            })),
          },
          {
            title: "Final",
            seeds: bracketData.final.map((match) => ({
              id: match.id,
              date: `${match.date || "TBD"} - ${match.match_time || ""} - ${match.stadium || "TBD"}`, // Format date with stadium
              stadium: match.stadium,
              teams: [
                {
                  name: (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "300px",
                      }}
                    >
                      {match.sides[0].team.logo && (
                        <Avatar
                          src={match.sides[0].team.logo}
                          alt={`${match.sides[0].team.name} logo`}
                          sx={{ width: 24, height: 24, marginRight: 1 }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{ flexGrow: 1, textAlign: "left" }}
                      >
                        {match.sides[0].team.name}
                      </Typography>
                      <Typography variant="body2">
                        {match.sides[0].score !== null
                          ? match.sides[0].score
                          : "---"}
                      </Typography>
                    </Box>
                  ),
                  isWinner: match.sides[0].winner,
                },
                {
                  name: (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "300px",
                      }}
                    >
                      {match.sides[1].team.logo && (
                        <Avatar
                          src={match.sides[1].team.logo}
                          alt={`${match.sides[1].team.name} logo`}
                          sx={{ width: 24, height: 24, marginRight: 1 }}
                        />
                      )}
                      <Typography
                        variant="body2"
                        sx={{ flexGrow: 1, textAlign: "left" }}
                      >
                        {match.sides[1].team.name}
                      </Typography>
                      <Typography variant="body2">
                        {match.sides[1].score !== null
                          ? match.sides[1].score
                          : "---"}
                      </Typography>
                    </Box>
                  ),
                  isWinner: match.sides[1].winner,
                },
              ],
            })),
          },
        ]}
      />
      {/* Note below the bracket */}
      <Typography
        variant="body2"
        sx={{ marginTop: "1rem", color: "gray", marginLeft: "1rem" }}
      >
        * Bairro Santos Nicolau qualificou-se automaticamente para os Oitavos de
        Final.
      </Typography>
    </Box>
  );
};

export default Cup;
