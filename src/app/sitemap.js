import { SITE_URL } from "../constants/site";

// Static public routes only. The dynamic ones (/jogos/[id], /equipas/[teamname])
// would need a Supabase call at build time; left out until the pages are server
// components (step 5.4).
const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/liga/classificacao", priority: 1 },
  { path: "/liga/calendario", priority: 0.9 },
  { path: "/liga/marcadores", priority: 0.8 },
  { path: "/liga/disciplina", priority: 0.8 },
  { path: "/taca", priority: 0.8 },
  { path: "/taca/calendario", priority: 0.7 },
  { path: "/taca/marcadores", priority: 0.7 },
  { path: "/galeria/equipas", priority: 0.5 },
  { path: "/historico", priority: 0.5 },
  { path: "/informacao/sorteio", priority: 0.5 },
  { path: "/informacao/documentacao", priority: 0.5 },
];

export default function sitemap() {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
}
