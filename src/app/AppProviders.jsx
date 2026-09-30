"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeWrapper } from "../components/ThemeWrapper";

/**
 * Everything that has to run in the browser, kept out of the root layout so
 * that layout can be a server component and export metadata.
 *
 * AppRouterCacheProvider makes emotion inject its styles during SSR instead of
 * after hydration — without it the first paint is unstyled for a moment.
 * CssBaseline used to be rendered inside Nav, which meant the login page never
 * got it; it belongs here, above everything.
 */
export const AppProviders = ({ children }) => {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeWrapper>
        <CssBaseline />
        {children}
      </ThemeWrapper>
    </AppRouterCacheProvider>
  );
};

export default AppProviders;
