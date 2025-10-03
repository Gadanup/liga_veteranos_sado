import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  ExpandMore,
  EmojiEvents,
  CalendarToday,
  AccessTime,
  Stadium,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * MobileRoundView Component
 * Displays a single round in accordion format for mobile
 *
 * @param {string} title - Round title
 * @param {Array} matches - Matches for this round
 * @param {string} roundKey - Round identifier
 * @param {Object} router - Next.js router
 */
const MobileRoundView = ({ title, matches, roundKey, router }) => {
  return (
    <Accordion
      sx={{
        backgroundColor: theme.colors.background.card,
        border: `1px solid ${theme.colors.border.primary}`,
        borderRadius: "12px !important",
        marginBottom: 2,
        "&:before": { display: "none" },
        boxShadow: theme.components.card.shadow,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: theme.colors.primary[600] }} />}
        sx={{
          backgroundColor: theme.colors.primary[600],
          color: "white",
          borderRadius: "12px 12px 0 0",
          "&.Mui-expanded": {
            borderRadius: "12px 12px 0 0",
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <EmojiEvents />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
          <Chip
            label={`${matches.length} jogos`}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontSize: "10px",
            }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {matches.map((match, index) => (
            <Grid item xs={12} key={match.id || index}>
              <Card
                onClick={() => router.push(`/jogos/${match.id}`)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: theme.colors.background.tertiary,
                  border: `1px solid ${theme.colors.border.primary}`,
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: theme.colors.primary[50],
                    borderColor: theme.colors.accent[500],
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ padding: "12px !important" }}>
                  {/* Date and Time */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday
                        sx={{
                          fontSize: 14,
                          color: theme.colors.text.secondary,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.colors.text.secondary,
                          fontSize: "11px",
                        }}
                      >
                        {match.date}
                      </Typography>
                    </Box>
                    {match.time && (
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTime
                          sx={{
                            fontSize: 14,
                            color: theme.colors.text.secondary,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.colors.text.secondary,
                            fontSize: "11px",
                          }}
                        >
                          {match.time.slice(0, 5)}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Teams */}
                  {match.sides.map((side, sideIndex) => (
                    <Box
                      key={sideIndex}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        padding: "6px 8px",
                        backgroundColor:
                          side.winner && side.score !== "---"
                            ? theme.colors.sports.win + "20"
                            : "transparent",
                        borderRadius: "6px",
                        marginBottom: sideIndex === 0 ? 1 : 0,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} flex={1}>
                        {side.team.logo && (
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "4px",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor:
                                theme.colors.background.secondary,
                            }}
                          >
                            <img
                              src={side.team.logo}
                              alt={`${side.team.name} logo`}
                              style={{
                                width: "16px",
                                height: "16px",
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight:
                              side.winner && side.score !== "---"
                                ? "bold"
                                : "medium",
                            color:
                              side.winner && side.score !== "---"
                                ? theme.colors.sports.win
                                : theme.colors.text.primary,
                            fontSize: "13px",
                          }}
                        >
                          {side.team.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={side.score}
                        size="small"
                        sx={{
                          backgroundColor:
                            side.winner && side.score !== "---"
                              ? theme.colors.sports.win
                              : theme.colors.neutral[200],
                          color:
                            side.winner && side.score !== "---"
                              ? "white"
                              : theme.colors.text.secondary,
                          fontWeight: "bold",
                          fontSize: "11px",
                          height: "24px",
                        }}
                      />
                    </Box>
                  ))}

                  {/* Stadium */}
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                    mt={2}
                  >
                    <Stadium
                      sx={{ fontSize: 14, color: theme.colors.text.secondary }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.colors.text.secondary,
                        fontSize: "11px",
                        textAlign: "center",
                      }}
                    >
                      {match.stadium}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default MobileRoundView;
