import React from "react";
import Link from "next/link";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const NavSection = ({ section, open, selectedItem, onItemClick }) => {
  const shouldDisplayItem = (item) => {
    if (open) return true;
    return item.showWhenClosed;
  };

  const getListItemStyles = (itemId) => ({
    backgroundColor: selectedItem === itemId ? "#0F2941" : "inherit",
    color: selectedItem === itemId ? "#C5944C" : "white",
  });

  return (
    <>
      {section.items.map((item) => {
        if (!shouldDisplayItem(item)) return null;

        const Icon = item.icon;
        const displayLabel =
          !open && item.labelClosed ? item.labelClosed : item.label;

        return (
          <ListItem key={item.id} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={() => onItemClick(item.id)}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                flexDirection: open ? "row" : "column",
                ...getListItemStyles(item.id),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: selectedItem === item.id ? "#C5944C" : "white",
                }}
              >
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: open ? "inherit" : "0.75rem",
                      textAlign: open ? "left" : "center",
                      color: selectedItem === item.id ? "#C5944C" : "white",
                    }}
                  >
                    {displayLabel}
                  </Typography>
                }
                sx={{ opacity: open ? 1 : 1, color: "white" }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </>
  );
};

export default NavSection;
