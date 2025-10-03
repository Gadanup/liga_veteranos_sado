import React from "react";
import { Box } from "@mui/material";
import { Bracket } from "react-brackets";
import { theme } from "../../../../styles/theme.js";
import { createCustomTeamDisplay } from "./TeamDisplay";

/**
 * CupBracket Component
 * Displays the tournament bracket for desktop view
 *
 * @param {Object} bracketData - Formatted bracket data
 * @param {Object} router - Next.js router
 * @param {boolean} isMobile - Whether viewing on mobile
 */
const CupBracket = ({ bracketData, router, isMobile }) => {
  return (
    <Box
      sx={{
        backgroundColor: theme.colors.background.card,
        borderRadius: "20px",
        padding: 3,
        boxShadow: theme.components.card.shadow,
        border: `2px solid ${theme.colors.border.purple}`,
        overflow: "auto",
        /* Custom CSS to style react-brackets with theme colors */
        "& .react-brackets__bracket": {
          backgroundColor: "transparent !important",
        },
        "& .react-brackets__match": {
          backgroundColor: `${theme.colors.primary[600]} !important`,
          border: `2px solid ${theme.colors.primary[700]} !important`,
          borderRadius: "12px !important",
          boxShadow: `0 4px 12px ${theme.colors.primary[600]}30 !important`,
          padding: "8px !important",
        },
        "& .react-brackets__team": {
          backgroundColor: "transparent !important",
          border: "none !important",
          margin: "2px 0 !important",
        },
        "& .react-brackets__team--winner": {
          backgroundColor: "transparent !important",
        },
        "& .react-brackets__seed": {
          backgroundColor: "transparent !important",
          border: "none !important",
          borderRadius: "12px !important",
          padding: "8px !important",
        },
        "& .react-brackets__seed-item": {
          backgroundColor: "transparent !important",
          padding: "4px 0 !important",
        },
        "& .react-brackets__round-title": {
          color: `${theme.colors.primary[600]} !important`,
          fontWeight: "bold !important",
          fontSize: "18px !important",
          marginBottom: "20px !important",
          textAlign: "center !important",
          textShadow: `1px 1px 2px ${theme.colors.accent[500]}50 !important`,
        },
        "& .react-brackets__connectors": {
          "& .react-brackets__connector": {
            borderColor: `${theme.colors.primary[400]} !important`,
            borderWidth: "2px !important",
          },
          "& .react-brackets__connector-horizontal": {
            borderTopColor: `${theme.colors.primary[400]} !important`,
            borderBottomColor: `${theme.colors.primary[400]} !important`,
          },
          "& .react-brackets__connector-vertical": {
            borderLeftColor: `${theme.colors.primary[400]} !important`,
            borderRightColor: `${theme.colors.primary[400]} !important`,
          },
        },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${theme.colors.primary[600]}08, ${theme.colors.accent[500]}08)`,
          borderRadius: "20px",
          pointerEvents: "none",
          zIndex: 0,
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <Bracket
        rounds={[
          {
            title: "Oitavos de Final",
            seeds: bracketData.round8.map((match) => ({
              id: match.id,
              date: `${match.date || "TBD"} - ${match.time ? match.time.slice(0, 5) + " -" : ""} ${match.stadium || "TBD"}`,
              teams: [
                {
                  name: createCustomTeamDisplay(
                    match.sides[0],
                    match.id,
                    router,
                    isMobile
                  ),
                  isWinner: match.sides[0].winner,
                },
                {
                  name: createCustomTeamDisplay(
                    match.sides[1],
                    match.id,
                    router,
                    isMobile
                  ),
                  isWinner: match.sides[1].winner,
                },
              ],
            })),
          },
          {
            title: "Quartos de Final",
            seeds: bracketData.round4.map((match) => ({
              id: match.id,
              date: `${match.date || "TBD"} - ${match.time ? match.time.slice(0, 5) + " -" : ""} ${match.stadium || "TBD"}`,
              teams: match.sides.map((side) => ({
                name: createCustomTeamDisplay(side, match.id, router, isMobile),
                isWinner: side.winner,
              })),
            })),
          },
          {
            title: "Semifinais",
            seeds: bracketData.round2.map((match) => ({
              id: match.id,
              date: `${match.date || "TBD"} - ${match.time ? match.time.slice(0, 5) + " -" : ""} ${match.stadium || "TBD"}`,
              teams: [
                {
                  name: createCustomTeamDisplay(
                    match.sides[0],
                    match.id,
                    router,
                    isMobile
                  ),
                  isWinner: match.sides[0].winner,
                },
                {
                  name: createCustomTeamDisplay(
                    match.sides[1],
                    match.id,
                    router,
                    isMobile
                  ),
                  isWinner: match.sides[1].winner,
                },
              ],
            })),
          },
          {
            title: "Final",
            seeds: bracketData.final.map((match) => ({
              id: match.id,
              date: `${match.date || "TBD"} - ${match.time ? match.time.slice(0, 5) + " -" : ""} ${match.stadium || "TBD"}`,
              teams: [
                {
                  name: createCustomTeamDisplay(
                    match.sides[0],
                    match.id,
                    router,
                    isMobile
                  ),
                  isWinner: match.sides[0].winner,
                },
                {
                  name: createCustomTeamDisplay(
                    match.sides[1],
                    match.id,
                    router,
                    isMobile
                  ),
                  isWinner: match.sides[1].winner,
                },
              ],
            })),
          },
        ]}
      />
    </Box>
  );
};

export default CupBracket;
