import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import { Close, CompareArrows } from "@mui/icons-material";
import { supabase } from "../../../..//lib/supabase";

/**
 * ComparisonModal Component
 * Allows users to compare two teams side-by-side
 */
const ComparisonModal = ({
  open,
  onClose,
  classification,
  selectedSeason,
  theme,
}) => {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [h2hData, setH2hData] = useState(null);

  const teamAData = classification.find((t) => t.team_id === teamA);
  const teamBData = classification.find((t) => t.team_id === teamB);

  // Fetch head-to-head data
  useEffect(() => {
    const fetchH2H = async () => {
      if (!teamA || !teamB || !selectedSeason) return;

      const { data: matches, error } = await supabase
        .from("matches")
        .select(
          "id, home_team_id, away_team_id, home_goals, away_goals, match_date"
        )
        .eq("season", selectedSeason)
        .or(
          `and(home_team_id.eq.${teamA},away_team_id.eq.${teamB}),and(home_team_id.eq.${teamB},away_team_id.eq.${teamA})`
        )
        .not("home_goals", "is", null)
        .not("away_goals", "is", null);

      if (!error && matches) {
        let teamAWins = 0;
        let teamBWins = 0;
        let draws = 0;

        matches.forEach((match) => {
          if (match.home_team_id === teamA) {
            if (match.home_goals > match.away_goals) teamAWins++;
            else if (match.home_goals < match.away_goals) teamBWins++;
            else draws++;
          } else {
            if (match.away_goals > match.home_goals) teamAWins++;
            else if (match.away_goals < match.home_goals) teamBWins++;
            else draws++;
          }
        });

        setH2hData({
          teamAWins,
          teamBWins,
          draws,
          totalMatches: matches.length,
        });
      }
    };

    fetchH2H();
  }, [teamA, teamB, selectedSeason]);

  const StatComparison = ({ label, valueA, valueB, higherIsBetter = true }) => {
    const aIsWinner = higherIsBetter ? valueA > valueB : valueA < valueB;
    const bIsWinner = higherIsBetter ? valueB > valueA : valueB < valueA;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: theme.colors.text.secondary,
            display: "block",
            textAlign: "center",
            mb: 1,
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "11px",
          }}
        >
          {label}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={5}>
            <Box
              sx={{
                textAlign: "center",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: aIsWinner
                  ? theme.colors.success[50]
                  : theme.colors.background.tertiary,
                border: `2px solid ${
                  aIsWinner
                    ? theme.colors.success[300]
                    : theme.colors.border.primary
                }`,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: aIsWinner
                    ? theme.colors.success[700]
                    : theme.colors.text.primary,
                }}
              >
                {valueA}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: theme.colors.text.tertiary }}
            >
              vs
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Box
              sx={{
                textAlign: "center",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: bIsWinner
                  ? theme.colors.success[50]
                  : theme.colors.background.tertiary,
                border: `2px solid ${
                  bIsWinner
                    ? theme.colors.success[300]
                    : theme.colors.border.primary
                }`,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: bIsWinner
                    ? theme.colors.success[700]
                    : theme.colors.text.primary,
                }}
              >
                {valueB}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handleClose = () => {
    setTeamA("");
    setTeamB("");
    setH2hData(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: theme.colors.background.card,
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
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <CompareArrows sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Comparar Equipas
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 4 }}>
        {/* Team Selectors */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={5}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, mt: 1, fontWeight: 600 }}
            >
              Equipa A
            </Typography>
            <Select
              fullWidth
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.colors.primary[300],
                },
              }}
            >
              <MenuItem value="" disabled>
                Selecionar equipa
              </MenuItem>
              {classification
                .filter((t) => !t.teams.excluded && t.team_id !== teamB)
                .map((team) => (
                  <MenuItem key={team.team_id} value={team.team_id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={team.teams.logo_url}
                        sx={{ width: 24, height: 24 }}
                      />
                      {team.teams.short_name}
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </Grid>

          <Grid
            item
            xs={12}
            sm={2}
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
          >
            <CompareArrows
              sx={{
                fontSize: 32,
                color: theme.colors.primary[600],
                mb: 1,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, mt: 1, fontWeight: 600 }}
            >
              Equipa B
            </Typography>
            <Select
              fullWidth
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.colors.accent[300],
                },
              }}
            >
              <MenuItem value="" disabled>
                Selecionar equipa
              </MenuItem>
              {classification
                .filter((t) => !t.teams.excluded && t.team_id !== teamA)
                .map((team) => (
                  <MenuItem key={team.team_id} value={team.team_id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={team.teams.logo_url}
                        sx={{ width: 24, height: 24 }}
                      />
                      {team.teams.short_name}
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </Grid>
        </Grid>

        {/* Comparison Results */}
        {teamAData && teamBData && (
          <>
            {/* Team Headers */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={5}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    src={teamAData.teams.logo_url}
                    sx={{ width: 64, height: 64, mb: 1 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {teamAData.teams.short_name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={5}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    src={teamBData.teams.logo_url}
                    sx={{ width: 64, height: 64, mb: 1 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {teamBData.teams.short_name}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Head-to-Head */}
            {h2hData && h2hData.totalMatches > 0 && (
              <>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: theme.colors.primary[600],
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  Confrontos Diretos ({h2hData.totalMatches} jogos)
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        textAlign: "center",
                        padding: "16px",
                        borderRadius: "12px",
                        backgroundColor: theme.colors.sports.win + "20",
                        border: `2px solid ${theme.colors.sports.win}`,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "bold",
                          color: theme.colors.sports.win,
                        }}
                      >
                        {h2hData.teamAWins}
                      </Typography>
                      <Typography variant="caption">Vitórias</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        textAlign: "center",
                        padding: "16px",
                        borderRadius: "12px",
                        backgroundColor: theme.colors.sports.draw + "20",
                        border: `2px solid ${theme.colors.sports.draw}`,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "bold",
                          color: theme.colors.sports.draw,
                        }}
                      >
                        {h2hData.draws}
                      </Typography>
                      <Typography variant="caption">Empates</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        textAlign: "center",
                        padding: "16px",
                        borderRadius: "12px",
                        backgroundColor: theme.colors.sports.win + "20",
                        border: `2px solid ${theme.colors.sports.win}`,
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "bold",
                          color: theme.colors.sports.win,
                        }}
                      >
                        {h2hData.teamBWins}
                      </Typography>
                      <Typography variant="caption">Vitórias</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
              </>
            )}

            {/* Stats Comparison */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: theme.colors.primary[600],
                mb: 2,
                textAlign: "center",
              }}
            >
              Estatísticas da Época
            </Typography>

            <StatComparison
              label="Pontos"
              valueA={teamAData.points}
              valueB={teamBData.points}
            />
            <StatComparison
              label="Vitórias"
              valueA={teamAData.wins}
              valueB={teamBData.wins}
            />
            <StatComparison
              label="Golos Marcados"
              valueA={teamAData.goals_for}
              valueB={teamBData.goals_for}
            />
            <StatComparison
              label="Golos Sofridos"
              valueA={teamAData.goals_against}
              valueB={teamBData.goals_against}
              higherIsBetter={false}
            />
            <StatComparison
              label="Diferença de Golos"
              valueA={teamAData.goals_for - teamAData.goals_against}
              valueB={teamBData.goals_for - teamBData.goals_against}
            />
          </>
        )}

        {!teamAData || !teamBData ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: theme.colors.text.secondary,
            }}
          >
            <CompareArrows sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
            <Typography variant="body1">
              Selecione duas equipas para comparar
            </Typography>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComparisonModal;
