import React from "react";
import {
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Link,
} from "@mui/material";
import {
  OpenInNew,
  Rule,
  Assignment,
  Description,
  Person,
  AccountBox,
  HelpOutline,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * DocumentCard Component
 * Displays a single document with metadata and download link
 *
 * @param {Object} doc - Document object with all metadata
 * @param {number} hoveredDocument - Currently hovered document ID
 * @param {Function} setHoveredDocument - Function to set hovered document
 */
const DocumentCard = ({ doc, hoveredDocument, setHoveredDocument }) => {
  // Map icon names to actual icon components
  const iconMap = {
    Rule: <Rule />,
    Assignment: <Assignment />,
    Description: <Description />,
    Person: <Person />,
    AccountBox: <AccountBox />,
    HelpOutline: <HelpOutline />,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return theme.colors.error[500];
      case "medium":
        return theme.colors.warning[500];
      default:
        return theme.colors.success[500];
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Essencial":
        return theme.colors.primary[500];
      case "Formulário":
        return theme.colors.secondary[500];
      case "Online":
        return theme.colors.success[500];
      case "Guia":
        return theme.colors.warning[500];
      default:
        return theme.colors.neutral[500];
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        textDecoration: "none",
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.background.tertiary,
        border: `2px solid transparent`,
        transition: theme.transitions.normal,
        cursor: "pointer",
        overflow: "hidden",
        "&:hover": {
          backgroundColor: `${doc.color}08`,
          borderColor: `${doc.color}25`,
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px -5px ${doc.color}30`,
        },
      }}
      component={Link}
      href={doc.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHoveredDocument(doc.id)}
      onMouseLeave={() => setHoveredDocument(null)}
    >
      {/* Priority Indicator Bar */}
      <Box
        sx={{
          height: "4px",
          backgroundColor: getPriorityColor(doc.priority),
          width: "100%",
        }}
      />

      <Box sx={{ p: 3 }}>
        {/* Header with Icon and Category */}
        <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: theme.borderRadius.lg,
              backgroundColor: `${doc.color}15`,
              color: doc.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: theme.transitions.fast,
              transform: hoveredDocument === doc.id ? "scale(1.1)" : "scale(1)",
            }}
          >
            {iconMap[doc.icon]}
          </Box>
          <Box flex={1} minWidth={0}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip
                label={doc.category}
                size="small"
                sx={{
                  backgroundColor: `${getCategoryColor(doc.category)}15`,
                  color: getCategoryColor(doc.category),
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                }}
              />
              <Chip
                label={doc.fileType}
                size="small"
                sx={{
                  backgroundColor: theme.colors.neutral[100],
                  color: theme.colors.neutral[600],
                  fontSize: "0.7rem",
                }}
              />
            </Box>
          </Box>
          <Tooltip title="Abrir documento">
            <IconButton
              size="small"
              sx={{
                color: theme.colors.text.tertiary,
                transition: theme.transitions.fast,
                "&:hover": {
                  color: doc.color,
                  backgroundColor: `${doc.color}10`,
                },
              }}
            >
              <OpenInNew fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Document Title and Description */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: theme.colors.text.primary,
            mb: 1,
            fontSize: { xs: "1rem", md: "1.1rem" },
            lineHeight: 1.3,
          }}
        >
          {doc.text}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.secondary,
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          {doc.description}
        </Typography>

        {/* Document Meta Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: `1px solid ${theme.colors.border.primary}`,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.tertiary,
                fontSize: "0.75rem",
              }}
            >
              {doc.size}
            </Typography>
            <Box
              sx={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: theme.colors.text.tertiary,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.tertiary,
                fontSize: "0.75rem",
              }}
            >
              {doc.lastUpdated}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: getPriorityColor(doc.priority),
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default DocumentCard;
