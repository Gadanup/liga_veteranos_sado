import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { SportsSoccer, Shield } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";
import CardIcon from "./CardIcon";

/**
 * MatchStatistics Component
 * Displays goalscorers and disciplinary cards for both teams
 *
 * @param {Object} matchDetails - Match information
 * @param {Array} homePlayers - Home team players
 * @param {Array} awayPlayers - Away team players
 * @param {Array} matchEvents - Match events (goals, cards)
 * @param {Array} playersData - Players data for events
 */
const MatchStatistics = ({
  matchDetails,
  homePlayers,
  awayPlayers,
  matchEvents,
  playersData,
}) => {
  const isMobile = window.innerWidth <= 768;

  const getGoalscorers = (teamId) => {
    const isHomeTeam = teamId === matchDetails.home_team.id;
    const teamPlayers = isHomeTeam ? homePlayers : awayPlayers;

    const goalscorerCounts = matchEvents
      .filter((event) => event.event_type === 1)
      .reduce((acc, event) => {
        const player = teamPlayers.find(
          (p) => p.id === event.player_id || p.previousClub === event.player_id
        );
        if (player) {
          acc[player.name] = (acc[player.name] || 0) + 1;
        }
        return acc;
      }, {});

    const ownGoals = matchEvents
      .filter(
        (event) =>
          event.event_type === 4 &&
          ((isHomeTeam &&
            awayPlayers.some(
              (p) =>
                p.id === event.player_id || p.previousClub === event.player_id
            )) ||
            (!isHomeTeam &&
              homePlayers.some(
                (p) =>
                  p.id === event.player_id || p.previousClub === event.player_id
              )))
      )
      .map(() => "Auto-Golo");

    const allGoals = [
      ...Object.entries(goalscorerCounts).map(
        ([name, count]) => `${name} (${count})`
      ),
      ...ownGoals,
    ];

    return allGoals;
  };

  const getCards = (teamId) => {
    const playerEvents = {};

    matchEvents
      .filter(
        (event) =>
          event.event_type === 2 || // Yellow
          event.event_type === 3 || // Red
          event.event_type === 5 // Double yellow
      )
      .forEach((event) => {
        const player = playersData.find((p) => p.id === event.player_id);
        if (!player) return;

        if (player.team_id === teamId) {
          if (!playerEvents[player.id]) {
            playerEvents[player.id] = { cards: [] };
          }
          if (event.event_type === 2) {
            playerEvents[player.id].cards.push("yellow");
          } else if (event.event_type === 3) {
            playerEvents[player.id].cards.push("red");
          } else if (event.event_type === 5) {
            playerEvents[player.id].cards.push("double-yellow");
          }
        }
      });

    Object.values(playerEvents).forEach((entry) => {
      if (entry.cards.includes("double-yellow")) {
        entry.cards = entry.cards.filter((card) => card !== "red");
      }
    });

    const cardEvents = Object.keys(playerEvents).map((playerId) => {
      const player = playersData.find((p) => p.id === parseInt(playerId, 10));
      return {
        name: player?.name || "Unknown",
        cards: playerEvents[playerId].cards,
      };
    });

    return cardEvents.filter((ce) => ce.cards.length > 0);
  };

  const TeamStats = ({ team, teamId }) => (
    <Card sx={{ height: "100%", borderRadius: "16px" }}>
      <CardContent>
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.primary[600],
              fontWeight: "bold",
            }}
          >
            {team.short_name}
          </Typography>
        </Box>

        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 3 : 4}
        >
          {/* Goals */}
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SportsSoccer sx={{ color: theme.colors.sports.goals }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Marcadores
              </Typography>
            </Box>
            {getGoalscorers(teamId).length > 0 ? (
              getGoalscorers(teamId).map((goalscorer, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 0.5, pl: 4 }}>
                  ⚽ {goalscorer}
                </Typography>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{ pl: 4, color: theme.colors.text.secondary }}
              >
                Sem marcadores
              </Typography>
            )}
          </Box>

          {!isMobile && (
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          )}

          {/* Cards */}
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Shield sx={{ color: theme.colors.warning[500] }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Disciplina
              </Typography>
            </Box>
            {getCards(teamId).length > 0 ? (
              getCards(teamId).map((cardEvent, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={0.5}
                  sx={{ pl: 4 }}
                >
                  <Typography variant="body1">{cardEvent.name}</Typography>
                  {cardEvent.cards.map((cardType, cardIndex) => (
                    <CardIcon key={cardIndex} cardType={cardType} />
                  ))}
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{ pl: 4, color: theme.colors.text.secondary }}
              >
                Sem cartões
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} md={6}>
        <TeamStats
          team={matchDetails.home_team}
          teamId={matchDetails.home_team.id}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TeamStats
          team={matchDetails.away_team}
          teamId={matchDetails.away_team.id}
        />
      </Grid>
    </Grid>
  );
};

export default MatchStatistics;
