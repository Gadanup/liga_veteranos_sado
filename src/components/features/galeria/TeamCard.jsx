import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { theme } from "../../../styles/theme.js";

/**
 * TeamCard Component
 * Displays a single team's logo, name, and roster image
 * Includes hover effects and click to enlarge functionality
 *
 * @param {Object} team - Team data (id, short_name, logo_url, roster_url)
 * @param {number} index - Card index for staggered animation
 * @param {Function} onImageClick - Callback when roster image is clicked
 */
const TeamCard = ({ team, index, onImageClick }) => {
  return (
    <Card
      sx={{
        borderRadius: theme.borderRadius.xl,
        overflow: "hidden",
        transition: theme.transitions.normal,
        cursor: "pointer",
        border: `2px solid ${theme.colors.border.primary}`,
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.shadows.xl,
          borderColor: theme.colors.primary[300],
        },
        animationDelay: `${index * 0.1}s`,
        animation: "fadeInUp 0.6s ease-out forwards",
        opacity: 0,
        "@keyframes fadeInUp": {
          "0%": {
            opacity: 0,
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* Team Header with Logo and Name */}
      <CardContent
        sx={{
          background: theme.colors.themed.purpleGradient,
          color: "white",
          textAlign: "center",
          py: 2,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 50%, ${theme.colors.accent[500]}20 0%, transparent 70%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Team Logo Circle */}
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 1.5,
              boxShadow: `0 4px 16px ${theme.colors.neutral[900]}30`,
              border: `2px solid ${theme.colors.accent[500]}`,
              overflow: "hidden",
            }}
          >
            <img
              src={team.logo_url}
              alt={`${team.short_name} logo`}
              style={{
                width: "35px",
                height: "35px",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Team Name */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: theme.typography.fontWeight.bold,
              fontSize: { xs: "0.9rem", md: "1rem" },
              textAlign: "center",
              lineHeight: 1.2,
              textShadow: `0 2px 4px ${theme.colors.neutral[900]}50`,
            }}
          >
            {team.short_name}
          </Typography>
        </Box>
      </CardContent>

      {/* Team Roster Image with Click Functionality */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={() => onImageClick(team.roster_url, team.short_name)}
      >
        <CardMedia
          component="img"
          height="350"
          image={team.roster_url}
          alt={`${team.short_name} roster`}
          sx={{
            objectFit: "cover",
            transition: theme.transitions.slow,
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        />

        {/* Bottom Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: `linear-gradient(transparent, ${theme.colors.neutral[900]}60)`,
            pointerEvents: "none",
          }}
        />

        {/* Click to Enlarge Indicator */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: theme.transitions.normal,
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            👁️
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default TeamCard;
