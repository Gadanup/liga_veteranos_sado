import React from 'react';
import { Container, Card, CardContent, Typography, Grid, Box } from '@mui/material';

export default function Sorteio() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Header */}
      <Typography variant="h4" align="center" sx={{color:'#6B4BA1'}} gutterBottom>
        Sorteio do Campeonato
      </Typography>

      {/* Notes Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="primary" sx={{color:'#6B4BA1'}} gutterBottom>
            Notas
          </Typography>
          <Typography>
            Campeonato com 15 equipas.
          </Typography>
          <Typography>
            Cada equipa joga contra todas as restantes duas vezes (uma casa e outra fora).
          </Typography>
          <Typography>
            Campeonato em formato liga regular.
          </Typography>
        </CardContent>


      {/* Teams Section */}

      {/* Methodology Section */}
        <CardContent>
          <Typography variant="h6" sx={{color:'#6B4BA1'}} gutterBottom>
            Metodologia do Sorteio
          </Typography>
          <Typography>
            Primeiro serão sorteadas equipas a jogar no Pinhal Novo.
          </Typography>
          <Typography>
            Estas equipas terão de ser sorteadas com a condicionante de serem alocadas aos lugares: 1, 2, 5, 7, 9, 11.
          </Typography>
          <Typography>
            Segundo será sorteada a equipa dos amarelos com a condicionante de ser colocada num dos lugares: 3, 4, 6, 12.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
