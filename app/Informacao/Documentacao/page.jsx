"use client";
import React from "react";
import { Typography, List, ListItem, ListItemText, Divider, Box, Link } from "@mui/material";
import Image from "next/image";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function Documentacao() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ color: '#6B4BA1' }} gutterBottom>
        INFORMAÇÃO
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#6B4BA1' }} gutterBottom>
          Documentos Importantes
        </Typography>
        <List>
          {[
            { text: "REGULAMENTO 2016/17", link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBclA5NGNaLTBod1FoV1ZXUkJWVmVRc1RVenkw&cid=101CD27EC6E1FDB3&id=101CD27EC6E1FDB3%21741&parId=101CD27EC6E1FDB3%21195&o=OneUp" },
            { text: "RELATÓRIO DO ÁRBITRO", link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBclA5NGNaLTBod1FoV2FVQUlMd1lGV1FoQnFh&cid=101CD27EC6E1FDB3&id=101CD27EC6E1FDB3%21742&parId=101CD27EC6E1FDB3%21195&o=OneUp" },
            { text: "FICHA DE JOGO EM BRANCO", link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBclA5NGNaLTBod1FoV2RZTWpwY0drYUtMbWY2&cid=101CD27EC6E1FDB3&id=101CD27EC6E1FDB3%21743&parId=101CD27EC6E1FDB3%21195&o=OneUp" },
            { text: "FICHA DE TRANSFERÊNCIA", link: "https://drive.google.com/file/d/1Vvxz82fHThEZyDWsx9hDALXRsjUFKWeh/view" },
            { text: "FICHA DE INSCRIÇÃO DE JOGADOR", link: "https://docs.google.com/forms/d/e/1FAIpQLSe48ZQn639DBzpV-J4xyn_FkyisjIxKODyZh4O8ebKgwqFs0w/viewform" },
            { text: "COMO PREENCHER A FICHA DE JOGO", link: "https://drive.google.com/file/d/1LOZ528QWkKpG1IP4rz9J3KMiFISjsv9j/view" }
          ].map((doc, index) => (
            <React.Fragment key={index}>
              <ListItem button component={Link} href={doc.link} target="_blank" rel="noopener noreferrer">
                <ListItemText primary={doc.text} />
                <OpenInNewIcon fontSize="small" sx={{ ml: 1 }} />
              </ListItem>
              {index < 5 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#6B4BA1' }} gutterBottom>
          Jokers - Idade Mínima e Limite
        </Typography>
        <Typography>
          A idade mínima para inscrição de Jokers é de 33 anos, limitados a 2 jokers por equipa.
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',  // Align the text and images at the center
          gap: 2,  // Space between the text and the images
          flexDirection: { xs: 'column', md: 'row' },  // Column on small screens, row on medium and above
          justifyContent: 'flex-start',  // Ensure that the content doesn't stretch all the way to the right
        }}
      >
        {/* Text (Left side) */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ color: '#6B4BA1' }} gutterBottom>
            Bolas Oficiais da Liga
          </Typography>
          <Typography>
            <strong>Marca:</strong> Select
          </Typography>
          <Typography>
            <strong>Modelo:</strong> Team ou Liga PRO
          </Typography>
          <Typography>
            Cada equipa, quando jogar em casa, tem de ter 3 bolas oficiais.
          </Typography>
        </Box>

        {/* Images (Right side, close to the text) */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,  // Space between the images
            flexShrink: 0,  // Prevent the images from shrinking
            justifyContent: 'flex-start'  // Keep the images close to the text
          }}
        >
          <Image src="/bolas/bola1.png" alt="Bola 1" width={100} height={100} />
          <Image src="/bolas/bola2.png" alt="Bola 2" width={100} height={100} />
          <Image src="/bolas/bola3.png" alt="Bola 3" width={100} height={100} />
        </Box>
      </Box>
    </Box>
  );
}
