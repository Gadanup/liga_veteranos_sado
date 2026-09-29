# 05 — Screen Specs (implementation guide for the redesign)

> Detailed spec of every screen and shared component from `docs/reference/design-direction.md`, precise enough to implement one screen per PR.
> Reads with: `docs/archive/02_IMPROVEMENTS.md` (mobile/code items), `docs/reference/data-entry.md` (admin flows).
> The app has **no end-user accounts** — only admins log in. Every screen is public and identical for all visitors.

---

## 0. Conventions used in this doc

### Breakpoints (MUI defaults — the only ones allowed)
| Name | Width | Treated as |
|---|---|---|
| `xs` | 0–599 | phone |
| `sm` | 600–899 | large phone landscape / small tablet → **still mobile layout** |
| `md` | 900–1199 | tablet landscape / small laptop → desktop layout |
| `lg` | ≥ 1200 | desktop |

"**Mobile**" in this doc = `xs` + `sm`. "**Desktop**" = `md`+. Implement with `sx={{ prop: { xs: …, md: … } }}`; use `useMediaQuery(theme.breakpoints.down("md"))` only when the *component tree* differs (e.g. bottom nav vs sidebar). Test at **360, 390, 768, 1024, 1440 px**.

### Season in the URL
Every data page reads the season from `?epoca=<id>` (fallback: season with `is_current`). The nav, links and switchers **preserve** it. One hook: `useSelectedSeason()` → `{ seasonId, season, seasons, setSeason }` (`setSeason` uses `router.replace`). Links to other pages include the param only when it isn't the current season (clean URLs for the normal case).

> Today some pages use `?season=`. Keep reading `season` as an alias so old shared links keep working.

### Data hooks
Names follow `useGet<Data>` (see `docs/archive/02_IMPROVEMENTS.md` C1/C2). Until React Query is approved they can be plain hooks with the same signature — screens don't change when the implementation does.

### States every screen must implement
- **Loading** → skeleton shaped like the content (never a full-page spinner after first paint).
- **Empty** → `EmptyState` with a specific message (strings below).
- **Error** → `ErrorState` with "Tentar novamente" button (calls `refetch`).

### Strings
All UI strings go in `src/constants/const.ts` (Portuguese). Strings in this doc are the proposed copy.

---

## 1. Foundations

### 1.1 Theme (`src/theme/theme.js`)

```js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        primary:   { main: "#5B3E96", light: "#8C6FC4", dark: "#3E2A6B", contrastText: "#FFFFFF" },
        secondary: { main: "#F5C400", light: "#FFE066", dark: "#C79F00", contrastText: "#1B1530" },
        success:   { main: "#16A34A" },
        error:     { main: "#DC2626" },
        warning:   { main: "#D97706" },
        info:      { main: "#2563EB" },
        background:{ default: "#F6F5F9", paper: "#FFFFFF" },
        text:      { primary: "#1B1530", secondary: "#625C70" },
        divider: "#E7E4EE",
      },
    },
    dark: {
      palette: {
        primary:   { main: "#A58BE0", light: "#C4B0F0", dark: "#7A5CC0", contrastText: "#121016" },
        secondary: { main: "#F5C400", contrastText: "#121016" },
        background:{ default: "#121016", paper: "#1C1922" },
        text:      { primary: "#F2F0F7", secondary: "#A8A2B5" },
        divider: "#2C2833",
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    h1: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem",   lineHeight: 1.1 }, // 32
    h2: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", lineHeight: 1.15 }, // 24
    h3: { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.25rem" }, // 20
    h4: { fontWeight: 600, fontSize: "1rem" },       // 16 — card titles
    body1: { fontSize: "1rem" },                     // 16
    body2: { fontSize: "0.875rem" },                 // 14 — default in lists/tables
    caption: { fontSize: "0.75rem" },                // 12 — minimum size anywhere
    overline: { fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCard:   { defaultProps: { variant: "outlined" } },
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { minHeight: 44, borderRadius: 8 } } },
    MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
    MuiChip:   { styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } } },
    MuiDialog: { defaultProps: { fullWidth: true } },
  },
});
```

**Custom tokens** (extra keys in each `colorSchemes.*.palette`, e.g. `palette.result.win` — plain JS, no type augmentation needed):
| Token | Light | Dark | Use |
|---|---|---|---|
| `result.win` | `#16A34A` | `#22C55E` | form guide W, winner accent |
| `result.draw` | `#9CA3AF` | `#6B7280` | form guide D |
| `result.loss` | `#DC2626` | `#EF4444` | form guide L |
| `card.yellow` | `#FACC15` | same | yellow card icon |
| `card.red` | `#DC2626` | same | red card icon |
| `zone.champion` | `secondary.main` | same | 1st place bar |
| `zone.podium` | `#E9D98A` | `#8A7A2E` | 2nd–3rd bar |
| `zone.top` | `primary.light` | `primary.dark` | 4th–6th bar |
| `zone.excluded` | `error.main` 30% | same | excluded team row |

**Custom typography variants** (extra keys in `typography`, plus `MuiTypography.defaultProps.variantMapping` so they render as `<span>`):
| Variant | Spec | Use |
|---|---|---|
| `score` | display font, 700, 40 px (`xs` 32 px), `font-variant-numeric: tabular-nums` | match hero score |
| `scoreSm` | display font, 700, 20 px, tabular | score in cards/lists |
| `stat` | display font, 700, 28 px, tabular | stat tiles |
| `tableNum` | body font, 14 px, 500, tabular | numbers in tables |

**Rules**: gold (`secondary`) is **never** used for text on white (contrast fails) — only as fills with dark text or as a bar/border. No gradients except the match hero and team hero. Shadows only on floating elements (dialogs, bottom nav, menus); cards use 1 px border.

### 1.2 Fonts
- Body: Geist (already loaded in `layout.js` as `--font-geist-sans`).
- Display: **Barlow Condensed** 600/700 via `next/font/google`, exposed as `--font-display`. (Alternative: Oswald — pick one when reviewing the mockup.)

### 1.3 Root layout (replaces `src/app/layout.js`)
- `layout.js` becomes a **server component**: `<html lang="pt-PT">`, fonts, `metadata` (title template `%s · Liga Veteranos do Sado`), `viewport` (`themeColor` light `#5B3E96` / dark `#121016`), manifest link.
- Client providers in `src/app/AppProviders.jsx`: `AppRouterCacheProvider` (`@mui/material-nextjs`, already installed) → `ThemeProvider` → `CssBaseline` → (React Query provider later).
- `InitColorSchemeScript` in `<body>` to avoid dark-mode flash.
- `AppShell` (client): TopBar + `<main>` + BottomNav (mobile) or Sidebar (desktop). **No DOM manipulation, no margins set in JS.**
- `/admin/login` renders without the shell (route group `(auth)` gets its own `layout.js`).

### 1.4 Spacing & sizes
- Page gutter: `px: { xs: 2, md: 3 }` (16/24 px). Max content width 1200 px, centred.
- Vertical rhythm between sections: `2` (16 px) mobile, `3` (24 px) desktop.
- Card padding: `2` (16 px). List row height ≥ 56 px (tap target).
- Icons: 20 px in lists, 24 px in nav.

---

## 2. App shell

### 2.1 TopBar
```
Mobile (56px)
┌──────────────────────────────────────────┐
│ [logo 32] Veteranos do Sado    [25/26 ▾] │
└──────────────────────────────────────────┘
Desktop (64px, right of sidebar)
┌──────────────────────────────────────────────────────────────┐
│ Classificação                         [Época 2025/26 ▾] [👤] │
└──────────────────────────────────────────────────────────────┘
```
- Background `primary.main`, text white. Sticky, `position: sticky; top: 0`, respects `env(safe-area-inset-top)`.
- Mobile left: logo + "Veteranos do Sado" (h4, white). Tapping logo → `/`.
- Desktop left: current page title (h3).
- Right: `SeasonSwitcher` (compact on mobile: "25/26 ▾"). Hidden on pages without season data (Informação, Admin login).
- Admin logged in: small gold dot on the logo + "Admin" chip on desktop; logout lives in *Mais* sheet (mobile) / sidebar footer (desktop).
- Replaces: `NavAppBar.jsx` (and the hardcoded "Época 2025/2026").

### 2.2 BottomNav (mobile only)
```
┌────────┬────────┬────────┬────────┬────────┐
│   🏠    │   📅    │   🏆    │   🛡️    │   ☰    │
│ Início │ Jogos  │  Taça  │ Equipas│  Mais  │
└────────┴────────┴────────┴────────┴────────┘
```
- MUI `BottomNavigation` + `Paper elevation={8}`, fixed bottom, height 64 + `env(safe-area-inset-bottom)`. `<main>` gets matching bottom padding.
- Tabs & routes: Início `/` · Jogos `/liga/calendario` · Taça `/taca` · Equipas `/equipas` (new list page, §4.12) · Mais (opens sheet).
- Active tab: `primary.main` icon + label; inactive `text.secondary`. Active state derived from `usePathname()` prefix (`/liga/calendario`, `/jogos/*` → Jogos; `/taca*` → Taça; `/equipas*` → Equipas; `/liga/classificacao` → Início).

### 2.3 "Mais" sheet (mobile)
MUI `SwipeableDrawer anchor="bottom"`, rounded top 16 px, drag handle.
```
Liga
  📊 Classificação        /liga/classificacao
  ⚽ Marcadores           /liga/marcadores
  🟨 Disciplina           /liga/disciplina
Taça
  📅 Calendário da Taça   /taca/calendario
  ⚽ Marcadores da Taça   /taca/marcadores
🏟 Supertaça               /supertaca
ℹ️ Regras e Sorteio        /informacao/sorteio
📄 Documentos             /informacao/documentacao
🖼 Galeria                 /galeria/equipas
🕰 Histórico               /historico
───────────
Instagram · Facebook · Email   (icons row, from navigationConfig.socialLinks)
Área de administração / Terminar sessão
```
Items are `ListItemButton` 56 px high. Config stays in `navigationConfig.js` (single source for sheet + sidebar).

### 2.4 Sidebar (desktop)
- Permanent `Drawer` 240 px, `background.paper`, right border `divider`. **Not** collapsible on hover (remove the hover-expand behaviour).
- Logo + "Liga Veteranos do Sado" at top; sections Liga / Taça / Supertaça / Informação / Galeria / Histórico with the same items as the sheet; social icons + admin at the bottom.
- Active item: `primary.main` 10 % background, `primary.main` text, 3 px left bar.

### 2.5 SeasonSwitcher
- MUI `Select` (desktop) / button opening a `Menu` (mobile) listing `seasons.description`, current season marked "Atual".
- On change → `setSeason(id)` (URL `replace`), all queries keyed by season refetch.

### 2.6 PageHeader
Used at the top of every page body (below TopBar):
```
Classificação                       [Comparar]   ← h1 + optional actions (right)
Liga · Época 2025/26                              ← caption, text.secondary
```
Mobile: actions become icon buttons or move into an overflow `⋮` menu. No emoji in titles.

---

## 3. Component library (`src/components/ui/` — shared by all screens)

For each: props → behaviour. No component takes `isMobile`.

### 3.1 `TeamBadge`
`{ team: { short_name, logo_url }, size?: 20|24|32|48|80, showName?: boolean, nameVariant?: 'short'|'full', href?: string }`
- Logo in a square with `object-fit: contain` (use `next/image` with `sizes`), fallback = initials in a `primary.light` circle.
- With name: logo + name, `gap: 1`, name `noWrap` + ellipsis. When `href`, the whole thing is a `Link`.

### 3.2 `PlayerAvatar`
`{ player: { name, photo_url, joker }, size?: 32|40|56|80, showJoker?: boolean }`
- MUI `Avatar` with `next/image` src, fallback initials. Joker → small "JK" badge (secondary fill) bottom-right.

### 3.3 `MatchCard`
`{ match, variant?: 'default'|'compact', showCompetition?: boolean, showSuspensions?: boolean, adminActions?: ReactNode }`
```
default
┌──────────────────────────────────────────┐
│ LIGA · JORNADA 6               Sáb 12/10 │  overline + date (caption)
│ [🛡24] Sport Clube Sado              2   │  winner row: text.primary 600, loser: text.secondary
│ [🛡24] Pontes                        1   │  scoreSm, right aligned, tabular
│ 📍 Campo do Sado · 15:00      [Terminado]│  caption + status chip
│ 🚫 2 suspensos                            │  optional, tap → popover/sheet with names
└──────────────────────────────────────────┘
compact (lists, home, team calendar)
│ 15:00  [🛡] Sado          2 – 1          Pontes [🛡] │  on xs: stacked like default without footer
```
- **Status** (derived, no DB change): `Agendado` (no score, future), `Por jogar` (no score, past date → neutral chip, admin sees warning), `Terminado` (score), `Penáltis` when penalties present → score shows `2 (4)`.
- Penalty display: `2` then small `(4)` caption next to it.
- Whole card is a link to `/jogos/{id}`. Admin actions (edit/delete icons) sit in the header row, `stopPropagation`.
- Suspensions: count comes from the page-level query (see §4.3), **not** one query per card (fixes the N+1 in today's `MatchCard.jsx`).
- Replaces: `liga/calendario/MatchCard.jsx`, `taca/calendario/CupMatchCard.jsx`, `taca/groups/GroupMatchList.jsx` rows, `equipas/CalendarTab.jsx` rows, `TeamInfoCards` next game.

### 3.4 `StandingsTable`
`{ rows, columns: 'compact'|'full', zones?: ZoneRule[], highlightTeamId?: number, onRowClick?(row), groupLabel?: string }`
- `rows`: `{ position, team, played, won, drawn, lost, goalsFor, goalsAgainst, goalDiff, points, form?: FormItem[], excluded? }`.
- **compact** columns: `# · Equipa · J · DG · Pts` (fits 360 px with full team names).
- **full** columns: `# · Equipa · J · V · E · D · GM · GS · DG · Pts · Forma`.
- On mobile a segmented toggle *Resumo / Completa* above the table switches columns; *Completa* is in an `overflow-x: auto` container with the `#` + `Equipa` columns **sticky** (`position: sticky; left: 0; background: paper`).
- Row: 56 px, zone bar 3 px on the left (`zones` → colour), position number (not a coloured circle), `TeamBadge` 24 + name, numbers `tableNum`, points bold. Excluded: row at 60 % opacity + "Excluída" caption, position "–".
- Header cells for sortable columns are buttons (tap to sort, arrow indicator). Default sort = official order (server/util); sorting by another column shows a "Ordem oficial" reset chip.
- Legend below the table (only when zones given): coloured bars + labels.
- Used by: Classificação, Início (top 5), Taça groups, Equipa (position context).
- Replaces: `ClassificationTable.jsx`, `ClassificationRow.jsx`, `ClassificationLegend.jsx`, `GroupStandingsTable.jsx`.

### 3.5 `FormGuide`
`{ items: { result: 'W'|'D'|'L', opponent, score, date, matchId }[], size?: 'sm'|'md' }`
- 5 rounded squares (20 px sm / 24 px md) with letters **V/E/D** (Portuguese), coloured by `result.*`, most recent on the right.
- Tap on a square → `Popover` with "vs Pontes · 2–1 · 12/10" and link to the match (works on touch; no hover-only tooltip).

### 3.6 `SectionCard`
`{ title, action?: { label, href }, children }` — Card with header row: h4 title left, "ver tudo ›" link right. Used on Início and team page.

### 3.7 `StatTile`
`{ label, value, sublabel?, icon?, href? }` — small card, value in `stat` variant, label caption. 2 per row on mobile, 4 on desktop.

### 3.8 `SegmentedTabs`
MUI `Tabs` styled as pill segment (`variant="fullWidth"` on mobile, `scrollable` if > 3 items). Syncs with a URL param when `paramName` given (e.g. `?tab=plantel`) so back button & shared links work.

### 3.9 `WeekStrip`
`{ items: { key, label, sublabel? }[], value, onChange }`
```
‹  [J4] [J5] (J6) [J7] [J8]  ›
       12/10  19/10  26/10
```
- Horizontally scrollable chips (`overflow-x: auto`, scroll-snap), selected chip centred on mount (`scrollIntoView({ inline: 'center' })`). Arrows only on desktop. Swipe left/right on the match list also changes week (optional, phase 2).
- Replaces: `WeekNavigator.jsx`, `RoundNavigator.jsx`.

### 3.10 `EventTimeline`
`{ events: { minute, type, player, teamSide: 'home'|'away' }[], homeTeam, awayTeam }`
```
        Sado  2 – 1  Pontes
   ⚽ J. Silva 12'  │
                    │  38' R. Costa ⚽
   🟨 A. Lopes 55'  │
   ⚽ M. Reis 81'   │
```
- Centre line; home events left-aligned to the line, away right. Minute in a small pill. No minute → events listed after timed ones in insertion order.
- Icons: goal ⚽ (`SportsSoccer`), own goal ⚽ + "(p.b.)", yellow = `card.yellow` rounded rect, red = `card.red`, double yellow = yellow+red overlapped. Keep `CardIcon.jsx` as the base.
- Mobile < 360 px: single column with team badge before each event.

### 3.11 `EmptyState` / `ErrorState` / skeletons
- `EmptyState { icon?, title, description?, action? }` — centred, icon 48 px `text.secondary`, no card shadow.
- `ErrorState { onRetry }` — "Não foi possível carregar os dados." + button "Tentar novamente".
- Skeletons: `MatchCardSkeleton`, `StandingsSkeleton(rows=13)`, `ListSkeleton` built from MUI `Skeleton` matching real dimensions.

### 3.12 `BottomSheet` (mobile) / `Dialog` (desktop)
`ResponsiveDialog { open, onClose, title, children, actions }` — `Dialog` on desktop (`maxWidth="sm"`), full-screen `Dialog` with a top app bar (close ✕ left, title, primary action right) on mobile. Used by every admin form and detail modal.

---

## 4. Screens

Each screen: **Route · Purpose · Data · Mobile · Desktop · Interactions · States · Admin · Acceptance**.

### 4.1 Início (new) — `/`
**Purpose**: answer "what's happening this week?" in one screen. Today `/` = Classificação.

**Data**
- `useGetLeagueMatches(seasonId)` (already needed by Calendário) → derive:
  - *Próxima jornada* = smallest `week` with at least one match without score and `match_date >= today`; fallback: last week.
  - *Últimos resultados* = largest `week` with at least one scored match.
- `useGetStandings(seasonId)` → top 5.
- `useGetTopScorers(seasonId, { limit: 3 })`.
- `useGetActiveSuspensions(seasonId)` → count + names.
- Current cup stage (optional, phase 2): next cup match if any in the next 14 days.

**Mobile**
```
[TopBar]
PageHeader: "Olá! Jornada 7 este fim de semana"   (h2, no season caption if current)

SectionCard "Próxima jornada · J7"          ver tudo › (/liga/calendario?jornada=7)
  MatchCard compact ×N  (grouped by date: "Sábado, 12 out")

SectionCard "Últimos resultados · J6"       ver tudo ›
  MatchCard compact ×N

SectionCard "Classificação"                  ver tabela ›
  StandingsTable compact, rows 1–5, zones

Row of StatTiles (2 columns):
  [⚽ Melhor marcador  | J. Silva · 9 golos]  → /liga/marcadores
  [🚫 Suspensos        | 3 jogadores       ]  → /liga/disciplina

SectionCard "Taça" (only if a cup match is within 14 days)
  MatchCard compact
```
**Desktop** (`md`+): 2 columns — left (8/12): Próxima jornada, Últimos resultados; right (4/12): Classificação top 5, stat tiles stacked, Taça.

**States**: season without matches → EmptyState "A época ainda não começou" + link to Documentos. Off-season (all matches played) → "Época terminada" card with champion (standings #1) + link to Histórico.

**Acceptance**: at 360 px no horizontal scroll; the first match card is visible without scrolling (TopBar + header ≤ 140 px); all tiles are links.

---

### 4.2 Classificação — `/liga/classificacao`
**Purpose**: league table.

**Data**: `useGetStandings(seasonId)` = `league_standings` + completed league matches; ordering by a pure util `sortStandings(rows, matches)` moved from `classificacao/page.jsx` (keep the exact H2H rules, see CLAUDE.md) with unit tests. `form` built by `buildFormGuide(matches)`.

**Mobile**
```
PageHeader "Classificação"  caption "Liga · Época 2025/26"   [⇄ Comparar] (icon button)
SegmentedTabs [Resumo | Completa]
StandingsTable (compact | full with sticky team column)
Legend: ▌Campeão ▌Pódio ▌Top 6 ▌Excluída
Small print: "Critérios de desempate: pontos, confronto direto (pontos, diferença de golos, golos fora), diferença de golos, golos marcados."
```
**Desktop**: always `full` columns incl. Forma; toggle hidden. Right-side panel (lg only) with 3 StatTiles: melhor ataque, melhor defesa, mais vitórias (replaces `ClassificationStats.jsx`, today hidden < 900 px).

**Interactions**: row tap → `/equipas/{team}` (with season param if not current); column header tap → sort; Comparar → `CompareTeamsDialog` (§4.2.1).

**Zones**: 1 → champion, 2–3 → podium, 4–6 → top (same as today's colours meaning). Confirm with the regulation if zones mean anything (e.g. qualification to Supertaça).

**Acceptance**: team names fully visible (ellipsis only if > ~22 chars) at 360 px in *Resumo*; *Completa* scrolls horizontally with team column pinned; sorting never changes the official position numbers shown in `#`.

#### 4.2.1 CompareTeamsDialog (keeps today's `ComparisonModal` features)
`ResponsiveDialog` "Comparar equipas". Two team selects (A/B) side by side (stacked on xs). Sections: *Estatísticas da época* (Pontos, Vitórias, Golos marcados, Golos sofridos, Diferença de golos) as mirrored horizontal bars (A left/B right, larger value highlighted); *Confrontos diretos* (list of `MatchCard compact` between them + summary "Vitórias A · Empates · Vitórias B").

---

### 4.3 Calendário (Liga) — `/liga/calendario?jornada=6`
**Data**: `useGetLeagueMatches(seasonId)` (one query, includes team names/logos/stadium) + `useGetActiveSuspensions(seasonId)` (one query) → map `teamId → names[]` passed to cards.

**Mobile**
```
PageHeader "Calendário"  caption "Liga · Época 2025/26"          [+ Criar] (admin)
WeekStrip  J1 … J26 (label "J6", sublabel first date "12/10")
Date group header: "Sábado, 12 de outubro"   (overline)
  MatchCard default ×N
Date group header: "Domingo, 13 de outubro"
  MatchCard default ×N
```
- Remove the giant 48 px "Jornada X" watermark; the selected chip + group headers are enough.
- Week change → `router.replace` (no history spam; fixes B9). Param name `jornada` (alias `week`).
- Initial week = the "próxima jornada" rule from §4.1 (not "closest date"), unless URL has one.

**Desktop**: same list; cards in a 2-column grid (`md`) / 3-column (`lg`) inside each date group.

**States**: EmptyState "Ainda não há jogos para a época 2025/26" (admin: + "Criar jogo" / "Importar calendário" buttons, see `docs/reference/data-entry.md`).

**Admin**: edit/delete icons on cards → `EditMatchDialog` (fixture fields: teams, date, time, jornada/round, campo) and `DeleteMatchDialog` (keep the existing warning when the match already has a result).

---

### 4.4 Jogo — `/jogos/[id]`
**Data**: `useGetMatch(id)` (match + teams), `useGetMatchEvents(id)` (events + player names — single query with join `players(name, photo_url)`), `useGetMatchSquads(match)` (players registered for both teams at match date; fixes B4), `useGetActiveSuspensions(season)`.

**Mobile**
```
┌──────────────────────── hero (primary gradient) ────────────────────────┐
│ ‹ back                LIGA · JORNADA 6                                  │
│      [🛡 56]                2 – 1                    [🛡 56]            │  score variant
│   Sport Clube Sado        Terminado                  Pontes             │  names wrap to 2 lines, centred
│            Sáb 12 out · 15:00 · 📍 Campo do Sado                         │
└─────────────────────────────────────────────────────────────────────────┘
SegmentedTabs [Resumo | Plantéis | Ficha]   (URL ?tab=)

Resumo:
  EventTimeline
  (no events & played) → EmptyState "Sem eventos registados"
  (not played) → countdown card "Faltam 3 dias" + suspended players per team

Plantéis:
  Team switch (two chips with badges) → list of PlayerAvatar 40 + name + JK chip
  Suspended players: red "Suspenso" chip, row at 60 % opacity, sorted last
  Goals/cards in this match shown as icons at the row end

Ficha:
  Button "Descarregar ficha de jogo (PDF)" (jsPDF loaded on click — P3)
  If match_sheet link: button "Ver ficha oficial" (opens link)
```
**Desktop**: hero wider (badges 80); below it a 2-column layout: left = EventTimeline, right = Plantéis (both teams side by side) + Ficha card. No tabs.

**Supertaça**: same page; hero overline "SUPERTAÇA 2025/26"; season switcher changes to the Supertaça of another season (today's `SeasonSelector`). Stadium comes from `matches.stadium_name` (remove the hardcoded `season === 2024` rule).

**Penalties**: under the score "(4 – 3 g.p.)" caption; winner name bold.

**Admin**: bottom sticky bar (above BottomNav) "Editar jogo" → `MatchResultForm` in `ResponsiveDialog` (spec in `docs/reference/data-entry.md` E3: score steppers, goals per team with player autocomplete, cards, warning if goal events ≠ score).

**Metadata**: `generateMetadata` → title "Sado 2–1 Pontes · Jornada 6" for WhatsApp previews.

**Acceptance**: no fixed pixel widths (today 160 px blocks); long names ("Bairro Santos Nicolau") wrap, never overflow; PDF button works on iOS Safari.

---

### 4.5 Equipa — `/equipas/[slug]?epoca=`
**Data**: `useGetTeam(slug, seasonId)`, `useGetTeamMatches(teamId)`, `useGetSquad(teamId)`, `useGetStandings(seasonId)` (position), `useGetTopScorers(seasonId, { teamId })`.
Slug: today `short_name` URL-encoded; move to a real slug with E9 (`docs/reference/data-entry.md`) — spec works with either.

**Mobile**
```
┌──────────── team hero (teams.main_color, fallback primary) ─┐
│ ‹                                            [⇄ equipa ▾]  │
│ [🛡 72]  Sport Clube Sado                                    │
│          2.º lugar · 16 pts · Fundado 1978                   │
│          📍 Campo do Sado                                     │
└─────────────────────────────────────────────────────────────┘
StatTiles (horizontal scroll row): Posição 2.º · Pontos 16 · Golos 18 · Forma [V V E D V]
SegmentedTabs [Jogos | Plantel | Info]

Jogos:  next match highlighted (MatchCard default, "Próximo jogo")
        then all matches grouped "Próximos" / "Resultados", MatchCard compact,
        chip filter [Todos | Liga | Taça]
Plantel: "Treinador" row (manager photo + name)
         Players grid: 3 cols xs, 4 sm, 6 md — PlayerAvatar 56 + name (2 lines max) + JK badge
         + goals this season as a small ⚽ n under the name
         Tap player → PlayerSheet (§4.6.1)
Info:   Equipamentos (principal / alternativo images side by side)
        Plantel oficial (roster_url image, tap → full screen viewer)
        Campo, fundação
```
**Desktop**: hero full width; below, 2 columns: left (8) tabs Jogos/Plantel; right (4) Info cards + mini standings around the team (positions −2..+2 with the team highlighted).

**Team switcher**: `⇄` opens a menu with all teams of the season (badges), keeps the current tab.

**States**: team not found in that season → EmptyState "Esta equipa não participou na época 2023/24" + list of seasons where it did (needs E9; until then link back to Equipas).

---

### 4.6 Marcadores — `/liga/marcadores` and `/taca/marcadores`
One screen component with `competition: 'League' | 'Cup'`.

**Data**: `useGetTopScorers(seasonId, { competition })` — aggregated in SQL (P5), returns `{ player, team (at time of goals — E8), goals, matches }`.

**Mobile**
```
PageHeader "Marcadores"  caption "Liga · Época 2025/26"
Podium (top 3): 2nd | 1st (taller) | 3rd — PlayerAvatar 56/72, name, team badge, goals (stat)
Search field "Procurar jogador" + team filter chip (opens sheet with team list)
List: rank · PlayerAvatar 40 · name / team caption · goals (scoreSm)
      ties share the rank ("4.º" twice), next rank skips
```
- Remove the "Pódio / Lista" toggle — podium + list always (podium hidden when searching/filtering).
**Desktop**: podium left column (sticky), list right.

#### 4.6.1 PlayerSheet (replaces `PlayersDetailsModal.jsx`)
`ResponsiveDialog`: header PlayerAvatar 80 + name + team; StatTiles: Total de golos · Golos p/ jogo · Hat-tricks · Bis (dobradinhas); SegmentedTabs *Por competição* (bars Liga/Taça/Supertaça) | *Histórico* (list of matches with goals: date, opponent, goals, link to match).

---

### 4.7 Disciplina — `/liga/disciplina`
**Data**: `discipline_standings` + active suspensions + at-risk players (move to a SQL view — P5).

**Mobile**
```
PageHeader "Disciplina"  caption "Liga · Época 2025/26"
Info line: "Menos pontos = melhor. 🟨 5 pts · 🟥 20 pts · castigos conforme regulamento"  (values from the DB: calculated_points = red*20 + yellow*5 + other_punishments)
SegmentedTabs [Equipas | Suspensos (3) | Em risco (5)]

Equipas: ranked list rows
  # · TeamBadge · (🟨 12  🟥 1  ⚖ 2) · média 1.4 / jogo (bold)
  tap → TeamDisciplineSheet
Suspensos: list grouped by team: PlayerAvatar · name · "1 jogo" · desde 12/10
Em risco: list grouped by team: name · 🟨×2 "próximo amarelo = suspensão"
```
**Desktop**: Equipas as a table (Pos, Equipa, J, 🟨, 🟥, Castigos, Pontos, Média) + right column with Suspensos and Em risco cards.

**TeamDisciplineSheet** (replaces the 2038-line `EnhancedDisciplineModal`): tabs *Jogadores* (per-player yellows with the list of matches for each card, status text "2 amarelos para suspensão"), *Suspensões* (history, active first), *Castigos* (team punishments table). Admin adds buttons "Adicionar suspensão", "Adicionar castigo", "Marcar como cumprida" — each a small `ResponsiveDialog` form. Split into one component + hook per tab.

---

### 4.8 Taça — `/taca`
Two modes from `seasons.cup_group_stage`. **Fix B1**: mount the mode view with `key={seasonId}`; views read the season from `useSelectedSeason()` instead of copying props into state.

**A. Taça da Liga (groups + Final Four)**
```
PageHeader "Taça da Liga"  caption "Fase de grupos + Final Four · 2025/26"
SegmentedTabs [Grupos | Final Four]

Grupos:
  Group chips [A] [B] [C]
  StandingsTable compact (groupLabel "Grupo A"), zones: 1st = qualified (success bar),
    2nd = "possível apuramento (melhor 2.º)" (warning bar)
  Group matches: MatchCard compact grouped by jornada
  Card "Apuramento": Vencedores de grupo ×3 + Melhor 2.º (live ranking of 2nd places:
    PTS · DG · GM) — from QualificationStatus.jsx

Final Four:
  Mobile: vertical bracket
    Meia-final 1  MatchCard default
    Meia-final 2  MatchCard default
          ↓
    Final         MatchCard default (gold border) → winner banner "🏆 Campeão: X"
  Desktop: horizontal bracket (semis left, final right) with connectors (keep FinalFourBracket idea)
```
**B. Taça (knockout)**
```
Mobile: SegmentedTabs by round [Oitavos | Quartos | Meias | Final] (default = current round)
        list of MatchCard default; bye → "Isento" row
Desktop: full bracket (react-brackets or custom grid) with winner highlighted
```
**Acceptance**: switching season between two League Cup seasons or two knockout seasons updates everything; bracket never requires horizontal page scroll on mobile.

---

### 4.9 Calendário da Taça — `/taca/calendario`
Same screen as §4.3 with `competition="Cup"`: `WeekStrip` items = group jornadas ("J1"…) then knockout rounds ("Meias", "Final"). Keys are **stable** strings (`j1`, `semi`, `final`) independent of screen width (fixes B10). Cards show the group ("Grupo A") in the overline.

---

### 4.10 Supertaça — `/supertaca` (new route)
Redirects (server) to `/jogos/{seasons.supercup_match_id}` of the selected season (needs E2 column). Removes the hardcoded `/jogos/256`. Nav item points here.

---

### 4.11 Galeria — `/galeria/equipas`
```
PageHeader "Galeria"  caption "Fotos oficiais dos plantéis · 2025/26"
Grid: 1 col xs, 2 sm, 3 md — card = roster photo (aspect 4:3, next/image, lazy) + TeamBadge + name
Tap → full-screen viewer (pinch-zoom, swipe to next team, ✕ close, "Ver equipa" link)
```
EmptyState "Ainda não há fotos para esta época".

---

### 4.12 Equipas (new list) — `/equipas`
Target of the bottom-nav tab.
```
PageHeader "Equipas"  caption "13 equipas · 2025/26"
Grid 2 cols xs / 3 sm / 4 md: card = TeamBadge 48 + name + "2.º · 16 pts" caption → /equipas/{slug}
```
Data: teams of season + standings (for the caption). Excluded teams at the end, dimmed.

---

### 4.13 Histórico — `/historico`
```
PageHeader "Histórico"  caption "Vencedores de todas as épocas"
For each season (desc) a SeasonCard:
  Época 2024/25
  [🏆 Liga: TeamBadge] [🏆 Taça: TeamBadge] [🏆 Supertaça: TeamBadge] [🟨 Fair-play: TeamBadge]
  Melhores marcadores: 1. name (team) 12 · 2. … · 3. …
  (Supertaça links to the match)
Archive section "Épocas 2013–2024": list rows year · winner · "Blog ›" (external link icon)
```
Cards 1 column mobile, 2 columns desktop. Fix the N+1 team queries (one query with nested joins). Archive list later moves to the DB (E9/E11).

---

### 4.14 Informação
**Regras e sorteio** — `/informacao/sorteio`: one scrolling article with anchored sections (chip bar at top: *Campeonato · Taça · Sorteio · Jokers · Bolas*), each a card with short paragraphs and bullet lists. Content stays in constants (or a markdown file per season later).

**Documentos** — `/informacao/documentacao`: list of document rows (icon by type PDF/XLSX · title · "Atualizado 17 set 2025" · download/open button 44 px). Downloads use normal `<a href download>` links (works on iOS). Titles/URLs from `seasons` columns (E2) so no code change each season.

---

### 4.15 Admin login — `/admin/login`
Centred card on `background.default` (no animated blobs): logo, "Área de administração", email, password (show/hide), "Entrar" button full width, error `Alert`. After login → back to the page the admin came from (`?next=`), default `/`.

---

## 5. Route map (old → new)

| Today | New | Note |
|---|---|---|
| `/` (= classificação) | `/` Início | new screen |
| `/liga/classificacao` | same | redesigned |
| `/liga/calendario?week=&season=` | `/liga/calendario?jornada=&epoca=` | old params still accepted |
| `/liga/marcadores`, `/taca/marcadores` | same | one shared screen |
| `/liga/disciplina` | same | |
| `/taca`, `/taca/calendario` | same | |
| `/taca/sorteio` (legacy 2024) | removed → redirect `/taca?epoca=2024` | D2 |
| `/jogos/256` (Supertaça link) | `/supertaca` | redirect route |
| `/equipas/[teamname]` | `/equipas/[slug]` | old encoded names keep working until E9 |
| — | `/equipas` | new list |
| `/informacao/*`, `/galeria/equipas`, `/historico`, `/admin/login` | same | |

---

## 6. Implementation order (one PR each)

1. **Foundations**: `theme/theme.js`, fonts, server `layout.js` + `AppProviders` + `AppShell` (TopBar, BottomNav, Sidebar, Mais sheet), `useSelectedSeason`. Old pages render inside the new shell unchanged. ✅ check: every existing page still works at 360 / 1440 px.
2. **UI kit**: §3 components + a hidden `/dev/ui` page showing all variants (delete before release or guard by admin).
3. Classificação (§4.2) — establishes `StandingsTable`, `useGetStandings`, `sortStandings` tests.
4. Calendário Liga + Taça (§4.3, §4.9) — establishes `MatchCard`, `WeekStrip`.
5. Jogo (§4.4).
6. Início (§4.1) — reuses 3–5.
7. Equipa + Equipas (§4.5, §4.12).
8. Marcadores (§4.6), Disciplina (§4.7).
9. Taça (§4.8), Supertaça (§4.10).
10. Galeria, Histórico, Informação, Login (§4.11–4.15).

**Per-screen definition of done**
- [ ] Matches the spec at 360, 390, 768, 1024, 1440 px; no horizontal page scroll.
- [ ] Loading skeleton, empty and error states implemented.
- [ ] No `window.innerWidth`, no `isMobile` props, no inline `style={{}}`, no hardcoded season.
- [ ] Strings in `constants/const.ts`.
- [ ] Light + dark mode checked.
- [ ] Old URL still resolves.
- [ ] `npm run build` + `npm run lint` pass; `/mobile-check` run on changed files.

---

## 7. Optional ideas (not in scope unless agreed)

- **Equipa favorita (device-only, no login)**: a ⭐ on the team page saves the team id in `localStorage`; Início then highlights that team's match and its row in the top-5 table. No account, nothing stored on the server. Skip if not wanted.
- Match-day "Ao vivo" status if admins start entering results during games.
- Push notifications (PWA) for results — requires a service worker and a subscription store; later.
