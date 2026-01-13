import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Popover,
} from "@mui/material";
import {
  CalendarToday,
  LocationOn,
  AccessTime,
  Edit,
  Delete,
  Block,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { supabase } from "../../../../lib/supabase";
import { theme } from "../../../../styles/theme.js";
import DeleteCupMatchDialog from "./DeleteCupMatchDialog";
import EditCupMatchDialog from "./EditCupMatchDialog";

/**
 * CupMatchCard Component
 * Displays Cup match with EXACT Liga design + group badge for identification
 *
 * @param {Object} match - Match data
 * @param {boolean} isAdmin - Whether user has admin privileges
 * @param {Function} onUpdate - Callback when match is updated/deleted
 */
const CupMatchCard = ({ match, isAdmin, onUpdate }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [suspendedPlayers, setSuspendedPlayers] = useState({
    home: [],
    away: [],
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverTeam, setPopoverTeam] = useState(null);

  // Fetch suspended players for both teams
  useEffect(() => {
    const fetchSuspendedPlayers = async () => {
      const { data: suspensions, error } = await supabase
        .from("suspensions")
        .select(`player_id, players!inner (name, team_id)`)
        .eq("active", true)
        .eq("season", match.season)
        .in("players.team_id", [match.home_team_id, match.away_team_id]);

      if (!error && suspensions) {
        const homeSuspended = suspensions
          .filter((s) => s.players.team_id === match.home_team_id)
          .map((s) => s.players.name);

        const awaySuspended = suspensions
          .filter((s) => s.players.team_id === match.away_team_id)
          .map((s) => s.players.name);

        setSuspendedPlayers({
          home: homeSuspended,
          away: awaySuspended,
        });
      }
    };

    fetchSuspendedPlayers();
  }, [match]);

  const handleSuspensionClick = (event, team) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setPopoverTeam(team);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverTeam(null);
  };

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

  const handleDelete = async () => {
    const { error } = await supabase
      .from("matches")
      .delete()
      .eq("id", match.id);

    if (!error) {
      setDeleteDialogOpen(false);
      onUpdate();
    }
  };

  const result = determineMatchResult(match.home_goals, match.away_goals);
  const isPlayed = result !== null;
  const hasSuspensions =
    suspendedPlayers.home.length > 0 || suspendedPlayers.away.length > 0;

  const SuspensionBadge = ({ team, count }) => {
    if (count === 0) return null;

    return (
      <Box
        sx={{
          position: "absolute",
          top: -4,
          right: -4,
          backgroundColor: "#ef4444",
          color: "white",
          borderRadius: "50%",
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: "bold",
          border: "2px solid white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {count}
      </Box>
    );
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Card
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
            "& .admin-actions": {
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
        {/* Admin Actions */}
        {isAdmin && (
          <Box
            className="admin-actions"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 0.5,
              opacity: 0,
              transition: "opacity 0.3s ease",
              zIndex: 10,
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setEditDialogOpen(true);
              }}
              sx={{
                backgroundColor: "rgba(255,255,255,0.95)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:hover": {
                  backgroundColor: theme.colors.primary[600],
                  color: "white",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
              sx={{
                backgroundColor: "rgba(255,255,255,0.95)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:hover": {
                  backgroundColor: "#ef4444",
                  color: "white",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s",
              }}
            >
              <Delete sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}

        <CardContent
          onClick={() => router.push(`/jogos/${match.id}`)}
          sx={{
            padding: "20px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: hasSuspensions ? "32px" : "20px",
          }}
        >
          {/* Status Chip + Group Badge */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
            mb={1}
          >
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
            {/* Group Badge - Shows which group this match belongs to */}
            {match.group_name && (
              <Chip
                label={`Grupo ${match.group_name}`}
                size="small"
                sx={{
                  backgroundColor: theme.colors.success[100],
                  color: theme.colors.success[700],
                  fontWeight: "bold",
                  fontSize: "11px",
                  height: "24px",
                  border: `1px solid ${theme.colors.success[500]}`,
                }}
              />
            )}
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
                sx={{ position: "relative" }}
                onClick={(e) => {
                  if (suspendedPlayers.home.length > 0) {
                    handleSuspensionClick(e, "home");
                  }
                }}
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
                    border: `2px solid ${
                      suspendedPlayers.home.length > 0
                        ? "#ef4444"
                        : theme.colors.border.primary
                    }`,
                    cursor:
                      suspendedPlayers.home.length > 0 ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    "&:hover":
                      suspendedPlayers.home.length > 0
                        ? {
                            transform: "scale(1.1)",
                            boxShadow: "0 4px 8px rgba(239, 68, 68, 0.3)",
                          }
                        : {},
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
                <SuspensionBadge
                  team="home"
                  count={suspendedPlayers.home.length}
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
                sx={{ position: "relative" }}
                onClick={(e) => {
                  if (suspendedPlayers.away.length > 0) {
                    handleSuspensionClick(e, "away");
                  }
                }}
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
                    border: `2px solid ${
                      suspendedPlayers.away.length > 0
                        ? "#ef4444"
                        : theme.colors.border.primary
                    }`,
                    cursor:
                      suspendedPlayers.away.length > 0 ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    "&:hover":
                      suspendedPlayers.away.length > 0
                        ? {
                            transform: "scale(1.1)",
                            boxShadow: "0 4px 8px rgba(239, 68, 68, 0.3)",
                          }
                        : {},
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
                <SuspensionBadge
                  team="away"
                  count={suspendedPlayers.away.length}
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
              borderRadius: "12px",
            }}
          >
            <LocationOn
              sx={{ fontSize: 14, color: theme.colors.primary[600] }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.colors.text.secondary,
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {match.home_team.stadium_name || "Estádio a definir"}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Suspended Players Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPopover-paper": {
            borderRadius: "12px",
            padding: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            border: `2px solid #ef4444`,
            marginTop: 1,
          },
        }}
      >
        <Box sx={{ minWidth: 200 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <Block sx={{ color: "#ef4444", fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight="bold">
              Jogadores Suspensos
            </Typography>
          </Box>
          {popoverTeam === "home" &&
            suspendedPlayers.home.map((player, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: theme.colors.text.secondary,
                  py: 0.5,
                  borderBottom:
                    index < suspendedPlayers.home.length - 1
                      ? `1px solid ${theme.colors.border.primary}`
                      : "none",
                }}
              >
                • {player}
              </Typography>
            ))}
          {popoverTeam === "away" &&
            suspendedPlayers.away.map((player, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: theme.colors.text.secondary,
                  py: 0.5,
                  borderBottom:
                    index < suspendedPlayers.away.length - 1
                      ? `1px solid ${theme.colors.border.primary}`
                      : "none",
                }}
              >
                • {player}
              </Typography>
            ))}
        </Box>
      </Popover>

      {/* Delete Dialog */}
      <DeleteCupMatchDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        match={match}
        hasGroupStage={!!match.group_name}
      />

      {/* Edit Dialog */}
      <EditCupMatchDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={() => {
          setEditDialogOpen(false);
          onUpdate();
        }}
        match={match}
        cupGroupStage={
          !!match.group_name ||
          match.round === "Semifinal" ||
          match.round === "Final"
        }
      />
    </>
  );
};

export default CupMatchCard;
