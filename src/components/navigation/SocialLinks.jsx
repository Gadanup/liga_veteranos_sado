import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Instagram, Facebook, Email } from "@mui/icons-material";
import { socialLinks } from "./navigationConfig";

/**
 * SocialLinks Component
 * Displays social media and contact links
 *
 * @param {boolean} open - Whether drawer is open (desktop only)
 * @param {boolean} isMobile - Whether viewing on mobile
 * @param {string} variant - Layout variant: 'row' | 'column'
 */
const SocialLinks = ({ open = true, isMobile = false, variant = "row" }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "instagram":
        return <Instagram />;
      case "facebook":
        return <Facebook />;
      case "email":
        return <Email />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: variant === "column" ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: variant === "column" ? 1 : 2,
        padding: variant === "column" ? "8px 0" : "12px 16px",
      }}
    >
      {socialLinks.map((link) => (
        <Tooltip key={link.name} title={link.name} placement="right">
          <IconButton
            component="a"
            href={link.url}
            target={link.icon !== "email" ? "_blank" : undefined}
            rel={link.icon !== "email" ? "noopener noreferrer" : undefined}
            sx={{
              color: "white",
              width: variant === "column" ? 36 : 40,
              height: variant === "column" ? 36 : 40,
              background: open
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: link.color,
                transform:
                  variant === "column" ? "translateX(4px)" : "translateY(-2px)",
                boxShadow: `0 4px 12px ${link.color}40`,
              },
            }}
          >
            {getIcon(link.icon)}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default SocialLinks;
