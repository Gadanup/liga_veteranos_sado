import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Assignment,
  Groups,
  SportsSoccer,
  Timeline,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * ChampionshipInfoCard Component
 * Displays championship format and basic information
 */
const ChampionshipInfoCard = () => {
  const championshipNotes = [
    {
      icon: <Groups />,
      text: "Campeonato com 13 equipas participantes",
    },
    {
      icon: <SportsSoccer />,
      text: "Cada equipa joga contra todas as restantes duas vezes (uma casa e outra fora)",
    },
    {
      icon: <Timeline />,
      text: "Campeonato em formato liga regular",
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: "16px",
        height: "100%",
        border: `2px solid ${theme.colors.primary[100]}`,
        transition: theme.transitions.normal,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows.lg,
          borderColor: theme.colors.primary[300],
        },
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* Card Header */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor: theme.colors.primary[50],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Assignment
              sx={{
                fontSize: 32,
                color: theme.colors.primary[600],
              }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: theme.colors.primary[600],
              fontWeight: "bold",
            }}
          >
            Informações do Campeonato
          </Typography>
        </Box>

        {/* Notes List */}
        <List sx={{ py: 0 }}>
          {championshipNotes.map((note, index) => (
            <ListItem
              key={index}
              sx={{
                px: 0,
                py: 2,
                borderRadius: "12px",
                mb: 1,
                backgroundColor:
                  index % 2 === 0
                    ? theme.colors.background.tertiary
                    : "transparent",
                transition: theme.transitions.normal,
                "&:hover": {
                  backgroundColor: theme.colors.primary[50],
                  transform: "translateX(8px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 48,
                  color: theme.colors.primary[600],
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: theme.colors.primary[100],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {note.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={note.text}
                primaryTypographyProps={{
                  variant: "body1",
                  sx: {
                    color: theme.colors.text.primary,
                    fontWeight: "medium",
                    lineHeight: 1.6,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ChampionshipInfoCard;
