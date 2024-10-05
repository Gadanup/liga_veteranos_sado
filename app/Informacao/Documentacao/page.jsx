"use client";
import React from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import Image from "next/image";

export default function Documentacao() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography align="center" variant="h4" sx={{color:'#6B4BA1'}} gutterBottom>
        INFORMAÇÃO
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{color:'#6B4BA1'}} gutterBottom>
          Documentos Importantes
        </Typography>
        <ListItem
          button="true"
          component="a"
          href="https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBclA5NGNaLTBod1FoV1ZXUkJWVmVRc1RVenkw&cid=101CD27EC6E1FDB3&id=101CD27EC6E1FDB3%21741&parId=101CD27EC6E1FDB3%21195&o=OneUp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText  primary="REGULAMENTO 2016/17" />
        </ListItem>
        <Divider />
        <ListItem
          button="true"
          component="a"
          href="https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBclA5NGNaLTBod1FoV2FVQUlMd1lGV1FoQnFh&cid=101CD27EC6E1FDB3&id=101CD27EC6E1FDB3%21742&parId=101CD27EC6E1FDB3%21195&o=OneUp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText primary="RELATÓRIO DO ÁRBITRO" />
        </ListItem>
        <Divider />
        <ListItem
          button="true"
          component="a"
          href="https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBclA5NGNaLTBod1FoV2RZTWpwY0drYUtMbWY2&cid=101CD27EC6E1FDB3&id=101CD27EC6E1FDB3%21743&parId=101CD27EC6E1FDB3%21195&o=OneUp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText primary="FICHA DE JOGO EM BRANCO (É aconselhável todos dos responsáveis ter uma ficha de jogo em branco para algum eventual problema de última hora.)" />
        </ListItem>
        <Divider />
        <ListItem
          button="true"
          component="a"
          href="https://drive.google.com/file/d/1Vvxz82fHThEZyDWsx9hDALXRsjUFKWeh/view"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText primary="FICHA DE TRANSFERÊNCIA" />
        </ListItem>
        <Divider />
        <ListItem
          button="true"
          component="a"
          href="https://docs.google.com/forms/d/e/1FAIpQLSe48ZQn639DBzpV-J4xyn_FkyisjIxKODyZh4O8ebKgwqFs0w/viewform"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText primary="FICHA DE INSCRIÇÃO DE JOGADOR" />
        </ListItem>
        <Divider />
        <ListItem
          button="true"
          component="a"
          href="https://drive.google.com/file/d/1LOZ528QWkKpG1IP4rz9J3KMiFISjsv9j/view"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText primary="COMO PREENCHER A FICHA DE JOGO" />
        </ListItem>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{color:'#6B4BA1'}} gutterBottom>
          Jokers - Idade Mínima e Limite
        </Typography>
        <Typography>
          A idade mínima para inscrição de Jokers é de 32 anos, limitados a 2
          jokers por equipa.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{color:'#6B4BA1'}} gutterBottom>
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            mt: 3,
          }}
        >
          <Image src="/bolas/bola1.png" alt="Bola 1" width={100} height={100} />
          <Image src="/bolas/bola2.png" alt="Bola 2" width={100} height={100} />
          <Image src="/bolas/bola3.png" alt="Bola 3" width={100} height={100} />
        </Box>
      </Paper>
    </Box>
  );
}
