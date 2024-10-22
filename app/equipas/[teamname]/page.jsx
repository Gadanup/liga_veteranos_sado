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
} from "@mui/material";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation"; // Import useRouter

const TeamPage = ({ params }) => {
  const { teamname } = params;
  const [teamData, setTeamData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [teamFixtures, setTeamFixtures] = useState([]);
  const [nextGame, setNextGame] = useState(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchTeamData = async () => {
      const { data: team, error } = await supabase
        .from("teams")
        .select("*")
        .eq("short_name", decodeURIComponent(teamname))
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
    };

    fetchTeamData();
  }, [teamname]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const determineMatchResult = (home_goals, away_goals) => {
    if (home_goals > away_goals) {
      return "home_win";
    } else if (home_goals < away_goals) {
      return "away_win";
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

    return translations[competitionType] || competitionType; // Fallback to original if not found
  };

  const renderCompetitionDetails = (match) => {
    const competitionType = translateCompetitionType(match.competition_type);

    if (match.competition_type === "Supercup") {
      return competitionType;
    } else if (match.competition_type === "Cup") {
      return `${competitionType} - ${match.round}`;
    } else if (match.competition_type === "League") {
      return `Jornada ${match.week}`;
    } else {
      return competitionType; // Fallback for any other types
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {teamData && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" gap={3} justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={3}>
                <Image
                  src={teamData.logo_url}
                  alt={`${teamData.name} Logo`}
                  width={100}
                  height={100}
                />
                <Box>
                  <Typography variant="h4">{teamData.name}</Typography>
                  <Typography variant="subtitle1">
                    {teamData.manager_name}
                  </Typography>
                  <Typography variant="body1">
                    Campo: {teamData.stadium_name}
                  </Typography>
                  <Typography variant="body2">
                    Fundado: {new Date(teamData.founded).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Image
                  src={teamData.roster_url}
                  alt={`${teamData.name} Roster`}
                  width={300}
                  height={300}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="body2">
                  Equipamento Principal: {teamData.main_jersey}
                </Typography>
                <Typography variant="body2">
                  Equipamento Secundário: {teamData.alternative_jersey}
                </Typography>
              </Box>
              {nextGame && (
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                      {nextGame.home_team.short_name}
                    </span>
                    <img
                      src={nextGame.home_team.logo_url}
                      alt={nextGame.home_team.short_name}
                      style={{ width: "30px", marginRight: "10px" }}
                    />
                    <Typography variant="body2" sx={{ marginRight: "10px" }}>
                      VS
                    </Typography>
                    <img
                      src={nextGame.away_team.logo_url}
                      alt={nextGame.away_team.short_name}
                      style={{ width: "30px", marginRight: "10px" }}
                    />
                    <span style={{ fontWeight: "bold" }}>
                      {nextGame.away_team.short_name}
                    </span>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="body2">
                      {nextGame.match_date
                        ? dayjs(nextGame.match_date).format("DD/MM/YYYY")
                        : "Data a definir"}{" "}
                      - {nextGame.home_team.stadium_name}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>

          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{ marginBottom: 2 }}
          >
            <Tab label="Calendário" />
            <Tab label="Plantel" />
          </Tabs>

          {tabIndex === 0 && (
            <Box sx={{ marginTop: 2 }}>
              <TableContainer>
                <Table>
                  <TableBody>
                    {teamFixtures.map((match, index) => {
                      const matchResult = determineMatchResult(
                        match.home_goals,
                        match.away_goals
                      );
                      return (
                        <TableRow
                          onClick={() => router.push(`/Jogos/${match.id}`)} // Navigate to Match day Page on click
                          key={match.id}
                          sx={{
                            cursor: "pointer",
                            borderBottom: "none",
                            backgroundColor:
                              index % 2 !== 0
                                ? "rgba(165, 132, 224, 0.1)"
                                : "inherit",
                            "&:hover": {
                              backgroundColor: "rgba(165, 132, 224, 0.2)",
                            },
                          }}
                        >
                          <TableCell>
                            {match.match_date
                              ? dayjs(match.match_date).format("DD/MM/YYYY")
                              : "Data a definir"}
                            {match.match_time && (
                              <Typography variant="body2">
                                {match.match_time}
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="flex-end"
                            >
                              <span
                                style={{
                                  fontWeight:
                                    matchResult === "home_win"
                                      ? "bold"
                                      : "normal",
                                  color:
                                    matchResult === "home_win"
                                      ? "green"
                                      : "inherit",
                                }}
                              >
                                {match.home_team.short_name}
                              </span>
                              <img
                                src={match.home_team.logo_url}
                                alt={match.home_team.short_name}
                                style={{ width: "30px", marginLeft: "10px" }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell
                            style={{
                              borderBottom: "none",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {match.home_goals !== null &&
                            match.away_goals !== null ? (
                              <span
                                style={{
                                  color:
                                    matchResult === "draw"
                                      ? "gray"
                                      : matchResult === "home_win"
                                        ? "green"
                                        : "red",
                                }}
                              >
                                {match.home_goals} - {match.away_goals}
                              </span>
                            ) : (
                              <Typography
                                sx={{ fontWeight: "bold" }}
                                color="textSecondary"
                              >
                                VS
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <img
                                src={match.away_team.logo_url}
                                alt={match.away_team.short_name}
                                style={{ width: "30px", marginRight: "10px" }}
                              />
                              <span
                                style={{
                                  fontWeight:
                                    matchResult === "away_win"
                                      ? "bold"
                                      : "normal",
                                  color:
                                    matchResult === "away_win"
                                      ? "green"
                                      : "inherit",
                                }}
                              >
                                {match.away_team.short_name}
                              </span>
                            </Box>
                          </TableCell>

                          <TableCell>{match.home_team.stadium_name}</TableCell>
                          <TableCell>
                            {renderCompetitionDetails(match)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {tabIndex === 1 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                }, // Responsive grid
                gap: 1,
              }}
            >
              {players.map((player, index) => (
                <Box
                  key={player.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "5px 0",
                    width: "100%",
                  }}
                >
                  <Avatar
                    alt={player.name}
                    src={player.photo_url}
                    sx={{ width: 70, height: 70, marginRight: 1 }} // Avatar size
                  />
                  <Typography variant="body1">{player.name}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default TeamPage;
