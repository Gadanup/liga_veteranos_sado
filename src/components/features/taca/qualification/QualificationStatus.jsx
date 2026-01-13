import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import {
  EmojiEvents,
  CheckCircle,
  Star,
  TrendingUp,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme";

/**
 * QualificationStatus Component
 * Displays the qualification status and Final Four qualified teams
 * Shows which teams qualified and by what method (1st place, best 2nd place)
 *
 * @param {Array} qualifiers - Array of qualified teams from cup_group_qualifiers view
 * @param {boolean} isMobile - Whether the view is mobile
 */
const QualificationStatus = ({ qualifiers, isMobile }) => {
  // Group qualifiers by qualification type
  const groupWinners =
    qualifiers?.filter(
      (q) =>
        q.qualification_type?.includes("1º") ||
        q.qualification_type?.includes("Vencedor")
    ) || [];

  const bestSecond =
    qualifiers?.filter(
      (q) =>
        q.qualification_type?.includes("2º") ||
        q.qualification_type?.includes("segundo")
    ) || [];

  // No qualifiers yet
  if (!qualifiers || qualifiers.length === 0) {
    return (
      <Paper
        sx={{
          padding: isMobile ? 3 : 4,
          backgroundColor: theme.colors.background.card,
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.md,
          textAlign: "center",
        }}
      >
        <EmojiEvents
          sx={{
            fontSize: isMobile ? 48 : 64,
            color: theme.colors.text.disabled,
            marginBottom: 2,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.secondary,
            marginBottom: 1,
            fontSize: isMobile ? "16px" : "20px",
          }}
        >
          Apuramento em Curso
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.secondary,
            fontSize: isMobile ? "13px" : "14px",
          }}
        >
          As equipas apuradas serão exibidas aqui quando a fase de grupos
          estiver completa
        </Typography>
      </Paper>
    );
  }

  // Render a qualified team card
  const renderTeamCard = (team, rank, isSecondPlace = false) => (
    <Box
      key={team.team_id}
      sx={{
        padding: isMobile ? theme.spacing.md : theme.spacing.lg,
        backgroundColor: isSecondPlace
          ? `${theme.colors.warning[50]}`
          : `${theme.colors.success[50]}`,
        borderRadius: theme.borderRadius.lg,
        border: isSecondPlace
          ? `2px solid ${theme.colors.warning[400]}`
          : `2px solid ${theme.colors.success[400]}`,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows.lg,
        },
      }}
    >
      {/* Team Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flex: 1,
        }}
      >
        {/* Rank Badge */}
        <Box
          sx={{
            minWidth: isMobile ? "32px" : "40px",
            height: isMobile ? "32px" : "40px",
            borderRadius: "50%",
            backgroundColor: isSecondPlace
              ? theme.colors.warning[500]
              : theme.colors.success[500],
            color: theme.colors.text.inverse,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: theme.typography.fontWeight.bold,
            fontSize: isMobile ? "16px" : "18px",
          }}
        >
          {rank}
        </Box>

        {/* Team Logo and Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
          {team.logo_url && (
            <img
              src={team.logo_url}
              alt={team.team_name}
              style={{
                width: isMobile ? "32px" : "40px",
                height: isMobile ? "32px" : "40px",
                objectFit: "contain",
              }}
            />
          )}
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              {team.team_name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.secondary,
                fontSize: isMobile ? "11px" : "12px",
              }}
            >
              Grupo {team.group_name}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Qualification Type Badge */}
      <Chip
        icon={isSecondPlace ? <TrendingUp /> : <Star />}
        label={team.qualification_type}
        size={isMobile ? "small" : "medium"}
        sx={{
          backgroundColor: isSecondPlace
            ? theme.colors.warning[500]
            : theme.colors.success[500],
          color: theme.colors.text.inverse,
          fontWeight: theme.typography.fontWeight.bold,
          fontSize: isMobile ? "11px" : "12px",
          "& .MuiChip-icon": {
            color: theme.colors.text.inverse,
          },
        }}
      />

      {/* Stats */}
      {!isMobile && (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            paddingLeft: 2,
            borderLeft: `2px solid ${
              isSecondPlace
                ? theme.colors.warning[300]
                : theme.colors.success[300]
            }`,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.secondary,
                display: "block",
                fontSize: "11px",
              }}
            >
              PTS
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
              }}
            >
              {team.points}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.secondary,
                display: "block",
                fontSize: "11px",
              }}
            >
              DG
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                color:
                  team.goal_difference > 0
                    ? theme.colors.success[600]
                    : team.goal_difference < 0
                      ? theme.colors.error[600]
                      : theme.colors.text.primary,
              }}
            >
              {team.goal_difference > 0 ? "+" : ""}
              {team.goal_difference}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.secondary,
                display: "block",
                fontSize: "11px",
              }}
            >
              GF
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
              }}
            >
              {team.goals_for}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginBottom: 3,
        }}
      >
        <CheckCircle
          sx={{
            fontSize: isMobile ? 32 : 40,
            color: theme.colors.success[500],
          }}
        />
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              fontSize: isMobile ? "18px" : "24px",
            }}
          >
            Equipas Apuradas para o Final Four
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              fontSize: isMobile ? "12px" : "14px",
            }}
          >
            {qualifiers.length} equipas qualificadas
          </Typography>
        </Box>
      </Box>

      {/* Group Winners Section */}
      {groupWinners.length > 0 && (
        <Box sx={{ marginBottom: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginBottom: 2,
            }}
          >
            <Star
              sx={{
                fontSize: isMobile ? 20 : 24,
                color: theme.colors.success[500],
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                fontSize: isMobile ? "16px" : "18px",
              }}
            >
              Vencedores de Grupo
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {groupWinners.map((team, index) =>
              renderTeamCard(team, index + 1, false)
            )}
          </Box>
        </Box>
      )}

      {/* Best Second Place Section */}
      {bestSecond.length > 0 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginBottom: 2,
            }}
          >
            <TrendingUp
              sx={{
                fontSize: isMobile ? 20 : 24,
                color: theme.colors.warning[500],
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                fontSize: isMobile ? "16px" : "18px",
              }}
            >
              Melhor 2º Classificado
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {bestSecond.map((team) => renderTeamCard(team, 4, true))}
          </Box>
        </Box>
      )}

      {/* Info Box */}
      <Paper
        sx={{
          marginTop: 3,
          padding: isMobile ? 2 : 3,
          backgroundColor: `${theme.colors.secondary[50]}`,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.secondary[200]}`,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.secondary,
            fontSize: isMobile ? "12px" : "13px",
            lineHeight: 1.6,
          }}
        >
          <strong>Critérios de Apuramento:</strong> Os 3 primeiros classificados
          de cada grupo apuram-se automaticamente. O melhor 2º classificado (por
          pontos, diferença de golos e golos marcados) também se apura,
          perfazendo as 4 equipas do Final Four.
        </Typography>
      </Paper>

      {/* Semifinal Matchups Info */}
      {qualifiers.length === 4 && (
        <Paper
          sx={{
            marginTop: 2,
            padding: isMobile ? 2 : 3,
            backgroundColor: `${theme.colors.primary[50]}`,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.primary[200]}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: theme.typography.fontWeight.semibold,
              marginBottom: 1,
              fontSize: isMobile ? "13px" : "14px",
            }}
          >
            🏆 Meias-Finais:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              fontSize: isMobile ? "12px" : "13px",
              lineHeight: 1.6,
            }}
          >
            • <strong>Meia-Final 1:</strong> Melhor 1º classificado vs Melhor 2º
            classificado
            <br />• <strong>Meia-Final 2:</strong> 2º melhor 1º classificado vs
            3º melhor 1º classificado
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default QualificationStatus;
