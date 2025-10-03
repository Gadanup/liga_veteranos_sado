import React from "react";
import { Box, Typography, Link, Fade } from "@mui/material";
import { theme } from "../../../../styles/theme.js";

/**
 * FooterInfo Component
 * Displays contact information and disclaimer
 */
const FooterInfo = () => {
  return (
    <Fade in={true} timeout={2200}>
      <Box
        sx={{
          p: 3,
          mb: 4,
          textAlign: "center",
          backgroundColor: theme.colors.background.tertiary,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.border.primary}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.colors.text.tertiary,
            mb: 2,
            display: "block",
          }}
        >
          Todos os documentos são propriedade da organização da liga
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.secondary,
            mt: 2,
          }}
        >
          Contacto da Direção:{" "}
          <Link
            href="mailto:ligadeveteranosdosado@outlook.pt"
            sx={{
              color: theme.colors.primary[600],
              fontWeight: theme.typography.fontWeight.semibold,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
                color: theme.colors.primary[700],
              },
            }}
          >
            ligadeveteranosdosado@outlook.pt
          </Link>
        </Typography>
      </Box>
    </Fade>
  );
};

export default FooterInfo;
