import React from "react";
import { Box } from "@mui/material";

/**
 * CardIcon Component
 * Displays a colored card icon (yellow, red, or double-yellow)
 *
 * @param {string} cardType - Type of card: "yellow", "red", or "double-yellow"
 */
const CardIcon = ({ cardType }) => {
  const getCardStyle = (type) => {
    switch (type) {
      case "yellow":
        return { backgroundColor: "#ffcd00", border: "1px solid #f59e0b" };
      case "red":
        return { backgroundColor: "#ef4444", border: "1px solid #dc2626" };
      case "double-yellow":
        return {
          background: "linear-gradient(135deg, #ffcd00 50%, #ef4444 50%)",
          border: "1px solid #dc2626",
        };
      default:
        return {};
    }
  };

  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: "13px",
        height: "20px",
        borderRadius: "2px",
        verticalAlign: "middle",
        marginRight: "4px",
        ...getCardStyle(cardType),
      }}
    />
  );
};

export default CardIcon;
