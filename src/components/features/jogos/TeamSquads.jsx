import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Avatar,
  Collapse,
  IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { theme } from "../../../styles/theme.js";

/**
 * TeamSquads Component
 * Displays both team's squad lists with suspended players highlighted
 *
 * @param {Object} matchDetails - Match information
 * @param {Array} currentHomePlayers - Current home team players
 * @param {Array} currentAwayPlayers - Current away team players
 * @param {Array} suspendedPlayerIds - Array of suspended player IDs
 */
const TeamSquads = ({
  matchDetails,
  currentHomePlayers,
  currentAwayPlayers,
  suspendedPlayerIds,
}) => {
  const [homeSquadExpanded, setHomeSquadExpanded] = useState(false);
  const [awaySquadExpanded, setAwaySquadExpanded] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const TeamSquadCard = ({ team, players, expanded, setExpanded }) => (
    <Card sx={{ borderRadius: "16px", height: "100%" }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          mb={isMobile ? 0 : 3}
          onClick={isMobile ? () => setExpanded(!expanded) : undefined}
          sx={{
            cursor: isMobile ? "pointer" : "default",
            "&:hover": isMobile
              ? {
                  backgroundColor: theme.colors.background.tertiary,
                  borderRadius: "8px",
                }
              : {},
            padding: isMobile ? "8px" : "0",
            marginX: isMobile ? "-8px" : "0",
            transition: theme.transitions.normal,
          }}
        >
          <Avatar
            src={team.logo_url}
            alt={team.short_name}
            sx={{ width: 40, height: 40 }}
          />
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.primary[600],
              fontWeight: "bold",
              flex: 1,
            }}
          >
            Jogadores {team.short_name}
          </Typography>
          {isMobile && (
            <IconButton size="small" sx={{ color: theme.colors.primary[600] }}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Box>

        <Collapse in={!isMobile || expanded} timeout="auto" unmountOnExit>
          <Grid container spacing={1}>
            {players
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((player) => (
                <Grid item xs={12} sm={6} key={player.id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    p={1}
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: suspendedPlayerIds.includes(player.id)
                        ? theme.colors.error[50]
                        : theme.colors.background.tertiary,
                      border: suspendedPlayerIds.includes(player.id)
                        ? `1px solid ${theme.colors.error[300]}`
                        : "1px solid transparent",
                    }}
                  >
                    <Avatar
                      src={player.photo_url}
                      alt={player.name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box flex={1} minWidth={0}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "medium",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: suspendedPlayerIds.includes(player.id)
                            ? theme.colors.error[700]
                            : theme.colors.text.primary,
                        }}
                      >
                        {player.name}
                        {player.joker && " (JK)"}
                      </Typography>
                      {suspendedPlayerIds.includes(player.id) && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.colors.error[600],
                            fontWeight: "bold",
                          }}
                        >
                          Suspenso
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TeamSquadCard
          team={matchDetails.home_team}
          players={currentHomePlayers}
          expanded={homeSquadExpanded}
          setExpanded={setHomeSquadExpanded}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TeamSquadCard
          team={matchDetails.away_team}
          players={currentAwayPlayers}
          expanded={awaySquadExpanded}
          setExpanded={setAwaySquadExpanded}
        />
      </Grid>
    </Grid>
  );
};

export default TeamSquads;
