"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Grid,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { supabase } from "../../lib/supabase"; // Adjust path to your actual supabase config

// Seasons data
const seasons = [
  {
    year: 2013,
    url: "https://ligaveteranossado.blogspot.com",
    winner: "Praiense",
  },
  {
    year: 2014,
    url: "https://ligaveteranossado2014.blogspot.com",
    winner: "Sport Clube Sado",
  },
  {
    year: 2015,
    url: "https://ligaveteranossado2015.blogspot.com",
    winner: "Sport Clube Sado",
  },
  {
    year: 2016,
    url: "https://ligaveteranossado2016.blogspot.com",
    winner: "Casa do Benfica de Setúbal",
  },
  {
    year: 2017,
    url: "https://ligaveteranossado2017.blogspot.com",
    winner: "Sport Clube Sado",
  },
  {
    year: 2018,
    url: "https://ligaveteranossado2018.blogspot.com",
    winner: "Ídolos da Praça",
  },
  {
    year: 2019,
    url: "https://ligaveteranosdosado2019.blogspot.com",
    winner: "Ídolos da Praça",
  },
  {
    year: 2020,
    url: "https://ligaveteranosdosado2020.blogspot.com",
    winner: "Pontes",
  },
  {
    year: 2021,
    url: "https://ligaveteranosdosado2021.blogspot.com",
    winner: "Amarelos",
  },
  {
    year: 2022,
    url: "https://ligaveteranodosado2022.blogspot.com",
    winner: "São Domingos F.C",
  },
  {
    year: 2023,
    url: "https://ligaveteranosdosado2023.blogspot.com",
    winner: "São Domingos F.C",
  },
  {
    year: 2024,
    url: "https://ligaveteranosdosado2024.blogspot.com",
    winner: "Águias S. Gabriel",
  },
];

const HistoryPage = () => {
  const [jornadas, setJornadas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the match_files table
  useEffect(() => {
    const fetchJornadas = async () => {
      const { data, error } = await supabase
        .from("match_files") // Your table name
        .select("week, link") // Selecting week and link columns
        .order("week", { ascending: true }); // Order by week in ascending order

      if (error) {
        console.error("Error fetching match files:", error);
      } else {
        // Format data for use in the component
        const formattedJornadas = data.map((item) => ({
          jornada: item.week,
          url: item.link,
        }));
        setJornadas(formattedJornadas);
      }
      setLoading(false);
    };

    fetchJornadas();
  }, []);

  const midIndex = Math.ceil(seasons.length / 2);
  const firstColumn = seasons.slice(0, midIndex);
  const secondColumn = seasons.slice(midIndex);

  return (
    <Box sx={{ p: 4 }}>
      {/* Épocas Section */}
      <Typography variant="h5" sx={{ color: "#6B4BA1", mb: 2 }} gutterBottom>
        ÉPOCAS
      </Typography>

      <Grid container spacing={2}>
        {/* First Column */}
        <Grid item xs={12} md={6}>
          <List>
            {firstColumn.map((season, index) => (
              <React.Fragment key={season.year}>
                <ListItem
                  component={Link}
                  href={season.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemText
                    sx={{ color: "#6B4BA1" }}
                    primary={season.year}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                    <Typography sx={{ color: "#6B4BA1" }} variant="body2">
                      {season.winner}
                    </Typography>
                  </Box>
                  <EmojiEventsIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#FFD700" }}
                  />
                </ListItem>
                {index < firstColumn.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Grid>

        {/* Second Column */}
        <Grid item xs={12} md={6}>
          <List>
            {secondColumn.map((season, index) => (
              <React.Fragment key={season.year}>
                <ListItem
                  component={Link}
                  href={season.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemText
                    sx={{ color: "#6B4BA1" }}
                    primary={season.year}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                    <Typography sx={{ color: "#6B4BA1" }} variant="body2">
                      {season.winner}
                    </Typography>
                  </Box>
                  <EmojiEventsIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "#FFD700" }}
                  />
                </ListItem>
                {index < secondColumn.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Grid>
      </Grid>

      {/* Fichas de Jogo Section */}
      <Typography
        variant="h5"
        sx={{ color: "#6B4BA1", mt: 4, mb: 2 }}
        gutterBottom
      >
        FICHAS DE JOGO
      </Typography>

      {loading ? (
        <Typography>Loading match files...</Typography>
      ) : (
        <Grid container spacing={2}>
          {/* Generate 4 columns */}
          {[0, 1, 2, 3].map((colIndex) => (
            <Grid item xs={12} sm={6} md={3} key={colIndex}>
              {" "}
              {/* 4 columns */}
              <List>
                {jornadas
                  .filter((_, index) => index % 4 === colIndex) // Filter to create columns
                  .map((jornada, index) => (
                    <React.Fragment key={jornada.jornada}>
                      <ListItem
                        button
                        component={Link}
                        href={jornada.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ListItemText
                          sx={{ color: "#6B4BA1" }}
                          primary={`Jornada ${jornada.jornada}`}
                        />
                        <OpenInNewIcon
                          fontSize="small"
                          sx={{ ml: 1, color: "#6B4BA1" }}
                        />
                      </ListItem>
                      {index < jornadas.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
              </List>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default HistoryPage;
