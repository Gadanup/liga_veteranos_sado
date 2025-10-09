import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Drawer as MuiDrawer,
  List,
  Divider,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import NavSection from "./NavSection";
import SocialLinks from "./SocialLinks";
import { navigationSections } from "./navigationConfig";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  background: "linear-gradient(180deg, #6B4BA1 0%, #5A3E8C 100%)",
  borderRight: "2px solid rgba(255, 215, 0, 0.2)",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  background: "linear-gradient(180deg, #6B4BA1 0%, #5A3E8C 100%)",
  borderRight: "2px solid rgba(255, 215, 0, 0.2)",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  height: 70,
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const NavDrawer = ({
  open,
  selectedItem,
  onToggle,
  onItemClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      open={open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <DrawerHeader>
        {open ? (
          <>
            {/* Logo and Title */}
            <Box display="flex" alignItems="center" gap={1.5} flex={1}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  padding: "6px",
                  background:
                    "linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(255, 215, 0, 0.3)",
                  boxShadow: "0 8px 24px rgba(255, 215, 0, 0.2)",
                }}
              >
                <img
                  src="/logo/logo.png"
                  alt="Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    lineHeight: 1.2,
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #FFD700 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Liga Veteranos
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 215, 0, 0.8)",
                    fontSize: "9px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  do Sado
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          /* Closed state - Just the logo */
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "12px",
                padding: "6px",
                background:
                  "linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(255, 215, 0, 0.3)",
                boxShadow: "0 8px 24px rgba(255, 215, 0, 0.2)",
              }}
            >
              <img
                src="/logo/logo.png"
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        )}
      </DrawerHeader>

      {/* Decorative header accent */}
      <Box
        sx={{
          height: "3px",
          background: "linear-gradient(90deg, #FFD700 0%, #FFA500 100%)",
          boxShadow: "0 2px 10px rgba(255, 215, 0, 0.5)",
        }}
      />

      {/* Navigation Sections */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {navigationSections.map((section, index) => (
          <React.Fragment key={section.key}>
            {open && (
              <Box
                sx={{
                  padding: "8px 12px 4px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 3,
                    height: 14,
                    background:
                      "linear-gradient(180deg, #FFD700 0%, #FFA500 100%)",
                    borderRadius: "2px",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "#FFD700",
                    fontWeight: 700,
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
            )}
            <List sx={{ paddingBottom: 0, paddingTop: 0 }}>
              <NavSection
                section={section}
                open={open}
                selectedItem={selectedItem}
                onItemClick={onItemClick}
              />
            </List>
            {index < navigationSections.length - 1 && (
              <Divider
                sx={{
                  borderColor: "rgba(255, 215, 0, 0.1)",
                  my: open ? 0.5 : 1,
                  mx: open ? 2 : 1,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>

      {/* Social Links - Bottom of Drawer */}
      <Box
        sx={{
          borderTop: "2px solid rgba(255, 215, 0, 0.2)",
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        {open && (
          <Box
            sx={{
              padding: "8px 12px 4px 12px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 3,
                height: 12,
                background: "linear-gradient(180deg, #FFD700 0%, #FFA500 100%)",
                borderRadius: "2px",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 215, 0, 0.9)",
                fontSize: "9px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              Siga-nos
            </Typography>
          </Box>
        )}
        <Box sx={{ padding: open ? "0 8px 8px 8px" : "6px 0 8px 0" }}>
          <SocialLinks open={open} variant={open ? "row" : "column"} />
        </Box>
      </Box>
    </Drawer>
  );
};

export default NavDrawer;
