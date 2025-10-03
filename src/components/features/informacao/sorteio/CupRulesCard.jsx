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
  EmojiEvents,
  Groups,
  SwapHoriz,
  Stadium,
  CheckCircle,
  MilitaryTech,
} from "@mui/icons-material";
import { theme } from "../../../../styles/theme.js";

/**
 * CupRulesCard Component
 * Displays the rules for the cup draw
 */
const CupRulesCard = () => {
  const cupRules = [
    {
      icon: <Groups />,
      text: "Apenas três equipas a jogar em simultâneo, por fase, no Pinhal Novo",
    },
    {
      icon: <SwapHoriz />,
      text: "Equipas vão sendo sorteadas e colocadas sequencialmente nos lugares (1,2,3,4, etc)",
    },
    {
      icon: <Stadium />,
      text: "Caso o sorteio dite mais de 3 equipas com campo no PN, a jogar em simultâneo, será alterado o visitado (visitante passa para visitado)",
    },
    {
      icon: <CheckCircle />,
      text: "15ª posição fará com que essa equipa fiquem isenta na primeira fase",
    },
    {
      icon: <MilitaryTech />,
      text: "Poderão também ser feitas alterações às localizações dos jogos dos quartos de final (devido à condicionante do campo)",
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: `2px solid ${theme.colors.secondary[100]}`,
        transition: theme.transitions.normal,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows.lg,
          borderColor: theme.colors.secondary[300],
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
              backgroundColor: theme.colors.secondary[50],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmojiEvents
              sx={{
                fontSize: 32,
                color: theme.colors.secondary[600],
              }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: theme.colors.secondary[600],
              fontWeight: "bold",
            }}
          >
            Regras do Sorteio da Taça
          </Typography>
        </Box>

        {/* Rules List */}
        <List sx={{ py: 0 }}>
          {cupRules.map((rule, index) => (
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
                  backgroundColor: theme.colors.secondary[50],
                  transform: "translateX(8px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 48,
                  color: theme.colors.secondary[600],
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "8px",
                    backgroundColor: theme.colors.secondary[100],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {rule.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={rule.text}
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

export default CupRulesCard;
