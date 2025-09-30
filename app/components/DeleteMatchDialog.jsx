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
} from "@mui/material";
import { Close, Warning, SportsSoccer } from "@mui/icons-material";
import { theme } from "../../styles/theme";
import dayjs from "dayjs";

const DeleteMatchDialog = ({ open, onClose, onConfirm, match }) => {
  if (!match) return null;

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
          <SportsSoccer
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
            Tem a certeza que deseja eliminar este jogo?
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
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              mb={2}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <img
                  src={match.home_team.logo_url}
                  alt={match.home_team.short_name}
                  style={{ width: 32, height: 32, objectFit: "contain" }}
                />
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: theme.colors.text.primary }}
                >
                  {match.home_team.short_name}
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  color: theme.colors.neutral[500],
                  fontWeight: "bold",
                }}
              >
                VS
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <img
                  src={match.away_team.logo_url}
                  alt={match.away_team.short_name}
                  style={{ width: 32, height: 32, objectFit: "contain" }}
                />
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: theme.colors.text.primary }}
                >
                  {match.away_team.short_name}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: theme.colors.text.secondary }}
            >
              {dayjs(match.match_date).format("DD/MM/YYYY")}
              {match.match_time && ` • ${match.match_time}`}
            </Typography>
          </Box>

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

export default DeleteMatchDialog;
