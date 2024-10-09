"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Typography, Box, CircularProgress } from '@mui/material';

const TeamPage = () => {
  const pathname = usePathname();
  const teamName = decodeURIComponent(pathname.split('/').pop());
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('short_name, logo_url')
        .eq('short_name', teamName)
        .single();

      if (error) {
        console.error("Error fetching team data:", error);
      } else {
        setTeamData(data);
      }
      setLoading(false);
    };

    fetchTeamData();
  }, [teamName]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      {teamData ? (
        <>
          <img
            src={teamData.logo_url}
            alt={`${teamData.short_name} logo`}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
              marginBottom: '16px'
            }}
          />
          <Typography variant="h4">Team: {teamData.short_name}</Typography>
        </>
      ) : (
        <Typography variant="h6">Team not found</Typography>
      )}
    </Box>
  );
};

export default TeamPage;
