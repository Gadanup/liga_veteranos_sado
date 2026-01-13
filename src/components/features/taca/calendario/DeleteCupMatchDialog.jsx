"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  Chip,
} from "@mui/material";
import { Close, Warning, EmojiEvents } from "@mui/icons-material";
import { theme } from "../../../../styles/theme";
import dayjs from "dayjs";

/**
 * DeleteCupMatchDialog Component
 * Confirmation dialog for deleting Cup matches with standings recalculation warning
 *
 * @param {boolean} open - Dialog open state
 * @param {Function} onClose - Close callback
 * @param {Function} onConfirm - Confirm deletion callback
 * @param {Object} match - Match object to delete
 * @param {boolean} hasGroupStage - Whether match is in group stage (affects warning)
 */
const DeleteCupMatchDialog = ({
  open,
  onClose,
  onConfirm,
  match,
  hasGroupStage = false,
}) => {
  if (!match) return null;

  // Determine if match affects group standings
  const affectsStandings = match.group_name && match.home_goals !== null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: theme.colors.background.card,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Warning sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Confirmar Eliminação
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box textAlign="center" py={2}>
          <EmojiEvents
            sx={{
              fontSize: 60,
              color: theme.colors.neutral[300],
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Tem a certeza que deseja eliminar este jogo da Taça?
          </Typography>

          {/* Match Info */}
          <Box
            sx={{
              backgroundColor: theme.colors.background.secondary,
              borderRadius: "12px",
              padding: 3,
              mt: 3,
            }}
          >
            {/* Group/Round Badge */}
            {(match.group_name || match.round) && (
              <Box display="flex" justifyContent="center" mb={2}>
                <Chip
                  label={
                    match.group_name ? `Grupo ${match.group_name}` : match.round
                  }
                  size="small"
                  sx={{
                    backgroundColor: match.group_name
                      ? theme.colors.success[100]
                      : theme.colors.accent[100],
                    color: match.group_name
                      ? theme.colors.success[700]
                      : theme.colors.accent[700],
                    fontWeight: theme.typography.fontWeight.bold,
                  }}
                />
              </Box>
            )}

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              mb={2}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {match.home_team?.logo_url && (
                  <img
                    src={match.home_team.logo_url}
                    alt={match.home_team.short_name}
                    style={{ width: 32, height: 32, objectFit: "contain" }}
                  />
                )}
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: theme.colors.text.primary }}
                >
                  {match.home_team?.short_name}
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: theme.colors.neutral[500],
                  fontWeight: "bold",
                }}
              >
                {match.home_goals !== null && match.away_goals !== null
                  ? `${match.home_goals} - ${match.away_goals}`
                  : "VS"}
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                {match.away_team?.logo_url && (
                  <img
                    src={match.away_team.logo_url}
                    alt={match.away_team.short_name}
                    style={{ width: 32, height: 32, objectFit: "contain" }}
                  />
                )}
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: theme.colors.text.primary }}
                >
                  {match.away_team?.short_name}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: theme.colors.text.secondary }}
            >
              {dayjs(match.match_date).format("DD/MM/YYYY")}
              {match.match_time && ` • ${match.match_time.slice(0, 5)}`}
            </Typography>
          </Box>

          {/* Warning for Group Stage Matches */}
          {affectsStandings && (
            <Alert severity="warning" sx={{ mt: 3, textAlign: "left" }}>
              <Typography variant="body2" fontWeight="bold" mb={0.5}>
                ⚠️ Atenção: Recálculo de Classificação
              </Typography>
              <Typography variant="body2">
                Este jogo já foi realizado e afeta a classificação do{" "}
                <strong>Grupo {match.group_name}</strong>. Ao eliminá-lo, as
                classificações serão automaticamente recalculadas.
              </Typography>
            </Alert>
          )}

          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              mt: 3,
              fontStyle: "italic",
            }}
          >
            Esta ação não pode ser revertida.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            py: 1.5,
            borderColor: theme.colors.neutral[300],
            color: theme.colors.text.secondary,
            fontWeight: 600,
            "&:hover": {
              borderColor: theme.colors.neutral[400],
              backgroundColor: theme.colors.neutral[50],
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            py: 1.5,
            backgroundColor: "#ef4444",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#dc2626",
            },
          }}
        >
          Eliminar Jogo
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCupMatchDialog;
