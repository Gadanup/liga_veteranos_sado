import React from 'react';
import { Typography, Box } from '@mui/material';

export default function Sorteio() {
  return (
    <Box 
      sx={{ 
        p: 4, 
      }}
    >
      {/* Header */}
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#6B4BA1', 
          mb: { xs: 2, md: 3 }, 
          fontSize: { xs: '1.8rem', sm: '2.2rem' } 
        }}
      >
        Sorteio do Campeonato
      </Typography>

      {/* Notes Section */}
      <Box 
        sx={{ 
          mb: 4, 
          width: '100%' 
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#6B4BA1', 
            fontSize: { xs: '1.2rem', sm: '1.5rem' }, 
            mb: 2 
          }}
        >
          Notas
        </Typography>
        <Typography sx={{ mb: 1 }}>Campeonato com 15 equipas.</Typography>
        <Typography sx={{ mb: 1 }}>Cada equipa joga contra todas as restantes duas vezes (uma casa e outra fora).</Typography>
        <Typography>Campeonato em formato liga regular.</Typography>
      </Box>

      {/* Methodology Section */}
      <Box sx={{ width: '100%' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#6B4BA1', 
            fontSize: { xs: '1.2rem', sm: '1.5rem' }, 
            mb: 2 
          }}
        >
          Metodologia do Sorteio
        </Typography>
        <Typography sx={{ mb: 1 }}>Primeiro serão sorteadas equipas a jogar no Pinhal Novo.</Typography>
        <Typography sx={{ mb: 1 }}>
          Estas equipas terão de ser sorteadas com a condicionante de serem alocadas aos lugares: 1, 2, 5, 7, 9, 11.
        </Typography>
        <Typography>
          Segundo será sorteada a equipa dos amarelos com a condicionante de ser colocada num dos lugares: 3, 4, 6, 12.
        </Typography>
      </Box>
    </Box>
  );
}
