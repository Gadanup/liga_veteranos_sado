import React from "react";
import { Box } from "@mui/material";
import MobileRoundView from "./MobileRoundView";

/**
 * CupMobileView Component
 * Displays cup matches in mobile accordion format
 *
 * @param {Object} bracketData - Formatted bracket data
 * @param {Object} router - Next.js router
 */
const CupMobileView = ({ bracketData, router }) => {
  return (
    <Box>
      <MobileRoundView
        title="Oitavos de Final"
        matches={bracketData.round8}
        roundKey="round8"
        router={router}
      />
      <MobileRoundView
        title="Quartos de Final"
        matches={bracketData.round4}
        roundKey="round4"
        router={router}
      />
      <MobileRoundView
        title="Semifinais"
        matches={bracketData.round2}
        roundKey="round2"
        router={router}
      />
      <MobileRoundView
        title="Final"
        matches={bracketData.final}
        roundKey="final"
        router={router}
      />
    </Box>
  );
};

export default CupMobileView;
