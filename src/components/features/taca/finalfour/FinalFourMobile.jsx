import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { EmojiEvents, ArrowDownward } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { theme } from "../../../../styles/theme";

/**
 * FinalFourMobile Component
 * Displays the Final Four bracket in vertical mobile layout
 *
 * @param {Object} semifinal1 - First semifinal match
 * @param {Object} semifinal2 - Second semifinal match
 * @param {Object} final - Final match
 * @param {Object} qualifiers - Qualified teams information
 */
const FinalFourMobile = ({ semifinal1, semifinal2, final, qualifiers }) => {
  const router = useRouter();

  const handleMatchClick = (matchId) => {
    if (matchId) {
      router.push(`/jogos/${matchId}`);
    }
  };

  // Determine match winner
  const getWinner = (match) => {
    if (!match || match.home_goals === null || match.away_goals === null) {
      return null;
    }
    if (match.home_goals > match.away_goals) {
      return {
        team_id: match.home_team_id,
        team_name: match.home_team_name,
        logo_url: match.home_team_logo,
      };
    } else if (match.away_goals > match.home_goals) {
      return {
        team_id: match.away_team_id,
        team_name: match.away_team_name,
        logo_url: match.away_team_logo,
      };
    }
    return null;
  };

  // Check if match is completed
  const isCompleted = (match) => {
    return match && match.home_goals !== null && match.away_goals !== null;
  };

  // Render mobile match card
  const renderMobileMatch = (match, label) => {
    if (!match) {
      return (
        <Paper
          sx={{
            padding: 2,
            backgroundColor: theme.colors.background.card,
            borderRadius: theme.borderRadius.lg,
            border: `2px dashed ${theme.colors.border.primary}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              color: theme.colors.text.secondary,
              fontStyle: "italic",
              display: "block",
            }}
          >
            {label} - Aguarda apuramento
          </Typography>
        </Paper>
      );
    }

    const completed = isCompleted(match);
    const winner = completed ? getWinner(match) : null;

    return (
      <Paper
        elevation={3}
        onClick={() => handleMatchClick(match.match_id)}
        sx={{
          padding: 2,
          backgroundColor: theme.colors.background.card,
          borderRadius: theme.borderRadius.lg,
          border: `2px solid ${theme.colors.border.primary}`,
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        {/* Match Label */}
        <Typography
          variant="caption"
          sx={{
            color: theme.colors.primary[600],
            fontWeight: theme.typography.fontWeight.bold,
            display: "block",
            textAlign: "center",
            marginBottom: 1,
          }}
        >
          {label}
        </Typography>

        {/* Date */}
        {match.match_date && (
          <Typography
            variant="caption"
            sx={{
              color: theme.colors.text.secondary,
              display: "block",
              textAlign: "center",
              marginBottom: 1,
              fontSize: "10px",
            }}
          >
            {dayjs(match.match_date).format("DD/MM/YYYY")}
            {match.match_time && ` • ${match.match_time.slice(0, 5)}`}
          </Typography>
        )}

        {/* Home Team */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: theme.spacing.sm,
            backgroundColor:
              winner?.team_id === match.home_team_id
                ? `${theme.colors.success[50]}`
                : theme.colors.background.secondary,
            borderRadius: theme.borderRadius.md,
            border:
              winner?.team_id === match.home_team_id
                ? `2px solid ${theme.colors.success[500]}`
                : "none",
            marginBottom: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            {match.home_team_logo && (
              <img
                src={match.home_team_logo}
                alt={match.home_team_name}
                style={{
                  width: "24px",
                  height: "24px",
                  objectFit: "contain",
                }}
              />
            )}
            <Typography
              variant="body2"
              sx={{
                fontWeight:
                  winner?.team_id === match.home_team_id
                    ? theme.typography.fontWeight.bold
                    : theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                fontSize: "13px",
              }}
            >
              {match.home_team_name}
            </Typography>
          </Box>
          {completed && (
            <Box
              sx={{
                minWidth: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  winner?.team_id === match.home_team_id
                    ? theme.colors.success[500]
                    : theme.colors.background.tertiary,
                borderRadius: theme.borderRadius.md,
                fontWeight: theme.typography.fontWeight.bold,
                fontSize: "16px",
                color:
                  winner?.team_id === match.home_team_id
                    ? theme.colors.text.inverse
                    : theme.colors.text.primary,
              }}
            >
              {match.home_goals}
            </Box>
          )}
        </Box>

        {/* VS Divider */}
        <Box
          sx={{
            textAlign: "center",
            color: theme.colors.text.secondary,
            fontSize: "11px",
            fontWeight: theme.typography.fontWeight.semibold,
            marginY: 0.5,
          }}
        >
          vs
        </Box>

        {/* Away Team */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: theme.spacing.sm,
            backgroundColor:
              winner?.team_id === match.away_team_id
                ? `${theme.colors.success[50]}`
                : theme.colors.background.secondary,
            borderRadius: theme.borderRadius.md,
            border:
              winner?.team_id === match.away_team_id
                ? `2px solid ${theme.colors.success[500]}`
                : "none",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            {match.away_team_logo && (
              <img
                src={match.away_team_logo}
                alt={match.away_team_name}
                style={{
                  width: "24px",
                  height: "24px",
                  objectFit: "contain",
                }}
              />
            )}
            <Typography
              variant="body2"
              sx={{
                fontWeight:
                  winner?.team_id === match.away_team_id
                    ? theme.typography.fontWeight.bold
                    : theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                fontSize: "13px",
              }}
            >
              {match.away_team_name}
            </Typography>
          </Box>
          {completed && (
            <Box
              sx={{
                minWidth: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  winner?.team_id === match.away_team_id
                    ? theme.colors.success[500]
                    : theme.colors.background.tertiary,
                borderRadius: theme.borderRadius.md,
                fontWeight: theme.typography.fontWeight.bold,
                fontSize: "16px",
                color:
                  winner?.team_id === match.away_team_id
                    ? theme.colors.text.inverse
                    : theme.colors.text.primary,
              }}
            >
              {match.away_goals}
            </Box>
          )}
        </Box>

        {/* Status Badge */}
        {!completed && (
          <Box
            sx={{
              marginTop: 1,
              textAlign: "center",
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-block",
                padding: "3px 10px",
                backgroundColor: `${theme.colors.secondary[500]}15`,
                color: theme.colors.secondary[600],
                borderRadius: theme.borderRadius.full,
                fontSize: "10px",
                fontWeight: theme.typography.fontWeight.semibold,
              }}
            >
              Agendado
            </Box>
          </Box>
        )}
      </Paper>
    );
  };

  // Render arrow connector
  const renderConnector = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "8px 0",
      }}
    >
      <ArrowDownward
        sx={{
          fontSize: 32,
          color: theme.colors.primary[400],
        }}
      />
    </Box>
  );

  return (
    <Box>
      {/* Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          marginBottom: 3,
        }}
      >
        <EmojiEvents
          sx={{
            fontSize: 32,
            color: theme.colors.accent[500],
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            fontSize: "20px",
          }}
        >
          Final Four
        </Typography>
      </Box>

      {/* Vertical Bracket */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Semifinal 1 */}
        {renderMobileMatch(semifinal1, "MEIA-FINAL 1")}

        {/* Connector */}
        {renderConnector()}

        {/* Semifinal 2 */}
        {renderMobileMatch(semifinal2, "MEIA-FINAL 2")}

        {/* Connector */}
        {renderConnector()}

        {/* Final */}
        {renderMobileMatch(final, "🏆 FINAL")}

        {/* Champion Banner */}
        {final && isCompleted(final) && getWinner(final) && (
          <Paper
            sx={{
              marginTop: 2,
              padding: 3,
              backgroundColor: `${theme.colors.accent[500]}15`,
              borderRadius: theme.borderRadius.lg,
              border: `2px solid ${theme.colors.accent[500]}`,
              textAlign: "center",
            }}
          >
            <EmojiEvents
              sx={{
                fontSize: 48,
                color: theme.colors.accent[500],
                marginBottom: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                marginBottom: 1,
                fontSize: "18px",
              }}
            >
              🏆 CAMPEÃO
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              {getWinner(final).logo_url && (
                <img
                  src={getWinner(final).logo_url}
                  alt={getWinner(final).team_name}
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "contain",
                  }}
                />
              )}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.primary[600],
                  fontSize: "16px",
                }}
              >
                {getWinner(final).team_name}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Qualified Teams */}
      {qualifiers && qualifiers.length > 0 && (
        <Box sx={{ marginTop: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: theme.typography.fontWeight.bold,
              marginBottom: 2,
              color: theme.colors.text.primary,
              fontSize: "16px",
            }}
          >
            Equipas Apuradas
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {qualifiers.map((team) => (
              <Box
                key={team.team_id}
                sx={{
                  padding: theme.spacing.sm,
                  backgroundColor: theme.colors.background.card,
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.border.primary}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                {team.logo_url && (
                  <img
                    src={team.logo_url}
                    alt={team.team_name}
                    style={{
                      width: "28px",
                      height: "28px",
                      objectFit: "contain",
                    }}
                  />
                )}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: theme.typography.fontWeight.bold,
                      color: theme.colors.text.primary,
                      fontSize: "13px",
                    }}
                  >
                    {team.team_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.colors.text.secondary,
                      fontSize: "11px",
                    }}
                  >
                    {team.qualification_type}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FinalFourMobile;
