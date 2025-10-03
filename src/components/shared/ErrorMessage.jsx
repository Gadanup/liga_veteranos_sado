import React from "react";
import { Container, Typography } from "@mui/material";
import { theme } from "../../styles/theme.js";

/**
 * ErrorMessage Component
 * Displays an error message when content cannot be loaded
 *
 * @param {string} message - Error message to display
 */
const ErrorMessage = ({ message = "Algo correu mal" }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
        {message}
      </Typography>
    </Container>
  );
};

export default ErrorMessage;
