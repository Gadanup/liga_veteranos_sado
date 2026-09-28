import { useState, useEffect } from "react";
import { fetchCurrentSeason } from "../api/seasons";

export const useGetCurrentSeason = () => {
  const [currentSeason, setCurrentSeason] = useState(null);

  // ---- hooks ----
  useEffect(() => {
    let cancelled = false;

    fetchCurrentSeason()
      .then((season) => {
        if (!cancelled) setCurrentSeason(season);
      })
      .catch((error) => console.error("Error fetching current season:", error));

    return () => {
      cancelled = true;
    };
  }, []);

  return { currentSeason };
};
