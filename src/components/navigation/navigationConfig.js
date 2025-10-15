import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import SportsRoundedIcon from "@mui/icons-material/SportsRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import StadiumIcon from "@mui/icons-material/Stadium";
import GavelIcon from "@mui/icons-material/Gavel";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupsIcon from "@mui/icons-material/Groups";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";

export const navigationSections = [
  {
    title: "Liga",
    key: "liga",
    items: [
      {
        label: "Liga",
        href: "/liga/classificacao",
        icon: LeaderboardIcon,
        showWhenClosed: true,
        id: "Classificação",
      },
      {
        label: "Calendário",
        href: "/liga/calendario",
        icon: CalendarMonthRoundedIcon,
        showWhenClosed: false,
        id: "Calendário",
      },
      {
        label: "Melhores marcadores",
        href: "/liga/marcadores",
        icon: SportsSoccerRoundedIcon,
        showWhenClosed: false,
        id: "Melhores marcadores",
      },
      {
        label: "Disciplina",
        href: "/liga/disciplina",
        icon: SportsRoundedIcon,
        showWhenClosed: false,
        id: "Disciplina",
      },
    ],
  },
  {
    title: "Taça",
    key: "taca",
    items: [
      {
        label: "Taça",
        href: "/taca/sorteio",
        icon: EmojiEventsRoundedIcon,
        showWhenClosed: true,
        id: "Taça",
      },
    ],
  },
  {
    title: "Supertaça",
    key: "supertaca",
    items: [
      {
        label: "Supertaça",
        href: "/jogos/256",
        icon: StadiumIcon,
        showWhenClosed: true,
        id: "Supertaça",
      },
    ],
  },
  {
    title: "Informações",
    key: "informacoes",
    items: [
      {
        label: "Sorteio",
        labelClosed: "Info",
        href: "/informacao/sorteio",
        icon: GavelIcon,
        showWhenClosed: true,
        id: "Info",
      },
      {
        label: "Documentação",
        href: "/informacao/documentacao",
        icon: DescriptionIcon,
        showWhenClosed: false,
        id: "Documentação",
      },
    ],
  },
  {
    title: "Galeria",
    key: "galeria",
    items: [
      {
        label: "Equipas",
        labelClosed: "Galeria",
        href: "/galeria/equipas",
        icon: GroupsIcon,
        showWhenClosed: true,
        id: "Galeria",
      },
    ],
  },
  {
    title: "Histórico",
    key: "historico",
    items: [
      {
        label: "Histórico",
        href: "/historico",
        icon: RestoreOutlinedIcon,
        showWhenClosed: true,
        id: "Histórico",
      },
    ],
  },
];

// Social Media Links
export const socialLinks = [
  {
    name: "Instagram",
    icon: "instagram",
    url: "https://www.instagram.com/liga.veteranos.do.sado", // Replace with actual URL
    color: "#E4405F",
  },
  {
    name: "Facebook",
    icon: "facebook",
    url: "https://www.facebook.com/profile.php?id=61581706886192&rdid=GFsVs4JAbAfkm68J&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CgPNN6UEn%2F", // Replace with actual URL
    color: "#1877F2",
  },
  {
    name: "Email",
    icon: "email",
    url: "mailto:ligadeveteranosdosado@outlook.pt", // Replace with actual email
    color: "#FFD700",
  },
];
