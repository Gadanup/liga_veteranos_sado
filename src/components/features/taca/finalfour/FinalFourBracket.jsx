import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { EmojiEvents, ArrowForward, ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { theme } from "../../../../styles/theme";

/**
 * FinalFourBracket Component
 * Displays the Final Four bracket (semifinals and final) in desktop view
 *
 * @param {Object} semifinal1 - First semifinal match
 * @param {Object} semifinal2 - Second semifinal match
 * @param {Object} final - Final match
 * @param {Object} qualifiers - Qualified teams information
 */
const FinalFourBracket = ({ semifinal1, semifinal2, final, qualifiers }) => {
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
    return null; // Draw (shouldn't happen in knockout)
  };

  // Check if match is completed
  const isCompleted = (match) => {
    return match && match.home_goals !== null && match.away_goals !== null;
  };

  // Render a team in the bracket
  const renderTeam = (team, score, isWinner, position = "left") => {
    if (!team) {
      return (
        <Box
          sx={{
            padding: theme.spacing.md,
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.md,
            border: `2px dashed ${theme.colors.border.primary}`,
            textAlign: position,
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: position === "left" ? "flex-start" : "flex-end",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              fontStyle: "italic",
            }}
          >
            A definir
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          padding: theme.spacing.md,
          backgroundColor: isWinner
            ? `${theme.colors.success[50]}`
            : theme.colors.background.card,
          borderRadius: theme.borderRadius.md,
          border: isWinner
            ? `2px solid ${theme.colors.success[500]}`
            : `2px solid ${theme.colors.border.primary}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          transition: "all 0.3s ease",
          flexDirection: position === "left" ? "row" : "row-reverse",
          "&:hover": isWinner
            ? {
                backgroundColor: theme.colors.success[100],
                transform: "scale(1.02)",
              }
            : {},
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flex: 1,
            flexDirection: position === "left" ? "row" : "row-reverse",
          }}
        >
          {team.logo_url && (
            <img
              src={team.logo_url}
              alt={team.team_name}
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
              fontWeight: isWinner
                ? theme.typography.fontWeight.bold
                : theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              textAlign: position,
            }}
          >
            {team.team_name}
          </Typography>
        </Box>
        {score !== null && score !== undefined && (
          <Box
            sx={{
              minWidth: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isWinner
                ? theme.colors.success[500]
                : theme.colors.background.tertiary,
              borderRadius: theme.borderRadius.md,
              fontWeight: theme.typography.fontWeight.bold,
              fontSize: "18px",
              color: isWinner
                ? theme.colors.text.inverse
                : theme.colors.text.primary,
            }}
          >
            {score}
          </Box>
        )}
      </Box>
    );
  };

  // Render match card
  const renderMatch = (match, label) => {
    if (!match) {
      return (
        <Paper
          sx={{
            padding: 3,
            backgroundColor: theme.colors.background.card,
            borderRadius: theme.borderRadius.xl,
            border: `2px dashed ${theme.colors.border.primary}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: theme.colors.text.secondary,
              fontStyle: "italic",
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
          padding: 3,
          backgroundColor: theme.colors.background.card,
          borderRadius: theme.borderRadius.xl,
          border: `2px solid ${theme.colors.border.primary}`,
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows.xl,
            borderColor: theme.colors.primary[400],
          },
        }}
      >
        {/* Match Info */}
        <Box sx={{ marginBottom: 2, textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.colors.text.secondary,
              fontWeight: theme.typography.fontWeight.semibold,
              display: "block",
              marginBottom: 1,
            }}
          >
            {label}
          </Typography>
          {match.match_date && (
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.secondary,
                display: "block",
              }}
            >
              {dayjs(match.match_date).format("DD/MM/YYYY")}
              {match.match_time && ` • ${match.match_time.slice(0, 5)}`}
            </Typography>
          )}
          {!completed && (
            <Box
              sx={{
                display: "inline-block",
                marginTop: 1,
                padding: "4px 12px",
                backgroundColor: `${theme.colors.secondary[500]}15`,
                color: theme.colors.secondary[600],
                borderRadius: theme.borderRadius.full,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.semibold,
              }}
            >
              Agendado
            </Box>
          )}
        </Box>

        {/* Teams */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {renderTeam(
            {
              team_id: match.home_team_id,
              team_name: match.home_team_name,
              logo_url: match.home_team_logo,
            },
            match.home_goals,
            winner?.team_id === match.home_team_id,
            "left"
          )}
          {renderTeam(
            {
              team_id: match.away_team_id,
              team_name: match.away_team_name,
              logo_url: match.away_team_logo,
            },
            match.away_goals,
            winner?.team_id === match.away_team_id,
            "left"
          )}
        </Box>

        {match.stadium && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              marginTop: 2,
              textAlign: "center",
              color: theme.colors.text.secondary,
            }}
          >
            📍 {match.stadium}
          </Typography>
        )}
      </Paper>
    );
  };

  // Render connector line
  const renderConnector = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
      }}
    >
      <ArrowForward
        sx={{
          fontSize: 40,
          color: theme.colors.primary[400],
        }}
      />
    </Box>
  );
  // Render connector line
  const renderConnector2 = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
      }}
    >
      <ArrowBack
        sx={{
          fontSize: 40,
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
          gap: 2,
          marginBottom: 4,
        }}
      >
        <EmojiEvents
          sx={{
            fontSize: 40,
            color: theme.colors.accent[500],
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
          }}
        >
          Final Four - Eliminatórias
        </Typography>
        <EmojiEvents
          sx={{
            fontSize: 40,
            color: theme.colors.accent[500],
          }}
        />
      </Box>

      {/* Bracket Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          alignItems: "center",
          gap: 3,
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Semifinal 1 */}
        <Box>{renderMatch(semifinal1, "Meia-Final 1")}</Box>

        {/* Connector 1 */}
        {renderConnector()}

        {/* Final */}
        <Box>
          {renderMatch(final, "FINAL")}
          {final && isCompleted(final) && getWinner(final) && (
            <Box
              sx={{
                marginTop: 3,
                padding: 3,
                backgroundColor: `${theme.colors.accent[500]}15`,
                borderRadius: theme.borderRadius.xl,
                border: `2px solid ${theme.colors.accent[500]}`,
                textAlign: "center",
              }}
            >
              <EmojiEvents
                sx={{
                  fontSize: 60,
                  color: theme.colors.accent[500],
                  marginBottom: 1,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  marginBottom: 1,
                }}
              >
                🏆 CAMPEÃO
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                {getWinner(final).logo_url && (
                  <img
                    src={getWinner(final).logo_url}
                    alt={getWinner(final).team_name}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                )}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.primary[600],
                  }}
                >
                  {getWinner(final).team_name}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Connector 2 */}
        {renderConnector2()}

        {/* Semifinal 2 */}
        <Box>{renderMatch(semifinal2, "Meia-Final 2")}</Box>
      </Box>

      {/* Qualification Info */}
      {qualifiers && (
        <Box
          sx={{
            marginTop: 4,
            padding: 3,
            backgroundColor: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.border.primary}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: theme.typography.fontWeight.bold,
              marginBottom: 2,
              color: theme.colors.text.primary,
            }}
          >
            Equipas Apuradas
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 2,
            }}
          >
            {qualifiers.map((team, index) => (
              <Box
                key={team.team_id}
                sx={{
                  padding: 2,
                  backgroundColor: theme.colors.background.card,
                  borderRadius: theme.borderRadius.lg,
                  border: `2px solid ${theme.colors.border.primary}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {team.logo_url && (
                  <img
                    src={team.logo_url}
                    alt={team.team_name}
                    style={{
                      width: "32px",
                      height: "32px",
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
                    }}
                  >
                    {team.team_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.colors.text.secondary }}
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

export default FinalFourBracket;
