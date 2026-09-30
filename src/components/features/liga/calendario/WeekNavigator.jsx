import React, { useEffect, useRef } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { theme } from "../../../../styles/theme.js";

/**
 * Default: a number is a matchweek, so it gets the short J-prefix that lets the
 * strip fit on a phone. Anything else is shown as it comes.
 *
 * The cup knockout also keys on numbers ("8", "4", "2", "1" are rounds, not
 * matchweeks), so /taca/calendario passes its own formatter — see
 * formatCupRoundLabel there.
 */
const defaultWeekLabel = (week) =>
  /^\d+$/.test(String(week)) ? `J${week}` : String(week);

/**
 * WeekNavigator Component
 * Navigation for switching between match weeks.
 *
 * Mobile: a horizontally scrollable strip of weeks, current one centred.
 * Desktop: the same strip, wrapped.
 *
 * @param {Array} weekList - List of available weeks
 * @param {string} currentWeek - Currently selected week
 * @param {Function} onWeekChange - Callback when week changes
 */
const WeekNavigator = ({
  weekList,
  currentWeek,
  onWeekChange,
  formatLabel = defaultWeekLabel,
}) => {
  // Same 768px threshold the rest of the calendar uses, but reactive — it used
  // to read window.innerWidth during render, which never updated on rotation.
  const isMobile = useMediaQuery("(max-width: 768px)");

  const stripRef = useRef(null);
  const activeRef = useRef(null);

  // Keep the selected week in view without scrolling the page itself.
  useEffect(() => {
    const strip = stripRef.current;
    const active = activeRef.current;
    if (!strip || !active) return;

    strip.scrollTo({
      left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [currentWeek, weekList.length]);

  return (
    <Box
      mb={3}
      sx={{
        backgroundColor: theme.colors.background.card,
        borderRadius: "12px",
        boxShadow: theme.components.card.shadow,
        overflow: "hidden",
      }}
    >
      <Box
        ref={stripRef}
        sx={{
          display: "flex",
          gap: 1,
          padding: "12px",
          justifyContent: isMobile ? "flex-start" : "center",
          flexWrap: isMobile ? "nowrap" : "wrap",
          overflowX: isMobile ? "auto" : "visible",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {weekList.map((week) => {
          const isCurrent = currentWeek === week;

          return (
            <Box
              key={week}
              ref={isCurrent ? activeRef : null}
              onClick={() => onWeekChange(week)}
              role="button"
              tabIndex={0}
              aria-current={isCurrent ? "true" : undefined}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onWeekChange(week);
                }
              }}
              sx={{
                flex: "0 0 auto",
                minWidth: "48px",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 14px",
                cursor: "pointer",
                userSelect: "none",
                fontWeight: "bold",
                borderRadius: "8px",
                border: `2px solid ${theme.colors.primary[600]}`,
                backgroundColor: isCurrent
                  ? theme.colors.primary[600]
                  : theme.colors.background.card,
                color: isCurrent ? "white" : theme.colors.primary[600],
                transition: "background-color 0.2s ease, color 0.2s ease",
                "@media (hover: hover)": {
                  "&:hover": {
                    backgroundColor: isCurrent
                      ? theme.colors.primary[600]
                      : theme.colors.background.secondary,
                  },
                },
              }}
            >
              {formatLabel(week)}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default WeekNavigator;
