"use client";
import * as React from "react";
import Link from "next/link";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import Button from "@mui/material/Button";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ScoreboardRoundedIcon from "@mui/icons-material/ScoreboardRounded";
import SportsRoundedIcon from "@mui/icons-material/SportsRounded";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#6B4BA1",
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
  backgroundColor: "#6B4BA1",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
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

export default function Nav() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const shouldDisplayItem = (label) => {
    if (open) return true;
    return ["Classificação", "Taça", "Galeria", "Sobre"].includes(label);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: "#6B4BA1" }}>
        <Toolbar sx={{ backgroundColor: "#6B4BA1" }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ marginRight: 5, fontSize: "1.5rem" }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <img
              src="/logo/logo.png"
              alt="Logo"
              style={{ marginRight: "10px", height: "40px" }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              className="text-secondary"
            >
              Liga Veteranos do Sado
            </Typography>
          </div>
          <Button
            color="inherit"
            component={Link}
            href="/login"
            className="text-secondary border border-accent"
          >
            Log in
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {open && (
          <Typography
            variant="h6"
            sx={{ padding: theme.spacing(1), color: "white" }}
          >
            Liga
          </Typography>
        )}
        <List>
          {shouldDisplayItem("Classificação") && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                href="/Liga/Classification"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  flexDirection: open ? "row" : "column",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <SportsSoccerRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: open ? "inherit" : "0.75rem",
                        textAlign: open ? "left" : "center",
                      }}
                    >
                      Liga
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 1, color: "white" }}
                />
              </ListItemButton>
            </ListItem>
          )}
          {open && (
            <>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Liga/Calendar"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <CalendarMonthRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                        }}
                      >
                        Calendário
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Liga/TopScorers"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <LeaderboardRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                        }}
                      >
                        Melhores marcadores
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Liga/Discipline"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <SportsRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                        }}
                      >
                        Disciplina
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
        <Divider />
        {open && (
          <Typography
            variant="h6"
            sx={{ padding: theme.spacing(1), color: "white" }}
          >
            Taça
          </Typography>
        )}
        <List>
          {shouldDisplayItem("Taça") && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                href="/Taca/Draw"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  flexDirection: open ? "row" : "column",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <EmojiEventsRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: open ? "inherit" : "0.75rem",
                        textAlign: open ? "left" : "center",
                      }}
                    >
                      Taça
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 1, color: "white" }}
                />
              </ListItemButton>
            </ListItem>
          )}
          {open && (
            <>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Taca/Calendar"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <CalendarMonthRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                        }}
                      >
                        Calendário
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  href="/Taca/TopScorers"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    flexDirection: open ? "row" : "column",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <LeaderboardRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: open ? "inherit" : "0.75rem",
                          textAlign: open ? "left" : "center",
                        }}
                      >
                        Melhores marcadores
                      </Typography>
                    }
                    sx={{ opacity: open ? 1 : 1, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
        <Divider />
        {open && (
          <Typography
            variant="h6"
            sx={{ padding: theme.spacing(1), color: "white" }}
          >
            Informações
          </Typography>
        )}
        <List>
          {shouldDisplayItem("Sobre") && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                href="/Sobre"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  flexDirection: open ? "row" : "column",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <InfoRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: open ? "inherit" : "0.75rem",
                        textAlign: open ? "left" : "center",
                      }}
                    >
                      Info
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 1, color: "white" }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
        {open && (
          <Typography
            variant="h6"
            sx={{ padding: theme.spacing(1), color: "white" }}
          >
            Galeria
          </Typography>
        )}
        <List>
          {shouldDisplayItem("Galeria") && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                href="/Galeria"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  flexDirection: open ? "row" : "column",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <CollectionsRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: open ? "inherit" : "0.75rem",
                        textAlign: open ? "left" : "center",
                      }}
                    >
                      Galeria
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 1, color: "white" }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </Box>
  );
}
