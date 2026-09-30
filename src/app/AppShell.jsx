"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Nav from "../components/navigation/Nav";

// The fixed app bar's height, and the permanent drawer's two widths. The
// drawer's collapsed width is theme.spacing(8) + 1px at sm and up.
const APP_BAR_HEIGHT = 64;
const DRAWER_OPEN = 240;
const DRAWER_CLOSED = 65;

/**
 * The app frame: fixed app bar, permanent drawer on desktop, and the main
 * column that has to sit clear of both.
 *
 * Those offsets used to be written straight onto the DOM node from an effect
 * (`document.querySelector(".main-content").style.marginLeft = …`), so the
 * first paint had no offsets at all: the content rendered underneath the app
 * bar and jumped once the effect ran. They are plain responsive sx values now,
 * so they are correct in the very first frame, server-rendered included.
 */
export const AppShell = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // The login page is full-bleed: no app bar, no drawer, no offsets.
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminLogin) {
    return children;
  }

  return (
    <>
      <Nav onDrawerToggle={setDrawerOpen} />
      <Box
        component="main"
        sx={{
          minWidth: 0,
          mt: `${APP_BAR_HEIGHT}px`,
          // xs is the mobile modal menu, so there is no drawer to clear.
          ml: {
            xs: 0,
            sm: `${drawerOpen ? DRAWER_OPEN : DRAWER_CLOSED}px`,
          },
          p: { xs: 0, sm: 2 },
          transition: (theme) =>
            theme.transitions.create("margin-left", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default AppShell;
